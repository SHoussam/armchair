# Frontend — Abdelatif Furnishings Storefront

React 19 + TypeScript + Vite 7 + Tailwind CSS v4 storefront for Abdelatif Furnishings (مفروشات عبداللطيف), featuring dynamic REST API integration, bespoke 2D vector configurators, live pricing calculations, Sanctum authentication, and order tracking.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS v4 + custom design tokens (`globals.css`) |
| Icons | Lucide React + custom inline SVGs |
| State Management | React Context + `useReducer` |
| Authentication | Laravel Sanctum token-based auth (`AuthContext.tsx`) |
| API Communication | Native `fetch` with typed backend adapters (`data/data.ts`) |
| Pricing Engine | Universal calculation engine (`utils/pricing.ts`) with typed breakdowns |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start local dev server (default: http://localhost:5173/armchair/)
npm run dev

# Run TypeScript compiler check
npx tsc --noEmit

# Run ESLint check
npm run lint

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

### Pricing Engine Test Suite

```bash
npx tsx src/utils/pricing.test.ts
```

---

## Project Structure

```
frontend/
├── index.html                      # Entry HTML (SEO, viewport-fit=cover meta)
├── vite.config.ts                  # Vite config + @ alias → src/, /armchair/ base
├── tailwind.config.js              # Tailwind CSS configuration
├── postcss.config.js               # PostCSS with @tailwindcss/postcss
├── tsconfig.json                   # TypeScript configuration
├── package.json
│
└── src/
    ├── main.tsx                    # React application entry point
    ├── App.tsx                     # Page routing & overlay orchestration
    ├── globals.css                 # Comprehensive dark/gold design system
    │
    ├── components/                 # UI components
    │   ├── Navbar/                 # Sticky header with search, auth, cart triggers
    │   ├── MobileBottomNav/        # Mobile bottom tab bar (auto-hiding on scroll)
    │   ├── Hero/                   # Hero section with brand story & CTA
    │   ├── FeaturesStrip/          # Workshop craftsmanship & delivery highlights
    │   ├── Shop/                   # Category filtering, live search & product listing
    │   ├── ProductModal/           # Dynamic configurator with SVG vector blueprints
    │   ├── CartDrawer/             # Slide-out cart with free-shipping progress tracker
    │   ├── CheckoutModal.tsx       # 4-step checkout & payment receipt upload wizard
    │   ├── Search/                 # Full-screen search overlay with instant results
    │   ├── AuthModal/              # Tabbed customer login and registration modal
    │   ├── AccountPage/            # Customer profile and order history dashboard
    │   ├── Tracking/               # Live 5-stage order status timeline
    │   ├── Footer/                 # Contact details, showroom map & links
    │   ├── Toast/                  # Swipe-to-dismiss toast notifications
    │   └── SVG/                    # Vector visualizer blueprints
    │       ├── SofaVisualizer.tsx       # L-shaped salon modular blueprint
    │       ├── ChairVisualizer.tsx      # Armchair custom width & tufting blueprint
    │       ├── MattressVisualizer.tsx   # 2.5D isometric mattress blueprint
    │       └── AccessoryVisualizer.tsx  # Cushion set & pack blueprint
    │
    ├── context/
    │   ├── CartContext.tsx          # Cart items, wishlist, toast state management
    │   └── AuthContext.tsx          # Laravel Sanctum customer auth & token persistence
    │
    ├── hooks/
    │   └── useCopyToClipboard.ts    # Copy-to-clipboard hook (for RIB numbers)
    │
    ├── data/
    │   ├── data.ts                 # Backend API fetchers, type adapters & static fallbacks
    │   ├── L.jpg                   # L-shaped sofa product reference image
    │   ├── chare.jpg               # Velvet armchair product reference image
    │   └── 542094736_*.jpg          # Additional showcase photography
    │
    └── utils/
        ├── pricing.ts              # Universal furniture pricing calculation engine
        └── pricing.test.ts         # Automated pricing test suite
```

---

## REST API Integration (`src/data/data.ts`)

The storefront fetches dynamic data from the Laravel backend while maintaining resilient offline fallbacks:

| Function | API Endpoint | Description |
|---|---|---|
| `fetchProducts()` | `GET /api/products` | Loads active products with dimensions, configurations, and images. Maps to `Product` interface via `mapBackendProductToFrontend()`. |
| `fetchCategories()` | `GET /api/categories` | Loads dynamic categories from the database for the category filter tabs. |
| `fetchCities()` | `GET /api/cities` | Loads Moroccan delivery cities with dynamically calculated shipping fees based on zone rules. |
| `fetchUpholsteryStyles()` | `GET /api/upholstery-styles` | Loads fabrics (Standard, Premium Velvet, Signature Leather) and pricing multipliers. |

---

## 2D SVG Configurator System

The storefront includes four interactive SVG visualizers that render product blueprints in real time based on user adjustments.

### Architecture

```
ProductModal (state owner)
  ├── SofaVisualizer        ← receives dimensions, seat size, headrests, chaise
  ├── ChairVisualizer       ← receives width, leg finishes, tufting patterns
  ├── MattressVisualizer    ← receives dimensions, thickness, core materials
  └── AccessoryVisualizer   ← receives pack quantities, sizes, fill types
```

### Supported Customizations
- **L-Shaped Salon (`SofaVisualizer`)**: Modular seat sizes (70cm, 80cm, 90cm), independent horizontal and vertical length sliders (e.g. 2.70m × 2.00m), chaise orientation (left/right), headrests count (0-4), armrest configurations.
- **Armchair (`ChairVisualizer`)**: Custom width slider (70cm - 125cm), 4 leg finishes (Natural Oak, Dark Walnut, Brushed Brass, Matte Black), 3 tufting styles (Smooth, Channel, Diamond).
- **Mattress (`MattressVisualizer`)**: Standard sizes or custom dimensions, thickness tiers (20cm - 35cm), core types (Pocket springs, High-density HR foam, Latex, Orthopedic).

---

## Pricing Engine (`src/utils/pricing.ts`)

The pricing engine implements the workshop's pricing rules with typed itemized breakdowns:

```
Final Price = Base Price + Dimension Supplements + Option Supplements
```

- **Sofa Formula**: Base tier price + extra meters beyond standard dimension × per-meter rate + headrest costs. Configured with fabric multiplier.
- **Chair Formula**: Base price + extra width beyond 85cm × per-cm rate + leg finish supplement + tufting supplement. Multiplied by fabric grade.
- **Enforcement**: Calculations strictly enforce that prices never fall below the product's base tier price.

---

## State Management

### 1. `CartContext` (`src/context/CartContext.tsx`)
- Manages items in the shopping cart using `useReducer`.
- Stores full item customizations and price breakdowns.
- Tracks wishlist product IDs and active toast notifications.
- Computes cart subtotal, item counts, and free shipping progress (800 DH threshold).

### 2. `AuthContext` (`src/context/AuthContext.tsx`)
- Connected to Laravel Sanctum API endpoints (`/api/login`, `/api/register`, `/api/me`, `/api/logout`).
- Stores the Bearer token in `localStorage` (`sanctum_token`).
- Validates the token on mount via `GET /api/me`.
- Synchronizes authentication state across the navbar, mobile navigation, and checkout modal.

---

## Mobile-First UI Patterns

- **Safe Areas**: Uses `viewport-fit=cover` and CSS `env(safe-area-inset-bottom)` for notch-safe rendering on mobile devices.
- **Auto-Hiding Bottom Nav (`MobileNav`)**: Fixed 5-tab mobile navigation bar that hides on scroll down and reappears on scroll up.
- **Swipeable Toasts (`Toast.tsx`)**: Touch gesture support allowing users to swipe away toast notifications horizontally.
- **Touch Targets**: Minimum 48px touch targets on buttons, swatches, and inputs.

---

## License

Private project — © Abdelatif Furnishings (مفروشات عبداللطيف), Tanger, Morocco.