"use client"

import React, { useMemo } from "react"
import { SeatSize } from "@/src/utils/pricing"

interface SofaVisualizerProps {
  length1: number // Horizontal length in meters (e.g. 2.70)
  length2: number // Vertical length in meters (e.g. 2.00)
  seatSize: SeatSize // 70 | 80 | 90
  colorHex: string
  colorName: string
  headrests: number
  chaiseOrientation: "left" | "right"
  armrestHorizontal: boolean
  armrestChaise: boolean
  photoUrl: string
  photoAlt: string
  modelName: string
  activeView: "configurator" | "photo"
  onToggleView: (view: "configurator" | "photo") => void
  onLength1Change?: (val: number) => void
  onLength2Change?: (val: number) => void
  minLength1?: number
  maxLength1?: number
  minLength2?: number
  maxLength2?: number
}

export default function SofaVisualizer({
  length1,
  length2,
  seatSize,
  colorHex,
  colorName,
  headrests,
  chaiseOrientation,
  armrestHorizontal,
  armrestChaise,
  photoUrl,
  photoAlt,
  modelName,
  activeView,
  onToggleView,
  onLength1Change,
  onLength2Change,
  minLength1 = 1.8,
  maxLength1 = 5.0,
  minLength2 = 1.2,
  maxLength2 = 4.0,
}: SofaVisualizerProps) {
  // SVG Canvas dimensions
  const svgWidth = 520
  const svgHeight = 400

  // Calculate dynamic scaling for the sofa inside SVG
  // Base reference is 2.70m x 2.00m
  const scale = useMemo(() => {
    const maxDimension = Math.max(length1, length2)
    // Dynamic scale to fit inside ~340px area
    return Math.min(105, 300 / Math.max(2.8, maxDimension * 0.95))
  }, [length1, length2])

  // Dimensions in SVG pixels
  const sofaH = length1 * scale // Horizontal span
  const sofaV = length2 * scale // Vertical span
  const seatDepthPx = (seatSize / 100) * scale * 1.05 // Visual seat cushion depth (backrest to front)
  const backrestThickness = 24
  const armrestWidth = 20

  // SVG positioning offsets to center the sofa
  const offsetX = (svgWidth - sofaH) / 2 + 10
  const offsetY = (svgHeight - sofaV) / 2 + 25

  return (
    <div className="sofa-visualizer-container">
      {/* Top View Selector Tabs */}
      <div className="visualizer-header-bar">
        <div className="visualizer-view-tabs">
          <button
            type="button"
            className={`vis-tab-btn ${activeView === "configurator" ? "active" : ""}`}
            onClick={() => onToggleView("configurator")}
            aria-label="View interactive 2D blueprint visualizer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
            <span>Blueprint</span>
          </button>
          <button
            type="button"
            className={`vis-tab-btn ${activeView === "photo" ? "active" : ""}`}
            onClick={() => onToggleView("photo")}
            aria-label="View showroom photo"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            <span>Showroom</span>
          </button>
        </div>

        <div className="visualizer-badge-info">
          <span className="vis-color-dot" style={{ backgroundColor: colorHex }} />
          <span>{colorName}</span>
          <span style={{ color: 'var(--fg-dim)' }}>·</span>
          <span>{seatSize} cm modules</span>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="visualizer-canvas-wrapper">
        {activeView === "photo" ? (
          <div className="visualizer-photo-pane">
            <img src={photoUrl} alt={photoAlt || modelName} />
            <div className="visualizer-photo-overlay">
              <span className="vis-model-tag">{modelName}</span>
              <span className="vis-photo-caption">Handcrafted to Order</span>
            </div>
          </div>
        ) : (
          <div className="visualizer-svg-pane">
            {/* SVG Visualizer */}
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="sofa-blueprint-svg"
              aria-label={`Interactive blueprint of ${modelName} at ${length1.toFixed(2)}m by ${length2.toFixed(2)}m`}
            >
              <defs>
                {/* Refined blueprint grid */}
                <pattern id="blueprint-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(176,141,62,0.08)" strokeWidth="0.5" />
                </pattern>
                <pattern id="blueprint-grid-major" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(176,141,62,0.14)" strokeWidth="0.8" />
                </pattern>

                {/* Fabric gradient fill - refined */}
                <linearGradient id="sofaFabricGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={colorHex} stopOpacity="0.92" />
                  <stop offset="50%" stopColor={colorHex} stopOpacity="0.88" />
                  <stop offset="100%" stopColor={colorHex} stopOpacity="0.82" />
                </linearGradient>

                {/* Cushion accent gradient */}
                <linearGradient id="cushionGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.18" />
                </linearGradient>

                {/* Headrest gradient */}
                <linearGradient id="headrestGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
                  <stop offset="50%" stopColor={colorHex} stopOpacity="1" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
                </linearGradient>

                {/* Soft shadow filter - refined */}
                <filter id="sofaShadow" x="-12%" y="-12%" width="130%" height="135%">
                  <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#221d16" floodOpacity="0.12" />
                  <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#c9a84c" floodOpacity="0.08" />
                </filter>
                <filter id="headrestShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#221d16" floodOpacity="0.2" />
                </filter>
              </defs>

              {/* Background grid layers */}
              <rect width="100%" height="100%" fill="url(#blueprint-grid)" rx="8" />
              <rect width="100%" height="100%" fill="url(#blueprint-grid-major)" rx="8" />

              {/* ───────────────── TOP DIMENSION RULER (Length 1) ───────────────── */}
              <g className="dimension-ruler horizontal-ruler">
                <line
                  x1={offsetX} y1={offsetY - 28}
                  x2={offsetX + sofaH} y2={offsetY - 28}
                  stroke="#c9a84c" strokeWidth="1" strokeDasharray="3 3"
                />
                <line
                  x1={offsetX} y1={offsetY - 35}
                  x2={offsetX} y2={offsetY - 21}
                  stroke="#c9a84c" strokeWidth="1.5"
                />
                <line
                  x1={offsetX + sofaH} y1={offsetY - 35}
                  x2={offsetX + sofaH} y2={offsetY - 21}
                  stroke="#c9a84c" strokeWidth="1.5"
                />
                {/* Dimension Badge - refined */}
                <g transform={`translate(${offsetX + sofaH / 2}, ${offsetY - 28})`}>
                  <rect
                    x="-38" y="-12"
                    width="76" height="24" rx="12"
                    fill="#1a1d2e"
                    stroke="rgba(201,168,76,0.4)"
                    strokeWidth="1"
                  />
                  <text
                    x="0" y="4"
                    textAnchor="middle"
                    fill="#d4b65c"
                    fontSize="11"
                    fontWeight="600"
                    fontFamily="'Inter', sans-serif"
                  >
                    {length1.toFixed(2)} m
                  </text>
                </g>
              </g>

              {/* ───────────────── VERTICAL / CHAISE RULER (Length 2) ───────────────── */}
              <g className="dimension-ruler vertical-ruler">
                {chaiseOrientation === "left" ? (
                  <>
                    <line
                      x1={offsetX - 28} y1={offsetY}
                      x2={offsetX - 28} y2={offsetY + sofaV}
                      stroke="#c9a84c" strokeWidth="1" strokeDasharray="3 3"
                    />
                    <line
                      x1={offsetX - 35} y1={offsetY}
                      x2={offsetX - 21} y2={offsetY}
                      stroke="#c9a84c" strokeWidth="1.5"
                    />
                    <line
                      x1={offsetX - 35} y1={offsetY + sofaV}
                      x2={offsetX - 21} y2={offsetY + sofaV}
                      stroke="#c9a84c" strokeWidth="1.5"
                    />
                    <g transform={`translate(${offsetX - 28}, ${offsetY + sofaV / 2})`}>
                      <rect
                        x="-38" y="-12"
                        width="76" height="24" rx="12"
                        fill="#1a1d2e"
                        stroke="rgba(201,168,76,0.4)"
                        strokeWidth="1"
                      />
                      <text
                        x="0" y="4"
                        textAnchor="middle"
                        fill="#d4b65c"
                        fontSize="11"
                        fontWeight="600"
                        fontFamily="'Inter', sans-serif"
                      >
                        {length2.toFixed(2)} m
                      </text>
                    </g>
                  </>
                ) : (
                  <>
                    <line
                      x1={offsetX + sofaH + 28} y1={offsetY}
                      x2={offsetX + sofaH + 28} y2={offsetY + sofaV}
                      stroke="#c9a84c" strokeWidth="1" strokeDasharray="3 3"
                    />
                    <line
                      x1={offsetX + sofaH + 21} y1={offsetY}
                      x2={offsetX + sofaH + 35} y2={offsetY}
                      stroke="#c9a84c" strokeWidth="1.5"
                    />
                    <line
                      x1={offsetX + sofaH + 21} y1={offsetY + sofaV}
                      x2={offsetX + sofaH + 35} y2={offsetY + sofaV}
                      stroke="#c9a84c" strokeWidth="1.5"
                    />
                    <g transform={`translate(${offsetX + sofaH + 28}, ${offsetY + sofaV / 2})`}>
                      <rect
                        x="-38" y="-12"
                        width="76" height="24" rx="12"
                        fill="#1a1d2e"
                        stroke="rgba(201,168,76,0.4)"
                        strokeWidth="1"
                      />
                      <text
                        x="0" y="4"
                        textAnchor="middle"
                        fill="#d4b65c"
                        fontSize="11"
                        fontWeight="600"
                        fontFamily="'Inter', sans-serif"
                      >
                        {length2.toFixed(2)} m
                      </text>
                    </g>
                  </>
                )}
              </g>

              {/* ───────────────── SOFA BODY RENDERING ───────────────── */}
              <g transform={`translate(${offsetX}, ${offsetY})`} filter="url(#sofaShadow)">
                {/* 1. Main Base Silhouette (L-Shape) */}
                {chaiseOrientation === "left" ? (
                  <path
                    d={`
                      M 0 0
                      L ${sofaH} 0
                      Q ${sofaH + 3} 0 ${sofaH + 3} 3
                      L ${sofaH + 3} ${seatDepthPx}
                      Q ${sofaH + 3} ${seatDepthPx + 3} ${sofaH} ${seatDepthPx + 3}
                      L ${seatDepthPx + 3} ${seatDepthPx + 3}
                      L ${seatDepthPx + 3} ${sofaV}
                      Q ${seatDepthPx + 3} ${sofaV + 3} ${seatDepthPx} ${sofaV + 3}
                      L 0 ${sofaV + 3}
                      Q -3 ${sofaV + 3} -3 ${sofaV}
                      L -3 3
                      Q -3 0 0 0
                      Z
                    `}
                    fill="url(#sofaFabricGrad)"
                    stroke="rgba(201,168,76,0.3)"
                    strokeWidth="1.5"
                  />
                ) : (
                  <path
                    d={`
                      M 0 0
                      L ${sofaH} 0
                      Q ${sofaH + 3} 0 ${sofaH + 3} 3
                      L ${sofaH + 3} ${sofaV}
                      Q ${sofaH + 3} ${sofaV + 3} ${sofaH} ${sofaV + 3}
                      L ${sofaH - seatDepthPx} ${sofaV + 3}
                      Q ${sofaH - seatDepthPx - 3} ${sofaV + 3} ${sofaH - seatDepthPx - 3} ${sofaV}
                      L ${sofaH - seatDepthPx - 3} ${seatDepthPx + 3}
                      L 0 ${seatDepthPx + 3}
                      Q -3 ${seatDepthPx + 3} -3 ${seatDepthPx}
                      L -3 3
                      Q -3 0 0 0
                      Z
                    `}
                    fill="url(#sofaFabricGrad)"
                    stroke="rgba(201,168,76,0.3)"
                    strokeWidth="1.5"
                  />
                )}

                {/* 2. Backrest (Top bar along horizontal length) */}
                <rect
                  x="0" y="0"
                  width={sofaH}
                  height={backrestThickness}
                  rx="3"
                  fill="rgba(0,0,0,0.2)"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="0.8"
                />

                {/* 3. Chaise Backrest (Side vertical backrest) */}
                {chaiseOrientation === "left" ? (
                  <rect
                    x="0" y="0"
                    width={backrestThickness}
                    height={sofaV}
                    rx="3"
                    fill="rgba(0,0,0,0.2)"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="0.8"
                  />
                ) : (
                  <rect
                    x={sofaH - backrestThickness} y="0"
                    width={backrestThickness}
                    height={sofaV}
                    rx="3"
                    fill="rgba(0,0,0,0.2)"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="0.8"
                  />
                )}

                {/* 4. Horizontal Seat Cushion — ends before chaise */}
                {(() => {
                  const rightArmrest = chaiseOrientation === "left" && armrestHorizontal
                  const leftArmrest = chaiseOrientation === "right" && armrestHorizontal
                  const hStart = chaiseOrientation === "left"
                    ? seatDepthPx + 3
                    : (leftArmrest ? armrestWidth + 3 : backrestThickness + 3)
                  const hEnd = chaiseOrientation === "left"
                    ? sofaH - 3 - (rightArmrest ? armrestWidth : 0)
                    : sofaH - seatDepthPx - 3

                  return (
                    <rect
                      x={hStart}
                      y={backrestThickness + 3}
                      width={hEnd - hStart}
                      height={seatDepthPx - backrestThickness - 3}
                      rx="5"
                      fill="url(#cushionGrad)"
                      stroke="rgba(255,255,255,0.12)"
                      strokeWidth="0.8"
                    />
                  )
                })()}

                {/* 5. Chaise Vertical Seat Cushion — one rectangle */}
                {(() => {
                  const hasBottomArmrest = armrestChaise
                  const vStartY = backrestThickness + 3
                  const vCushionH = sofaV - vStartY - (hasBottomArmrest ? armrestWidth : 0)
                  return (
                    <rect
                      x={
                        chaiseOrientation === "left"
                          ? backrestThickness + 3
                          : sofaH - seatDepthPx
                      }
                      y={vStartY}
                      width={seatDepthPx - backrestThickness - 3}
                      height={vCushionH}
                      rx="5"
                      fill="url(#cushionGrad)"
                      stroke="rgba(255,255,255,0.12)"
                      strokeWidth="0.8"
                    />
                  )
                })()}

                {/* 6. Armrests */}
                {chaiseOrientation === "left" && armrestHorizontal && (
                  <rect
                    x={sofaH - armrestWidth} y={backrestThickness}
                    width={armrestWidth}
                    height={seatDepthPx - backrestThickness + 3}
                    rx="4"
                    fill="rgba(0,0,0,0.3)"
                    stroke="rgba(201,168,76,0.2)"
                    strokeWidth="0.8"
                  />
                )}
                {chaiseOrientation === "right" && armrestHorizontal && (
                  <rect
                    x="0" y={backrestThickness}
                    width={armrestWidth}
                    height={seatDepthPx - backrestThickness + 3}
                    rx="4"
                    fill="rgba(0,0,0,0.3)"
                    stroke="rgba(201,168,76,0.2)"
                    strokeWidth="0.8"
                  />
                )}
                {armrestChaise && (
                  <rect
                    x={
                      chaiseOrientation === "left"
                        ? backrestThickness
                        : sofaH - seatDepthPx
                    }
                    y={sofaV - armrestWidth}
                    width={seatDepthPx - backrestThickness + 3}
                    height={armrestWidth}
                    rx="4"
                    fill="rgba(0,0,0,0.3)"
                    stroke="rgba(201,168,76,0.2)"
                    strokeWidth="0.8"
                  />
                )}

                {/* 8. Headrests Rendering */}
                {headrests > 0 && (
                  <g className="headrests-layer" filter="url(#headrestShadow)">
                    {Array.from({ length: headrests }).map((_, hIdx) => {
                      const hrWidth = 44
                      const hrHeight = 10
                      const spacing = sofaH / (headrests + 1)
                      const hrX = spacing * (hIdx + 1) - hrWidth / 2
                      const hrY = -5

                      return (
                        <g key={`hr-${hIdx}`}>
                          <rect
                            x={hrX} y={hrY}
                            width={hrWidth} height={hrHeight}
                            rx="5"
                            fill="url(#headrestGrad)"
                            stroke="#c9a84c"
                            strokeWidth="0.8"
                          />
                          <line
                            x1={hrX + 8} y1={hrY + hrHeight / 2}
                            x2={hrX + hrWidth - 8} y2={hrY + hrHeight / 2}
                            stroke="#d4b65c"
                            strokeWidth="0.8"
                          />
                        </g>
                      )
                    })}
                  </g>
                )}

                {/* 6. Seat Depth Badge Callout */}
                <g transform={`translate(${sofaH / 2}, ${seatDepthPx + 18})`}>
                  <rect
                    x="-30" y="-9"
                    width="60" height="18" rx="9"
                    fill="#1a1d2e"
                    stroke="rgba(201,168,76,0.3)"
                    strokeWidth="0.8"
                  />
                  <text
                    x="0" y="4"
                    textAnchor="middle"
                    fill="#8888a0"
                    fontSize="9"
                    fontWeight="600"
                    fontFamily="'Inter', sans-serif"
                  >
                    {seatSize} cm depth
                  </text>
                </g>
              </g>
            </svg>
          </div>
        )}
      </div>

      {/* Dimension Quick-Adjust Controllers */}
      {activeView === "configurator" && (
        <div className="visualizer-quick-adjust-bar">
          <div className="adjust-control-item">
            <span className="adjust-label">↔ Horizontal</span>
            <div className="adjust-btn-group">
              <button
                type="button"
                className="adjust-step-btn"
                onClick={() => onLength1Change?.(Math.max(minLength1, Number((length1 - 0.1).toFixed(2))))}
                disabled={length1 <= minLength1}
                aria-label="Decrease horizontal length by 10cm"
              >
                − 10 cm
              </button>
              <span className="adjust-val-display">{length1.toFixed(2)} m</span>
              <button
                type="button"
                className="adjust-step-btn"
                onClick={() => onLength1Change?.(Math.min(maxLength1, Number((length1 + 0.1).toFixed(2))))}
                disabled={length1 >= maxLength1}
                aria-label="Increase horizontal length by 10cm"
              >
                + 10 cm
              </button>
            </div>
          </div>

          <div className="adjust-control-item">
            <span className="adjust-label">↕ Chaise</span>
            <div className="adjust-btn-group">
              <button
                type="button"
                className="adjust-step-btn"
                onClick={() => onLength2Change?.(Math.max(minLength2, Number((length2 - 0.1).toFixed(2))))}
                disabled={length2 <= minLength2}
                aria-label="Decrease vertical chaise length by 10cm"
              >
                − 10 cm
              </button>
              <span className="adjust-val-display">{length2.toFixed(2)} m</span>
              <button
                type="button"
                className="adjust-step-btn"
                onClick={() => onLength2Change?.(Math.min(maxLength2, Number((length2 + 0.1).toFixed(2))))}
                disabled={length2 >= maxLength2}
                aria-label="Increase vertical chaise length by 10cm"
              >
                + 10 cm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
