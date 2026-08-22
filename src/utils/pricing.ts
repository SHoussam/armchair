/**
 * Universal Pricing Engine for all Furniture Types
 * 
 * Supports:
 * 1. Sofas & Moroccan Salons (Seat sizes, dimension meters, headrests, chaise)
 * 2. Mattresses (Standard presets or custom W×L, thickness tiers, core materials)
 * 3. Armchairs (Custom width, luxury leg finishes, tufting styles, upholstery grades)
 * 4. Accessories & Cushions (Pack quantities, dimensions, fill types)
 */

import {
  SeatSize,
  SofaConfig,
  MattressConfig,
  ChairConfig,
  AccessoryConfig,
  upholsteryStyles,
} from "@/data/data"

export { type SeatSize }

// ─────────────────────────────────────────────
// 1. SOFA PRICING
// ─────────────────────────────────────────────

export interface SofaPricingParams {
  seatSize: SeatSize
  length1: number
  length2: number
  baseLength1?: number
  baseLength2?: number
  headrests?: number
  chaiseOrientation?: "left" | "right"
  fabricMultiplier?: number
  sofaConfig?: SofaConfig
}

export interface SofaPriceBreakdown {
  type: "sofa"
  seatSize: SeatSize
  seatLabel: string
  basePrice: number
  ratePerMeter: number
  baseTotalLength: number
  customTotalLength: number
  extraMeters: number
  dimensionSupplement: number
  headrests: number
  headrestCost: number
  fabricMultiplier: number
  fabricSupplement: number
  rawCalculatedTotal: number
  finalPrice: number
  isBasePriceEnforced: boolean
}

export const SEAT_PRICING_CONFIG: Record<
  SeatSize,
  {
    seatSize: SeatSize
    label: string
    basePrice: number
    pricePerMeter: number
    description: string
  }
> = {
  70: {
    seatSize: 70,
    label: "70 cm",
    basePrice: 3000,
    pricePerMeter: 900,
    description: "Standard comfort — ideal for classic living rooms & salons",
  },
  80: {
    seatSize: 80,
    label: "80 cm",
    basePrice: 3500,
    pricePerMeter: 1000,
    description: "Deep lounge comfort — balance of spaciousness & relaxation",
  },
  90: {
    seatSize: 90,
    label: "90 cm",
    basePrice: 4000,
    pricePerMeter: 1100,
    description: "Grand luxury depth — ultra-spacious Moroccan majlis seating",
  },
}

export function calculateSofaPrice(params: SofaPricingParams): SofaPriceBreakdown {
  const seatSize = (params.seatSize in SEAT_PRICING_CONFIG ? params.seatSize : 70) as SeatSize
  const tier = params.sofaConfig?.seatPricing?.[seatSize] ?? SEAT_PRICING_CONFIG[seatSize]

  const baseLength1 = params.baseLength1 ?? params.sofaConfig?.baseLength1 ?? 2.70
  const baseLength2 = params.baseLength2 ?? params.sofaConfig?.baseLength2 ?? 2.00
  const baseTotalLength = Number((baseLength1 + baseLength2).toFixed(2))

  const customLength1 = Number(Math.max(0.5, params.length1).toFixed(2))
  const customLength2 = Number(Math.max(0, params.length2).toFixed(2))
  const customTotalLength = Number((customLength1 + customLength2).toFixed(2))

  const extraMeters = Number(Math.max(0, customTotalLength - baseTotalLength).toFixed(2))
  const dimensionSupplement = Number((extraMeters * tier.pricePerMeter).toFixed(2))

  const headrests = params.headrests ?? 0
  const headrestCost = 0

  const fabricMultiplier = params.fabricMultiplier ?? 1.0
  const fabricBaseAndDimension = tier.basePrice + dimensionSupplement
  const fabricSupplement = Number(
    fabricMultiplier > 1
      ? (fabricBaseAndDimension * (fabricMultiplier - 1)).toFixed(2)
      : 0
  )

  const rawCalculatedTotal = Number(
    (tier.basePrice + dimensionSupplement + headrestCost + fabricSupplement).toFixed(2)
  )

  const finalPrice = Math.max(tier.basePrice, rawCalculatedTotal)
  const isBasePriceEnforced = finalPrice === tier.basePrice && rawCalculatedTotal < tier.basePrice

  return {
    type: "sofa",
    seatSize,
    seatLabel: tier.label,
    basePrice: tier.basePrice,
    ratePerMeter: tier.pricePerMeter,
    baseTotalLength,
    customTotalLength,
    extraMeters,
    dimensionSupplement,
    headrests,
    headrestCost,
    fabricMultiplier,
    fabricSupplement,
    rawCalculatedTotal,
    finalPrice,
    isBasePriceEnforced,
  }
}

