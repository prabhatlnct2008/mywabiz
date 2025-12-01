# Project Status: mywabiz

## Development Strategy: Parallel Worktrees

This project uses **git worktrees** for parallel development across multiple feature tracks, followed by an integration phase.

### Worktree Structure

```
/home/user/
├── mywabiz/                    # Main worktree (base branch)
├── mywabiz-backend-core/       # Backend APIs worktree
├── mywabiz-dashboard/          # Merchant dashboard worktree
├── mywabiz-storefront/         # Buyer storefront worktree
├── mywabiz-premium/            # Premium features worktree
└── mywabiz-landing/            # Landing page worktree
```

### Branch Mapping

| Worktree | Branch | Phases | Dependencies |
|----------|--------|--------|--------------|
| `mywabiz` | `main` | Track 0 | None (base) |
| `mywabiz-backend-core` | `feature/backend-core` | Track 1 | Track 0 |
| `mywabiz-dashboard` | `feature/dashboard` | Track 2 | Track 0 |
| `mywabiz-storefront` | `feature/storefront` | Track 3 | Track 0 |
| `mywabiz-premium` | `feature/premium` | Track 4 | Track 1 |
| `mywabiz-landing` | `feature/landing` | Track 5 | None |

### Development Flow

```
Track 0 (Base)──────────────────────────────────────────────────────────┐
    │                                                                    │
    ├──► Track 1 (Backend Core) ────────────────────────────────────────►│
    │                                                                    │
    ├──► Track 2 (Dashboard) ───────────────────────────────────────────►│
    │                                                                    │
    ├──► Track 3 (Storefront) ──────────────────────────────────────────►│
    │                                                                    │
    │         └──► Track 4 (Premium) ───────────────────────────────────►│
    │                                                                    │
    └──► Track 5 (Landing) ─────────────────────────────────────────────►│
                                                                         │
                                                            INTEGRATION ◄┘
```

---

## Current Phase: Track 0 - Base Setup

---

## Track 0: Base Setup (Sequential - Main Worktree)
**Branch:** `main`
**Worktree:** `/home/user/mywabiz`

### Phase 0.1: Project Scaffolding

#### Backend Setup
- [ ] Initialize FastAPI project with recommended structure (`app/api/v1/endpoints/...`)
- [ ] Configure MongoDB connection with Motor async driver
- [ ] Set up Pydantic settings for environment variables
- [ ] Create base models and schemas structure
- [ ] Set up CORS middleware for frontend communication
- [ ] Configure logging and error handling

#### Frontend Setup
- [ ] Initialize React 18 + TypeScript + Vite project
- [ ] Configure Tailwind CSS with custom design tokens
- [ ] Set up folder structure (features, components, api, hooks, utils)
- [ ] Create Axios client with interceptors
- [ ] Set up React Router for routing
- [ ] Install and configure i18n (react-i18next)
- [ ] Create base UI components (Button, Input, Card, Modal, Toast, Spinner)

#### DevOps
- [ ] Set up Vercel project configuration
- [ ] Set up MongoDB Atlas cluster
- [ ] Configure environment variables template
- [ ] Set up GitHub repository with branch protection

### Phase 0.2: Authentication

#### Backend
- [ ] Implement Google OAuth 2.0 flow endpoints
  - [ ] `GET /api/v1/auth/google` - initiate OAuth
  - [ ] `GET /api/v1/auth/google/callback` - handle callback
  - [ ] `GET /api/v1/auth/me` - get current user
  - [ ] `POST /api/v1/auth/logout` - logout
- [ ] Create User model and schemas
- [ ] Implement JWT generation and validation
- [ ] Create authentication dependency (`get_current_user`)
- [ ] Set up httpOnly cookie-based session

#### Frontend
- [ ] Create AuthProvider context
- [ ] Implement `useAuth` hook
- [ ] Build LoginButton component (Google OAuth)
- [ ] Build UserMenu component (avatar, logout)
- [ ] Create protected route wrapper
- [ ] Handle auth redirects and loading states

---

