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
  BedConfig,
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
  BedConfig,
  AccessoryConfig,
  ProductCustomConfig,
  UpholsteryStyle,
  ChairLegFinish,
  ChairTuftingStyle,
}
export { upholsteryStyles }

import { api } from "@/services/api"

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
  config?: ProductCustomConfig | null
  sofa_config?: any
  bed_config?: any
  chair_config?: any
  mattress_config?: any
  accessory_config?: any
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

export const categories = ["All", "Salons", "Chairs", "Beds", "Accessories"]

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
// ONLINE MOCK IMAGES (VERIFIED HIGH-RES UNSPLASH)
// ─────────────────────────────────────────────

export const ONLINE_MOCK_IMAGES = {
  royalSalon: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80",
  medinaCorner: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80",
  atlasSofa: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1000&q=80",
  velvetArmchair: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80",
  rattanChair: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1000&q=80",
  cloudMattress: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=1000&q=80",
  kidsMattress: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80",
  royalBed: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80",
  moroccanPouf: "https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=1000&q=80",
  velvetCushions: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80",
  headrestAccessory: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80",
}

// ─────────────────────────────────────────────
// MOCK CATALOG — EXACTLY ONE PRODUCT PER SVG DEMONSTRATION
// ─────────────────────────────────────────────

export const products: Product[] = [
  // 1. Sofa L Demonstration (Salons) -> SofaVisualizer
  {
    id: 1,
    name: "Royal L-Shaped Salon",
    nameAr: "صالون ملكي على شكل L",
    category: "Salons",
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
    img: ONLINE_MOCK_IMAGES.royalSalon,
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

  // 2. Couch / Armchair Demonstration (Chairs) -> ChairVisualizer
  {
    id: 2,
    name: "Velvet Accent Couch & Armchair",
    nameAr: "كرسي وكنبة صالون مخملية فاخرة",
    category: "Chairs",
    price: 1800,
    oldPrice: 2100,
    badge: "Featured",
    rating: 4.85,
    reviews: 55,
    colors: ["#8b6040", "#c8b090", "#3c2c1c", "#9090a0"],
    colorNames: ["Chestnut", "Camel", "Dark Brown", "Slate"],
    colorIds: [5, 6, 7, 8],
    desc: "Elegant accent armchair and couch upholstered in luxury velvet with customizable width, handcrafted solid wooden or brushed brass legs, and bespoke backrest tufting.",
    features: ["Solid beechwood frame", "High-density HR foam", "Custom leg finishes", "Tufting craftsmanship"],
    img: ONLINE_MOCK_IMAGES.velvetArmchair,
    imgAlt: "Velvet accent couch in chestnut brown with sleek legs",
    config: {
      type: "chair",
      basePrice: 1800,
      baseWidth: 0.85,
      minWidth: 0.70,
      maxWidth: 1.25,
      ratePerCmExtra: 15,
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

  // 3. Bed Demonstration (Beds) -> BedVisualizer
  {
    id: 3,
    name: "Royal Upholstered Bed",
    nameAr: "سرير ملكي منجد فاخر",
    category: "Beds",
    price: 4500,
    oldPrice: 5200,
    badge: "New Luxury",
    rating: 4.95,
    reviews: 64,
    colors: ["#c9a882", "#8d6444", "#3d3530", "#e8dece", "#1a1a2e"],
    colorNames: ["Beige Velvet", "Walnut Fabric", "Espresso", "Ivory Cream", "Midnight Navy"],
    colorIds: [1, 2, 3, 4, 8],
    desc: "Bespoke handcrafted Moroccan upholstered bed featuring a luxury tufted headboard, solid reinforced frame, and customizable mattress dimensions.",
    features: ["Customizable tufted headboard", "Reinforced solid beech frame", "Integrated mattress base support", "Brushed brass corner legs"],
    img: ONLINE_MOCK_IMAGES.royalBed,
    imgAlt: "Royal bespoke upholstered bed with tufted headboard",
    config: {
      type: "bed",
      defaultSizeId: "queen_160_200",
      sizes: [
        { id: "double_140_190", label: "Double 140×190 cm", width: 1.40, length: 1.90, basePrice: 3900 },
        { id: "queen_160_200", label: "Queen 160×200 cm", width: 1.60, length: 2.00, basePrice: 4500 },
        { id: "king_180_200", label: "King 180×200 cm", width: 1.80, length: 2.00, basePrice: 5200 },
        { id: "super_king_200_200", label: "Super King 200×200 cm", width: 2.00, length: 2.00, basePrice: 5900 },
      ],
      allowCustomDimensions: true,
      customBounds: {
        minWidth: 1.20,
        maxWidth: 2.20,
        minLength: 1.80,
        maxLength: 2.20,
        basePrice: 4200,
        pricePerM2: 1200,
      },
      headboardStyles: [
        { id: "tufted", label: "Royal Diamond Button Tufting", supplement: 0 },
        { id: "channel", label: "Vertical Fluted Channel Stitching", supplement: 250 },
      ],
      headboardHeightCm: 120,
      hasStorageBox: false,
    },
  },

  // 4. Headrest Demonstration (Accessories) -> HeadrestVisualizer
  {
    id: 4,
    name: "Ergonomic Adjustable Headrest",
    nameAr: "مسند رأس قابل للتعديل للصالون",
    category: "Accessories",
    price: 350,
    oldPrice: 420,
    badge: "Ergonomic",
    rating: 4.88,
    reviews: 72,
    colors: ["#c9a882", "#8d6444", "#3d3530", "#4a5568", "#1b4332"],
    colorNames: ["Beige", "Walnut", "Espresso", "Slate Grey", "Emerald"],
    colorIds: [1, 2, 3, 7, 8],
    desc: "Multi-angle adjustable ergonomic headrest with polished chrome insertion rods, tailored piping, and multi-position ratchet tilt mechanism designed for Moroccan salons and armchairs.",
    features: [
      "Multi-angle ratchet tilt mechanism (0°-90°)",
      "Dual polished stainless steel insertion poles",
      "High-density molded HR foam core",
      "Removable washable zipped cover",
    ],
    img: ONLINE_MOCK_IMAGES.headrestAccessory,
    imgAlt: "Ergonomic adjustable salon headrest with polished chrome rods",
    config: {
      type: "accessory",
      accessorySubtype: "headrest",
      basePrice: 350,
      packOptions: [
        { id: "pack_1", count: 1, label: "Single Headrest", multiplier: 1 },
        { id: "pack_2", count: 2, label: "Pair / Set of 2 (Save 10%)", multiplier: 1.8 },
        { id: "pack_4", count: 4, label: "Set of 4 (Salon Pack)", multiplier: 3.4 },
      ],
      sizeOptions: [
        { id: "s65", sizeLabel: "Standard (65 × 22 cm)", supplement: 0 },
        { id: "s75", sizeLabel: "Grand Comfort (75 × 24 cm)", supplement: 60 },
      ],
      fillOptions: [
        { id: "high_density_foam", label: "High-Density Orthopedic Foam", supplement: 0 },
        { id: "memory_foam", label: "Contoured Memory Foam Layer", supplement: 50 },
      ],
      tiltAngles: [
        { id: "deg_0", label: "0° Flat", degrees: 0 },
        { id: "deg_30", label: "30° Relax", degrees: 30 },
        { id: "deg_60", label: "60° Support", degrees: 60 },
        { id: "deg_90", label: "90° Upright", degrees: 90 },
      ],
    },
  },
]

// ─────────────────────────────────────────────
// BACKEND ADAPTER & FETCH UTILITIES
// ─────────────────────────────────────────────

export function mapBackendProductToFrontend(bp: BackendProduct): Product {
  const isSofa = bp.slug?.includes("sofa") || bp.slug?.includes("salon") || bp.category?.slug?.includes("salon") || bp.name.toLowerCase().includes("salon") || bp.name.toLowerCase().includes("sofa")
  const isBed = bp.slug?.includes("bed") || bp.category?.slug?.includes("bed") || bp.name.toLowerCase().includes("bed")
  const isMattress = !isBed && (bp.slug?.includes("mattress") || bp.category?.slug?.includes("mattress") || bp.name.toLowerCase().includes("mattress"))
  const isAccessory = bp.slug?.includes("accessory") || bp.slug?.includes("cushion") || bp.slug?.includes("headrest") || bp.category?.slug?.includes("accessor") || bp.name.toLowerCase().includes("cushion") || bp.name.toLowerCase().includes("accessory") || bp.name.toLowerCase().includes("headrest")
  const categoryName = bp.category?.name || (isSofa ? "Salons" : isBed ? "Beds" : isMattress ? "Mattresses" : isAccessory ? "Accessories" : "Chairs")
  const basePriceNum = typeof bp.base_price === "string" ? parseFloat(bp.base_price) : bp.base_price

  // Extract primary image or online category fallback
  const onlineFallback = isSofa
    ? ONLINE_MOCK_IMAGES.royalSalon
    : isBed
    ? ONLINE_MOCK_IMAGES.royalBed
    : isMattress
    ? ONLINE_MOCK_IMAGES.cloudMattress
    : isAccessory
    ? ONLINE_MOCK_IMAGES.headrestAccessory
    : ONLINE_MOCK_IMAGES.velvetArmchair

  const primaryImgObj = bp.images?.find((img) => img.is_primary) || bp.images?.[0]
  const imageSrc =
    primaryImgObj?.image_path &&
    (primaryImgObj.image_path.startsWith("http://") ||
      primaryImgObj.image_path.startsWith("https://") ||
      primaryImgObj.image_path.startsWith("/"))
      ? primaryImgObj.image_path
      : onlineFallback

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

  const toMeters = (val: number | string | undefined | null, fallback: number): number => {
    if (val === undefined || val === null || val === "") return fallback
    const num = Number(val)
    if (isNaN(num) || num <= 0) return fallback
    return num > 10 ? Number((num / 100).toFixed(2)) : num
  }

  if (bp.config && typeof bp.config === "object") {
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
      desc: bp.description || "Handcrafted bespoke furniture with luxury finishing.",
      features: productFeatures,
      img: imageSrc,
      imgAlt: bp.name,
      config: bp.config,
      get sofaConfig() { return this.config?.type === "sofa" ? (this.config as SofaConfig) : undefined },
    }
  }

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
          const supp = Number(sc.price || 0)
          const resolvedBasePrice = supp >= (basePriceNum || 3000) ? supp : (basePriceNum || 3000) + supp
          defaultSeatPricing[sizeKey] = {
            label: sc.label || `${sizeKey} cm`,
            basePrice: resolvedBasePrice,
            pricePerMeter: sc.price_per_meter ? Number(sc.price_per_meter) : (sizeKey === 70 ? 900 : sizeKey === 80 ? 1000 : 1100),
            description: sc.description || (sizeKey === 70 ? "Standard comfort — classic majlis depth" : sizeKey === 80 ? "Deep lounge comfort — spacious relaxation" : "Grand luxury depth — ultra-spacious seating"),
          }
        }
      })
    }

    const sofaCfg: SofaConfig = {
      type: "sofa",
      layoutType: "l-shape",
      baseLength1: 2.70,
      baseLength2: 2.00,
      minLength1: toMeters(dim?.min_length, 1.80),
      maxLength1: toMeters(dim?.max_length, 5.00),
      minLength2: toMeters(dim?.min_width, 1.20),
      maxLength2: toMeters(dim?.max_width, 4.00),
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
  } else if (isBed) {
    const defaultSizes = [
      { id: "double_140_190", label: "Double 140×190 cm", width: 1.40, length: 1.90, basePrice: 3900 },
      { id: "queen_160_200", label: "Queen 160×200 cm", width: 1.60, length: 2.00, basePrice: basePriceNum || 4500 },
      { id: "king_180_200", label: "King 180×200 cm", width: 1.80, length: 2.00, basePrice: (basePriceNum || 4500) + 700 },
      { id: "super_king_200_200", label: "Super King 200×200 cm", width: 2.00, length: 2.00, basePrice: (basePriceNum || 4500) + 1400 },
    ]
    const bedCfg: BedConfig = {
      type: "bed",
      defaultSizeId: "queen_160_200",
      sizes: defaultSizes,
      allowCustomDimensions: true,
      customBounds: { minWidth: 1.20, maxWidth: 2.20, minLength: 1.80, maxLength: 2.20, basePrice: 4200, pricePerM2: 1200 },
      headboardStyles: [
        { id: "tufted", label: "Royal Diamond Button Tufting", supplement: 0 },
        { id: "channel", label: "Vertical Fluted Channel Stitching", supplement: 250 },
      ],
      headboardHeightCm: 120,
      hasStorageBox: false,
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
      desc: bp.description || "Handcrafted luxury upholstered bed with bespoke headboard.",
      features: productFeatures,
      img: imageSrc,
      imgAlt: bp.name,
      config: bedCfg,
    }
  } else if (isMattress) {
    const defaultSizes = [
      { id: "twin_90_190", label: "Twin 90×190", width: 0.90, length: 1.90, basePrice: 2500 },
      { id: "single_100_200", label: "Single 100×200", width: 1.00, length: 2.00, basePrice: 3000 },
      { id: "double_140_200", label: "Double 140×200", width: 1.40, length: 2.00, basePrice: 4000 },
      { id: "queen_160_200", label: "Queen 160×200", width: 1.60, length: 2.00, basePrice: 5000 },
      { id: "king_180_200", label: "King 180×200", width: 1.80, length: 2.00, basePrice: 6000 },
    ]
    const mattressCfg: MattressConfig = {
      type: "mattress",
      defaultSizeId: "queen_160_200",
      sizes: defaultSizes,
      allowCustomDimensions: true,
      customBounds: { minWidth: 0.90, maxWidth: 1.80, minLength: 1.90, maxLength: 2.20, basePrice: 3000, pricePerM2: 1200 },
      thicknessOptions: [
        { id: "t20", thicknessCm: 20, label: "Standard — 20 cm", multiplier: 1 },
        { id: "t25", thicknessCm: 25, label: "Premium — 25 cm", multiplier: 1.15 },
        { id: "t30", thicknessCm: 30, label: "Luxury — 30 cm", multiplier: 1.30 },
      ],
      coreOptions: [
        { id: "pocket_springs", label: "Pocket Springs", description: "Individual support coils for motion isolation", multiplier: 1 },
        { id: "memory_foam", label: "Memory Foam", description: "Contouring pressure relief", multiplier: 1.10 },
        { id: "latex", label: "Natural Latex", description: "Bouncy, breathable, and durable", multiplier: 1.20 },
      ],
      firmnessLevels: [
        { id: "ortho_firm", label: "Ortho Firm", desc: "Maximum spinal support" },
        { id: "medium", label: "Medium", desc: "Balanced comfort and support" },
        { id: "plush_soft", label: "Plush Soft", desc: "Cloud-like sleeping surface" },
      ],
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
      desc: bp.description || "Premium handcrafted mattress with customizable comfort.",
      features: productFeatures,
      img: imageSrc,
      imgAlt: bp.name,
      config: mattressCfg,
    }
  } else if (isAccessory) {
    const isHeadrest =
      bp.name.toLowerCase().includes("headrest") ||
      Boolean(bp.slug?.includes("headrest"))

    const accessoryCfg: AccessoryConfig = {
      type: "accessory",
      accessorySubtype: isHeadrest ? "headrest" : "cushion",
      basePrice: basePriceNum || (isHeadrest ? 350 : 320),
      packOptions: isHeadrest
        ? [
            { id: "pack_1", count: 1, label: "Single (1 pc)", multiplier: 0.5 },
            { id: "pack_2", count: 2, label: "Pair (2 pcs)", multiplier: 1 },
            { id: "pack_4", count: 4, label: "Set of 4", multiplier: 1.8 },
          ]
        : [
            { id: "pack_2", count: 2, label: "2 Pack", multiplier: 0.6 },
            { id: "pack_4", count: 4, label: "4 Pack", multiplier: 1 },
            { id: "pack_6", count: 6, label: "6 Pack", multiplier: 1.4 },
          ],
      tiltAngles: isHeadrest
        ? [
            { id: "deg_0", degrees: 0, label: "0° Flat" },
            { id: "deg_30", degrees: 30, label: "30° Relax" },
            { id: "deg_60", degrees: 60, label: "60° Support" },
            { id: "deg_90", degrees: 90, label: "90° Upright" },
          ]
        : undefined,
      sizeOptions: isHeadrest
        ? [
            { id: "s_std", sizeLabel: "Standard (55×20 cm)", supplement: 0 },
            { id: "s_wide", sizeLabel: "Wide (70×20 cm)", supplement: 60 },
          ]
        : [
            { id: "s40", sizeLabel: "40×40 cm", supplement: 0 },
            { id: "s45", sizeLabel: "45×45 cm", supplement: 30 },
            { id: "s50", sizeLabel: "50×50 cm", supplement: 60 },
          ],
      fillOptions: [
        { id: "microfiber", label: "Microfiber Fill", supplement: 0 },
        { id: "feather", label: "Feather & Down", supplement: 80 },
        { id: "memory_foam", label: "Memory Foam", supplement: 120 },
      ],
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
      desc: bp.description || "Handcrafted furniture accessory with premium finishing.",
      features: productFeatures,
      img: imageSrc,
      imgAlt: bp.name,
      config: accessoryCfg,
    }
  } else {
    const isFixedChair =
      bp.slug?.includes("rattan") ||
      bp.slug?.includes("dining") ||
      bp.name.toLowerCase().includes("rattan") ||
      bp.name.toLowerCase().includes("dining")

    let legFinishes = isFixedChair
      ? []
      : [
          { id: "natural_oak", label: "Solid Natural Oak", colorHex: "#b89060", supplement: 0 },
          { id: "dark_walnut", label: "Carved Dark Walnut", colorHex: "#4a3020", supplement: 150 },
          { id: "brass_gold", label: "Brushed Brass / Gold", colorHex: "#c9a84c", supplement: 250 },
          { id: "matte_black", label: "Matte Black Steel", colorHex: "#1a1a1a", supplement: 100 },
        ]
    let tuftingStyles = isFixedChair
      ? []
      : [
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
      baseWidth: toMeters(dim?.min_width, 0.85),
      minWidth: toMeters(dim?.min_width, 0.70),
      maxWidth: toMeters(dim?.max_width, 1.25),
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
    const data = await api.get<{ success: boolean; data: BackendProduct[] }>("/products")
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
    const data = await api.get<{ success: boolean; data: BackendUpholsteryStyle[] }>("/upholstery-styles")
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
    const data = await api.get<{ success: boolean; data: BackendCity[] }>("/cities")
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
    const data = await api.get<{ success: boolean; data: BackendCategory[] }>("/categories")
    if (data.success && Array.isArray(data.data) && data.data.length > 0) {
      const names = data.data.map((c: BackendCategory) => c.name)
      return ["All", ...names]
    }
  } catch (err) {
    console.warn("Could not fetch categories from API, using fallback:", err)
  }
  return categories
}

