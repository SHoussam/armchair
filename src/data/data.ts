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
import { upholsteryStyles } from "./types"
import type {
  SeatSize,
  SofaConfig,
  ChairConfig,
  MattressConfig,
  AccessoryConfig,
  ProductCustomConfig,
  UpholsteryStyle,
  ChairLegFinish,
  ChairTuftingStyle,
} from "./types"

export type {
  SeatSize,
  SofaConfig,
  ChairConfig,
  MattressConfig,
  AccessoryConfig,
  ProductCustomConfig,
  UpholsteryStyle,
  ChairLegFinish,
  ChairTuftingStyle,
}
export { upholsteryStyles }

export interface Product {
  id: number
  name: string
  nameAr: string
  category: string
  price: number
  oldPrice: number | null
  badge: string | null
  rating: number
  reviews: number
  colors: string[]
  colorNames: string[]
  colorIds?: number[]
  desc: string
  features: string[]
  img: string
  imgAlt: string
  config: ProductCustomConfig
  sofaConfig?: SofaConfig
}

export interface City {
  id: number | string
  name: string
  zone: string
  shipping: number
  latitude?: number
  longitude?: number
  is_active?: boolean
}

// Backend Live Schema Types
export interface BackendCategory {
  id: number
  name: string
  slug: string
  description?: string
  is_active?: boolean
}

export interface BackendImage {
  id: number
  product_id: number
  image_path: string
  is_primary: boolean
}

export interface BackendColor {
  id: number
  name: string
  hex_code: string
  pivot?: {
    stock_quantity?: number
  }
}

export interface BackendDimension {
  id: number
  product_id: number
  min_length: number | string
  max_length: number | string
  min_width: number | string
  max_width: number | string
  min_height?: number | string | null
  max_height?: number | string | null
  step_length?: number | string | null
}

export interface BackendProductConfiguration {
  id: number
  product_id: number
  config_type: string
  key: string
  label: string
  price: number | string
  price_per_meter?: number | string | null
  color_hex?: string | null
  description?: string | null
  metadata?: any
  is_default?: boolean
  sort_order?: number
}

export interface BackendProduct {
  id: number
  category_id: number
  name: string
  name_ar?: string | null
  slug: string
  description: string
  features?: string[] | null
  badge?: string | null
  rating?: number | string | null
  reviews?: number | null
  base_price: string | number
  old_price?: string | number | null
  is_active: boolean
  category?: BackendCategory
  images?: BackendImage[]
  dimension?: BackendDimension
  colors?: BackendColor[]
  configurations?: BackendProductConfiguration[]
}

export interface BackendUpholsteryStyle {
  id: number
  code: string
  name: string
  multiplier: number | string
  description?: string | null
  is_active?: boolean
  sort_order?: number
}

export interface BackendCity {
  id: number
  name: string
  zone_type: "tanger" | "national" | "international" | string
  latitude: string | number
  longitude: string | number
  is_active: boolean
  shipping_cost?: number | string | null
}

export const categories = ["All", "Salon", "Chair"]

export const CITIES: City[] = [
  { id: 1, name: "Tanger", zone: "tanger", shipping: 0 },
  { id: 2, name: "Tetouan", zone: "national", shipping: 200 },
  { id: 3, name: "Casablanca", zone: "national", shipping: 350 },
  { id: 4, name: "Rabat", zone: "national", shipping: 320 },
  { id: 5, name: "Marrakech", zone: "national", shipping: 500 },
  { id: 6, name: "Fes", zone: "national", shipping: 400 },
  { id: 7, name: "Meknes", zone: "national", shipping: 380 },
  { id: 8, name: "Agadir", zone: "national", shipping: 550 },
  { id: 9, name: "Oujda", zone: "national", shipping: 450 },
  { id: 10, name: "Other City", zone: "national", shipping: 400 },
]

// ─────────────────────────────────────────────
// FOCUSED CATALOG: L-SHAPED SOFA & CHAIR (FALLBACK DEFAULTS)
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
    colorIds: [1, 2, 3, 4],
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
    colorIds: [5, 6, 7, 8],
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

// ─────────────────────────────────────────────
// BACKEND ADAPTER & FETCH UTILITIES
// ─────────────────────────────────────────────

