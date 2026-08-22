"use client"

import React, { useMemo } from "react"

interface MattressVisualizerProps {
  width: number // in meters (e.g. 1.60)
  length: number // in meters (e.g. 2.00)
  thicknessCm: number // e.g. 25
  coreLabel: string
  firmnessLabel: string
  colorHex: string
  colorName: string
  photoUrl: string
  photoAlt: string
  modelName: string
  activeView: "configurator" | "photo"
  onToggleView: (view: "configurator" | "photo") => void
}

export default function MattressVisualizer({
  width,
  length,
  thicknessCm,
  coreLabel,
  firmnessLabel,
  colorHex,
  colorName,
  photoUrl,
  photoAlt,
  modelName,
  activeView,
  onToggleView,
}: MattressVisualizerProps) {
  const svgWidth = 520
  const svgHeight = 400

  // 2.5D Isometric projection calculation
  const { topPoints, leftPoints, rightPoints, centerX, centerY } = useMemo(() => {
    const scale = Math.min(130, 260 / Math.max(width, length))
    const wPx = width * scale * 0.9
    const lPx = length * scale * 0.9
    const hPx = (thicknessCm / 30) * 48 // thickness in isometric height

    const cX = svgWidth / 2
    const cY = svgHeight / 2 - 10

    // Isometric isometric vector angles: 30 deg
    const cos30 = 0.866
    const sin30 = 0.5

    // Top surface coordinates
    const pTop = { x: cX, y: cY - lPx * sin30 }
    const pRight = { x: cX + wPx * cos30, y: cY - (lPx - wPx) * sin30 * 0.5 }
    const pBottom = { x: cX + (wPx - lPx) * cos30 * 0.5, y: cY + (wPx + lPx) * sin30 * 0.5 }
    const pLeft = { x: cX - lPx * cos30, y: cY + (wPx - lPx) * sin30 * 0.5 }

    const topPolygon = `${pTop.x},${pTop.y} ${pRight.x},${pRight.y} ${pBottom.x},${pBottom.y} ${pLeft.x},${pLeft.y}`
    const leftPolygon = `${pLeft.x},${pLeft.y} ${pBottom.x},${pBottom.y} ${pBottom.x},${pBottom.y + hPx} ${pLeft.x},${pLeft.y + hPx}`
    const rightPolygon = `${pBottom.x},${pBottom.y} ${pRight.x},${pRight.y} ${pRight.x},${pRight.y + hPx} ${pBottom.x},${pBottom.y + hPx}`

    return {
      topPoints: topPolygon,
      leftPoints: leftPolygon,
      rightPoints: rightPolygon,
      centerX: cX,
      centerY: cY,
    }
  }, [width, length, thicknessCm])

  return (
    <div className="sofa-visualizer-container">
      {/* Header bar */}
      <div className="visualizer-header-bar">
        <div className="visualizer-view-tabs">
          <button
            type="button"
            className={`vis-tab-btn ${activeView === "configurator" ? "active" : ""}`}
            onClick={() => onToggleView("configurator")}
            aria-label="View interactive 2.5D mattress blueprint"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
            <span>Live Blueprint</span>
          </button>
          <button
            type="button"
            className={`vis-tab-btn ${activeView === "photo" ? "active" : ""}`}
            onClick={() => onToggleView("photo")}
            aria-label="View showroom photo"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            <span>Showroom Photo</span>
          </button>
        </div>

        <div className="visualizer-badge-info">
          <span className="vis-color-dot" style={{ backgroundColor: colorHex }} />
          <span>{colorName}</span> · <span>{thicknessCm} cm profile</span>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="visualizer-canvas-wrapper">
        {activeView === "photo" ? (
          <div className="visualizer-photo-pane">
            <img src={photoUrl} alt={photoAlt || modelName} />
            <div className="visualizer-photo-overlay">
              <span className="vis-model-tag">{modelName}</span>
              <span className="vis-photo-caption">7-Zone Orthopedic Ergonomic Core</span>
            </div>
          </div>
        ) : (
          <div className="visualizer-svg-pane">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="sofa-blueprint-svg">
              <defs>
                <pattern id="mattress-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(201, 168, 76, 0.05)" strokeWidth="1" />
                </pattern>
                <pattern id="quilt-pattern" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path d="M 0 12 L 12 0 L 24 12 L 12 24 Z" fill="none" stroke="rgba(201, 168, 76, 0.15)" strokeWidth="0.8" />
                  <circle cx="12" cy="12" r="1.5" fill="#c9a84c" opacity="0.4" />
                </pattern>
                <linearGradient id="topMattressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                  <stop offset="60%" stopColor="#e8e2d6" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#d4ccbe" stopOpacity="0.85" />
                </linearGradient>
                <linearGradient id="sideMattressGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={colorHex} stopOpacity="0.9" />
                  <stop offset="50%" stopColor={colorHex} stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#0b0d18" stopOpacity="0.9" />
                </linearGradient>
                <filter id="mattressShadow" x="-15%" y="-15%" width="130%" height="130%">
                  <feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="#000000" floodOpacity="0.6" />
                </filter>
              </defs>

              {/* Grid */}
              <rect width="100%" height="100%" fill="url(#mattress-grid)" rx="8" />

              {/* Dimension indicators */}
              <g className="mattress-dim-badges">
                {/* Width badge (top right) */}
                <g transform={`translate(${svgWidth - 90}, 45)`}>
                  <rect x="-42" y="-12" width="84" height="24" rx="12" fill="#13162a" stroke="#c9a84c" strokeWidth="1.2" />
                  <text x="0" y="4" textAnchor="middle" fill="#e8c96a" fontSize="11.5" fontWeight="700" fontFamily="'DM Sans', sans-serif">
                    {Math.round(width * 100)} cm Wide
                  </text>
                </g>
                {/* Length badge (top left) */}
                <g transform={`translate(90, 45)`}>
                  <rect x="-42" y="-12" width="84" height="24" rx="12" fill="#13162a" stroke="#c9a84c" strokeWidth="1.2" />
                  <text x="0" y="4" textAnchor="middle" fill="#e8c96a" fontSize="11.5" fontWeight="700" fontFamily="'DM Sans', sans-serif">
                    {Math.round(length * 100)} cm Long
                  </text>
                </g>
              </g>

              {/* 3D Isometric Mattress */}
              <g filter="url(#mattressShadow)">
                {/* Left Side Wall */}
                <polygon points={leftPoints} fill="url(#sideMattressGrad)" stroke="rgba(201, 168, 76, 0.4)" strokeWidth="1.2" />
                {/* Right Side Wall */}
                <polygon points={rightPoints} fill="url(#sideMattressGrad)" stroke="rgba(201, 168, 76, 0.4)" strokeWidth="1.2" />
                {/* Top Quilted Surface */}
                <polygon points={topPoints} fill="url(#topMattressGrad)" stroke="#c9a84c" strokeWidth="1.8" />
                {/* Quilted overlay pattern on top */}
                <polygon points={topPoints} fill="url(#quilt-pattern)" opacity="0.75" />
              </g>

              {/* Floating Feature Tags */}
              <g transform={`translate(${centerX}, ${centerY + 105})`}>
                <rect x="-140" y="-14" width="280" height="28" rx="14" fill="#13162a" stroke="rgba(201, 168, 76, 0.5)" strokeWidth="1.2" />
                <text x="0" y="4" textAnchor="middle" fill="#e8e2d6" fontSize="11" fontWeight="600" fontFamily="'DM Sans', sans-serif">
                  {thicknessCm} cm Depth · {firmnessLabel} · {coreLabel}
                </text>
              </g>
            </svg>
          </div>
        )}
      </div>

      {/* Info specs strip */}
      <div className="visualizer-quick-adjust-bar">
        <div className="adjust-control-item">
          <span className="adjust-label">📐 Selected Dimensions</span>
          <div className="adjust-val-display" style={{ color: "var(--gold)" }}>
            {Math.round(width * 100)} cm × {Math.round(length * 100)} cm ({width.toFixed(2)}m × {length.toFixed(2)}m)
          </div>
        </div>
        <div className="adjust-control-item">
          <span className="adjust-label">🛡 Core Support</span>
          <div className="adjust-val-display" style={{ color: "var(--fg)" }}>
            {coreLabel}
          </div>
        </div>
      </div>
    </div>
  )
}
