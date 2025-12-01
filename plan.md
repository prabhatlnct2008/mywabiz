# Implementation Plan: mywabiz

## 1. System Overview

**mywabiz** is a WhatsApp-first store builder enabling small merchants (primarily Delhi/NCR) to create storefronts, manage catalogs via Google Sheets or in-app UI, and receive structured orders directly in WhatsApp.

### Core Value Proposition
- Spin up a WhatsApp-first storefront in 10 minutes
- Google Sheets-driven product catalog (or in-app management)
- Fast mobile checkout with WhatsApp order handoff
- Multi-language support (English, Hindi, Punjabi, Haryanvi, Gujarati)

### Tech Stack
| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript + Tailwind CSS |
| Backend | FastAPI (Python 3.11+) |
| Database | MongoDB (via Motor async driver) |
| Auth | Google OAuth 2.0 |
| Payments | PayPal (merchant setup), Cash/COD (customer orders) |
| Hosting | Vercel (Frontend + Serverless Functions) |
| Catalog Sync | Google Sheets API v4 (manual template copy) |

---

## 2. Architecture Specification

### 2.1 Database Models (MongoDB Collections)

#### **users** (Merchants)
```javascript
{
  _id: ObjectId,
  google_id: String,           // Google OAuth subject ID
  email: String,
  name: String,
  avatar_url: String,
  created_at: DateTime,
  updated_at: DateTime
}
```

#### **stores**
```javascript
{
  _id: ObjectId,
  owner_id: ObjectId,          // FK -> users._id
  name: String,
  slug: String,                // unique, for URL: {slug}.mywabiz.in
  url: String,                 // full store URL
  whatsapp_number: String,     // merchant's WhatsApp for orders
  language: Enum("en", "hi", "pa", "hr", "gu"),
  template: Enum("multi-purpose", "quick-order", "wholesale", "digital-download", "service-booking", "links-list", "blank"),

  // Branding
  branding: {
    logo_url: String,
    brand_color: String,       // hex color, default #22C55E
    banner_url: String,
    banner_text: String
  },

  // Section toggles
  sections: {
    header: Boolean,           // default true
    banner: Boolean,           // default false
    products: Boolean,         // default true
    footer: Boolean            // default true
  },

  // Theme
  theme: Enum("minimal", "bold", "dark"),  // default "minimal"

  // Premium flags
  premium: {
    plan: Enum("starter", "growth", "pro"),  // default "starter"
    coupons_enabled: Boolean,
    custom_pages_enabled: Boolean,
    branding_removal: Boolean,
    product_limit: Number      // 50 for starter, 500 for growth, unlimited for pro
  },

  // Google Sheets integration
  sheets_config: {
    sheet_id: String,          // Google Sheet ID (from URL)
    sheet_url: String,
    last_synced_at: DateTime,
    sync_status: Enum("idle", "syncing", "error"),
    sync_error: String
  },

  // Shipping config
  shipping: {
    pickup_enabled: Boolean,
    pickup_address: String,
    delivery_enabled: Boolean,
    delivery_fee: Number,      // in INR
    delivery_zones: [String]   // optional
  },

  // Payment config
  payments: {
    cod_enabled: Boolean,      // default true
    paypal_enabled: Boolean,
    paypal_client_id: String
  },

  created_at: DateTime,
  updated_at: DateTime
}
```

#### **products**
```javascript
{
  _id: ObjectId,
  store_id: ObjectId,          // FK -> stores._id
  name: String,
  category: String,
  price: Number,               // in store currency (INR)
  description: String,

  // Variants
  sizes: [String],             // e.g., ["S", "M", "L", "XL"]
  colors: [String],            // e.g., ["Red", "Blue", "Black"]
  tags: [String],
  brand: String,

  // Stock
  stock: Number,               // -1 for unlimited
  availability: Enum("show", "hide"),

  // Images
  thumbnail_url: String,
  image_urls: [String],

  // Sync tracking
  sheet_row_index: Number,     // row number if from Google Sheet
  last_updated_source: Enum("sheet", "dashboard"),

  created_at: DateTime,
  updated_at: DateTime
}
```

