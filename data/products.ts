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
  desc: string
  features: string[]
  img: string
  imgAlt: string
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

export const products: Product[] = [
  {
    id: 1,
    name: "Royal L-Shaped Salon",
    nameAr: "صالون ملكي على شكل L",
    category: "salon",
    price: 1100,
    oldPrice: null,
    badge: "Best Seller",
    rating: 4.9,
    reviews: 87,
    colors: ["#c9a882", "#8d6444", "#3d3530", "#e8dece"],
    colorNames: ["Beige", "Walnut", "Espresso", "Ivory"],
    desc: "Handcrafted L-shaped Moroccan salon with plush foam cushions and elegant carved wooden frame. Perfect centerpiece for any living room in the classic Tanger style.",
    features: ["Solid carved wood frame", "High-density foam cushions", "Removable covers", "Custom fabric options"],
    img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    imgAlt: "Elegant L-shaped Moroccan sofa set in beige fabric with decorative cushions",
  },
  {
    id: 2,
    name: "Modern Corner Sofa",
    nameAr: "كنبة زاوية عصرية",
    category: "salon",
    price: 1200,
    oldPrice: 2000,
    badge: "Sale",
    rating: 4.7,
    reviews: 63,
    colors: ["#6b7f8e", "#2c4a3e", "#1e1812", "#b09a80"],
    colorNames: ["Grey", "Forest", "Charcoal", "Camel"],
    desc: "Contemporary corner sofa with clean lines and deep seating comfort. Available in a wide range of fabrics to match any interior décor.",
    features: ["Modular corner design", "Stain-resistant fabric", "Solid wood base", "Reversible chaise"],
    img: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80",
    imgAlt: "Modern grey corner sofa with accent cushions in a contemporary living room",
  },
  {
    id: 3,
    name: "Traditional Moroccan Salon",
    nameAr: "صالون مغربي تقليدي",
    category: "traditional",
    price: 1100,
    oldPrice: null,
    badge: "New",
    rating: 4.8,
    reviews: 41,
    colors: ["#7a5c40", "#c0b090", "#5c3d1e", "#d4c4a8"],
    colorNames: ["Cognac", "Champagne", "Tobacco", "Oat"],
    desc: "Authentic U-shaped Moroccan salon with intricate hand-embroidered fabric and solid cedar wood frame. Brings the warmth of traditional craftsmanship to your home.",
    features: ["Hand-embroidered fabric", "Cedar wood frame", "U-shaped layout", "Matching center table"],
    img: "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&q=80",
    imgAlt: "Traditional Moroccan U-shaped salon with embroidered fabric and cedar wood",
  },
  {
    id: 4,
    name: "Luxury Mattress — Ortho Comfort",
    nameAr: "مرتبة فاخرة — أورثو كومفورت",
    category: "mattress",
    price: 2000,
    oldPrice: null,
    badge: null,
    rating: 5.0,
    reviews: 112,
    colors: ["#e8dece", "#a09080", "#605040", "#2a2018"],
    colorNames: ["White", "Cream", "Silver", "Graphite"],
    desc: "Premium orthopedic mattress with pocket spring system and memory foam comfort layer. Designed for perfect spinal support and deep, restful sleep.",
    features: ["Pocket spring system", "Memory foam layer", "Bamboo cover", "Anti-allergy treatment"],
    img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
    imgAlt: "White luxury orthopedic mattress with memory foam layers",
  },
  {
    id: 5,
    name: "Velvet Accent Armchair",
    nameAr: "كرسي بالمخمل",
    category: "chair",
    price: 1800,
    oldPrice: 2100,
    badge: "Sale",
    rating: 4.6,
    reviews: 55,
    colors: ["#8b6040", "#c8b090", "#3c2c1c", "#9090a0"],
    colorNames: ["Chestnut", "Camel", "Dark Brown", "Slate"],
    desc: "Elegant accent armchair upholstered in premium velvet. Its classic silhouette and rich color options make it a statement piece for any reading nook or sitting area.",
    features: ["Premium velvet upholstery", "Solid wood legs", "High-density foam", "FR-treated fabric"],
    img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    imgAlt: "Velvet accent armchair in chestnut brown with wooden legs",
  },
  {
    id: 6,
    name: "Kids & Youth Mattress",
    nameAr: "مرتبة للأطفال",
    category: "mattress",
    price: 980,
    oldPrice: null,
    badge: null,
    rating: 4.7,
    reviews: 34,
    colors: ["#d4a882", "#9090a0", "#2c4a3e", "#c0b090"],
    colorNames: ["Peach", "Slate", "Sage", "Camel"],
    desc: "Specially designed for children and youth, this breathable mattress provides optimal support during key growth years. Anti-bacterial and hypoallergenic.",
    features: ["Anti-bacterial fabric", "Breathable materials", "Ergonomic support", "Easy-clean cover"],
    img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80&sat=-100",
    imgAlt: "Youth mattress with breathable hypoallergenic fabric",
  },
  {
    id: 7,
    name: "Decorative Cushion Set",
    nameAr: "طقم وسائد زخرفية",
    category: "accessories",
    price: 350,
    oldPrice: null,
    badge: null,
    rating: 4.5,
    reviews: 196,
    colors: ["#b8a090", "#405060", "#7c5c40", "#e8e0d0"],
    colorNames: ["Taupe", "Navy", "Tan", "Off-White"],
    desc: "Set of 4 luxurious decorative cushions with embroidered Moroccan patterns. Perfect for adding warmth and character to any sofa or salon.",
    features: ["Set of 4 cushions", "Moroccan embroidery", "Inner filling included", "Removable covers"],
    img: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80",
    imgAlt: "Set of decorative cushions with Moroccan embroidery patterns",
  },
  {
    id: 8,
    name: "Premium Memory Foam Mattress",
    nameAr: "مرتبة ميموري فوم الفاخرة",
    category: "mattress",
    price: 3000,
    oldPrice: null,
    badge: "New",
    rating: 4.9,
    reviews: 28,
    colors: ["#f0e8d8", "#c0a880", "#5c4030", "#303030"],
    colorNames: ["White", "Cream", "Walnut", "Charcoal"],
    desc: "Hotel-grade memory foam mattress with 7-zone pressure relief technology. Adapts to your body shape for personalised comfort throughout the night.",
    features: ["7-zone memory foam", "Temperature regulation", "Hotel-grade quality", "10-year warranty"],
    img: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80",
    imgAlt: "Premium memory foam mattress with white luxury bedding",
  },
]

export const categories = ["All", "Salon", "Traditional", "Mattress", "Chair", "Accessories"]
