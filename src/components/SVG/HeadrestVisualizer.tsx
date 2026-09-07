"use client"

import React, { useState } from "react"

interface HeadrestVisualizerProps {
  packCount?: number // e.g. 1, 2, 4
  tiltDegrees?: number // 0, 30, 60, 90
  colorHex: string
  colorName: string
  photoUrl: string
  photoAlt: string
  modelName: string
  activeView: "configurator" | "photo"
  onToggleView: (view: "configurator" | "photo") => void
  onTiltChange?: (deg: number) => void
}

export default function HeadrestVisualizer({
  packCount = 1,
  tiltDegrees: propTilt,
  colorHex,
  colorName,
  photoUrl,
  photoAlt,
  modelName,
  activeView,
  onToggleView,
  onTiltChange,
}: HeadrestVisualizerProps) {
  const [internalTilt, setInternalTilt] = useState<number>(30)
  const currentTilt = propTilt !== undefined ? propTilt : internalTilt

  const handleTiltSelect = (deg: number) => {
    setInternalTilt(deg)
    onTiltChange?.(deg)
  }

  const svgWidth = 520
  const svgHeight = 400

  // Dimensions of headrest in blueprint
  const cX = svgWidth / 2
  const cY = 180
  const headrestW = 260
  const headrestH = 88
  const rodSpacing = 110
  const rodW = 12
  const rodL = 115

  // Calculate tilt displacement to visually convey ratchet incline
  // Tilt angles: 0 (flat), 30 (relax), 60 (reading), 90 (upright)
  const tiltRad = (currentTilt * Math.PI) / 180
  const tiltOffsetY = Math.sin(tiltRad) * -12
  const tiltScaleY = 1 - Math.sin(tiltRad) * 0.12

  return (
    <div className="sofa-visualizer-container">
      {/* Header Bar */}
      <div className="visualizer-header-bar">
        <div className="visualizer-view-tabs">
          <button
            type="button"
            className={`vis-tab-btn ${activeView === "configurator" ? "active" : ""}`}
            onClick={() => onToggleView("configurator")}
            aria-label="View interactive headrest blueprint"
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
          <span>{colorName}</span> · <span>{packCount > 1 ? `Set of ${packCount}` : "Single"}</span> · <span>{currentTilt}° Incline</span>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="visualizer-canvas-wrapper">
        {activeView === "photo" ? (
          <div className="visualizer-photo-pane">
            <img src={photoUrl} alt={photoAlt || modelName} />
            <div className="visualizer-photo-overlay">
              <span className="vis-model-tag">{modelName}</span>
              <span className="vis-photo-caption">Multi-Angle Adjustable Salon Headrest</span>
            </div>
          </div>
        ) : (
          <div className="visualizer-svg-pane">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="sofa-blueprint-svg"
              aria-label={`Interactive blueprint of ${modelName}`}
            >
              <defs>
                <pattern id="headrest-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(201, 168, 76, 0.12)" strokeWidth="0.6" />
                </pattern>
                <pattern id="headrest-grid-major" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(201, 168, 76, 0.22)" strokeWidth="0.9" />
                </pattern>

                {/* Fabric gradient fill */}
                <linearGradient id="headrestFabricGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
                  <stop offset="25%" stopColor={colorHex} stopOpacity="0.95" />
                  <stop offset="75%" stopColor={colorHex} stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#0a0c16" stopOpacity="0.88" />
                </linearGradient>

                {/* Chrome steel rods gradient */}
                <linearGradient id="chromeRodGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8c909e" />
                  <stop offset="35%" stopColor="#ffffff" />
                  <stop offset="70%" stopColor="#ced4da" />
                  <stop offset="100%" stopColor="#555a64" />
                </linearGradient>

                {/* Shadow */}
                <filter id="headrestShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#000000" floodOpacity="0.32" />
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#c9a84c" floodOpacity="0.1" />
                </filter>
              </defs>

              {/* Background blueprint grid */}
              <rect width="100%" height="100%" fill="url(#headrest-grid)" rx="8" />
              <rect width="100%" height="100%" fill="url(#headrest-grid-major)" rx="8" />

              {/* ───────────────── TOP DIMENSION RULER (Width 65 cm) ───────────────── */}
              <g className="dimension-ruler horizontal-ruler">
                <line
                  x1={cX - headrestW / 2}
                  y1={cY - headrestH / 2 - 32}
                  x2={cX + headrestW / 2}
                  y2={cY - headrestH / 2 - 32}
                  stroke="#c9a84c"
                  strokeWidth="1.2"
                  strokeDasharray="4 3"
                />
                <line
                  x1={cX - headrestW / 2}
                  y1={cY - headrestH / 2 - 39}
                  x2={cX - headrestW / 2}
                  y2={cY - headrestH / 2 - 25}
                  stroke="#c9a84c"
                  strokeWidth="1.8"
                />
                <line
                  x1={cX + headrestW / 2}
                  y1={cY - headrestH / 2 - 39}
                  x2={cX + headrestW / 2}
                  y2={cY - headrestH / 2 - 25}
                  stroke="#c9a84c"
                  strokeWidth="1.8"
                />

                <g transform={`translate(${cX}, ${cY - headrestH / 2 - 32})`}>
                  <rect x="-48" y="-12" width="96" height="24" rx="12" fill="#13162a" stroke="#c9a84c" strokeWidth="1.2" />
                  <text x="0" y="4" textAnchor="middle" fill="#e8c96a" fontSize="11" fontWeight="700" fontFamily="'Inter', sans-serif">
                    65 cm Width
                  </text>
                </g>
              </g>

              {/* ───────────────── SIDE DIMENSION RULER (Height 22 cm) ───────────────── */}
              <g className="dimension-ruler vertical-ruler">
                <line
                  x1={cX + headrestW / 2 + 28}
                  y1={cY - headrestH / 2}
                  x2={cX + headrestW / 2 + 28}
                  y2={cY + headrestH / 2}
                  stroke="#c9a84c"
                  strokeWidth="1.2"
                  strokeDasharray="4 3"
                />
                <line
                  x1={cX + headrestW / 2 + 21}
                  y1={cY - headrestH / 2}
                  x2={cX + headrestW / 2 + 35}
                  y2={cY - headrestH / 2}
                  stroke="#c9a84c"
                  strokeWidth="1.8"
                />
                <line
                  x1={cX + headrestW / 2 + 21}
                  y1={cY + headrestH / 2}
                  x2={cX + headrestW / 2 + 35}
                  y2={cY + headrestH / 2}
                  stroke="#c9a84c"
                  strokeWidth="1.8"
                />

                <g transform={`translate(${cX + headrestW / 2 + 28}, ${cY})`}>
                  <rect x="-44" y="-12" width="88" height="24" rx="12" fill="#13162a" stroke="#c9a84c" strokeWidth="1.2" />
                  <text x="0" y="4" textAnchor="middle" fill="#e8c96a" fontSize="11" fontWeight="700" fontFamily="'Inter', sans-serif">
                    22 cm Height
                  </text>
                </g>
              </g>

              {/* ───────────────── HEADREST RENDERING ───────────────── */}
              <g filter="url(#headrestShadow)">
                {/* 1. Dual Chrome Insertion Rods */}
                {/* Left Rod */}
                <g className="headrest-rod-left">
                  <rect
                    x={cX - rodSpacing / 2 - rodW / 2}
                    y={cY + headrestH / 2 - 10}
                    width={rodW}
                    height={rodL}
                    rx="6"
                    fill="url(#chromeRodGrad)"
                    stroke="rgba(0,0,0,0.4)"
                    strokeWidth="1"
                  />
                  {/* Adjustment notches */}
                  {[30, 55, 80].map((notchY) => (
                    <line
                      key={notchY}
                      x1={cX - rodSpacing / 2 - rodW / 2 + 1}
                      y1={cY + headrestH / 2 + notchY}
                      x2={cX - rodSpacing / 2 + rodW / 2 - 1}
                      y2={cY + headrestH / 2 + notchY}
                      stroke="#222"
                      strokeWidth="1.5"
                    />
                  ))}
                </g>

                {/* Right Rod */}
                <g className="headrest-rod-right">
                  <rect
                    x={cX + rodSpacing / 2 - rodW / 2}
                    y={cY + headrestH / 2 - 10}
                    width={rodW}
                    height={rodL}
                    rx="6"
                    fill="url(#chromeRodGrad)"
                    stroke="rgba(0,0,0,0.4)"
                    strokeWidth="1"
                  />
                  {[30, 55, 80].map((notchY) => (
                    <line
                      key={notchY}
                      x1={cX + rodSpacing / 2 - rodW / 2 + 1}
                      y1={cY + headrestH / 2 + notchY}
                      x2={cX + rodSpacing / 2 + rodW / 2 - 1}
                      y2={cY + headrestH / 2 + notchY}
                      stroke="#222"
                      strokeWidth="1.5"
                    />
                  ))}
                </g>

                {/* Rod Spacing Annotation Badge */}
                <g transform={`translate(${cX}, ${cY + headrestH / 2 + 55})`}>
                  <line
                    x1={cX - rodSpacing / 2}
                    y1="0"
                    x2={cX + rodSpacing / 2}
                    y2="0"
                    stroke="#c9a84c"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  <rect x="-38" y="-10" width="76" height="20" rx="10" fill="#13162a" stroke="rgba(201,168,76,0.6)" strokeWidth="1" />
                  <text x="0" y="3.5" textAnchor="middle" fill="#d4b65c" fontSize="9.5" fontWeight="600" fontFamily="'Inter', sans-serif">
                    30 cm Rods
                  </text>
                </g>

                {/* 2. Main Curved Ergonomic Headrest Cushion */}
                <g transform={`translate(${cX}, ${cY + tiltOffsetY}) scale(1, ${tiltScaleY}) translate(${-cX}, ${-cY})`}>
                  {/* Outer tailored pill silhouette */}
                  <rect
                    x={cX - headrestW / 2}
                    y={cY - headrestH / 2}
                    width={headrestW}
                    height={headrestH}
                    rx={headrestH * 0.42}
                    fill="url(#headrestFabricGrad)"
                    stroke="#c9a84c"
                    strokeWidth="1.8"
                  />

                  {/* Inner luxury piping line */}
                  <rect
                    x={cX - headrestW / 2 + 6}
                    y={cY - headrestH / 2 + 6}
                    width={headrestW - 12}
                    height={headrestH - 12}
                    rx={(headrestH - 12) * 0.4}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.25)"
                    strokeWidth="1"
                    strokeDasharray="4 3"
                  />

                  {/* Ergonomic Neck Contour Arc Highlight */}
                  <path
                    d={`M ${cX - headrestW * 0.35} ${cY - 6} Q ${cX} ${cY + 14} ${cX + headrestW * 0.35} ${cY - 6}`}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.4)"
                    strokeWidth="1.4"
                  />

                  {/* Center Moroccan Emblem Accent */}
                  <g transform={`translate(${cX}, ${cY})`}>
                    <polygon points="0,-7 7,0 0,7 -7,0" fill="#13162a" stroke="#e8c96a" strokeWidth="1" />
                    <circle cx="0" cy="0" r="2" fill="#e8c96a" />
                  </g>
                </g>

                {/* 3. Incline Angle Indicator Arc (Left Side) */}
                <g transform={`translate(${cX - headrestW / 2 - 40}, ${cY + 15})`}>
                  <path
                    d="M 15 25 A 25 25 0 0 0 35 5"
                    fill="none"
                    stroke="#c9a84c"
                    strokeWidth="1.5"
                    strokeDasharray="3 2"
                  />
                  <polygon points="34,2 38,7 32,8" fill="#c9a84c" />
                  <rect x="-18" y="10" width="36" height="18" rx="9" fill="#13162a" stroke="#c9a84c" strokeWidth="1" />
                  <text x="0" y="22" textAnchor="middle" fill="#e8c96a" fontSize="10" fontWeight="700" fontFamily="'Inter', sans-serif">
                    {currentTilt}°
                  </text>
                </g>
              </g>
            </svg>
          </div>
        )}
      </div>

      {/* Tilt Angle Selector Buttons */}
      <div style={{ display: "flex", gap: "8px", justifyContent: "center", padding: "10px 14px", background: "rgba(19, 22, 42, 0.6)", borderTop: "1px solid rgba(201, 168, 76, 0.15)" }}>
        <span style={{ fontSize: "0.8rem", color: "var(--fg-muted)", alignSelf: "center", marginRight: "6px" }}>Incline Angle:</span>
        {[0, 30, 60, 90].map((deg) => (
          <button
            key={deg}
            type="button"
            className={`headrest-pill ${currentTilt === deg ? "active" : ""}`}
            style={{
              padding: "4px 12px",
              fontSize: "0.8rem",
              borderRadius: "14px",
              border: currentTilt === deg ? "1px solid #c9a84c" : "1px solid rgba(255,255,255,0.12)",
              background: currentTilt === deg ? "rgba(201, 168, 76, 0.2)" : "rgba(255,255,255,0.04)",
              color: currentTilt === deg ? "#e8c96a" : "var(--fg)",
              cursor: "pointer",
            }}
            onClick={() => handleTiltSelect(deg)}
          >
            {deg === 0 ? "0° Flat" : deg === 30 ? "30° Relax" : deg === 60 ? "60° Support" : "90° Upright"}
          </button>
        ))}
      </div>

      {/* Quick Specs Strip */}
      <div className="visualizer-quick-adjust-bar">
        <div className="adjust-control-item">
          <span className="adjust-label">🔩 Hardware Attachment</span>
          <div className="adjust-val-display" style={{ color: "var(--gold)" }}>
            Standard 30 cm Dual Polished Chrome Rods
          </div>
        </div>
        <div className="adjust-control-item">
          <span className="adjust-label">📐 Cushion Profile</span>
          <div className="adjust-val-display" style={{ color: "var(--fg)" }}>
            65 cm × 22 cm Curved Ergonomic Core
          </div>
        </div>
      </div>
    </div>
  )
}