#### **orders**
```javascript
{
  _id: ObjectId,
  store_id: ObjectId,          // FK -> stores._id
  order_number: String,        // sequential per store, e.g., "10001"

  // Customer info
  customer: {
    name: String,
    email: String,
    phone: String,
    address: String,
    custom_fields: Object      // dynamic key-value pairs
  },

  // Order items
  items: [{
    product_id: ObjectId,
    name: String,              // snapshot at order time
    size: String,
    color: String,
    quantity: Number,
    unit_price: Number,
    line_total: Number
  }],

  // Pricing
  currency: String,            // default "INR"
  subtotal: Number,
  shipping_method: Enum("pickup", "delivery"),
  shipping_fee: Number,
  discount_amount: Number,     // from coupon
  coupon_code: String,
  total: Number,

  // Payment
  payment_method: Enum("cash", "paypal"),
  payment_status: Enum("pending", "paid", "failed"),
  paypal_order_id: String,

  // Status tracking
  status: Enum("initiated", "sent_to_whatsapp", "confirmed", "shipped", "delivered", "cancelled"),

  // Tracking
  track_token: String,         // UUID for public tracking URL

  // WhatsApp
  whatsapp_message: String,    // generated message stored for reference

  created_at: DateTime,
  updated_at: DateTime
}
```

#### **coupons** (Premium)
```javascript
{
  _id: ObjectId,
  store_id: ObjectId,          // FK -> stores._id
  code: String,                // unique per store
  type: Enum("flat", "percent"),
  value: Number,               // amount or percentage

  // Validity
  status: Enum("active", "expired", "disabled"),
  start_at: DateTime,
  end_at: DateTime,

  // Usage limits
  usage_limit: Number,         // -1 for unlimited
  used_count: Number,

  // Minimum order
  min_order_amount: Number,

  created_at: DateTime,
  updated_at: DateTime
}
```

#### **custom_pages** (Premium)
```javascript
{
  _id: ObjectId,
  store_id: ObjectId,          // FK -> stores._id
  title: String,
  slug: String,                // for URL: store.mywabiz.in/pages/{slug}
  content: String,             // HTML or Markdown
  is_published: Boolean,
  display_in: Enum("header", "footer", "both"),
  sort_order: Number,

  created_at: DateTime,
  updated_at: DateTime
}
```

#### **analytics_snapshots**
```javascript
{
  _id: ObjectId,
  store_id: ObjectId,
  date: Date,                  // day granularity

  orders_count: Number,
  sales_total: Number,
  visits: Number,
  unique_visitors: Number,

  // Top products (denormalized for quick reads)
  top_products: [{
    product_id: ObjectId,
    name: String,
    orders: Number,
    revenue: Number
  }],

  created_at: DateTime
}
```

---

### 2.2 API Contract (FastAPI)

#### Authentication Endpoints
| Method | Endpoint | Request | Response | Description |
|--------|----------|---------|----------|-------------|
| GET | `/api/v1/auth/google` | - | Redirect | Initiates Google OAuth flow |
| GET | `/api/v1/auth/google/callback` | code, state | `AuthResponse` | OAuth callback, returns JWT |
| GET | `/api/v1/auth/me` | - | `UserResponse` | Get current user |
| POST | `/api/v1/auth/logout` | - | 200 OK | Invalidate session |

#### Store Endpoints
| Method | Endpoint | Request | Response | Description |
|--------|----------|---------|----------|-------------|
| POST | `/api/v1/stores` | `StoreCreate` | `StoreResponse` | Create new store |
| GET | `/api/v1/stores` | - | `[StoreResponse]` | List user's stores |
| GET | `/api/v1/stores/{store_id}` | - | `StoreResponse` | Get store details |
| PATCH | `/api/v1/stores/{store_id}` | `StoreUpdate` | `StoreResponse` | Update store |
| DELETE | `/api/v1/stores/{store_id}` | - | 204 | Delete store |
| GET | `/api/v1/stores/{store_id}/stats` | timeframe | `StoreStats` | Get analytics |

#### Product Endpoints
| Method | Endpoint | Request | Response | Description |
|--------|----------|---------|----------|-------------|
| POST | `/api/v1/stores/{store_id}/products` | `ProductCreate` | `ProductResponse` | Add product |
| GET | `/api/v1/stores/{store_id}/products` | category, page | `[ProductResponse]` | List products |
| GET | `/api/v1/stores/{store_id}/products/{product_id}` | - | `ProductResponse` | Get product |
| PATCH | `/api/v1/stores/{store_id}/products/{product_id}` | `ProductUpdate` | `ProductResponse` | Update product |
| DELETE | `/api/v1/stores/{store_id}/products/{product_id}` | - | 204 | Delete product |
| POST | `/api/v1/stores/{store_id}/products/sync` | - | `SyncResponse` | Force sync from Google Sheet |