export function mapBackendProductToFrontend(bp: BackendProduct): Product {
  const isSofa = bp.slug?.includes("sofa") || bp.slug?.includes("salon") || bp.category?.slug?.includes("salon") || bp.name.toLowerCase().includes("salon") || bp.name.toLowerCase().includes("sofa")
  const categoryName = bp.category?.name || (isSofa ? "Salon" : "Chair")
  const basePriceNum = typeof bp.base_price === "string" ? parseFloat(bp.base_price) : bp.base_price

  // Extract primary image or fallback
  const primaryImgObj = bp.images?.find((img) => img.is_primary) || bp.images?.[0]
  const imageSrc = primaryImgObj?.image_path ? primaryImgObj.image_path : (isSofa ? sofaImg : chairImg)

  // Colors mapping
  const colorsList = bp.colors && bp.colors.length > 0
    ? bp.colors.map((c) => c.hex_code)
    : (isSofa ? ["#c9a882", "#8d6444", "#3d3530", "#e8dece"] : ["#8b6040", "#c8b090", "#3c2c1c", "#9090a0"])

  const colorNamesList = bp.colors && bp.colors.length > 0
    ? bp.colors.map((c) => c.name)
    : (isSofa ? ["Beige", "Walnut", "Espresso", "Ivory"] : ["Chestnut", "Camel", "Dark Brown", "Slate"])

  const colorIdsList = bp.colors && bp.colors.length > 0
    ? bp.colors.map((c) => c.id)
    : (isSofa ? [1, 2, 3, 4] : [5, 6, 7, 8])

  const dim = bp.dimension

  const fallbackFeatures = isSofa
    ? ["Solid carved wood frame", "High-density foam cushions", "Removable covers", "Custom fabric options"]
    : ["Solid beechwood frame", "High-density HR foam", "Custom leg finishes", "Tufting craftsmanship"]

  const productFeatures = Array.isArray(bp.features) && bp.features.length > 0 ? bp.features : fallbackFeatures
  const nameAr = bp.name_ar || (isSofa ? "صالون ملكي على شكل L" : "كرسي مريح فاخر")
  const badge = bp.badge !== undefined && bp.badge !== null ? bp.badge : (isSofa ? "Best Seller" : "Featured")
  const rating = bp.rating ? Number(bp.rating) : (isSofa ? 4.9 : 4.8)
  const reviews = bp.reviews !== undefined && bp.reviews !== null ? Number(bp.reviews) : (isSofa ? 87 : 55)

  if (isSofa) {
    const defaultSeatPricing: Record<SeatSize, { label: string; basePrice: number; pricePerMeter: number; description: string }> = {
      70: { label: "70 cm", basePrice: basePriceNum || 3000, pricePerMeter: 900, description: "Standard comfort — classic majlis depth" },
      80: { label: "80 cm", basePrice: (basePriceNum || 3000) + 500, pricePerMeter: 1000, description: "Deep lounge comfort — spacious relaxation" },
      90: { label: "90 cm", basePrice: (basePriceNum || 3000) + 1000, pricePerMeter: 1100, description: "Grand luxury depth — ultra-spacious seating" },
    }

    if (bp.configurations && bp.configurations.length > 0) {
      const seatConfigs = bp.configurations.filter((c) => c.config_type === "seat_size")
      seatConfigs.forEach((sc) => {
        const sizeKey = parseInt(sc.key) as SeatSize
        if (sizeKey === 70 || sizeKey === 80 || sizeKey === 90) {
          defaultSeatPricing[sizeKey] = {
            label: sc.label || `${sizeKey} cm`,
            basePrice: sc.price ? Number(sc.price) : basePriceNum,
            pricePerMeter: sc.price_per_meter ? Number(sc.price_per_meter) : (sizeKey === 70 ? 900 : sizeKey === 80 ? 1000 : 1100),
            description: sc.description || (sizeKey === 70 ? "Standard comfort — classic majlis depth" : sizeKey === 80 ? "Deep lounge comfort — spacious relaxation" : "Grand luxury depth — ultra-spacious seating"),
          }
        }
      })
    }

    const sofaCfg: SofaConfig = {
      type: "sofa",
      layoutType: "l-shape",
      baseLength1: dim?.min_length ? Number(dim.min_length) : 2.70,
      baseLength2: dim?.min_width ? Number(dim.min_width) : 2.00,
      minLength1: dim?.min_length ? Number(dim.min_length) : 1.80,
      maxLength1: dim?.max_length ? Number(dim.max_length) : 5.00,
      minLength2: dim?.min_width ? Number(dim.min_width) : 1.20,
      maxLength2: dim?.max_width ? Number(dim.max_width) : 4.00,
      stepLength: dim?.step_length ? Number(dim.step_length) : 0.10,
      defaultSeatSize: 70,
      defaultHeadrests: 2,
      maxHeadrests: 4,
      hasHeadrests: true,
      hasChaiseOrientation: true,
      seatPricing: defaultSeatPricing,
    }

    return {
      id: bp.id,
      name: bp.name,
      nameAr,
      category: categoryName,
      price: basePriceNum,
      oldPrice: bp.old_price !== undefined && bp.old_price !== null ? Number(bp.old_price) : null,
      badge,
      rating,
      reviews,
      colors: colorsList,
      colorNames: colorNamesList,
      colorIds: colorIdsList,
      desc: bp.description || "Handcrafted furniture with luxury finishing.",
      features: productFeatures,
      img: imageSrc,
      imgAlt: bp.name,
      config: sofaCfg,
      get sofaConfig() { return this.config as SofaConfig },
    }
  } else {
    let legFinishes = [
      { id: "natural_oak", label: "Solid Natural Oak", colorHex: "#b89060", supplement: 0 },
      { id: "dark_walnut", label: "Carved Dark Walnut", colorHex: "#4a3020", supplement: 150 },
      { id: "brass_gold", label: "Brushed Brass / Gold", colorHex: "#c9a84c", supplement: 250 },
      { id: "matte_black", label: "Matte Black Steel", colorHex: "#1a1a1a", supplement: 100 },
    ]
    let tuftingStyles = [
      { id: "smooth", label: "Modern Smooth Surface", supplement: 0 },
      { id: "channel", label: "Vertical Channel Stitching", supplement: 120 },
      { id: "diamond", label: "Royal Diamond Button Tufting", supplement: 220 },
    ]

    if (bp.configurations && bp.configurations.length > 0) {
      const legConfigs = bp.configurations.filter((c) => c.config_type === "leg_finish")
      if (legConfigs.length > 0) {
        legFinishes = legConfigs.map((lc) => ({
          id: lc.key,
          label: lc.label,
          colorHex: lc.color_hex || "#1a1a1a",
          supplement: Number(lc.price),
        }))
      }
      const tuftConfigs = bp.configurations.filter((c) => c.config_type === "tufting_style")
      if (tuftConfigs.length > 0) {
        tuftingStyles = tuftConfigs.map((tc) => ({
          id: tc.key,
          label: tc.label,
          supplement: Number(tc.price),
        }))
      }
    }

    const chairCfg: ChairConfig = {
      type: "chair",
      basePrice: basePriceNum || 1800,
      baseWidth: dim?.min_width ? Number(dim.min_width) : 0.85,
      minWidth: dim?.min_width ? Number(dim.min_width) : 0.70,
      maxWidth: dim?.max_width ? Number(dim.max_width) : 1.25,
      ratePerCmExtra: 15,
      legFinishes,
      tuftingStyles,
    }

    return {
      id: bp.id,
      name: bp.name,
      nameAr,
      category: categoryName,
      price: basePriceNum,
      oldPrice: bp.old_price !== undefined && bp.old_price !== null ? Number(bp.old_price) : 2100,
      badge,
      rating,
      reviews,
      colors: colorsList,
      colorNames: colorNamesList,
      colorIds: colorIdsList,
      desc: bp.description || "Elegant accent armchair upholstered in luxury fabric.",
      features: productFeatures,
      img: imageSrc,
      imgAlt: bp.name,
      config: chairCfg,
    }
  }
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch("/api/products", {
      headers: { Accept: "application/json" },
    })
    if (!res.ok) throw new Error(`HTTP error ${res.status}`)
    const data = await res.json()
    if (data.success && Array.isArray(data.data) && data.data.length > 0) {
      return data.data.map((bp: BackendProduct) => mapBackendProductToFrontend(bp))
    }
  } catch (err) {
    console.warn("Could not fetch products from API, using fallback catalog:", err)
  }
  return products
}