## Track 1: Backend Core (Parallel - After Track 0)
**Branch:** `feature/backend-core`
**Worktree:** `/home/user/mywabiz-backend-core`

### Phase 1.1: Store Management

- [ ] Create Store model and schemas (StoreCreate, StoreUpdate, StoreResponse)
- [ ] Implement store endpoints
  - [ ] `POST /api/v1/stores` - create store
  - [ ] `GET /api/v1/stores` - list user's stores
  - [ ] `GET /api/v1/stores/{store_id}` - get store
  - [ ] `PATCH /api/v1/stores/{store_id}` - update store
  - [ ] `DELETE /api/v1/stores/{store_id}` - delete store
- [ ] Implement unique slug generation
- [ ] Add owner authorization checks

### Phase 1.2: Product Management

- [ ] Create Product model and schemas
- [ ] Implement product endpoints
  - [ ] `POST /api/v1/stores/{store_id}/products` - add product
  - [ ] `GET /api/v1/stores/{store_id}/products` - list products
  - [ ] `GET /api/v1/stores/{store_id}/products/{product_id}` - get product
  - [ ] `PATCH /api/v1/stores/{store_id}/products/{product_id}` - update
  - [ ] `DELETE /api/v1/stores/{store_id}/products/{product_id}` - delete
- [ ] Implement category filtering and pagination
- [ ] Add authorization checks (store ownership)

### Phase 1.3: Google Sheets Integration

- [ ] Set up Google Sheets API v4 with service account
- [ ] Create sheets sync service
  - [ ] Parse sheet URL to extract Sheet ID
  - [ ] Fetch sheet data
  - [ ] Validate rows (required: Name, Price)
  - [ ] Upsert products (match by row index)
  - [ ] Track sync status and errors
- [ ] Implement force sync endpoint
  - [ ] `POST /api/v1/stores/{store_id}/products/sync`
- [ ] Store last_synced_at and sync_status

### Phase 1.4: Order Management

- [ ] Create Order model and schemas
- [ ] Implement order creation endpoint
  - [ ] `POST /api/v1/stores/{store_id}/orders`
  - [ ] Validate products and stock
  - [ ] Calculate totals (subtotal, shipping, discount, total)
  - [ ] Generate order number (sequential per store)
  - [ ] Generate track_token (UUID)
- [ ] Implement merchant order endpoints
  - [ ] `GET /api/v1/stores/{store_id}/orders` - list orders
  - [ ] `GET /api/v1/stores/{store_id}/orders/{order_id}` - get order
  - [ ] `PATCH /api/v1/stores/{store_id}/orders/{order_id}` - update status
- [ ] Implement public tracking endpoint
  - [ ] `GET /api/v1/orders/track/{track_token}`

### Phase 1.5: WhatsApp Message Generation

- [ ] Create i18n dictionaries for all 5 languages (en, hi, pa, hr, gu)
- [ ] Build WhatsApp message generator service
  - [ ] Load store language
  - [ ] Build message from template with localized labels
  - [ ] URL-encode message
  - [ ] Generate wa.me URL
- [ ] Store generated message in order record
- [ ] Return whatsapp_url in order response

### Phase 1.6: Analytics API

- [ ] Implement analytics aggregation
  - [ ] `GET /api/v1/stores/{store_id}/stats?timeframe=7d`
  - [ ] Calculate orders_count, sales_total, visits
- [ ] Create analytics_snapshots collection
- [ ] Set up daily aggregation job (or on-demand calculation)

### Phase 1.7: Public Storefront API

- [ ] Implement public endpoints (no auth required)
  - [ ] `GET /api/v1/public/stores/{slug}` - get store
  - [ ] `GET /api/v1/public/stores/{slug}/products` - list products
  - [ ] `GET /api/v1/public/stores/{slug}/products/{product_id}` - get product
- [ ] Track page visits for analytics

---

## Track 2: Merchant Dashboard (Parallel - After Track 0)
**Branch:** `feature/dashboard`
**Worktree:** `/home/user/mywabiz-dashboard`

### Phase 2.1: Dashboard Layout