#### Order Endpoints
| Method | Endpoint | Request | Response | Description |
|--------|----------|---------|----------|-------------|
| POST | `/api/v1/stores/{store_id}/orders` | `OrderCreate` | `OrderResponse` | Create order + get WA URL |
| GET | `/api/v1/stores/{store_id}/orders` | status, page | `[OrderResponse]` | List orders (merchant) |
| GET | `/api/v1/stores/{store_id}/orders/{order_id}` | - | `OrderResponse` | Get order details |
| PATCH | `/api/v1/stores/{store_id}/orders/{order_id}` | `OrderUpdate` | `OrderResponse` | Update order status |
| GET | `/api/v1/orders/track/{track_token}` | - | `OrderTrackingResponse` | Public order tracking |

#### Coupon Endpoints (Premium)
| Method | Endpoint | Request | Response | Description |
|--------|----------|---------|----------|-------------|
| POST | `/api/v1/stores/{store_id}/coupons` | `CouponCreate` | `CouponResponse` | Create coupon |
| GET | `/api/v1/stores/{store_id}/coupons` | - | `[CouponResponse]` | List coupons |
| PATCH | `/api/v1/stores/{store_id}/coupons/{coupon_id}` | `CouponUpdate` | `CouponResponse` | Update coupon |
| DELETE | `/api/v1/stores/{store_id}/coupons/{coupon_id}` | - | 204 | Delete coupon |
| POST | `/api/v1/stores/{store_id}/coupons/validate` | `{code, subtotal}` | `CouponValidation` | Validate coupon for checkout |

#### Custom Pages Endpoints (Premium)
| Method | Endpoint | Request | Response | Description |
|--------|----------|---------|----------|-------------|
| POST | `/api/v1/stores/{store_id}/pages` | `PageCreate` | `PageResponse` | Create page |
| GET | `/api/v1/stores/{store_id}/pages` | - | `[PageResponse]` | List pages |
| GET | `/api/v1/stores/{store_id}/pages/{page_id}` | - | `PageResponse` | Get page |
| PATCH | `/api/v1/stores/{store_id}/pages/{page_id}` | `PageUpdate` | `PageResponse` | Update page |
| DELETE | `/api/v1/stores/{store_id}/pages/{page_id}` | - | 204 | Delete page |

#### Public Storefront Endpoints (No Auth)
| Method | Endpoint | Request | Response | Description |
|--------|----------|---------|----------|-------------|
| GET | `/api/v1/public/stores/{slug}` | - | `PublicStoreResponse` | Get store for storefront |
| GET | `/api/v1/public/stores/{slug}/products` | category | `[PublicProductResponse]` | Get products for storefront |
| GET | `/api/v1/public/stores/{slug}/products/{product_id}` | - | `PublicProductResponse` | Get product detail |
| GET | `/api/v1/public/stores/{slug}/pages/{page_slug}` | - | `PublicPageResponse` | Get custom page |

---

### 2.3 Frontend Modules

