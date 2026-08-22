/**
 * Centralized Furniture Catalog & Pricing Configuration (Backend-Ready)
 * 
 * Focused on:
 * 1. L-Shaped Sofa (Bespoke modular seating with seat sizes & dimensions)
 * 2. Armchair / Chair (Custom width, luxury leg materials & tufting)
 * 
 * Ready to be swapped with a single backend API call (e.g. GET /api/products).
 */

import sofaImg from "./L.jpg"
import chairImg from "./chare.jpg"

export type SeatSize = 70 | 80 | 90

// ─────────────────────────────────────────────
// CONFIGURATION INTERFACES
// ─────────────────────────────────────────────

export interface SofaConfig {
  type: "sofa"
  layoutType: "l-shape" | "straight" | "u-shape"
  baseLength1: number // Horizontal length (m), default: 2.70
  baseLength2: number // Vertical length / Chaise (m), default: 2.00
  minLength1: number // e.g. 1.80
  maxLength1: number // e.g. 5.00
  minLength2: number // e.g. 1.20
  maxLength2: number // e.g. 4.00
  stepLength: number // e.g. 0.10
  defaultSeatSize: SeatSize // 70
  defaultHeadrests: number // 2
  maxHeadrests: number // 4
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
  baseWidth: number // e.g. 0.85 m
  minWidth: number // e.g. 0.70 m
  maxWidth: number // e.g. 1.25 m
  ratePerCmExtra: number // e.g. 15 DH per extra cm
  legFinishes: ChairLegFinish[]
  tuftingStyles: ChairTuftingStyle[]
}

// Optional generic types for future extension
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

export interface Product {
  id: number
  name: string
  nameAr: string
  category: "salon" | "chair" | "mattress" | "accessories" | "traditional"
  price: number
  oldPrice: number | null
  badge: string | null
  rating: number
  reviews: number
  colors: string[]
  colorNames: string[]
  desc: string
  features: string[]
  img: string
  imgAlt: string
  config: ProductCustomConfig
  sofaConfig?: SofaConfig
}

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

export const categories = ["All", "Salon", "Chair"]

// ─────────────────────────────────────────────
// FOCUSED CATALOG: L-SHAPED SOFA & CHAIR
// ─────────────────────────────────────────────

export const products: Product[] = [
  // 1. Royal L-Shaped Salon (L-Sofa)
  {
    id: 1,
    name: "Royal L-Shaped Salon",
    nameAr: "صالون ملكي على شكل L",
    category: "salon",
    price: 3000,
    oldPrice: null,
    badge: "Best Seller",
    rating: 4.9,
    reviews: 87,
    colors: ["#c9a882", "#8d6444", "#3d3530", "#e8dece"],
    colorNames: ["Beige", "Walnut", "Espresso", "Ivory"],
    desc: "Handcrafted L-shaped Moroccan salon with plush foam cushions and elegant carved wooden frame. Starting configuration at 2.70 m × 2.00 m with 70 cm modules, fully customizable to your living room dimensions.",
    features: ["Solid carved wood frame", "High-density foam cushions", "Removable covers", "Custom fabric options"],
    img: sofaImg,
    imgAlt: "Elegant L-shaped Moroccan sofa set in beige fabric with decorative cushions",
    config: {
      type: "sofa",
      layoutType: "l-shape",
      baseLength1: 2.70,
      baseLength2: 2.00,
      minLength1: 1.80,
      maxLength1: 5.00,
      minLength2: 1.20,
      maxLength2: 4.00,
      stepLength: 0.10,
      defaultSeatSize: 70,
      defaultHeadrests: 2,
      maxHeadrests: 4,
      hasHeadrests: true,
      hasChaiseOrientation: true,
      seatPricing: {
        70: { label: "70 cm", basePrice: 3000, pricePerMeter: 900, description: "Standard comfort — classic majlis depth" },
        80: { label: "80 cm", basePrice: 3500, pricePerMeter: 1000, description: "Deep lounge comfort — spacious relaxation" },
        90: { label: "90 cm", basePrice: 4000, pricePerMeter: 1100, description: "Grand luxury depth — ultra-spacious seating" },
      },
    },
    get sofaConfig() { return this.config as SofaConfig },
  },

  // 2. Velvet Accent Armchair (Chair)
  {
    id: 2,
    name: "Velvet Accent Armchair",
    nameAr: "كرسي صالون بالمخمل",
    category: "chair",
    price: 1800,
    oldPrice: 2100,
    badge: "Featured",
    rating: 4.8,
    reviews: 55,
    colors: ["#8b6040", "#c8b090", "#3c2c1c", "#9090a0"],
    colorNames: ["Chestnut", "Camel", "Dark Brown", "Slate"],
    desc: "Elegant accent armchair upholstered in luxury velvet with customizable width, handcrafted solid wooden or brushed brass legs, and bespoke backrest tufting.",
    features: ["Solid beechwood frame", "High-density HR foam", "Custom leg finishes", "Tufting craftsmanship"],
    img: chairImg,
    imgAlt: "Velvet accent armchair in chestnut brown with wooden legs",
    config: {
      type: "chair",
      basePrice: 1800,
      baseWidth: 0.85,
      minWidth: 0.70,
      maxWidth: 1.25,
      ratePerCmExtra: 15, // 15 DH per extra cm width above 0.85 m
      legFinishes: [
        { id: "natural_oak", label: "Solid Natural Oak", colorHex: "#b89060", supplement: 0 },
        { id: "dark_walnut", label: "Carved Dark Walnut", colorHex: "#4a3020", supplement: 150 },
        { id: "brass_gold", label: "Brushed Brass / Gold", colorHex: "#c9a84c", supplement: 250 },
        { id: "matte_black", label: "Matte Black Steel", colorHex: "#1a1a1a", supplement: 100 },
      ],
      tuftingStyles: [
        { id: "smooth", label: "Modern Smooth Surface", supplement: 0 },
        { id: "channel", label: "Vertical Channel Stitching", supplement: 120 },
        { id: "diamond", label: "Royal Diamond Button Tufting", supplement: 220 },
      ],
    },
  },
]
