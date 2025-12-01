# Project Status: mywabiz

## Current Phase: Phase 1

---

## Phase 1: Project Scaffolding & Infrastructure

### Backend Setup
- [ ] Initialize FastAPI project with recommended structure (`app/api/v1/endpoints/...`)
- [ ] Configure MongoDB connection with Motor async driver
- [ ] Set up Pydantic settings for environment variables
- [ ] Create base models and schemas structure
- [ ] Set up CORS middleware for frontend communication
- [ ] Configure logging and error handling

### Frontend Setup
- [ ] Initialize React 18 + TypeScript + Vite project
- [ ] Configure Tailwind CSS with custom design tokens
- [ ] Set up folder structure (features, components, api, hooks, utils)
- [ ] Create Axios client with interceptors
- [ ] Set up React Router for routing
- [ ] Install and configure i18n (react-i18next)
- [ ] Create base UI components (Button, Input, Card, Modal, Toast)

### DevOps
- [ ] Set up Vercel project for frontend
- [ ] Configure Vercel serverless for FastAPI backend (or separate deployment)
- [ ] Set up MongoDB Atlas cluster
- [ ] Configure environment variables in Vercel
- [ ] Set up GitHub repository with branch protection

---

## Phase 2: Authentication & User Management

### Backend
- [ ] Implement Google OAuth 2.0 flow endpoints
  - [ ] `GET /api/v1/auth/google` - initiate OAuth
  - [ ] `GET /api/v1/auth/google/callback` - handle callback
  - [ ] `GET /api/v1/auth/me` - get current user
  - [ ] `POST /api/v1/auth/logout` - logout
- [ ] Create User model and schemas
- [ ] Implement JWT generation and validation
- [ ] Create authentication dependency (`get_current_user`)
- [ ] Set up httpOnly cookie-based session

### Frontend
- [ ] Create AuthProvider context
- [ ] Implement `useAuth` hook
- [ ] Build LoginButton component (Google OAuth)
- [ ] Build UserMenu component (avatar, logout)
- [ ] Create protected route wrapper
- [ ] Handle auth redirects and loading states

---

## Phase 3: Store Management (CRUD)

### Backend
- [ ] Create Store model and schemas (StoreCreate, StoreUpdate, StoreResponse)
- [ ] Implement store endpoints
  - [ ] `POST /api/v1/stores` - create store
  - [ ] `GET /api/v1/stores` - list user's stores
  - [ ] `GET /api/v1/stores/{store_id}` - get store
  - [ ] `PATCH /api/v1/stores/{store_id}` - update store
  - [ ] `DELETE /api/v1/stores/{store_id}` - delete store
- [ ] Implement unique slug generation
- [ ] Add owner authorization checks

### Frontend
- [ ] Create stores API module
- [ ] Build `useStores` hook
- [ ] Build store creation flow (basic form)
- [ ] Build store list view
- [ ] Build store settings page

---

## Phase 4: Onboarding Wizard

### Frontend
- [ ] Build OnboardingWizard container with step navigation
- [ ] Step 1: TemplateSelector component (7 template cards)
- [ ] Step 2: StoreBasicsForm (name, WhatsApp, language dropdown)
- [ ] Step 3: CatalogSetup (Google Sheets URL input or skip)
- [ ] Step 4: DesignPreview (basic branding controls)
- [ ] Implement progress indicator
- [ ] Handle wizard completion → redirect to dashboard

### Backend
- [ ] Create onboarding-specific endpoint (or use store creation endpoint)
- [ ] Validate and store template selection
- [ ] Store initial branding defaults based on template

---

## Phase 5: Product Management

### Backend
- [ ] Create Product model and schemas
- [ ] Implement product endpoints
  - [ ] `POST /api/v1/stores/{store_id}/products` - add product
  - [ ] `GET /api/v1/stores/{store_id}/products` - list products
  - [ ] `GET /api/v1/stores/{store_id}/products/{product_id}` - get product
  - [ ] `PATCH /api/v1/stores/{store_id}/products/{product_id}` - update
  - [ ] `DELETE /api/v1/stores/{store_id}/products/{product_id}` - delete
- [ ] Implement category filtering and pagination
- [ ] Add authorization checks (store ownership)

### Frontend
- [ ] Create products API module
- [ ] Build `useProducts` hook
- [ ] Build ProductsPage with list view
- [ ] Build ProductCard component
- [ ] Build ProductForm modal (create/edit)
- [ ] Build ImageUploader component
- [ ] Implement variant management (sizes, colors)

---

## Phase 6: Google Sheets Integration

### Backend
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

### Frontend
- [ ] Build SheetSyncPanel component
  - [ ] Sheet URL input field
  - [ ] "Open Sheet" button (external link)
  - [ ] "Force Sync" button with loading state
  - [ ] Last synced timestamp display
  - [ ] Sync error display
