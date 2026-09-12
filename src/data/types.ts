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

export interface BedSizeOption {
  id: string
  label: string
  width: number
  length: number
  basePrice: number
}

export interface BedHeadboardStyle {
  id: string
  label: string
  supplement: number
}

export interface BedConfig {
  type: "bed"
  defaultSizeId: string
  sizes: BedSizeOption[]
  allowCustomDimensions: boolean
  customBounds: {
    minWidth: number
    maxWidth: number
    minLength: number
    maxLength: number
    basePrice: number
    pricePerM2: number
  }
  headboardStyles: BedHeadboardStyle[]
  headboardHeightCm: number
  hasStorageBox?: boolean
}

export interface AccessoryConfig {
  type: "accessory"
  accessorySubtype?: "cushion" | "headrest" | "pouf"
  basePrice: number
  packOptions: Array<{ id: string; count: number; label: string; multiplier: number }>
  sizeOptions: Array<{ id: string; sizeLabel: string; supplement: number }>
  fillOptions: Array<{ id: string; label: string; supplement: number }>
  tiltAngles?: Array<{ id: string; label: string; degrees: number }>
}

export type ProductCustomConfig = SofaConfig | ChairConfig | MattressConfig | BedConfig | AccessoryConfig

export interface UpholsteryStyle {
  id: string
  label: string
  labelAr?: string
  labelFr?: string
  multiplier: number
}

export const upholsteryStyles: UpholsteryStyle[] = [
  { id: "standard", label: "Standard Fabric", labelAr: "قماش كلاسيكي ممتاز", labelFr: "Tissu Standard Supérieur", multiplier: 1 },
  { id: "premium", label: "Premium Velvet", labelAr: "مخمل ملكي فاخر", labelFr: "Velours Royal Premium", multiplier: 1.22 },
  { id: "signature", label: "Signature Leather", labelAr: "جلد فاخر عالي الجودة", labelFr: "Cuir Signature", multiplier: 1.45 },
  { id: "linen", label: "Belgian Linen", labelAr: "كتان بلجيكي طبيعي", labelFr: "Lin Belge Naturel", multiplier: 1.30 },
]
