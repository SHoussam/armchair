"use client"

import React from "react"

interface ChairVisualizerProps {
  width: number // in meters (e.g. 0.85)
  colorHex: string
  colorName: string
  legFinishId: string
  legFinishLabel: string
  legColorHex: string
  tuftingStyleId: string
  tuftingLabel: string
  photoUrl: string
  photoAlt: string
  modelName: string
  activeView: "configurator" | "photo"
  onToggleView: (view: "configurator" | "photo") => void
  onWidthChange?: (w: number) => void
  minWidth?: number
  maxWidth?: number
}

export default function ChairVisualizer({
  width,
  colorHex,
  colorName,
  legFinishId,
  legFinishLabel,
  legColorHex,
  tuftingStyleId,
  tuftingLabel,
  photoUrl,
  photoAlt,
  modelName,
  activeView,
  onToggleView,
  onWidthChange,
  minWidth = 0.70,
  maxWidth = 1.25,
}: ChairVisualizerProps) {
  const svgWidth = 520
  const svgHeight = 400

  // Calculate dynamic chair width in SVG
  const scale = 220
  const chairW = Math.max(160, Math.min(300, width * scale))
  const chairH = 190
  const seatH = 45
  const backH = 135
  const armW = 28

  const cX = svgWidth / 2
  const cY = svgHeight / 2 + 10

  const chairLeft = cX - chairW / 2
  const chairRight = cX + chairW / 2
  const seatTop = cY + 15
  const backTop = seatTop - backH

  return (
    <div className="sofa-visualizer-container">
      {/* Header */}
      <div className="visualizer-header-bar">
        <div className="visualizer-view-tabs">
          <button
            type="button"
            className={`vis-tab-btn ${activeView === "configurator" ? "active" : ""}`}
            onClick={() => onToggleView("configurator")}
            aria-label="View interactive chair blueprint"
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
          <span>{colorName}</span> · <span>{legFinishLabel}</span>
        </div>
      </div>

      {/* Main Preview */}
      <div className="visualizer-canvas-wrapper">
        {activeView === "photo" ? (
          <div className="visualizer-photo-pane">
            <img src={photoUrl} alt={photoAlt || modelName} />
            <div className="visualizer-photo-overlay">
              <span className="vis-model-tag">{modelName}</span>
              <span className="vis-photo-caption">Bespoke Handcrafted Armchair</span>
            </div>
          </div>
        ) : (
          <div className="visualizer-svg-pane">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="sofa-blueprint-svg">
              <defs>
                <pattern id="chair-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(201, 168, 76, 0.14)" strokeWidth="1" />
                </pattern>
                <linearGradient id="chairFabricGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={colorHex} stopOpacity="0.95" />
                  <stop offset="70%" stopColor={colorHex} stopOpacity="0.82" />
                  <stop offset="100%" stopColor="#0b0d18" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="legGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={legColorHex} stopOpacity="1" />
                  <stop offset="100%" stopColor="#1a1a1a" stopOpacity="0.7" />
                </linearGradient>
                <filter id="chairShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#000000" floodOpacity="0.25" />
                </filter>
              </defs>

              <rect width="100%" height="100%" fill="url(#chair-grid)" rx="8" />

              {/* Width Ruler at Top */}
              <g className="dimension-ruler">
                <line
                  x1={chairLeft}
                  y1={backTop - 25}
                  x2={chairRight}
                  y2={backTop - 25}
                  stroke="#c9a84c"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
                <line x1={chairLeft} y1={backTop - 32} x2={chairLeft} y2={backTop - 18} stroke="#c9a84c" strokeWidth="2" />
                <line x1={chairRight} y1={backTop - 32} x2={chairRight} y2={backTop - 18} stroke="#c9a84c" strokeWidth="2" />

                <g transform={`translate(${cX}, ${backTop - 25})`}>
                  <rect x="-44" y="-13" width="88" height="26" rx="13" fill="#13162a" stroke="#c9a84c" strokeWidth="1.2" />
                  <text x="0" y="4" textAnchor="middle" fill="#e8c96a" fontSize="12" fontWeight="700" fontFamily="'Inter', sans-serif">
                    {Math.round(width * 100)} cm Width
                  </text>
                </g>
              </g>

              {/* Armchair Body */}
              <g filter="url(#chairShadow)">
                {/* 4 Wooden / Metallic Legs */}
                <g className="legs-group">
                  {/* Front Left Leg */}
                  <polygon
                    points={`${chairLeft + 18},${seatTop + seatH} ${chairLeft + 28},${seatTop + seatH} ${chairLeft + 12},${seatTop + seatH + 55} ${chairLeft + 6},${seatTop + seatH + 55}`}
                    fill="url(#legGrad)"
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="1"
                  />
                  {/* Front Right Leg */}
                  <polygon
                    points={`${chairRight - 28},${seatTop + seatH} ${chairRight - 18},${seatTop + seatH} ${chairRight - 6},${seatTop + seatH + 55} ${chairRight - 12},${seatTop + seatH + 55}`}
                    fill="url(#legGrad)"
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="1"
                  />
                  {/* Back Left Leg */}
                  <polygon
                    points={`${chairLeft + 42},${seatTop + seatH - 5} ${chairLeft + 50},${seatTop + seatH - 5} ${chairLeft + 36},${seatTop + seatH + 45} ${chairLeft + 30},${seatTop + seatH + 45}`}
                    fill="url(#legGrad)"
                    opacity="0.75"
                  />
                  {/* Back Right Leg */}
                  <polygon
                    points={`${chairRight - 50},${seatTop + seatH - 5} ${chairRight - 42},${seatTop + seatH - 5} ${chairRight - 30},${seatTop + seatH + 45} ${chairRight - 36},${seatTop + seatH + 45}`}
                    fill="url(#legGrad)"
                    opacity="0.75"
                  />
                </g>

                {/* Backrest */}
                <rect
                  x={chairLeft + armW * 0.4}
                  y={backTop}
                  width={chairW - armW * 0.8}
                  height={backH}
                  rx="16"
                  fill="url(#chairFabricGrad)"
                  stroke="rgba(201, 168, 76, 0.4)"
                  strokeWidth="1.5"
                />

                {/* Tufting Pattern Rendering on Backrest */}
                {tuftingStyleId === "channel" && (
                  <g className="channel-tufting">
                    {[-0.3, -0.1, 0.1, 0.3].map((factor, idx) => (
                      <line
                        key={`ch-${idx}`}
                        x1={cX + chairW * factor}
                        y1={backTop + 14}
                        x2={cX + chairW * factor}
                        y2={seatTop - 8}
                        stroke="rgba(0,0,0,0.35)"
                        strokeWidth="2"
                        strokeDasharray="4 2"
                      />
                    ))}
                  </g>
                )}

                {tuftingStyleId === "diamond" && (
                  <g className="diamond-tufting">
                    {[-0.25, 0, 0.25].map((factor, rIdx) => (
                      <g key={`d-row-${rIdx}`}>
                        <circle cx={cX + chairW * factor} cy={backTop + 40} r="3.5" fill="#c9a84c" opacity="0.8" />
                        <circle cx={cX + chairW * (factor + 0.125)} cy={backTop + 75} r="3.5" fill="#c9a84c" opacity="0.8" />
                        <line
                          x1={cX + chairW * factor}
                          y1={backTop + 40}
                          x2={cX + chairW * (factor + 0.125)}
                          y2={backTop + 75}
                          stroke="rgba(0,0,0,0.3)"
                          strokeWidth="1"
                        />
                      </g>
                    ))}
                  </g>
                )}

                {/* Thick Cushion Seat */}
                <rect
                  x={chairLeft + 6}
                  y={seatTop - 4}
                  width={chairW - 12}
                  height={seatH}
                  rx="10"
                  fill="url(#chairFabricGrad)"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="1.2"
                />
                {/* Piping seam on seat */}
                <line
                  x1={chairLeft + 12}
                  y1={seatTop + seatH / 2}
                  x2={chairRight - 12}
                  y2={seatTop + seatH / 2}
                  stroke="#c9a84c"
                  strokeWidth="1.2"
                  opacity="0.6"
                />

                {/* Left Armrest */}
                <rect
                  x={chairLeft}
                  y={seatTop - 35}
                  width={armW}
                  height={seatH + 35}
                  rx="10"
                  fill="url(#chairFabricGrad)"
                  stroke="rgba(201, 168, 76, 0.35)"
                  strokeWidth="1.2"
                />

                {/* Right Armrest */}
                <rect
                  x={chairRight - armW}
                  y={seatTop - 35}
                  width={armW}
                  height={seatH + 35}
                  rx="10"
                  fill="url(#chairFabricGrad)"
                  stroke="rgba(201, 168, 76, 0.35)"
                  strokeWidth="1.2"
                />
              </g>
            </svg>
          </div>
        )}
      </div>

      {/* Quick Adjust Strip */}
      <div className="visualizer-quick-adjust-bar">
        <div className="adjust-control-item">
          <span className="adjust-label">↔ Custom Width</span>
          <div className="adjust-btn-group">
            <button
              type="button"
              className="adjust-step-btn"
              onClick={() => onWidthChange?.(Math.max(minWidth, Number((width - 0.05).toFixed(2))))}
              disabled={width <= minWidth}
            >
              − 5 cm
            </button>
            <span className="adjust-val-display">{Math.round(width * 100)} cm ({width.toFixed(2)}m)</span>
            <button
              type="button"
              className="adjust-step-btn"
              onClick={() => onWidthChange?.(Math.min(maxWidth, Number((width + 0.05).toFixed(2))))}
              disabled={width >= maxWidth}
            >
              + 5 cm
            </button>
          </div>
        </div>

        <div className="adjust-control-item">
          <span className="adjust-label">Legs & Tufting</span>
          <div className="adjust-val-display" style={{ color: "var(--gold)" }}>
            {legFinishLabel} · {tuftingLabel}
          </div>
        </div>
      </div>
    </div>
  )
}