- [ ] Build `useSheetSync` hook
- [ ] Show "Last edited in Sheet/Dashboard" indicator on products

---

## Phase 7: Store Design & Branding

### Backend
- [ ] Update Store model with branding and section fields (already in schema)
- [ ] Handle logo and banner image uploads (Cloudinary or S3)
- [ ] Implement store update with branding fields

### Frontend
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
- [ ] Implement real-time preview updates

---

## Phase 8: Public Storefront (Buyer-Facing)

### Backend
- [ ] Implement public endpoints (no auth required)
  - [ ] `GET /api/v1/public/stores/{slug}` - get store
  - [ ] `GET /api/v1/public/stores/{slug}/products` - list products
  - [ ] `GET /api/v1/public/stores/{slug}/products/{product_id}` - get product
- [ ] Track page visits for analytics

### Frontend
- [ ] Build storefront layout with store branding
- [ ] Build Header component (logo, store name)
- [ ] Build Banner component (conditional)
- [ ] Build CategoryChips component (filter by category)
- [ ] Build ProductGrid component (responsive 2/3/4 columns)
- [ ] Build ProductCard component (storefront version)
- [ ] Build ProductDetail page
  - [ ] Image gallery
  - [ ] VariantSelector (size, color chips)
  - [ ] Quantity selector
  - [ ] "Add to order" button
- [ ] Build Footer component

---

## Phase 9: Cart & Checkout

### Frontend
- [ ] Build `useCart` hook (localStorage-based cart state)
- [ ] Build cart summary component
- [ ] Build CheckoutPage
  - [ ] OrderSummary component (line items, totals)
  - [ ] CheckoutForm component
    - [ ] Name input (required)
    - [ ] Phone input (required)
    - [ ] Email input (optional)
    - [ ] Address textarea
    - [ ] Custom fields (if configured)
  - [ ] Shipping method selector (Pickup/Delivery)
  - [ ] "Place order on WhatsApp" CTA button

### Backend
- [ ] Create Order model and schemas
- [ ] Implement order creation endpoint
  - [ ] `POST /api/v1/stores/{store_id}/orders`
  - [ ] Validate products and stock
  - [ ] Calculate totals (subtotal, shipping, discount, total)
  - [ ] Generate order number (sequential per store)
  - [ ] Generate track_token (UUID)
  - [ ] Generate WhatsApp message
  - [ ] Return whatsapp_url

---

## Phase 10: WhatsApp Message Generation & i18n

### Backend
- [ ] Create i18n dictionaries for all 5 languages
  - [ ] English (en)
  - [ ] Hindi (hi)
  - [ ] Punjabi (pa)
  - [ ] Haryanvi (hr)
  - [ ] Gujarati (gu)
- [ ] Build WhatsApp message generator service
  - [ ] Load store language
  - [ ] Build message from template with localized labels
  - [ ] URL-encode message
  - [ ] Generate wa.me URL
- [ ] Store generated message in order record