- [ ] Create DashboardLayout component with sidebar
- [ ] Build Sidebar component with navigation links
- [ ] Build TopBar component with user menu
- [ ] Set up dashboard routing structure

### Phase 2.2: Onboarding Wizard

- [ ] Build OnboardingWizard container with step navigation
- [ ] Step 1: TemplateSelector component (7 template cards)
- [ ] Step 2: StoreBasicsForm (name, WhatsApp, language dropdown)
- [ ] Step 3: CatalogSetup (Google Sheets URL input or skip)
- [ ] Step 4: DesignPreview (basic branding controls)
- [ ] Implement progress indicator
- [ ] Handle wizard completion → redirect to dashboard

### Phase 2.3: Dashboard Home

- [ ] Build DashboardPage layout
- [ ] Build StatsCards component (Orders, Sales, Visits)
- [ ] Build QuickActions component (Add product, Design, Share, Upgrade)
- [ ] Build RecentOrders component (last 5-10 orders)
- [ ] Implement timeframe filter (Today, 7 days, 30 days)

### Phase 2.4: Products Management UI

- [ ] Create products API module
- [ ] Build `useProducts` hook
- [ ] Build ProductsPage with list view
- [ ] Build ProductCard component (dashboard version)
- [ ] Build ProductForm modal (create/edit)
- [ ] Build ImageUploader component
- [ ] Implement variant management (sizes, colors)
- [ ] Build SheetSyncPanel component
  - [ ] Sheet URL input field
  - [ ] "Open Sheet" button (external link)
  - [ ] "Force Sync" button with loading state
  - [ ] Last synced timestamp display

### Phase 2.5: Store Design UI

- [ ] Build StoreDesignPage layout (controls + preview)
- [ ] Build BrandingControls component
  - [ ] Logo uploader
  - [ ] Brand color picker
  - [ ] Banner image uploader
  - [ ] Banner text input
- [ ] Build SectionToggles component (header, banner, products, footer)
- [ ] Build ThemeSelector component (minimal, bold, dark)
- [ ] Build LanguageSelector component (5 languages)
- [ ] Build LivePreview component
  - [ ] Desktop/Mobile toggle
  - [ ] Render preview based on current settings

### Phase 2.6: Orders Management UI

- [ ] Build OrdersPage
  - [ ] OrderList component (table view)
  - [ ] OrderRow component
  - [ ] Status filter
  - [ ] Pagination
- [ ] Build OrderDetail modal/page
  - [ ] Customer info
  - [ ] Order items
  - [ ] Status dropdown (update status)
  - [ ] "Open in WhatsApp" icon

### Phase 2.7: Settings UI

- [ ] Build SettingsPage layout with tabs/sections
- [ ] Build StoreDetails section (name, WhatsApp, language)
- [ ] Build ShippingSettings section
  - [ ] Pickup toggle + address
  - [ ] Delivery toggle + fee
- [ ] Build PaymentSettings section
  - [ ] COD toggle
  - [ ] PayPal toggle + client ID input
- [ ] Build DangerZone section (delete store)

---

## Track 3: Buyer Storefront (Parallel - After Track 0)
**Branch:** `feature/storefront`
**Worktree:** `/home/user/mywabiz-storefront`

### Phase 3.1: Storefront Layout & Components

- [ ] Build storefront layout with store branding
- [ ] Build Header component (logo, store name)
- [ ] Build Banner component (conditional display)
- [ ] Build CategoryChips component (filter by category)
- [ ] Build ProductGrid component (responsive 2/3/4 columns)
- [ ] Build ProductCard component (storefront version)
- [ ] Build Footer component

### Phase 3.2: Product Detail Page

- [ ] Build ProductDetail page layout
- [ ] Build image gallery with thumbnails
- [ ] Build VariantSelector component (size, color chips)
- [ ] Build quantity selector
- [ ] Build "Add to order" button with feedback

### Phase 3.3: Cart & Checkout

- [ ] Build `useCart` hook (localStorage-based cart state)
- [ ] Build cart summary component
- [ ] Build CheckoutPage layout
- [ ] Build OrderSummary component (line items, totals)
- [ ] Build CheckoutForm component
  - [ ] Name input (required)
  - [ ] Phone input (required)
  - [ ] Email input (optional)
  - [ ] Address textarea
  - [ ] Custom fields (if configured)
