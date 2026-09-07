/**
 * Shared types and static config data used by both data.ts and pricing.ts.
 * Kept separate to avoid pulling in image imports in Node/test environments.
 */

export type SeatSize = 70 | 80 | 90

export interface SofaConfig {
  type: "sofa"
  layoutType: "l-shape" | "straight" | "u-shape"
  baseLength1: number
  baseLength2: number
  minLength1: number
  maxLength1: number
  minLength2: number
  maxLength2: number
  stepLength: number
  defaultSeatSize: SeatSize
  defaultHeadrests: number
  maxHeadrests: number
  hasHeadrests: boolean
  hasChaiseOrientation: boolean
  seatPricing: Record<
    SeatSize,
    {
      label: string
      basePrice: number
      pricePerMeter: number
      description: string
    }
  >
}

export interface ChairLegFinish {
  id: string
  label: string
  colorHex: string
  supplement: number
}

export interface ChairTuftingStyle {
  id: string
  label: string
  supplement: number
}

export interface ChairConfig {
  type: "chair"
  basePrice: number
  baseWidth: number
  minWidth: number
  maxWidth: number
  ratePerCmExtra: number
  legFinishes: ChairLegFinish[]
  tuftingStyles: ChairTuftingStyle[]
}

export interface MattressConfig {
  type: "mattress"
  defaultSizeId: string
  sizes: Array<{ id: string; label: string; width: number; length: number; basePrice: number }>
  allowCustomDimensions: boolean
  customBounds: { minWidth: number; maxWidth: number; minLength: number; maxLength: number; basePrice: number; pricePerM2: number }
  thicknessOptions: Array<{ id: string; thicknessCm: number; label: string; multiplier: number }>
  coreOptions: Array<{ id: string; label: string; description: string; multiplier: number }>
  firmnessLevels: Array<{ id: string; label: string; desc: string }>
}

export interface AccessoryConfig {
  type: "accessory"
  basePrice: number
  packOptions: Array<{ id: string; count: number; label: string; multiplier: number }>
  sizeOptions: Array<{ id: string; sizeLabel: string; supplement: number }>
  fillOptions: Array<{ id: string; label: string; supplement: number }>
}

export type ProductCustomConfig = SofaConfig | ChairConfig | MattressConfig | AccessoryConfig

export interface UpholsteryStyle {
  id: string
  label: string
  multiplier: number
}

export const upholsteryStyles: UpholsteryStyle[] = [
  { id: "standard", label: "Standard Fabric", multiplier: 1 },
  { id: "premium", label: "Premium Velvet", multiplier: 1.22 },
  { id: "signature", label: "Signature Leather", multiplier: 1.45 },
]