### Frontend
- [ ] Set up i18n dictionaries (mirror backend)
- [ ] Implement language context for storefront
- [ ] Apply translations to all storefront UI labels
- [ ] Build WhatsApp redirect handler
- [ ] Build fallback UI (copy message if WA doesn't open)

---

## Phase 11: Order Confirmation & Tracking

### Backend
- [ ] Implement order tracking endpoint
  - [ ] `GET /api/v1/orders/track/{track_token}` (public)
- [ ] Implement merchant order management
  - [ ] `GET /api/v1/stores/{store_id}/orders` - list orders
  - [ ] `GET /api/v1/stores/{store_id}/orders/{order_id}` - get order
  - [ ] `PATCH /api/v1/stores/{store_id}/orders/{order_id}` - update status

### Frontend (Buyer)
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

### Frontend (Merchant Dashboard)
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

---

## Phase 12: Merchant Dashboard & Analytics

### Backend
- [ ] Implement analytics aggregation
  - [ ] `GET /api/v1/stores/{store_id}/stats?timeframe=7d`
  - [ ] Calculate orders_count, sales_total, visits
- [ ] Create analytics_snapshots collection (daily aggregation job)

### Frontend
- [ ] Build DashboardPage layout
- [ ] Build StatsCards component (Orders, Sales, Visits)
- [ ] Build QuickActions component (Add product, Design, Share, Upgrade)
- [ ] Build RecentOrders component (last 5-10 orders)
- [ ] Implement timeframe filter (Today, 7 days, 30 days)

---

## Phase 13: Coupons (Premium Feature)

### Backend
- [ ] Create Coupon model and schemas
- [ ] Implement premium feature gate
- [ ] Implement coupon endpoints
  - [ ] `POST /api/v1/stores/{store_id}/coupons` - create
  - [ ] `GET /api/v1/stores/{store_id}/coupons` - list
  - [ ] `PATCH /api/v1/stores/{store_id}/coupons/{id}` - update
  - [ ] `DELETE /api/v1/stores/{store_id}/coupons/{id}` - delete
  - [ ] `POST /api/v1/stores/{store_id}/coupons/validate` - validate at checkout

### Frontend
- [ ] Build CouponsPage
- [ ] Build PremiumGate component (upsell for Starter users)
- [ ] Build CouponList component
- [ ] Build CouponForm modal
  - [ ] Code input
  - [ ] Discount type selector (Flat/Percent)
  - [ ] Value input
  - [ ] Date range picker
  - [ ] Usage limit input
- [ ] Add coupon input to checkout flow
- [ ] Display discount in order summary

---

## Phase 14: Custom Pages (Premium Feature)

### Backend
- [ ] Create CustomPage model and schemas
- [ ] Implement premium feature gate
- [ ] Implement page endpoints
  - [ ] `POST /api/v1/stores/{store_id}/pages` - create
  - [ ] `GET /api/v1/stores/{store_id}/pages` - list
  - [ ] `GET /api/v1/stores/{store_id}/pages/{id}` - get
  - [ ] `PATCH /api/v1/stores/{store_id}/pages/{id}` - update
  - [ ] `DELETE /api/v1/stores/{store_id}/pages/{id}` - delete
- [ ] Implement public page endpoint
  - [ ] `GET /api/v1/public/stores/{slug}/pages/{page_slug}`

### Frontend
- [ ] Build CustomPagesPage
- [ ] Build PremiumGate component (reuse from coupons)
- [ ] Build PageList component
- [ ] Build PageEditor component (simple rich text or markdown)
- [ ] Add page links to storefront header/footer

---

## Phase 15: Settings & Payments

### Backend
- [ ] Implement shipping settings update
- [ ] Implement PayPal configuration storage
- [ ] Validate PayPal credentials (optional)

### Frontend
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

## Phase 16: Premium Upgrade Flow

### Backend
- [ ] Define subscription plans (Starter, Growth, Pro)
- [ ] Implement PayPal subscription integration (or Razorpay)
- [ ] Handle webhook for subscription events
- [ ] Update store premium flags on successful payment

### Frontend
- [ ] Build UpgradePage with plan comparison
- [ ] Build pricing cards (Starter, Growth, Pro)
- [ ] Implement PayPal checkout button
- [ ] Handle subscription success/failure
- [ ] Update UI based on plan

---

## Phase 17: Landing Page

### Frontend
- [ ] Build landing page layout
- [ ] Hero section (headline, subtext, CTAs, phone mockup)
- [ ] "How it works" section (3 steps)
- [ ] "Who it's for" section (Delhi merchants cards)
- [ ] Features grid section
- [ ] Demo section (link to demo store)
- [ ] Pricing section (3 plans)
- [ ] FAQ section
- [ ] Footer

---

## Phase 18: Testing & QA

- [ ] Write unit tests for backend services
- [ ] Write unit tests for critical frontend components
- [ ] End-to-end testing with Playwright or Cypress
  - [ ] Complete merchant onboarding flow
  - [ ] Product creation via UI
  - [ ] Google Sheets sync
  - [ ] Buyer checkout flow
  - [ ] WhatsApp redirect
  - [ ] Order tracking
- [ ] Cross-browser testing (Chrome, Safari, Firefox)
- [ ] Mobile responsiveness testing
- [ ] i18n testing (all 5 languages)

---

## Phase 19: Performance & Polish

- [ ] Optimize MongoDB queries with proper indexes
- [ ] Implement image optimization (lazy loading, WebP)
- [ ] Add loading skeletons for better UX
- [ ] Implement error boundaries
- [ ] Add proper SEO meta tags to storefront pages
- [ ] Performance audit (Lighthouse)
- [ ] Accessibility audit (WCAG 2.1 AA)

---

## Phase 20: Launch Preparation

- [ ] Set up production MongoDB Atlas cluster
- [ ] Configure production environment variables
- [ ] Set up custom domain (mywabiz.in)
- [ ] Configure SSL certificates
- [ ] Set up monitoring and alerting (Sentry, Vercel Analytics)
- [ ] Create demo store with sample products
- [ ] Write initial FAQ content
- [ ] Prepare launch announcement

---

## Completed Phases

(Move phases here as they are completed)

---

## Notes & Decisions

| Date | Decision |
|------|----------|
| 2025-12-01 | Tech stack: FastAPI + React + MongoDB + Vercel |
| 2025-12-01 | Auth: Google OAuth only (no email/password) |
| 2025-12-01 | Sheets: Manual template copy (no auto-provision) |
| 2025-12-01 | Payments: PayPal for merchants, Cash/COD for customers |
| 2025-12-01 | Full product scope (including Premium features) |