// ─────────────────────────────────────────────
// 2. MATTRESS PRICING
// ─────────────────────────────────────────────

export interface MattressPricingParams {
  sizeId: string
  isCustomSize?: boolean
  customWidth?: number
  customLength?: number
  thicknessId?: string
  coreId?: string
  firmnessId?: string
  mattressConfig: MattressConfig
}

export interface MattressPriceBreakdown {
  type: "mattress"
  sizeLabel: string
  width: number
  length: number
  isCustom: boolean
  baseSizePrice: number
  thicknessLabel: string
  thicknessCm: number
  thicknessMultiplier: number
  thicknessSupplement: number
  coreLabel: string
  coreMultiplier: number
  coreSupplement: number
  finalPrice: number
}

export function calculateMattressPrice(params: MattressPricingParams): MattressPriceBreakdown {
  const conf = params.mattressConfig

  let basePrice = 2000
  let width = 1.60
  let length = 2.00
  let sizeLabel = "Queen (160 × 200 cm)"
  const isCustom = !!params.isCustomSize

  if (isCustom && params.customWidth && params.customLength) {
    width = Number(params.customWidth.toFixed(2))
    length = Number(params.customLength.toFixed(2))
    sizeLabel = `Custom (${Math.round(width * 100)} × ${Math.round(length * 100)} cm)`
    const m2 = width * length
    const baseM2 = 0.90 * 1.90 // single reference m2
    const extraM2 = Math.max(0, m2 - baseM2)
    basePrice = Number((conf.customBounds.basePrice + extraM2 * conf.customBounds.pricePerM2).toFixed(2))
  } else {
    const preset = conf.sizes.find((s) => s.id === params.sizeId) ?? conf.sizes[0]
    if (preset) {
      basePrice = preset.basePrice
      width = preset.width
      length = preset.length
      sizeLabel = preset.label
    }
  }

  const thicknessOption =
    conf.thicknessOptions.find((t) => t.id === params.thicknessId) ?? conf.thicknessOptions[0]
  const thicknessMultiplier = thicknessOption ? thicknessOption.multiplier : 1.0

  const coreOption =
    conf.coreOptions.find((c) => c.id === params.coreId) ?? conf.coreOptions[0]
  const coreMultiplier = coreOption ? coreOption.multiplier : 1.0

  const priceAfterThickness = basePrice * thicknessMultiplier
  const thicknessSupplement = Number((priceAfterThickness - basePrice).toFixed(2))

  const finalCalculated = priceAfterThickness * coreMultiplier
  const coreSupplement = Number((finalCalculated - priceAfterThickness).toFixed(2))

  const finalPrice = Math.max(basePrice, Number(finalCalculated.toFixed(2)))

  return {
    type: "mattress",
    sizeLabel,
    width,
    length,
    isCustom,
    baseSizePrice: basePrice,
    thicknessLabel: thicknessOption ? thicknessOption.label : "Standard",
    thicknessCm: thicknessOption ? thicknessOption.thicknessCm : 20,
    thicknessMultiplier,
    thicknessSupplement,
    coreLabel: coreOption ? coreOption.label : "Standard Core",
    coreMultiplier,
    coreSupplement,
    finalPrice,
  }
}

// ─────────────────────────────────────────────
// 3. ARMCHAIR PRICING
// ─────────────────────────────────────────────

export interface ChairPricingParams {
  width: number // in meters (e.g. 0.85)
  legFinishId: string
  tuftingStyleId: string
  styleId?: string
  chairConfig: ChairConfig
}

export interface ChairPriceBreakdown {
  type: "chair"
  basePrice: number
  customWidth: number
  baseWidth: number
  extraWidthCm: number
  widthSupplement: number
  legLabel: string
  legSupplement: number
  tuftingLabel: string
  tuftingSupplement: number
  fabricStyleLabel: string
  fabricMultiplier: number
  fabricSupplement: number
  finalPrice: number
}