export async function fetchUpholsteryStyles(): Promise<UpholsteryStyle[]> {
  try {
    const res = await fetch("/api/upholstery-styles", {
      headers: { Accept: "application/json" },
    })
    if (!res.ok) throw new Error(`HTTP error ${res.status}`)
    const data = await res.json()
    if (data.success && Array.isArray(data.data) && data.data.length > 0) {
      return data.data.map((s: BackendUpholsteryStyle) => ({
        id: s.code || String(s.id),
        label: s.name,
        multiplier: typeof s.multiplier === "string" ? parseFloat(s.multiplier) : s.multiplier,
      }))
    }
  } catch (err) {
    console.warn("Could not fetch upholstery styles from API, using fallback:", err)
  }
  return upholsteryStyles
}

export async function fetchCities(): Promise<City[]> {
  try {
    const res = await fetch("/api/cities", {
      headers: { Accept: "application/json" },
    })
    if (!res.ok) throw new Error(`HTTP error ${res.status}`)
    const data = await res.json()
    if (data.success && Array.isArray(data.data) && data.data.length > 0) {
      return data.data.map((c: BackendCity) => ({
        id: c.id,
        name: c.name,
        zone: c.zone_type,
        shipping:
          typeof c.shipping_cost === "number"
            ? c.shipping_cost
            : c.shipping_cost
            ? parseFloat(String(c.shipping_cost))
            : c.zone_type === "tanger"
            ? 0
            : 350,
        latitude: typeof c.latitude === "string" ? parseFloat(c.latitude) : (c.latitude as number),
        longitude: typeof c.longitude === "string" ? parseFloat(c.longitude) : (c.longitude as number),
        is_active: c.is_active,
      }))
    }
  } catch (err) {
    console.warn("Could not fetch cities from API, using fallback:", err)
  }
  return CITIES
}

export async function fetchCategories(): Promise<string[]> {
  try {
    const res = await fetch("/api/categories", {
      headers: { Accept: "application/json" },
    })
    if (!res.ok) throw new Error(`HTTP error ${res.status}`)
    const data = await res.json()
    if (data.success && Array.isArray(data.data) && data.data.length > 0) {
      const names = data.data.map((c: BackendCategory) => c.name)
      return ["All", ...names]
    }
  } catch (err) {
    console.warn("Could not fetch categories from API, using fallback:", err)
  }
  return categories
}

