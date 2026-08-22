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
  const seatDepthPx = (seatSize / 100) * scale * 1.05 // Visual seat cushion depth
  const backrestThickness = 24
  const armrestWidth = 20

  // Calculate cushion segments
  const horizontalSeatSpan = sofaH - (chaiseOrientation === "left" ? seatDepthPx : armrestWidth) - armrestWidth
  const numHorizontalCushions = Math.max(2, Math.round(horizontalSeatSpan / ((seatSize / 100) * scale)))

  const verticalChaiseSpan = sofaV - seatDepthPx
  const numVerticalCushions = Math.max(1, Math.round(verticalChaiseSpan / ((seatSize / 100) * scale)))

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
          <span>{colorName}</span> · <span>{seatSize} cm modules</span>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="visualizer-canvas-wrapper">
        {activeView === "photo" ? (
          <div className="visualizer-photo-pane">
            <img src={photoUrl} alt={photoAlt || modelName} />
            <div className="visualizer-photo-overlay">
              <span className="vis-model-tag">{modelName}</span>
              <span className="vis-photo-caption">Moroccan Artisan Handcrafted</span>
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
                {/* Blueprint grid background */}
                <pattern id="blueprint-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(201, 168, 76, 0.05)" strokeWidth="1" />
                </pattern>

                {/* Fabric gradient fill */}
                <linearGradient id="sofaFabricGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={colorHex} stopOpacity="0.95" />
                  <stop offset="70%" stopColor={colorHex} stopOpacity="0.85" />
                  <stop offset="100%" stopColor={colorHex} stopOpacity="0.75" />
                </linearGradient>

                {/* Cushion accent gradient */}
                <linearGradient id="cushionGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
                </linearGradient>

                {/* Headrest gradient */}
                <linearGradient id="headrestGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                  <stop offset="50%" stopColor={colorHex} stopOpacity="1" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
                </linearGradient>

                {/* Soft shadow filter */}
                <filter id="sofaShadow" x="-10%" y="-10%" width="130%" height="130%">
                  <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#000000" floodOpacity="0.55" />
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#c9a84c" floodOpacity="0.15" />
                </filter>
                <filter id="headrestShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
                </filter>
              </defs>

              {/* Background blueprint grid */}
              <rect width="100%" height="100%" fill="url(#blueprint-grid)" rx="8" />

              {/* ───────────────── TOP DIMENSION RULER (Length 1) ───────────────── */}
              <g className="dimension-ruler horizontal-ruler">
                {/* Horizontal dimension line */}
                <line
                  x1={offsetX}
                  y1={offsetY - 26}
                  x2={offsetX + sofaH}
                  y2={offsetY - 26}
                  stroke="#c9a84c"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
                {/* Left & Right tick caps */}
                <line
                  x1={offsetX}
                  y1={offsetY - 33}
                  x2={offsetX}
                  y2={offsetY - 19}
                  stroke="#c9a84c"
                  strokeWidth="2"
                />
                <line
                  x1={offsetX + sofaH}
                  y1={offsetY - 33}
                  x2={offsetX + sofaH}
                  y2={offsetY - 19}
                  stroke="#c9a84c"
                  strokeWidth="2"
                />

                {/* Dimension Badge */}
                <g transform={`translate(${offsetX + sofaH / 2}, ${offsetY - 26})`}>
                  <rect
                    x="-42"
                    y="-14"
                    width="84"
                    height="28"
                    rx="14"
                    fill="#13162a"
                    stroke="#c9a84c"
                    strokeWidth="1.5"
                  />
                  <text
                    x="0"
                    y="4"
                    textAnchor="middle"
                    fill="#e8c96a"
                    fontSize="12.5"
                    fontWeight="700"
                    fontFamily="'DM Sans', sans-serif"
                  >
                    {length1.toFixed(2)} m
                  </text>
                </g>
              </g>

              {/* ───────────────── VERTICAL / CHAISE RULER (Length 2) ───────────────── */}
              <g className="dimension-ruler vertical-ruler">
                {/* Position on left or right according to chaise */}
                {chaiseOrientation === "left" ? (
                  <>
                    {/* Left ruler line */}
                    <line
                      x1={offsetX - 26}
                      y1={offsetY}
                      x2={offsetX - 26}
                      y2={offsetY + sofaV}
                      stroke="#c9a84c"
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                    />
                    {/* Top & Bottom tick caps */}
                    <line
                      x1={offsetX - 33}
                      y1={offsetY}
                      x2={offsetX - 19}
                      y2={offsetY}
                      stroke="#c9a84c"
                      strokeWidth="2"
                    />
                    <line
                      x1={offsetX - 33}
                      y1={offsetY + sofaV}
                      x2={offsetX - 19}
                      y2={offsetY + sofaV}
                      stroke="#c9a84c"
                      strokeWidth="2"
                    />

                    {/* Dimension Badge */}
                    <g transform={`translate(${offsetX - 26}, ${offsetY + sofaV / 2})`}>
                      <rect
                        x="-42"
                        y="-14"
                        width="84"
                        height="28"
                        rx="14"
                        fill="#13162a"
                        stroke="#c9a84c"
                        strokeWidth="1.5"
                      />
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        fill="#e8c96a"
                        fontSize="12.5"
                        fontWeight="700"
                        fontFamily="'DM Sans', sans-serif"
                      >
                        {length2.toFixed(2)} m
                      </text>
                    </g>
                  </>
                ) : (
                  <>
                    {/* Right ruler line for right chaise */}
                    <line
                      x1={offsetX + sofaH + 26}
                      y1={offsetY}
                      x2={offsetX + sofaH + 26}
                      y2={offsetY + sofaV}
                      stroke="#c9a84c"
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                    />
                    {/* Top & Bottom tick caps */}
                    <line
                      x1={offsetX + sofaH + 19}
                      y1={offsetY}
                      x2={offsetX + sofaH + 33}
                      y2={offsetY}
                      stroke="#c9a84c"
                      strokeWidth="2"
                    />
                    <line
                      x1={offsetX + sofaH + 19}
                      y1={offsetY + sofaV}
                      x2={offsetX + sofaH + 33}
                      y2={offsetY + sofaV}
                      stroke="#c9a84c"
                      strokeWidth="2"
                    />

                    {/* Dimension Badge */}
                    <g transform={`translate(${offsetX + sofaH + 26}, ${offsetY + sofaV / 2})`}>
                      <rect
                        x="-42"
                        y="-14"
                        width="84"
                        height="28"
                        rx="14"
                        fill="#13162a"
                        stroke="#c9a84c"
                        strokeWidth="1.5"
                      />
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        fill="#e8c96a"
                        fontSize="12.5"
                        fontWeight="700"
                        fontFamily="'DM Sans', sans-serif"
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
                      Q ${sofaH + 4} 0 ${sofaH + 4} 4
                      L ${sofaH + 4} ${seatDepthPx}
                      Q ${sofaH + 4} ${seatDepthPx + 4} ${sofaH} ${seatDepthPx + 4}
                      L ${seatDepthPx + 4} ${seatDepthPx + 4}
                      L ${seatDepthPx + 4} ${sofaV}
                      Q ${seatDepthPx + 4} ${sofaV + 4} ${seatDepthPx} ${sofaV + 4}
                      L 0 ${sofaV + 4}
                      Q -4 ${sofaV + 4} -4 ${sofaV}
                      L -4 4
                      Q -4 0 0 0
                      Z
                    `}
                    fill="url(#sofaFabricGrad)"
                    stroke="rgba(201, 168, 76, 0.45)"
                    strokeWidth="2"
                  />
                ) : (
                  <path
                    d={`
                      M 0 0
                      L ${sofaH} 0
                      Q ${sofaH + 4} 0 ${sofaH + 4} 4
                      L ${sofaH + 4} ${sofaV}
                      Q ${sofaH + 4} ${sofaV + 4} ${sofaH} ${sofaV + 4}
                      L ${sofaH - seatDepthPx} ${sofaV + 4}
                      Q ${sofaH - seatDepthPx - 4} ${sofaV + 4} ${sofaH - seatDepthPx - 4} ${sofaV}
                      L ${sofaH - seatDepthPx - 4} ${seatDepthPx + 4}
                      L 0 ${seatDepthPx + 4}
                      Q -4 ${seatDepthPx + 4} -4 ${seatDepthPx}
                      L -4 4
                      Q -4 0 0 0
                      Z
                    `}
                    fill="url(#sofaFabricGrad)"
                    stroke="rgba(201, 168, 76, 0.45)"
                    strokeWidth="2"
                  />
                )}

                {/* 2. Backrest (Top bar along horizontal length) */}
                <rect
                  x="0"
                  y="0"
                  width={sofaH}
                  height={backrestThickness}
                  rx="4"
                  fill="rgba(0,0,0,0.22)"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1"
                />

                {/* 3. Chaise Backrest (Side vertical backrest) */}
                {chaiseOrientation === "left" ? (
                  <rect
                    x="0"
                    y="0"
                    width={backrestThickness}
                    height={sofaV}
                    rx="4"
                    fill="rgba(0,0,0,0.22)"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="1"
                  />
                ) : (
                  <rect
                    x={sofaH - backrestThickness}
                    y="0"
                    width={backrestThickness}
                    height={sofaV}
                    rx="4"
                    fill="rgba(0,0,0,0.22)"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="1"
                  />
                )}

                {/* 4. Horizontal Seat Cushions */}
                {Array.from({ length: numHorizontalCushions }).map((_, idx) => {
                  const cushionW = horizontalSeatSpan / numHorizontalCushions
                  const cushionX =
                    chaiseOrientation === "left"
                      ? seatDepthPx + idx * cushionW
                      : idx * cushionW
                  const cushionY = backrestThickness + 3
                  const cushionH = seatDepthPx - backrestThickness

                  return (
                    <g key={`h-cushion-${idx}`}>
                      {/* Cushion block */}
                      <rect
                        x={cushionX + 2}
                        y={cushionY}
                        width={cushionW - 4}
                        height={cushionH}
                        rx="7"
                        fill="url(#cushionGrad)"
                        stroke="rgba(255,255,255,0.18)"
                        strokeWidth="1.2"
                      />
                      {/* Soft tufting / seam line in middle */}
                      <line
                        x1={cushionX + (cushionW - 4) * 0.3}
                        y1={cushionY + cushionH / 2}
                        x2={cushionX + (cushionW - 4) * 0.7}
                        y2={cushionY + cushionH / 2}
                        stroke="rgba(0,0,0,0.3)"
                        strokeWidth="1"
                        strokeDasharray="2 2"
                      />
                    </g>
                  )
                })}

                {/* 5. Chaise Vertical Seat Cushions */}
                {Array.from({ length: numVerticalCushions }).map((_, idx) => {
                  const cushionH = verticalChaiseSpan / numVerticalCushions
                  const cushionY = seatDepthPx + idx * cushionH
                  const cushionX =
                    chaiseOrientation === "left"
                      ? backrestThickness + 3
                      : sofaH - seatDepthPx + 3
                  const cushionW = seatDepthPx - backrestThickness

                  return (
                    <g key={`v-cushion-${idx}`}>
                      <rect
                        x={cushionX}
                        y={cushionY + 2}
                        width={cushionW}
                        height={cushionH - 4}
                        rx="7"
                        fill="url(#cushionGrad)"
                        stroke="rgba(255,255,255,0.18)"
                        strokeWidth="1.2"
                      />
                      <line
                        x1={cushionX + cushionW / 2}
                        y1={cushionY + (cushionH - 4) * 0.3}
                        x2={cushionX + cushionW / 2}
                        y2={cushionY + (cushionH - 4) * 0.7}
                        stroke="rgba(0,0,0,0.3)"
                        strokeWidth="1"
                        strokeDasharray="2 2"
                      />
                    </g>
                  )
                })}

                {/* 6. Corner Junction Cushion */}
                {chaiseOrientation === "left" ? (
                  <rect
                    x={backrestThickness + 3}
                    y={backrestThickness + 3}
                    width={seatDepthPx - backrestThickness - 2}
                    height={seatDepthPx - backrestThickness - 2}
                    rx="7"
                    fill="url(#cushionGrad)"
                    stroke="rgba(255,255,255,0.18)"
                    strokeWidth="1.2"
                  />
                ) : (
                  <rect
                    x={sofaH - seatDepthPx + 3}
                    y={backrestThickness + 3}
                    width={seatDepthPx - backrestThickness - 2}
                    height={seatDepthPx - backrestThickness - 2}
                    rx="7"
                    fill="url(#cushionGrad)"
                    stroke="rgba(255,255,255,0.18)"
                    strokeWidth="1.2"
                  />
                )}

                {/* 7. Armrests */}
                {chaiseOrientation === "left" ? (
                  // Right armrest
                  <rect
                    x={sofaH - armrestWidth}
                    y={backrestThickness}
                    width={armrestWidth}
                    height={seatDepthPx - backrestThickness + 4}
                    rx="5"
                    fill="rgba(0,0,0,0.35)"
                    stroke="rgba(201,168,76,0.3)"
                    strokeWidth="1"
                  />
                ) : (
                  // Left armrest
                  <rect
                    x="0"
                    y={backrestThickness}
                    width={armrestWidth}
                    height={seatDepthPx - backrestThickness + 4}
                    rx="5"
                    fill="rgba(0,0,0,0.35)"
                    stroke="rgba(201,168,76,0.3)"
                    strokeWidth="1"
                  />
                )}

                {/* 8. Headrests Rendering (if headrests > 0) */}
                {headrests > 0 && (
                  <g className="headrests-layer" filter="url(#headrestShadow)">
                    {Array.from({ length: headrests }).map((_, hIdx) => {
                      // Distribute headrests evenly along horizontal backrest
                      const hrWidth = 46
                      const hrHeight = 12
                      const spacing = sofaH / (headrests + 1)
                      const hrX = spacing * (hIdx + 1) - hrWidth / 2
                      const hrY = -6 // Pop slightly above backrest

                      return (
                        <g key={`hr-${hIdx}`}>
                          {/* Headrest mounting pill */}
                          <rect
                            x={hrX}
                            y={hrY}
                            width={hrWidth}
                            height={hrHeight}
                            rx="6"
                            fill="url(#headrestGrad)"
                            stroke="#c9a84c"
                            strokeWidth="1.2"
                          />
                          {/* Metallic stitch accent */}
                          <line
                            x1={hrX + 8}
                            y1={hrY + hrHeight / 2}
                            x2={hrX + hrWidth - 8}
                            y2={hrY + hrHeight / 2}
                            stroke="#e8c96a"
                            strokeWidth="1"
                          />
                        </g>
                      )
                    })}
                  </g>
                )}

                {/* 9. Seat Depth Badge Callout (Front edge) */}
                <g transform={`translate(${sofaH / 2}, ${seatDepthPx + 16})`}>
                  <rect
                    x="-34"
                    y="-10"
                    width="68"
                    height="20"
                    rx="10"
                    fill="#1b1f36"
                    stroke="rgba(201, 168, 76, 0.4)"
                    strokeWidth="1"
                  />
                  <text
                    x="0"
                    y="4"
                    textAnchor="middle"
                    fill="#8a8aa8"
                    fontSize="10"
                    fontWeight="600"
                    fontFamily="'DM Sans', sans-serif"
                  >
                    {seatSize} cm seat
                  </text>
                </g>
              </g>
            </svg>
          </div>
        )}
      </div>

      {/* Dimension Quick-Adjust Controllers right underneath visualizer */}
      {activeView === "configurator" && (
        <div className="visualizer-quick-adjust-bar">
          <div className="adjust-control-item">
            <span className="adjust-label">↔ Length (Horizontal)</span>
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
            <span className="adjust-label">↕ Chaise (Vertical)</span>
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