export function calculateChairPrice(params: ChairPricingParams): ChairPriceBreakdown {
  const conf = params.chairConfig
  const basePrice = conf.basePrice
  const baseWidth = conf.baseWidth
  const customWidth = Number(Math.max(conf.minWidth, Math.min(conf.maxWidth, params.width)).toFixed(2))

  const extraWidthCm = Math.max(0, Math.round((customWidth - baseWidth) * 100))
  const widthSupplement = Number((extraWidthCm * conf.ratePerCmExtra).toFixed(2))

  const leg = conf.legFinishes.find((l) => l.id === params.legFinishId) ?? conf.legFinishes[0]
  const legSupplement = leg ? leg.supplement : 0

  const tufting = conf.tuftingStyles.find((t) => t.id === params.tuftingStyleId) ?? conf.tuftingStyles[0]
  const tuftingSupplement = tufting ? tufting.supplement : 0

  const fabricStyle = upholsteryStyles.find((s) => s.id === params.styleId) ?? upholsteryStyles[0]
  const fabricMultiplier = fabricStyle ? fabricStyle.multiplier : 1.0

  const preFabricTotal = basePrice + widthSupplement + legSupplement + tuftingSupplement
  const fabricSupplement = Number(
    fabricMultiplier > 1 ? (preFabricTotal * (fabricMultiplier - 1)).toFixed(2) : 0
  )

  const finalPrice = Math.max(basePrice, Number((preFabricTotal + fabricSupplement).toFixed(2)))

  return {
    type: "chair",
    basePrice,
    customWidth,
    baseWidth,
    extraWidthCm,
    widthSupplement,
    legLabel: leg ? leg.label : "Standard Oak",
    legSupplement,
    tuftingLabel: tufting ? tufting.label : "Smooth",
    tuftingSupplement,
    fabricStyleLabel: fabricStyle.label,
    fabricMultiplier,
    fabricSupplement,
    finalPrice,
  }
}

// ─────────────────────────────────────────────
// 4. ACCESSORIES / CUSHIONS PRICING
// ─────────────────────────────────────────────

export interface AccessoryPricingParams {
  packId: string
  sizeId: string
  fillId: string
  styleId?: string
  accessoryConfig: AccessoryConfig
}

export interface AccessoryPriceBreakdown {
  type: "accessory"
  basePrice: number
  packLabel: string
  packCount: number
  packBasePrice: number
  sizeLabel: string
  sizeSupplement: number
  fillLabel: string
  fillSupplement: number
  fabricStyleLabel: string
  fabricMultiplier: number
  fabricSupplement: number
  finalPrice: number
}

export function calculateAccessoryPrice(params: AccessoryPricingParams): AccessoryPriceBreakdown {
  const conf = params.accessoryConfig
  const basePrice = conf.basePrice

  const pack = conf.packOptions.find((p) => p.id === params.packId) ?? conf.packOptions[1] ?? conf.packOptions[0]
  const packMultiplier = pack ? pack.multiplier : 1.0
  const packBasePrice = Number((basePrice * packMultiplier).toFixed(2))

  const size = conf.sizeOptions.find((s) => s.id === params.sizeId) ?? conf.sizeOptions[0]
  const sizeSupplement = size ? size.supplement : 0

  const fill = conf.fillOptions.find((f) => f.id === params.fillId) ?? conf.fillOptions[0]
  const fillSupplement = fill ? fill.supplement : 0

  const fabricStyle = upholsteryStyles.find((s) => s.id === params.styleId) ?? upholsteryStyles[0]
  const fabricMultiplier = fabricStyle ? fabricStyle.multiplier : 1.0

  const preFabricTotal = packBasePrice + sizeSupplement + fillSupplement
  const fabricSupplement = Number(
    fabricMultiplier > 1 ? (preFabricTotal * (fabricMultiplier - 1)).toFixed(2) : 0
  )

  const finalPrice = Math.max(100, Number((preFabricTotal + fabricSupplement).toFixed(2)))

  return {
    type: "accessory",
    basePrice,
    packLabel: pack ? pack.label : "Set of 4",
    packCount: pack ? pack.count : 4,
    packBasePrice,
    sizeLabel: size ? size.sizeLabel : "45 × 45 cm",
    sizeSupplement,
    fillLabel: fill ? fill.label : "Microfiber",
    fillSupplement,
    fabricStyleLabel: fabricStyle.label,
    fabricMultiplier,
    fabricSupplement,
    finalPrice,
  }
}

export function formatPriceDH(amount: number): string {
  return `${Math.round(amount).toLocaleString("en-US")} DH`
}
