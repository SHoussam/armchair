"use client"

import React from "react"

interface AccessoryVisualizerProps {
  packCount: number
  sizeLabel: string
  fillLabel: string
  colorHex: string
  colorName: string
  photoUrl: string
  photoAlt: string
  modelName: string
  activeView: "configurator" | "photo"
  onToggleView: (view: "configurator" | "photo") => void
}

export default function AccessoryVisualizer({
  packCount,
  sizeLabel,
  fillLabel,
  colorHex,
  colorName,
  photoUrl,
  photoAlt,
  modelName,
  activeView,
  onToggleView,
}: AccessoryVisualizerProps) {
  const svgWidth = 520
  const svgHeight = 400

  // Calculate grid layout of cushions based on packCount
  const cushions = Array.from({ length: packCount }).map((_, i) => {
    let x = 0
    let y = 0
    let rotation = 0

    if (packCount === 2) {
      x = 160 + i * 130
      y = 190
      rotation = (i === 0 ? -6 : 6)
    } else if (packCount === 4) {
      const col = i % 2
      const row = Math.floor(i / 2)
      x = 180 + col * 120
      y = 130 + row * 115
      rotation = (i % 2 === 0 ? -4 : 4)
    } else if (packCount === 6) {
      const col = i % 3
      const row = Math.floor(i / 3)
      x = 130 + col * 115
      y = 130 + row * 115
      rotation = (col === 0 ? -5 : col === 2 ? 5 : 0)
    } else {
      // 8 cushions
      const col = i % 4
      const row = Math.floor(i / 4)
      x = 100 + col * 98
      y = 130 + row * 115
      rotation = (col === 0 ? -6 : col === 3 ? 6 : 0)
    }

    return { id: i, x, y, rotation }
  })

  const cSize = packCount >= 8 ? 74 : 88

  return (
    <div className="sofa-visualizer-container">
      {/* Header */}
      <div className="visualizer-header-bar">
        <div className="visualizer-view-tabs">
          <button
            type="button"
            className={`vis-tab-btn ${activeView === "configurator" ? "active" : ""}`}
            onClick={() => onToggleView("configurator")}
            aria-label="View interactive cushion blueprint"
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
          <span>{colorName}</span> · <span>Set of {packCount}</span>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="visualizer-canvas-wrapper">
        {activeView === "photo" ? (
          <div className="visualizer-photo-pane">
            <img src={photoUrl} alt={photoAlt || modelName} />
            <div className="visualizer-photo-overlay">
              <span className="vis-model-tag">{modelName}</span>
              <span className="vis-photo-caption">Hand-Embroidered Moroccan Cushion Set</span>
            </div>
          </div>
        ) : (
          <div className="visualizer-svg-pane">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="sofa-blueprint-svg">
              <defs>
                <pattern id="acc-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(201, 168, 76, 0.14)" strokeWidth="1" />
                </pattern>
                <linearGradient id="cushionFabric" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={colorHex} stopOpacity="0.95" />
                  <stop offset="60%" stopColor={colorHex} stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0b0d18" stopOpacity="0.85" />
                </linearGradient>
                <filter id="cushionShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#000000" floodOpacity="0.22" />
                </filter>
              </defs>

              <rect width="100%" height="100%" fill="url(#acc-grid)" rx="8" />

              {/* Badges */}
              <g transform="translate(260, 40)">
                <rect x="-100" y="-13" width="200" height="26" rx="13" fill="#13162a" stroke="#c9a84c" strokeWidth="1.2" />
                <text x="0" y="4" textAnchor="middle" fill="#e8c96a" fontSize="11.5" fontWeight="700" fontFamily="'Inter', sans-serif">
                  {packCount} Cushions · {sizeLabel}
                </text>
              </g>

              {/* Render Cushions */}
              <g filter="url(#cushionShadow)">
                {cushions.map((c) => (
                  <g key={c.id} transform={`translate(${c.x}, ${c.y}) rotate(${c.rotation})`}>
                    {/* Plush curved square */}
                    <rect
                      x={-cSize / 2}
                      y={-cSize / 2}
                      width={cSize}
                      height={cSize}
                      rx={cSize * 0.28}
                      fill="url(#cushionFabric)"
                      stroke="#c9a84c"
                      strokeWidth="1.4"
                    />

                    {/* Embroidered Diamond Star Moroccan Motif */}
                    <g transform="scale(0.85)" opacity="0.85">
                      <polygon
                        points="0,-18 18,0 0,18 -18,0"
                        fill="none"
                        stroke="#e8c96a"
                        strokeWidth="1.2"
                      />
                      <polygon
                        points="-13,-13 13,-13 13,13 -13,13"
                        fill="none"
                        stroke="rgba(255,255,255,0.4)"
                        strokeWidth="0.8"
                      />
                      <circle cx="0" cy="0" r="3" fill="#e8c96a" />
                    </g>
                  </g>
                ))}
              </g>
            </svg>
          </div>
        )}
      </div>

      {/* Info Strip */}
      <div className="visualizer-quick-adjust-bar">
        <div className="adjust-control-item">
          <span className="adjust-label">📦 Pack Configuration</span>
          <div className="adjust-val-display" style={{ color: "var(--gold)" }}>
            Set of {packCount} Cushions ({sizeLabel})
          </div>
        </div>
        <div className="adjust-control-item">
          <span className="adjust-label">☁ Inner Core Filling</span>
          <div className="adjust-val-display" style={{ color: "var(--fg)" }}>
            {fillLabel}
          </div>
        </div>
      </div>
    </div>
  )
}
