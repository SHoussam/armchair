# مفروشات عبداللطيف — Abdelatif Furnishings

A premium e-commerce storefront for a Moroccan furniture business based in **Sidi Deris, Tanger**, specializing in handcrafted salons, custom mattresses, and fine upholstery.

> ☎ +212 666 896 776 · 💬 [WhatsApp](https://wa.me/212666896776) · 📍 Sidi Deris, Tanger 90000, Morocco

---

## 📋 About

This project implements the customer-facing storefront described in `Specifications_Mobilier_Synthese.docx` — the functional specification for a made-to-measure furniture shop. Customers browse the collection, personalize products (color, upholstery style, size, quantity) with automatic price calculation, and place orders via WhatsApp / bank transfer (RIB provided by the business, confirmed manually by the administrator).

**Current version:** storefront only (catalog, cart, product configurator, search).
**Roadmap (per spec):** customer accounts with order tracking, admin dashboard, production/delivery status pipeline, deposit-based payment flow.

---

## ✨ Features

### Catalog & Discovery
- **Product grid** with responsive layout (1 column mobile → auto-fill desktop)
- **Category filters** — All, Salon, Traditional, Mattress, Chair, Accessories
  - Desktop: pill-style tab buttons
  - Mobile: searchable dropdown list (type-to-filter categories)
- **Sorting** — Featured, Price low→high, Price high→low, Top rated
- **Live search overlay** (`SearchBar`) matching name, category, and description with inline image results
- Bilingual product data — English names + Arabic names (`nameAr`)
- Ratings, review counts, sale/best-seller badges, old prices

### Product Configurator (`ProductModal`)
- Color swatch picker with named colors
- Upholstery styles with price multipliers:

  | Style | Multiplier |
  |---|---|
  | Standard Fabric | ×1.00 |
  | Premium Velvet | ×1.22 |
  | Signature Leather | ×1.45 |

- Size selection, quantity stepper, live price recalculation

### Cart & Ordering
- Slide-out cart drawer with quantity controls and item removal
- **Free shipping over MAD 800** (otherwise MAD 150 flat), with progress bar toward the threshold
- Wishlist (heart toggle) with toast feedback
- Global state via React Context + `useReducer` (cart, wishlist, toasts)
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
| Styling | Hand-written CSS (`src/globals.css`) — dark/gold design system with CSS variables; Tailwind v4 available via PostCSS |
| Icons | Lucide React + inline SVG |
| UI primitives | Radix UI Slot, class-variance-authority, clsx, tailwind-merge |
| State | React Context API + `useReducer` |
| Deployment | GitHub Pages (`gh-pages`) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
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

### Deploy to GitHub Pages

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
├── Specifications_Mobilier_Synthese.docx   # Functional specification (FR)
├── TODO.md                     # Feature checklist (all complete ✅)
├── data/
│   └── products.ts             # Product interface, catalog (8 products),
│                               # categories, upholstery style multipliers
├── context/
│   └── CartContext.tsx         # Cart + wishlist + toast state (useReducer)
├── components/
│   ├── Navbar.tsx              # Sticky nav, search/cart buttons, mobile menu
│   ├── Hero.tsx                # Hero split-layout with brand block & stats
│   ├── FeaturesBanner.tsx      # Trust strip (delivery, warranty, etc.)
│   ├── ProductGrid.tsx         # Filters (tabs/searchable dropdown), sorting
│   ├── ProductCard.tsx         # Card with colors, rating, wishlist, quick add
│   ├── ProductModal.tsx        # Full configurator (color/style/size/qty)
│   ├── CartDrawer.tsx          # Slide-out cart with free-shipping progress
│   ├── SearchBar.tsx           # Full-screen search overlay w/ live results
│   ├── Footer.tsx              # Contact info, links, newsletter form
│   └── Toast.tsx               # Notification system
└── src/
    ├── main.tsx                # React entry point
    ├── App.tsx                 # Page composition + search/modal orchestration
    └── globals.css             # Entire design system + responsive breakpoints
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

*Currently implemented:* upholstery-style multipliers applied to the base price in the product configurator. Dimension-based tiered pricing is part of the roadmap.

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

---

## 🗺 Roadmap

- [ ] Client accounts — order tracking, personalization history, deposit/balance view
- [ ] Admin dashboard — products, categories, pricing rules, orders, payment confirmation
- [ ] Per-product dimension pricing rules (tiers / per-meter coefficients)
- [ ] Order status pipeline wired to the statuses above
- [ ] Delivery fee engine (city rules, distance coefficients, international quotes)

---

## 📄 License

Private project — © Abdelatif Furnishings (مفروشات عبداللطيف), Tanger, Morocco.