```
src/
├── api/                          # API client layer
│   ├── client.ts                 # Axios instance with interceptors
│   ├── auth.ts                   # Auth API calls
│   ├── stores.ts                 # Store API calls
│   ├── products.ts               # Product API calls
│   ├── orders.ts                 # Order API calls
│   ├── coupons.ts                # Coupon API calls
│   └── pages.ts                  # Custom pages API calls
│
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginButton.tsx
│   │   │   └── UserMenu.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   └── AuthProvider.tsx
│   │
│   ├── onboarding/
│   │   ├── components/
│   │   │   ├── TemplateSelector.tsx
│   │   │   ├── StoreBasicsForm.tsx
│   │   │   ├── CatalogSetup.tsx
│   │   │   └── DesignPreview.tsx
│   │   ├── hooks/
│   │   │   └── useOnboarding.ts
│   │   └── OnboardingWizard.tsx
│   │
│   ├── dashboard/
│   │   ├── components/
│   │   │   ├── StatsCards.tsx
│   │   │   ├── QuickActions.tsx
│   │   │   └── RecentOrders.tsx
│   │   └── DashboardPage.tsx
│   │
│   ├── products/
│   │   ├── components/
│   │   │   ├── ProductList.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductForm.tsx
│   │   │   ├── SheetSyncPanel.tsx
│   │   │   └── ImageUploader.tsx
│   │   ├── hooks/
│   │   │   ├── useProducts.ts
│   │   │   └── useSheetSync.ts
│   │   └── ProductsPage.tsx
│   │
│   ├── store-design/
│   │   ├── components/
│   │   │   ├── BrandingControls.tsx
│   │   │   ├── SectionToggles.tsx
│   │   │   ├── ThemeSelector.tsx
│   │   │   ├── LanguageSelector.tsx
│   │   │   └── LivePreview.tsx
│   │   └── StoreDesignPage.tsx
│   │
│   ├── orders/
│   │   ├── components/
│   │   │   ├── OrderList.tsx
│   │   │   ├── OrderRow.tsx
│   │   │   ├── OrderDetail.tsx
│   │   │   └── StatusBadge.tsx
│   │   ├── hooks/
│   │   │   └── useOrders.ts
│   │   └── OrdersPage.tsx
│   │
│   ├── coupons/
│   │   ├── components/
│   │   │   ├── CouponList.tsx
│   │   │   ├── CouponForm.tsx
│   │   │   └── PremiumGate.tsx
│   │   └── CouponsPage.tsx
│   │
│   ├── custom-pages/
│   │   ├── components/
│   │   │   ├── PageList.tsx
│   │   │   ├── PageEditor.tsx
│   │   │   └── PremiumGate.tsx
│   │   └── CustomPagesPage.tsx
│   │
│   ├── settings/
│   │   ├── components/
│   │   │   ├── StoreDetails.tsx
│   │   │   ├── ShippingSettings.tsx
│   │   │   ├── PaymentSettings.tsx
│   │   │   └── DangerZone.tsx
│   │   └── SettingsPage.tsx
│   │
│   └── storefront/                # Buyer-facing (public)
│       ├── components/
│       │   ├── Header.tsx
│       │   ├── Banner.tsx
│       │   ├── CategoryChips.tsx
│       │   ├── ProductGrid.tsx
│       │   ├── ProductCard.tsx
│       │   ├── ProductDetail.tsx
│       │   ├── VariantSelector.tsx
│       │   ├── CheckoutForm.tsx
│       │   ├── OrderSummary.tsx
│       │   ├── OrderConfirmation.tsx
│       │   ├── OrderTracking.tsx
│       │   └── Footer.tsx
│       ├── hooks/
│       │   ├── useStore.ts
│       │   ├── useCart.ts
│       │   └── useCheckout.ts
│       └── pages/
│           ├── StorefrontPage.tsx
│           ├── ProductPage.tsx
│           ├── CheckoutPage.tsx
│           ├── ConfirmationPage.tsx
│           └── TrackingPage.tsx
│
├── components/                    # Shared UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Select.tsx
│   ├── Modal.tsx
│   ├── Card.tsx
│   ├── Chip.tsx
│   ├── Toast.tsx
│   ├── Spinner.tsx
│   ├── EmptyState.tsx
│   └── Layout/
│       ├── DashboardLayout.tsx
│       ├── Sidebar.tsx
│       └── TopBar.tsx
│
├── i18n/                          # Internationalization
│   ├── index.ts
│   ├── en.json
│   ├── hi.json
│   ├── pa.json
│   ├── hr.json
│   └── gu.json
│
├── hooks/                         # Global hooks
│   ├── useLocalStorage.ts
│   └── useMediaQuery.ts
│
├── utils/
│   ├── formatCurrency.ts
│   ├── formatDate.ts
│   ├── generateWhatsAppUrl.ts
│   └── validators.ts
│
└── types/
    ├── store.ts
    ├── product.ts
    ├── order.ts
    ├── coupon.ts
    └── user.ts
```

---

## 3. Implementation Details

### 3.1 Google Sheets Integration

**Flow:**
1. Merchant copies provided template sheet to their Google Drive
2. Merchant pastes the Sheet URL into mywabiz dashboard
3. System extracts Sheet ID from URL and stores in `stores.sheets_config.sheet_id`
4. On "Force Sync":
   - Backend fetches sheet data via Google Sheets API v4 (using service account)
   - Parses rows (skip header, validate required fields: Name, Price)
   - Upserts products in MongoDB (match by `sheet_row_index`)
   - Invalid rows are logged but not imported

**Template Sheet Headers:**
| Name | Category | Price | Description | Size | Color | Tag | Brand | Stock | Availability | Thumbnail | Image1 | Image2 | Image3 |

**Conflict Resolution:**
- `last_updated_source` tracks whether last edit was "sheet" or "dashboard"
- UI displays source indicator
- Last write wins (no merge logic in v1)

### 3.2 WhatsApp Message Generation

**Process:**
1. Order created via `/api/v1/stores/{store_id}/orders`
2. Backend builds canonical order object
3. Loads i18n labels for store's language
4. Generates message from template
5. URL-encodes message
6. Returns `whatsapp_url`: `https://wa.me/{merchant_phone}?text={encoded_message}`
7. Frontend redirects to this URL

