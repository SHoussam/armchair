# مفروشات عبداللطيف — Abdelatif Furnishings

A premium e-commerce storefront for a Moroccan furniture business based in **Sidi Deris, Tanger**, specializing in handcrafted salons, custom mattresses, and fine upholstery.

> ☎ +212 666 896 776 · 💬 [WhatsApp](https://wa.me/212666896776) · 📍 Sidi Deris, Tanger 90000, Morocco

---

## 📋 About

This project implements the customer-facing storefront described in `Specifications_Mobilier_Synthese.docx` — the functional specification for a made-to-measure furniture shop. Customers browse the collection, personalize products (dimensions, colors, upholstery style, options) with automatic price calculation, preview their configuration live, and place orders via WhatsApp / bank transfer (RIB provided by the business, confirmed manually by the administrator).

**Current version:** storefront only (catalog, cart, real-time product configurator with live visualizers, search).
**Roadmap (per spec):** customer accounts with order tracking, admin dashboard, production/delivery status pipeline, deposit-based payment flow.

---

## ✨ Features

### Catalog & Discovery
- **Product grid** with responsive layout (1 column mobile → auto-fill desktop)
- **Category filters** — All, Salon, Chair
  - Desktop: pill-style tab buttons
  - Mobile: searchable dropdown list (type-to-filter categories)
- **Sorting** — Featured, Price low→high, Price high→low, Top rated
- **Live search overlay** (`SearchBar`) matching name, category, and description with inline image results
- Bilingual product data — English names + Arabic names (`nameAr`)
- Ratings, review counts, sale/best-seller badges, old prices
- **Focused catalog** — currently 2 flagship products (L-shaped salon + accent armchair), driven by a centralized, backend-ready config (`data/data.ts`, designed to be swapped for a single API call)

### Product Configurator (`ProductModal`)
Per-product-type configuration with **live price recalculation** powered by the pricing engine:

- **L-Shaped Salon (sofa)**
  - Seat depth tiers — 70 cm (3,000 DH base · 900 DH/m), 80 cm (3,500 DH · 1,000 DH/m), 90 cm (4,000 DH · 1,100 DH/m)
  - Custom dimensions L1 × L2 (1.80–5.00 m × 1.20–4.00 m, 10 cm steps) → per-meter supplement beyond base 2.70 × 2.00 m
  - Headrest count, chaise left/right orientation
  - Base-price enforcement (configuration below reference never drops below tier base price)
- **Armchair (chair)**
  - Custom width 0.70–1.25 m (+15 DH per extra cm above the 0.85 m base)
  - Leg finishes (natural oak, carved walnut, brushed brass, matte black steel) with supplements
  - Backrest tufting styles (smooth, channel stitching, diamond button tufting) with supplements
- **Shared options** — color swatches with named colors, upholstery grades (Standard Fabric ×1.00, Premium Velvet ×1.22, Signature Leather ×1.45), quantity stepper
- **Live SVG visualizers** — `SofaVisualizer` / `ChairVisualizer` render the configured product in real time (proportions, seat depth, headrests, chaise orientation, fabric color); photo ↔ configurator toggle
- Mattress & accessory configurators/pricing are already implemented in the engine, ready for catalog expansion

### Cart & Ordering
- Slide-out cart drawer with quantity controls and item removal
- Cart items store the **full configuration + detailed price breakdown** (seat size, dimensions, options, line-by-line supplements)
- **Free shipping over MAD 800** (otherwise MAD 150 flat), with progress bar toward the threshold
- Wishlist (heart toggle) with toast feedback
- Global state via React Context + `useReducer` (cart, wishlist, toasts)
- Swipe-down-to-close modal/drawer behavior on mobile
- **WhatsApp checkout integration** — floating button, hero CTA, cart/contact links to `wa.me/212666896776`

### Design & UX
- Luxury dark theme ("midnight" + gold palette), Cormorant Garamond / DM Sans typography
- Scroll-triggered entrance animations, sticky blurred navbar, mobile hamburger menu
- Fully responsive: dedicated layouts for mobile (<768px), tablet, laptop, and desktop breakpoints
- Touch-optimized controls (44px touch targets, tap-highlight handling, momentum scrolling)
- Google Maps embed for the showroom, testimonials section, contact + CTA sections

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 7 |
| Styling | Hand-written CSS (`src/globals.css`) — dark/gold design system with CSS variables; Tailwind v4 via PostCSS |
| Icons | Lucide React + inline SVG |
| UI primitives | Radix UI Slot, class-variance-authority, clsx, tailwind-merge |
| State | React Context API + `useReducer` |
| Pricing | Dedicated engine (`src/utils/pricing.ts`) with typed breakdowns per product type |
| Testing | Self-contained assertion suite for the pricing engine (`src/utils/pricing.test.ts`) |
| Deployment | GitHub Pages via GitHub Actions workflow |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18 (CI uses Node 20)
- npm ≥ 9

### Install & run

```bash
# install dependencies
npm install

# start dev server (http://localhost:5173/armchair/)
npm run dev

# typecheck + production build
npm run build

# preview the production build locally
npm run preview

# lint
npm run lint
```

### Pricing engine tests

The pricing test file is a self-contained TypeScript script. Run it with:

```bash
# Option 1: Using tsx (if installed)
npx tsx src/utils/pricing.test.ts

# Option 2: Compile and run with Node
npx tsc src/utils/pricing.test.ts --esModuleInterop --module commonjs --target ES2020 --outDir /tmp && node /tmp/pricing.test.js
```

Runs the self-contained assertion suite covering the confirmed sofa/chair pricing cases (base prices, per-meter/per-cm supplements, fabric multipliers, base-price enforcement).

### Deploy to GitHub Pages

Two options:

- **Automatic** — pushing to `main` triggers the GitHub Actions workflow (`.github/workflows/deploy.yml`): install → build → publish `dist/`.
- **Manual** —

```bash
npm run deploy   # runs predeploy (build) then publishes dist/
```

The Vite config sets `base: "/armchair/"`, so the site is served from the `/armchair/` path of the GitHub Pages domain.

---

## 📁 Project Structure

```
armchair-shop-website/
├── index.html                  # Entry HTML (SEO meta, Open Graph)
├── vite.config.ts              # Vite config (@ alias, /armchair/ base)
├── package.json                # Scripts & dependencies
├── .github/workflows/deploy.yml # GitHub Pages deploy workflow (push to main)
├── Specifications_Mobilier_Synthese.docx   # Functional specification (FR)
├── way/                        # Additional spec documents (AR/FR)
│   ├── Specifications_Mobilier_Consolide v2.docx
│   └── Mowasafat_Mobilier_Version2_AR.docx
├── data/
│   ├── data.ts                 # Source of truth: types, catalog, categories,
│   │                           # upholstery multipliers, sofa/chair configs
│   ├── products.ts             # Re-export of data.ts (backward compatibility)
│   └── *.jpg                   # Product photos
├── context/
│   └── CartContext.tsx         # Cart + wishlist + toast state (useReducer);
│                               # cart items carry full config + price breakdown
├── components/
│   ├── Navbar.tsx              # Sticky nav, search/cart buttons, mobile menu
│   ├── Hero.tsx                # Hero split-layout with brand block & stats
│   ├── FeaturesBanner.tsx      # Trust strip (delivery, warranty, etc.)
│   ├── ProductGrid.tsx         # Filters (tabs/searchable dropdown), sorting
│   ├── ProductCard.tsx         # Card with colors, rating, wishlist, quick add
│   ├── ProductModal.tsx        # Full configurator per product type
│   ├── CartDrawer.tsx          # Slide-out cart with free-shipping progress
│   ├── SearchBar.tsx           # Full-screen search overlay w/ live results
│   ├── Footer.tsx              # Contact info, links, newsletter form
│   ├── Toast.tsx               # Notification system
│   └── SVG/                    # Live SVG visualizers
│       ├── SofaVisualizer.tsx      # L-shape proportions, seats, headrests, chaise
│       ├── ChairVisualizer.tsx     # Width, leg finishes, tufting styles
│       ├── MattressVisualizer.tsx  # Ready for mattress SKUs
│       └── AccessoryVisualizer.tsx # Ready for accessory SKUs
└── src/
    ├── main.tsx                # React entry point
    ├── App.tsx                 # Page composition + search/modal orchestration
    ├── globals.css             # Entire design system + responsive breakpoints
    └── utils/
        ├── pricing.ts          # Universal pricing engine (sofa/mattress/
        │                       # chair/accessory) with price breakdowns
        └── pricing.test.ts     # Assertion suite for the pricing engine
```

---

## 🧭 Business Rules (from the Specification)

The `.docx` specification defines the target system this storefront belongs to:

### Pricing model
```
Final price = Base price + Dimension supplements + Option supplements
```
- Each product has a base price tied to reference dimensions.
- Configurations ≤ the reference keep the base price; larger sizes trigger fixed-tier or per-meter supplements defined per product.
- Example: a corner sofa at MAD 3,000 (70 cm module) can rise to MAD 3,500 (80 cm) or MAD 4,000 (90 cm).

*Currently implemented:* the full pricing engine — seat-size tiers with per-meter length supplements (sofa), per-cm width supplements plus option supplements (chair), thickness/core multipliers (mattress), pack/size/fill supplements (accessory), and fabric-grade multipliers applied across types. Dimension-based pricing is live in the configurator with an itemized breakdown shown at checkout time in the cart.

### Payment flow
- No online payment in this phase — orders are confirmed via **bank transfer (RIB)** verified manually by the administrator.
- A **deposit (%)** is required before fabrication; the balance is due before shipping.

### Order lifecycle
| Status | Meaning |
|---|---|
| `PENDING` | Order created, deposit not yet validated |
| `WORKING` | Deposit confirmed, fabrication in progress |
| `WAITING_FOR_FINAL_PAYMENT` | Item finished, balance due |
| `SHIPPING` | Fully paid, order in transit |
| `DELIVERED` | Order delivered |

### Delivery tariffs (planned)
| Zone | Rate |
|---|---|
| Tanger | From MAD 100, adjusted by furniture size |
| Rest of Morocco | MAD 200 + distance × coefficient (up to ~MAD 800) |
| International | Via external carrier, rates TBD |
| Customer pickup | Free |

*Currently implemented:* simplified storefront rule — free shipping in Tanger over MAD 800, otherwise MAD 150 flat.

---

## 🗺 Roadmap

- [ ] Client accounts — order tracking, personalization history, deposit/balance view
- [ ] Admin dashboard — products, categories, pricing rules, orders, payment confirmation
- [ ] Order status pipeline wired to the statuses above
- [ ] Delivery fee engine (city rules, distance coefficients, international quotes)
- [ ] Swap static catalog config (`data/data.ts`) for a backend API (interface already shaped for it)
- [ ] Expand catalog using the ready-made mattress & accessory configurators

---

## 📄 License

Private project — © Abdelatif Furnishings (مفروشات عبداللطيف), Tanger, Morocco.
