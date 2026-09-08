import React, { useMemo } from "react"

interface BedVisualizerProps {
  width: number // in meters (e.g. 1.60, 1.80, 2.00)
  length: number // in meters (e.g. 1.90, 2.00)
  headboardStyle?: string // "tufted" | "channel" | "minimal" | "moroccan"
  headboardHeightCm?: number // e.g. 120
  hasStorageBox?: boolean
  colorHex: string
  colorName: string
  photoUrl: string
  photoAlt: string
  modelName: string
  activeView: "configurator" | "photo"
  onToggleView: (view: "configurator" | "photo") => void
  onWidthChange?: (w: number) => void
  onLengthChange?: (l: number) => void
  minWidth?: number
  maxWidth?: number
  minLength?: number
  maxLength?: number
}

export default function BedVisualizer({
  width,
  length,
  headboardStyle = "tufted",
  headboardHeightCm = 120,
  hasStorageBox = false,
  colorHex,
  colorName,
  photoUrl,
  photoAlt,
  modelName,
  activeView,
  onToggleView,
  onWidthChange,
  onLengthChange,
  minWidth = 1.4,
  maxWidth = 2.0,
  minLength = 1.9,
  maxLength = 2.1,
}: BedVisualizerProps) {
  const svgWidth = 520
  const svgHeight = 400

  // Calculate dynamic scale to comfortably center the bed within the canvas
  const { bedW, bedL, cX, cY, bedLeft, bedRight, bedTop, bedBottom, headboardW, headboardH } = useMemo(() => {
    // Dynamic scale factor: fit max dimensions (2.10m length, 2.00m width) into ~260px
    const scale = 118
    const wPx = Math.max(160, Math.min(260, width * scale))
    const lPx = Math.max(200, Math.min(270, length * scale))

    const centerX = svgWidth / 2
    const centerY = svgHeight / 2 + 12

    const left = centerX - wPx / 2
    const right = centerX + wPx / 2
    const top = centerY - lPx / 2 + 8
    const bottom = centerY + lPx / 2 + 8

    const hbW = wPx + 32
    const hbH = 26

    return {
      bedW: wPx,
      bedL: lPx,
      cX: centerX,
      cY: centerY,
      bedLeft: left,
      bedRight: right,
      bedTop: top,
      bedBottom: bottom,
      headboardW: hbW,
      headboardH: hbH,
    }
  }, [width, length])

  // Pillow positioning
  const pillowW = (bedW - 32) / 2
  const pillowH = 40
  const pillowY = bedTop + 14

  return (
    <div className="sofa-visualizer-container">
      {/* Header bar */}
      <div className="visualizer-header-bar">
        <div className="visualizer-view-tabs">
          <button
            type="button"
            className={`vis-tab-btn ${activeView === "configurator" ? "active" : ""}`}
            onClick={() => onToggleView("configurator")}
            aria-label="View interactive bed blueprint"
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
          <span>{colorName}</span> · <span>{Math.round(width * 100)}×{Math.round(length * 100)} cm</span>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="visualizer-canvas-wrapper">
        {activeView === "photo" ? (
          <div className="visualizer-photo-pane">
            <img src={photoUrl} alt={photoAlt || modelName} />
            <div className="visualizer-photo-overlay">
              <span className="vis-model-tag">{modelName}</span>
              <span className="vis-photo-caption">Bespoke Upholstered Bed with Custom Headboard</span>
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
                <pattern id="bed-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(201, 168, 76, 0.12)" strokeWidth="0.6" />
                </pattern>
                <pattern id="bed-grid-major" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(201, 168, 76, 0.22)" strokeWidth="0.9" />
                </pattern>
                <pattern id="bed-quilt" width="22" height="22" patternUnits="userSpaceOnUse">
                  <path d="M 0 11 L 11 0 L 22 11 L 11 22 Z" fill="none" stroke="rgba(201, 168, 76, 0.16)" strokeWidth="0.8" />
                  <circle cx="11" cy="11" r="1.2" fill="#c9a84c" opacity="0.4" />
                </pattern>

                {/* Fabric gradient fill */}
                <linearGradient id="bedFabricGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={colorHex} stopOpacity="0.95" />
                  <stop offset="60%" stopColor={colorHex} stopOpacity="0.82" />
                  <stop offset="100%" stopColor="#0d0f1a" stopOpacity="0.85" />
                </linearGradient>

                {/* Headboard gradient */}
                <linearGradient id="headboardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={colorHex} stopOpacity="1" />
                  <stop offset="40%" stopColor={colorHex} stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#080911" stopOpacity="0.95" />
                </linearGradient>

                {/* Mattress gradient */}
                <linearGradient id="mattressSurfaceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.96" />
                  <stop offset="50%" stopColor="#f3eee5" stopOpacity="0.92" />
                  <stop offset="100%" stopColor="#dfd6c6" stopOpacity="0.88" />
                </linearGradient>

                {/* Duvet / Runner gradient */}
                <linearGradient id="duvetFoldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={colorHex} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={colorHex} stopOpacity="0.75" />
                </linearGradient>

                {/* Brass leg gradient */}
                <linearGradient id="bedLegGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffd875" />
                  <stop offset="50%" stopColor="#c9a84c" />
                  <stop offset="100%" stopColor="#6e5720" />
                </linearGradient>

                <filter id="bedShadow" x="-15%" y="-15%" width="130%" height="135%">
                  <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#000000" floodOpacity="0.3" />
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#c9a84c" floodOpacity="0.12" />
                </filter>
              </defs>

              {/* Background blueprint grid */}
              <rect width="100%" height="100%" fill="url(#bed-grid)" rx="8" />
              <rect width="100%" height="100%" fill="url(#bed-grid-major)" rx="8" />

              {/* ───────────────── TOP DIMENSION RULER (Width) ───────────────── */}
              <g className="dimension-ruler horizontal-ruler">
                <line
                  x1={bedLeft}
                  y1={bedTop - 34}
                  x2={bedRight}
                  y2={bedTop - 34}
                  stroke="#c9a84c"
                  strokeWidth="1.2"
                  strokeDasharray="4 3"
                />
                <line x1={bedLeft} y1={bedTop - 41} x2={bedLeft} y2={bedTop - 27} stroke="#c9a84c" strokeWidth="1.8" />
                <line x1={bedRight} y1={bedTop - 41} x2={bedRight} y2={bedTop - 27} stroke="#c9a84c" strokeWidth="1.8" />

                <g transform={`translate(${cX}, ${bedTop - 34})`}>
                  <rect x="-46" y="-12" width="92" height="24" rx="12" fill="#13162a" stroke="#c9a84c" strokeWidth="1.2" />
                  <text x="0" y="4" textAnchor="middle" fill="#e8c96a" fontSize="11" fontWeight="700" fontFamily="'Inter', sans-serif">
                    {Math.round(width * 100)} cm Wide
                  </text>
                </g>
              </g>

              {/* ───────────────── SIDE DIMENSION RULER (Length) ───────────────── */}
              <g className="dimension-ruler vertical-ruler">
                <line
                  x1={bedLeft - 30}
                  y1={bedTop}
                  x2={bedLeft - 30}
                  y2={bedBottom}
                  stroke="#c9a84c"
                  strokeWidth="1.2"
                  strokeDasharray="4 3"
                />
                <line x1={bedLeft - 37} y1={bedTop} x2={bedLeft - 23} y2={bedTop} stroke="#c9a84c" strokeWidth="1.8" />
                <line x1={bedLeft - 37} y1={bedBottom} x2={bedLeft - 23} y2={bedBottom} stroke="#c9a84c" strokeWidth="1.8" />

                <g transform={`translate(${bedLeft - 30}, ${cY + 8})`}>
                  <rect x="-46" y="-12" width="92" height="24" rx="12" fill="#13162a" stroke="#c9a84c" strokeWidth="1.2" />
                  <text x="0" y="4" textAnchor="middle" fill="#e8c96a" fontSize="11" fontWeight="700" fontFamily="'Inter', sans-serif">
                    {Math.round(length * 100)} cm Long
                  </text>
                </g>
              </g>

              {/* ───────────────── BED ARCHITECTURE ───────────────── */}
              <g filter="url(#bedShadow)">
                {/* 1. Headboard Structure at the top */}
                <g className="bed-headboard-group">
                  <rect
                    x={cX - headboardW / 2}
                    y={bedTop - headboardH + 4}
                    width={headboardW}
                    height={headboardH}
                    rx="6"
                    fill="url(#headboardGrad)"
                    stroke="#c9a84c"
                    strokeWidth="1.6"
                  />

                  {/* Headboard Tufting / Channel Lines */}
                  {headboardStyle === "channel" ? (
                    // Vertical channel stitches
                    Array.from({ length: 9 }).map((_, i) => {
                      const step = headboardW / 10
                      const x = cX - headboardW / 2 + (i + 1) * step
                      return (
                        <line
                          key={i}
                          x1={x}
                          y1={bedTop - headboardH + 6}
                          x2={x}
                          y2={bedTop + 2}
                          stroke="#e8c96a"
                          strokeWidth="1"
                          opacity="0.65"
                          strokeDasharray="3 2"
                        />
                      )
                    })
                  ) : (
                    // Diamond Tufting Buttons
                    <g opacity="0.85">
                      {[-0.38, -0.22, -0.07, 0.07, 0.22, 0.38].map((factor, idx) => (
                        <g key={idx} transform={`translate(${cX + headboardW * factor}, ${bedTop - headboardH / 2 + 2})`}>
                          <polygon points="0,-4 4,0 0,4 -4,0" fill="#e8c96a" stroke="#000" strokeWidth="0.5" />
                          <circle cx="0" cy="0" r="1.5" fill="#13162a" />
                        </g>
                      ))}
                    </g>
                  )}

                  {/* Headboard Height Tag */}
                  <g transform={`translate(${bedRight + 32}, ${bedTop - headboardH / 2 + 2})`}>
                    <rect x="-34" y="-10" width="68" height="20" rx="10" fill="#13162a" stroke="rgba(201, 168, 76, 0.5)" strokeWidth="1" />
                    <text x="0" y="3.5" textAnchor="middle" fill="#d4b65c" fontSize="9.5" fontWeight="600" fontFamily="'Inter', sans-serif">
                      HB {headboardHeightCm} cm
                    </text>
                  </g>
                </g>

                {/* 2. Upholstered Bed Frame & Side Rails */}
                <rect
                  x={bedLeft - 4}
                  y={bedTop}
                  width={bedW + 8}
                  height={bedL}
                  rx="10"
                  fill="url(#bedFabricGrad)"
                  stroke="rgba(201, 168, 76, 0.4)"
                  strokeWidth="1.6"
                />

                {/* 3. Inset Quilted Mattress Surface */}
                <rect
                  x={bedLeft + 8}
                  y={bedTop + 8}
                  width={bedW - 16}
                  height={bedL - 18}
                  rx="6"
                  fill="url(#mattressSurfaceGrad)"
                  stroke="rgba(201, 168, 76, 0.5)"
                  strokeWidth="1.2"
                />
                <rect
                  x={bedLeft + 8}
                  y={bedTop + 8}
                  width={bedW - 16}
                  height={bedL - 18}
                  rx="6"
                  fill="url(#bed-quilt)"
                  opacity="0.8"
                />

                {/* 4. Folded Bed Runner / Duvet Cover at the foot */}
                <rect
                  x={bedLeft + 8}
                  y={bedBottom - 75}
                  width={bedW - 16}
                  height={65}
                  rx="4"
                  fill="url(#duvetFoldGrad)"
                  stroke="rgba(201, 168, 76, 0.45)"
                  strokeWidth="1"
                />
                <line
                  x1={bedLeft + 8}
                  y1={bedBottom - 75}
                  x2={bedRight - 8}
                  y2={bedBottom - 75}
                  stroke="#c9a84c"
                  strokeWidth="1.4"
                />
                <line
                  x1={bedLeft + 8}
                  y1={bedBottom - 69}
                  x2={bedRight - 8}
                  y2={bedBottom - 69}
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="0.8"
                  strokeDasharray="4 2"
                />

                {/* 5. Luxury Sleeping Pillows at Head */}
                {/* Left Pillow */}
                <g transform={`translate(${bedLeft + 12}, ${pillowY})`}>
                  <rect
                    x="0"
                    y="0"
                    width={pillowW}
                    height={pillowH}
                    rx="9"
                    fill="#ffffff"
                    stroke="#c9a84c"
                    strokeWidth="1.2"
                  />
                  {/* Pillow center indentation */}
                  <ellipse cx={pillowW / 2} cy={pillowH / 2} rx={pillowW * 0.28} ry="6" fill="#e8e2d6" opacity="0.75" />
                  <path
                    d={`M 6 4 Q ${pillowW / 2} 12 ${pillowW - 6} 4`}
                    fill="none"
                    stroke="rgba(201, 168, 76, 0.3)"
                    strokeWidth="0.8"
                  />
                </g>

                {/* Right Pillow */}
                <g transform={`translate(${bedLeft + 20 + pillowW}, ${pillowY})`}>
                  <rect
                    x="0"
                    y="0"
                    width={pillowW}
                    height={pillowH}
                    rx="9"
                    fill="#ffffff"
                    stroke="#c9a84c"
                    strokeWidth="1.2"
                  />
                  <ellipse cx={pillowW / 2} cy={pillowH / 2} rx={pillowW * 0.28} ry="6" fill="#e8e2d6" opacity="0.75" />
                  <path
                    d={`M 6 4 Q ${pillowW / 2} 12 ${pillowW - 6} 4`}
                    fill="none"
                    stroke="rgba(201, 168, 76, 0.3)"
                    strokeWidth="0.8"
                  />
                </g>

                {/* 6. Gold Footboard Corner Legs */}
                <g className="bed-legs">
                  {/* Bottom Left Foot */}
                  <circle cx={bedLeft} cy={bedBottom} r="7" fill="url(#bedLegGrad)" stroke="#1a1a1a" strokeWidth="1.2" />
                  <circle cx={bedLeft} cy={bedBottom} r="2.5" fill="#ffd875" />

                  {/* Bottom Right Foot */}
                  <circle cx={bedRight} cy={bedBottom} r="7" fill="url(#bedLegGrad)" stroke="#1a1a1a" strokeWidth="1.2" />
                  <circle cx={bedRight} cy={bedBottom} r="2.5" fill="#ffd875" />
                </g>

                {/* 7. Center Crest / Moroccan Emblem Badge */}
                <g transform={`translate(${cX}, ${bedBottom - 40})`}>
                  <polygon points="0,-9 9,0 0,9 -9,0" fill="#13162a" stroke="#c9a84c" strokeWidth="1.2" />
                  <circle cx="0" cy="0" r="2.5" fill="#e8c96a" />
                </g>
              </g>
            </svg>
          </div>
        )}
      </div>

      {/* Info & Spec strip */}
      <div className="visualizer-quick-adjust-bar">
        <div className="adjust-control-item">
          <span className="adjust-label">📐 Selected Mattress Size</span>
          <div className="adjust-val-display" style={{ color: "var(--gold)" }}>
            {Math.round(width * 100)} cm × {Math.round(length * 100)} cm ({width.toFixed(2)}m × {length.toFixed(2)}m)
          </div>
        </div>
        <div className="adjust-control-item">
          <span className="adjust-label">👑 Headboard Architecture</span>
          <div className="adjust-val-display" style={{ color: "var(--fg)" }}>
            {headboardHeightCm} cm Height · {headboardStyle === "channel" ? "Vertical Fluted Channel" : "Royal Diamond Tufted"}
          </div>
        </div>
      </div>
    </div>
  )
}