- [ ] Build shipping method selector (Pickup/Delivery)
- [ ] Build "Place order on WhatsApp" CTA button

### Phase 3.4: i18n for Storefront

- [ ] Set up i18n dictionaries (en, hi, pa, hr, gu)
- [ ] Implement language context based on store settings
- [ ] Apply translations to all storefront UI labels
- [ ] Test all 5 languages

### Phase 3.5: WhatsApp Handoff

- [ ] Build WhatsApp redirect handler
- [ ] Build fallback UI (copy message if WA doesn't open)
- [ ] Test on mobile and desktop

### Phase 3.6: Order Confirmation & Tracking

- [ ] Build OrderConfirmation page
  - [ ] Success icon
  - [ ] Localized "Order placed" message
  - [ ] Order number display
  - [ ] "Track your order" button
- [ ] Build OrderTracking page
  - [ ] Order status display
  - [ ] Status timeline (optional)
  - [ ] Order items and total
  - [ ] "Chat on WhatsApp" action

---

## Track 4: Premium Features (Parallel - After Track 1)
**Branch:** `feature/premium`
**Worktree:** `/home/user/mywabiz-premium`
**Note:** Depends on Track 1 (Backend Core) for base API structure

### Phase 4.1: Premium Feature Gating

#### Backend
- [ ] Implement premium feature gate middleware
- [ ] Define plan limits (products, features)

#### Frontend
- [ ] Build PremiumGate component (upsell modal)
- [ ] Build UpgradeBanner component

### Phase 4.2: Coupons

#### Backend
- [ ] Create Coupon model and schemas
- [ ] Implement coupon endpoints
  - [ ] `POST /api/v1/stores/{store_id}/coupons` - create
  - [ ] `GET /api/v1/stores/{store_id}/coupons` - list
  - [ ] `PATCH /api/v1/stores/{store_id}/coupons/{id}` - update
  - [ ] `DELETE /api/v1/stores/{store_id}/coupons/{id}` - delete
  - [ ] `POST /api/v1/stores/{store_id}/coupons/validate` - validate at checkout

#### Frontend
- [ ] Build CouponsPage
- [ ] Build CouponList component
- [ ] Build CouponForm modal
  - [ ] Code input
  - [ ] Discount type selector (Flat/Percent)
  - [ ] Value input
  - [ ] Date range picker
  - [ ] Usage limit input
- [ ] Add coupon input to checkout flow
- [ ] Display discount in order summary

### Phase 4.3: Custom Pages

#### Backend
- [ ] Create CustomPage model and schemas
- [ ] Implement page endpoints
  - [ ] `POST /api/v1/stores/{store_id}/pages` - create
  - [ ] `GET /api/v1/stores/{store_id}/pages` - list
  - [ ] `GET /api/v1/stores/{store_id}/pages/{id}` - get
  - [ ] `PATCH /api/v1/stores/{store_id}/pages/{id}` - update
  - [ ] `DELETE /api/v1/stores/{store_id}/pages/{id}` - delete
- [ ] Implement public page endpoint
  - [ ] `GET /api/v1/public/stores/{slug}/pages/{page_slug}`

#### Frontend
- [ ] Build CustomPagesPage
- [ ] Build PageList component
- [ ] Build PageEditor component (simple rich text or markdown)
- [ ] Add page links to storefront header/footer

### Phase 4.4: Premium Upgrade Flow

#### Backend
- [ ] Define subscription plans (Starter, Growth, Pro)
- [ ] Implement PayPal subscription integration
- [ ] Handle webhook for subscription events
- [ ] Update store premium flags on successful payment

#### Frontend
- [ ] Build UpgradePage with plan comparison
- [ ] Build pricing cards (Starter, Growth, Pro)
- [ ] Implement PayPal checkout button
- [ ] Handle subscription success/failure
- [ ] Update UI based on plan

---

## Track 5: Landing Page (Fully Parallel - No Dependencies)
**Branch:** `feature/landing`
**Worktree:** `/home/user/mywabiz-landing`

### Phase 5.1: Landing Page

- [ ] Build landing page layout
- [ ] Hero section
  - [ ] Headline: "Turn your WhatsApp into a proper store in 10 minutes"
  - [ ] Subtext with value proposition
  - [ ] Primary CTA: "Create your free store"
  - [ ] Secondary CTA: "View demo store"
  - [ ] Phone mockup illustration
- [ ] "How it works" section (3 steps with icons)
- [ ] "Who it's for" section (Delhi merchants cards)
- [ ] Features grid section (4 key features)
- [ ] Demo section (link to demo store, GIF/video)
- [ ] Pricing section (3 plan cards)
- [ ] FAQ section (accordion)
- [ ] Footer with links

---

## Track 6: Integration Phase (Sequential - After All Tracks)
**Branch:** `main`
**Worktree:** `/home/user/mywabiz`

### Phase 6.1: Merge & Resolve Conflicts

- [ ] Merge `feature/backend-core` into `main`
- [ ] Merge `feature/dashboard` into `main`
- [ ] Merge `feature/storefront` into `main`
- [ ] Merge `feature/premium` into `main`
- [ ] Merge `feature/landing` into `main`
- [ ] Resolve all merge conflicts
- [ ] Verify all imports and dependencies

### Phase 6.2: Integration Testing

- [ ] Test complete merchant onboarding flow
- [ ] Test product creation via UI
- [ ] Test Google Sheets sync
- [ ] Test complete buyer checkout flow
- [ ] Test WhatsApp redirect on mobile and desktop
- [ ] Test order tracking
- [ ] Test premium upgrade flow
- [ ] Test coupon application at checkout
- [ ] Test custom pages display

### Phase 6.3: Cross-Browser & Device Testing

- [ ] Chrome (desktop & mobile)
- [ ] Safari (desktop & iOS)
- [ ] Firefox (desktop)
- [ ] Edge (desktop)
- [ ] Test all 5 languages

### Phase 6.4: Performance & Polish

- [ ] Optimize MongoDB queries with proper indexes
- [ ] Implement image optimization (lazy loading, WebP)
- [ ] Add loading skeletons for better UX
- [ ] Implement error boundaries
- [ ] Add proper SEO meta tags to storefront pages
- [ ] Performance audit (Lighthouse)
- [ ] Accessibility audit (WCAG 2.1 AA)

### Phase 6.5: Launch Preparation

- [ ] Set up production MongoDB Atlas cluster
- [ ] Configure production environment variables
- [ ] Set up custom domain (mywabiz.in)
- [ ] Configure SSL certificates
- [ ] Set up monitoring and alerting (Sentry, Vercel Analytics)
- [ ] Create demo store with sample products
- [ ] Write initial FAQ content
- [ ] Final smoke test on production

---

## Completed Tracks

(Move tracks here as they are completed)

---

## Worktree Commands Reference

```bash
# Create worktrees (run from main repo)
git worktree add ../mywabiz-backend-core -b feature/backend-core
git worktree add ../mywabiz-dashboard -b feature/dashboard
git worktree add ../mywabiz-storefront -b feature/storefront
git worktree add ../mywabiz-premium -b feature/premium
git worktree add ../mywabiz-landing -b feature/landing

# List all worktrees
git worktree list

# Remove a worktree (after merging)
git worktree remove ../mywabiz-backend-core

# Prune stale worktrees
git worktree prune
```

---

## Notes & Decisions

| Date | Decision |
|------|----------|
| 2025-12-01 | Tech stack: FastAPI + React + MongoDB + Vercel |
| 2025-12-01 | Auth: Google OAuth only (no email/password) |
| 2025-12-01 | Sheets: Manual template copy (no auto-provision) |
| 2025-12-01 | Payments: PayPal for merchants, Cash/COD for customers |
| 2025-12-01 | Full product scope (including Premium features) |
| 2025-12-01 | Using git worktrees for parallel development |
| 2025-12-01 | 5 parallel tracks + 1 integration track |