**Fallback:**
- If WhatsApp doesn't open, show message text with "Copy to clipboard" button

### 3.3 i18n Dictionary Structure

```json
{
  "storefront": {
    "add_to_order": "Add to order",
    "checkout": "Checkout",
    "place_order_whatsapp": "Place order on WhatsApp",
    "name": "Name",
    "phone": "Phone",
    "address": "Address",
    "pickup": "Pickup",
    "delivery": "Delivery",
    "order_placed": "Order placed!",
    "track_order": "Track your order"
  },
  "whatsapp_message": {
    "order_from": "Order from",
    "order_number": "Order Number",
    "date": "Date",
    "products": "Products",
    "shipping": "Shipping",
    "payment_method": "Payment Method",
    "total": "Total",
    "track_at": "You can track your order at"
  }
}
```

### 3.4 Authentication Flow (Google OAuth)

1. User clicks "Login with Google"
2. Frontend redirects to `/api/v1/auth/google`
3. Backend redirects to Google OAuth consent screen
4. User approves, Google redirects to `/api/v1/auth/google/callback`
5. Backend:
   - Exchanges code for tokens
   - Fetches user profile from Google
   - Upserts user in MongoDB
   - Generates JWT (stored in httpOnly cookie)
6. Redirects to dashboard

### 3.5 Premium Feature Gating

**Check Logic:**
```python
def require_premium_feature(store: Store, feature: str):
    if store.premium.plan == "starter":
        raise HTTPException(403, f"{feature} requires Growth or Pro plan")
```

**Features by Plan:**
| Feature | Starter | Growth | Pro |
|---------|---------|--------|-----|
| Products | 50 | 500 | Unlimited |
| Coupons | No | Yes | Yes |
| Custom Pages | No | Yes | Yes |
| Branding Removal | No | Yes | Yes |
| Analytics | Basic | Basic | Advanced |
| Staff Logins | 1 | 1 | 3 |

### 3.6 Visual Design Tokens

```css
/* Colors */
--color-primary: #22C55E;
--color-primary-hover: #16A34A;
--color-accent: #F97316;
--color-text-dark: #111827;
--color-text-secondary: #6B7280;
--color-bg: #F9FAFB;
--color-card: #FFFFFF;
--color-border: #E5E7EB;

/* Typography */
--font-heading: 'Poppins', sans-serif;
--font-body: 'Inter', sans-serif;

/* Spacing */
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-full: 9999px;

/* Shadows */
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px rgba(0,0,0,0.1);
```

---

## 4. Third-Party Integrations

| Service | Purpose | SDK/API |
|---------|---------|---------|
| Google OAuth | Merchant authentication | `google-auth-oauthlib` |
| Google Sheets API v4 | Catalog sync | `google-api-python-client` |
| PayPal | Merchant payments (Premium) | PayPal REST API |
| MongoDB Atlas | Database | `motor` (async) |
| Vercel | Hosting | Vercel CLI / GitHub integration |
| Cloudinary / S3 | Image storage | SDK |

---

## 5. Environment Variables

```env
# MongoDB
MONGODB_URI=mongodb+srv://...

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=https://api.mywabiz.in/api/v1/auth/google/callback

# Google Sheets (Service Account)
GOOGLE_SERVICE_ACCOUNT_JSON={"type": "service_account", ...}

# PayPal
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
PAYPAL_MODE=sandbox  # or live

# JWT
JWT_SECRET=...
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=168  # 7 days

# App
FRONTEND_URL=https://mywabiz.in
API_URL=https://api.mywabiz.in
```

---

## 6. Indexes (MongoDB)

```javascript
// users
db.users.createIndex({ google_id: 1 }, { unique: true })
db.users.createIndex({ email: 1 }, { unique: true })

// stores
db.stores.createIndex({ owner_id: 1 })
db.stores.createIndex({ slug: 1 }, { unique: true })

// products
db.products.createIndex({ store_id: 1, category: 1 })
db.products.createIndex({ store_id: 1, availability: 1 })

// orders
db.orders.createIndex({ store_id: 1, created_at: -1 })
db.orders.createIndex({ store_id: 1, status: 1 })
db.orders.createIndex({ track_token: 1 }, { unique: true })

// coupons
db.coupons.createIndex({ store_id: 1, code: 1 }, { unique: true })
db.coupons.createIndex({ store_id: 1, status: 1 })

// analytics_snapshots
db.analytics_snapshots.createIndex({ store_id: 1, date: -1 })
```
