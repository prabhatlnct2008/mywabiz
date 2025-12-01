mywabiz – WhatsApp Store Builder

0. Purpose of This Document

This document consolidates:
	•	The product specification for mywabiz (WhatsApp-first store builder)
	•	Multi-language support (English, Hindi, Punjabi, Haryanvi, Gujarati)
	•	WhatsApp order message generation logic
	•	User stories & epics
	•	Screen-by-screen UX description
	•	Landing page structure & copy
	•	Visual design (color, fonts, components)
	•	Pricing & packaging (with focus on Delhi/NCR small merchants)

You can give this document to design, development, and marketing as a shared source of truth.

⸻

1. Product Overview & Positioning

Product name: mywabiz
Tagline (external):

Turn your WhatsApp into a proper store in 10 minutes.

1.1 Goal & Value
	•	Enable small merchants to spin up a WhatsApp-first storefront in minutes.
	•	Let them sell via a shareable link and collect orders directly in WhatsApp.
	•	Remove manual, unstructured chat-work by providing:
	•	A templated storefront
	•	Google Sheets–driven product catalog (or in-app catalog)
	•	Fast mobile checkout
	•	Automated WhatsApp order handoff with structured messages

1.2 Primary Users & Roles
	1.	Merchant (store owner)
	•	Creates store
	•	Manages catalog via Google Sheets or in-app UI
	•	Customizes design & language
	•	Configures checkout, shipping, and payments
	•	Shares store link
	•	Monitors orders & analytics
	2.	Buyer (customer)
	•	Browses storefront
	•	Filters/selects products & variants
	•	Completes checkout form
	•	Places order through WhatsApp handoff
	•	Uses tracking link to see basic order status

1.3 Delhi/NCR Target Persona (Examples)
	•	Clothing & boutique owners (Lajpat Nagar, Sarojini-type, Instagram sellers)
	•	Kirana & neighborhood grocery shops
	•	Home chefs & tiffin services
	•	Mobile accessories, cosmetics, gifts, footwear sellers
	•	Small wholesalers doing B2B via WhatsApp

Core pitch:

“If your customers already message you on WhatsApp, mywabiz turns that chaos into clean, structured orders.”

⸻

2. Core Journeys (Happy Path)
	1.	Onboard & create store
	•	Merchant signs up, picks a template, chooses store language, names store, sets WhatsApp number.
	•	System generates a store URL (e.g., https://store42799.mywabiz.in).
	2.	Publish catalog
	•	System provisions a Google Sheet with predefined headers.
	•	Merchant fills or edits rows in Google Sheet or adds products via in-app UI.
	•	Merchant triggers Force Sync Products or waits for auto-sync.
	3.	Design storefront
	•	Merchant toggles sections (Header, Banner, All products, Footer).
	•	Uploads logo, sets brand color, chooses theme and language.
	•	Previews on desktop and mobile.
	4.	Customer checkout to WhatsApp
	•	Buyer browses catalog, opens product, selects variants, adds to order.
	•	Fills checkout fields (Name, Phone, Address, etc.).
	•	Selects shipping method (Pickup / Delivery).
	•	Sees order summary (Subtotal, Shipping, Total), then clicks “Place order on WhatsApp”.
	•	System logs the order and generates a language-specific WhatsApp message.
	•	Buyer is redirected to WhatsApp with order pre-filled.
	5.	Operate store & track orders
	•	Merchant shares link via WhatsApp, Instagram, Facebook, QR code, etc.
	•	Merchant uses dashboard to view orders, basic analytics, and settings.
	•	Buyer can view an order confirmation page with tracking link.

⸻

3. Multi-Language Support

3.1 Store Language

Each store has one primary language that affects:
	•	Storefront UI labels (buttons, checkout labels, messages)
	•	System messages on order confirmation & tracking pages
	•	System labels in the WhatsApp order message

Supported languages:
	•	English (en)
	•	Hindi (hi)
	•	Punjabi (pa)
	•	Haryanvi (hr)
	•	Gujarati (gu)

Data model field:

Store.language: enum("en", "hi", "pa", "hr", "gu")

Product names, descriptions, and any text entered by the merchant can be in any language or mix—they are not automatically translated.

3.2 Language Selection in Onboarding

Onboarding Step: Store Basics
	•	Inputs:
	•	Store name
	•	WhatsApp number
	•	Store language (dropdown)

Label & helper text:
	•	Label: “Store language”
	•	Helper text:
“We’ll show your store buttons & messages in this language. You can change it later from settings.”

Dropdown options (display text):
	•	English
	•	हिंदी (Hindi)
	•	ਪੰਜਾਬੀ (Punjabi)
	•	हरियाणवी (Haryanvi)
	•	ગુજરાતી (Gujarati)

3.3 Where Language Is Applied
	1.	Storefront UI
	•	Buttons: e.g., “Add to order”, “Checkout”, “Place order on WhatsApp”
	•	Labels: “Name”, “Phone”, “Address”, “Pickup”, “Delivery”, etc.
	•	Empty states: e.g., “No products yet”
	•	Confirmation copy: “Order placed!”, “Track your order”, etc.
	2.	Order confirmation & tracking pages
	•	“Order number”, “Status”, “Placed”, “Shipped”, etc.
	3.	WhatsApp order message
	•	System labels like “Order from”, “Order Number”, “Products”, “Shipping”, “Payment Method”, “Total”, and the tracking line.

Currency, prices, and product text remain as is.

3.4 Implementation (High Level)
	•	Maintain one i18n dictionary per language.
	•	On each request, read store.language and pick the right dictionary.
	•	All system text (buttons, labels, WhatsApp message labels) must come from the translation dictionary.

⸻

4. WhatsApp Order Message Generation

4.1 Data Flow
	1.	Buyer completes checkout and clicks “Place order on WhatsApp”.
	2.	Frontend sends order payload to backend:
	•	store_id
	•	Cart items (product IDs, variants, quantity)
	•	Customer details (name, email, phone, address, custom fields)
	•	Shipping method
	•	Currency & calculated totals
	3.	Backend:
	•	Validates products & stock
	•	Calculates subtotal, shipping, and total
	•	Creates an Order record with status initiated
	•	Generates a localized WhatsApp message body string
	4.	Backend encodes the message into a wa.me URL:
	•	https://wa.me/{merchant_phone}?text={url_encoded_message}
	5.	Frontend redirects browser to that URL → opens WhatsApp app or Web.

4.2 Canonical Order Object (Internal)

Before generating the message, backend prepares a canonical order object (pseudo-structure):

{
  "store_url": "https://store42799.mywabiz.in",
  "order_number": "10001",
  "date": "01/12/2025",
  "customer": {
    "name": "Prabhat Sharma",
    "email": "prabhat@example.com",
    "phone": "917777777777",
    "address": "F-92, First Floor, ... New Delhi, 110029"
  },
  "items": [
    {
      "name": "Denim jacket",
      "size": "L",
      "color": "Blue",
      "quantity": 1,
      "unit_price": 40,
      "line_total": 40
    }
  ],
  "shipping_method": "delivery",
  "shipping_label": "Delivery",    
  "payment_method": "Cash",
  "subtotal": 40,
  "shipping_fee": 0,
  "total": 40,
  "track_url": "https://store42799.mywabiz.in/orders/692cf72c75d9b6201a7b80ea",
  "language": "hi"
}

4.3 Message Template – English Example

Order from store42799.mywabiz.in

Order Number: 10001
Date: 01/12/2025
Name: Prabhat Sharma
Email: prabhat@example.com
Phone: 917777777777

Products:
1 x Denim jacket ( Size - L, Color - Blue )

Shipping: Delivery
Address: F-92, First Floor, Aiims residential colony,, Ansari nagar west, gate no. 4 or 5,, New delhi, New Delhi, 110029
Payment Method: Cash
Total: ₹40

You can track your order at https://store42799.mywabiz.in/orders/692cf72c75d9b6201a7b80ea

4.4 Message Template – Hindi Example

ऑर्डर आया है: store42799.mywabiz.in

ऑर्डर नंबर: 10001
तारीख: 01/12/2025
नाम: Prabhat Sharma
ईमेल: prabhat@example.com
फोन: 917777777777

प्रोडक्ट्स:
1 x Denim jacket ( Size - L, Color - Blue )

शिपिंग: होम डिलीवरी
पता: F-92, First Floor, Aiims residential colony,, Ansari nagar west, gate no. 4 or 5,, New delhi, New Delhi, 110029
भुगतान का तरीका: Cash
कुल राशि: ₹40

आप अपना ऑर्डर यहाँ ट्रैक कर सकते हैं:
https://store42799.mywabiz.in/orders/692cf72c75d9b6201a7b80ea

4.5 Message Template – Punjabi Example (Concept)

ਆਰਡਰ ਆਇਆ ਹੈ: store42799.mywabiz.in

ਆਰਡਰ ਨੰਬਰ: 10001
ਤਾਰੀਖ: 01/12/2025
ਨਾਮ: Prabhat Sharma
ਈਮੇਲ: prabhat@example.com
ਫੋਨ: 917777777777

ਪ੍ਰੋਡਕਟਸ:
1 x Denim jacket ( Size - L, Color - Blue )

ਸ਼ਿਪਿੰਗ: ਡਿਲੀਵਰੀ
ਐਡਰੈਸ: F-92, First Floor, Aiims residential colony,, Ansari nagar west, gate no. 4 or 5,, New delhi, New Delhi, 110029
ਭੁਗਤਾਨ ਤਰੀਕਾ: Cash
ਟੋਟਲ: ₹40

ਤੁਸੀਂ ਆਪਣਾ ਆਰਡਰ ਇੱਥੇ ਟਰੈਕ ਕਰ ਸਕਦੇ ਹੋ:
https://store42799.mywabiz.in/orders/692cf72c75d9b6201a7b80ea

Haryanvi & Gujarati follow the same pattern: only labels change according to language; product and address text remain as entered.

4.6 Edge Cases
	•	If language is missing or unsupported → default to English.
	•	If WhatsApp cannot open (no app installed, desktop issue) → frontend should show a fallback:
	•	Show the order message text on-screen with a “Copy order message” button and instructions to paste manually into WhatsApp.

⸻

5. Epics & User Stories

Epic 1: Merchant Onboarding & Store Creation
	1.	As a merchant, I want to create a store with just my store name, WhatsApp number, and language so that I can start sharing my link quickly.
	2.	As a merchant, I want to pick a template (Grocery, Boutique, Quick order, Wholesale, Services, Links list, Blank) so that my store layout matches my business.
	3.	As a merchant, I want to get an auto-generated store URL so that I can share it instantly.
	4.	As a merchant, I want a simple, guided onboarding (steps: Create store → Add products → Design → Share) so that I don’t feel overwhelmed.

Epic 2: Catalog Management (Google Sheets + In-App)
	5.	As a merchant, I want an auto-generated Google Sheet with clear headers so that I can add products in a familiar spreadsheet.
	6.	As a merchant, I want a Force Sync button so that I can instantly refresh my catalog after editing the sheet.
	7.	As a merchant, I want to add/edit products directly in the dashboard so that I can manage catalog without opening Sheets.
	8.	As a merchant, I want to see whether a product was last edited in Sheet or in-app so that I know which data is live.
	9.	As a merchant, I want to define size, color, and stock so that buyers can choose variants and I don’t oversell.

Epic 3: Store Design, Branding & Language
	10.	As a merchant, I want to upload a logo, choose a brand color, and enable a banner so that my store looks like my own brand.
	11.	As a merchant, I want to turn on/off sections like Banner, All products, Footer so that I can keep the layout clean.
	12.	As a merchant, I want to choose my store language so that my customers see buttons and messages in their language.
	13.	As a merchant, I want to preview on mobile and desktop so that I can trust how it looks on phones.

Epic 4: Buyer Shopping & Checkout
	14.	As a buyer, I want to scroll through products and see image, name, and price so that I can quickly decide what to explore.
	15.	As a buyer, I want to see product details with variants and multiple images so that I’m confident before ordering.
	16.	As a buyer, I want a short, clear checkout form so that placing an order doesn’t feel like too much work.
	17.	As a buyer, I want to place my order via WhatsApp so that I have a familiar chat and confirmation.
	18.	As a buyer, I want to see an order confirmation page and tracking link so that I know the order is recorded.

Epic 5: Orders, Tracking & Analytics
	19.	As a merchant, I want a list of all orders so that I can track what’s happening even if WhatsApp messages get buried.
	20.	As a merchant, I want to see key stats (orders, sales, visits) so that I can quickly understand store performance.
	21.	As a buyer, I want to see my order status (Placed/Confirmed/Delivered) on a simple tracking page so that I don’t need to keep messaging the store.

Epic 6: Premium Features (Coupons, Custom Pages, Branding)
	22.	As a merchant, I want to see clearly what extra features I get with Premium so that I can decide if it’s worth paying.
	23.	As a merchant, I want to create coupon codes in Premium so that I can run offers and promotions.
	24.	As a merchant, I want to add custom pages (e.g. About, Size guide) in Premium so that I can explain my brand better.

⸻

6. Functional Requirements

6.1 Store Creation & Templates
	•	Predefined templates:
	•	Multi-purpose
	•	Quick Order
	•	Wholesale
	•	Digital Download
	•	Service Booking
	•	List of links
	•	Start from scratch
	•	Capture:
	•	Store name
	•	Owner/merchant name (optional for display)
	•	WhatsApp notification phone number
	•	Store language (English, Hindi, Punjabi, Haryanvi, Gujarati)
	•	Generate unique store URL, with a copy button.
	•	Social sharing shortcuts from dashboard.

6.2 Catalog Management

Mode A: Google Sheets
	•	Auto-provision sheet with headers:
	•	Name
	•	Category
	•	Price
	•	Description
	•	Size
	•	Color
	•	Tag
	•	Brand
	•	Stock
	•	Availability (Show/Hide)
	•	Thumbnail
	•	Image1, Image2, Image3, … (configurable)
	•	In-app:
	•	“Open Product Sheet” → opens Google Sheet
	•	Read-only preview embed
	•	“Force Sync Products” → triggers immediate catalog update
	•	Behavior:
	•	Live sync within a few minutes
	•	Force Sync for explicit update
	•	Invalid rows (missing Name/Price) skipped and logged

Mode B: In-App Product UI
	•	Add Product form mirrors sheet fields.
	•	Image upload (thumbnail + multiple images).
	•	Availability and stock.
	•	Variant management via size/color/tag fields.
	•	Edits can also sync back into Sheet (if linked) or internal storage if sheet is not used.

Mode C: Hybrid & Conflict Handling
	•	Merchant can use both Sheet and in-app.
	•	System tracks last_updated_source and timestamp.
	•	If conflicting changes detected, last write wins; UI shows a small label like “Last edited in Sheet” or “Last edited in Dashboard”.
	•	Merchant can disconnect Sheet to go UI-only.

6.3 Product Presentation
	•	Product cards show:
	•	Image
	•	Name
	•	Price
	•	Product detail page shows:
	•	Images gallery
	•	Name, Price
	•	Description
	•	Brand, category
	•	Variant selectors (size, color) if present
	•	Stock info / “Only X left” if low
	•	Category chips/tabs on storefront when multiple categories exist.

6.4 Store Design
	•	Section toggles:
	•	Header
	•	Banner image
	•	All products grid
	•	Footer
	•	Branding controls:
	•	Logo upload
	•	Store name
	•	Brand color (primary)
	•	Theme presets: “Minimal”, “Bold”, “Dark” (optional v1 or v2).
	•	Live preview in desktop & mobile modes.

6.5 Checkout
	•	Cart / order building from product detail page.
	•	Checkout form fields:
	•	Name (required)
	•	Phone (required)
	•	Email (optional)
	•	Address (text area)
	•	Custom fields (optional; e.g., Landmark, Delivery instructions)
	•	Shipping methods:
	•	Pickup (default FREE)
	•	Delivery (configurable fee)
	•	Order summary:
	•	Line items, Subtotal, Shipping, Total
	•	Primary CTA:
	•	“Place order on WhatsApp” → triggers backend order creation + WA redirect

6.6 Order Confirmation & Tracking
	•	Confirmation page:
	•	Icon + “Order placed” (localized)
	•	Order number
	•	Short message + tracking link
	•	Tracking page:
	•	Order number
	•	Status (Placed, Confirmed, Shipped, Delivered)
	•	Items, total, date
	•	Link to chat with store on WhatsApp

6.7 Coupons (Premium)
	•	Free users see gate with upsell.
	•	Premium users can:
	•	Create coupon code
	•	Choose discount type: Flat/Percentage
	•	Set value, start/end date, usage limits

6.8 Custom Pages (Premium)
	•	Gate in free tier with upsell.
	•	Premium:
	•	Create new pages (About, Size guide, etc.)
	•	Simple rich-text editor
	•	Links appear in footer / header nav.

6.9 Payments
	•	Optional online payment before WhatsApp (future-friendly).
	•	Payment providers: Stripe/Razorpay/etc., configured in Settings.
	•	If payment is enabled and successful, order message includes payment method and “Paid” tag.
	•	If COD, payment method field is set to “Cash” or “COD”.

6.10 Analytics & Dashboard
	•	Metrics:
	•	Total orders
	•	Total sales (currency)
	•	Store visits
	•	Filter by timeframe (e.g., Today, Last 7 days, This month).
	•	Quick actions from dashboard:
	•	Share store
	•	Copy URL
	•	View store
	•	Upgrade to Premium

6.11 Integrations
	•	WhatsApp (handoff via wa.me links)
	•	Google Sheets (catalog)
	•	Social sharing (WhatsApp, Facebook, Instagram, LinkedIn, QR code)

⸻

7. UX & Screen Designs

7.1 Buyer-Facing Screens

A. Storefront / Home
Goal: Let buyers browse quickly and add items.

Layout (mobile-first):
	•	Top bar: logo + store name
	•	Optional banner image with overlay tagline
	•	Category chips row (All, Category A, B, C)
	•	Product grid (2 columns on mobile, 3–4 on desktop)
	•	Footer: store address, “Powered by mywabiz”

Key states:
	•	Empty catalog → show friendly message in chosen language.

B. Product Detail
	•	Large image + thumbnails
	•	Product name, price
	•	Description
	•	Variant chips (size, color)
	•	Quantity selector
	•	Primary button: “Add to order”
	•	Small note: “You’ll confirm this order on WhatsApp in the next step.”

C. Checkout
	•	Order summary at top (items, totals)
	•	Form fields (localized labels)
	•	Shipping method selectors
	•	Primary CTA: “Place order on WhatsApp”
	•	Subtext: “We’ll open WhatsApp with your order details.”

D. Order Confirmation
	•	Success icon
	•	Heading: localized “Order placed” text
	•	Order number & summary
	•	Button: “Track your order”

E. Order Tracking
	•	Shows order status, items, total
	•	Optional timeline
	•	“Need help? Chat on WhatsApp” action.

⸻

7.2 Merchant Dashboard Screens

A. Login / Signup
	•	Login: Email/Phone + Password, “Login” button, link to Signup.
	•	Signup: Store name, Merchant name, Email, WhatsApp number, Store language, Password.

B. Onboarding Wizard
Step 1: Choose Template
Step 2: Store Basics (name, WhatsApp number, language)
Step 3: Add Products (choose Google Sheet vs In-app)
Step 4: Design Store (basic branding + preview)

C. Dashboard Home
	•	Stats cards: Orders, Sales, Visits
	•	Quick actions: Add product, Design store, Share link, Upgrade
	•	Recent orders table with statuses

D. Products
	•	Tab: “Products” (in-app) + “Google Sheet”.
	•	List view with image, name, category, price, stock, availability.
	•	Add/Edit product modal with all fields.

E. Store Design
	•	Left: controls (logo, brand color, section toggles, language info)
	•	Right: live preview with Desktop/Mobile toggle

F. Orders
	•	Table: Order #, Date, Buyer, Total, Status, “Open in WhatsApp” icon.
	•	Order detail page with customer info, items, and status dropdown.

G. Coupons (Premium)
	•	If not premium: upsell card.
	•	If premium: list of coupons + “Create coupon” flow.

H. Settings
	•	Store details
	•	Payments
	•	Shipping
	•	Advanced (custom domain, branding removal).

⸻

8. Data Model (High-Level)

8.1 Store
	•	id
	•	owner_id
	•	name
	•	url
	•	template
	•	language (en|hi|pa|hr|gu)
	•	branding assets (logo_url, brand_color)
	•	theme settings
	•	sections_toggles
	•	premium_flags (coupons_enabled, custom_pages_enabled, branding_removal)
	•	created_at, updated_at

8.2 Product
	•	id
	•	store_id
	•	name
	•	category
	•	price
	•	description
	•	size
	•	color
	•	tag
	•	brand
	•	stock
	•	availability (show/hide)
	•	thumbnail_url
	•	image_urls[]
	•	sheet_row_ref (if from Google Sheet)
	•	last_updated_source (sheet/dashboard)
	•	created_at, updated_at

8.3 Order
	•	id
	•	store_id
	•	order_number
	•	items[] (embedded or via OrderItem table)
	•	subtotal
	•	shipping_method
	•	shipping_fee
	•	total
	•	currency
	•	customer { name, email, phone, address, custom_fields }
	•	status (initiated, sent_to_whatsapp, confirmed, shipped, delivered)
	•	whatsapp_message_id? (optional)
	•	track_token / track_url
	•	created_at, updated_at

8.4 Coupon (Premium)
	•	id
	•	store_id
	•	code
	•	type (flat, percent)
	•	value
	•	status (active, expired, disabled)
	•	start_at, end_at
	•	usage_limit, used_count

8.5 Analytics Snapshot
	•	id
	•	store_id
	•	timeframe (e.g., day/month)
	•	orders_count
	•	sales_total
	•	visits
	•	generated_at

⸻

9. Visual Design System

9.1 Colors
	•	Primary green: #22C55E (main buttons, links, highlights)
	•	Dark text: #111827
	•	Secondary text: #6B7280
	•	Background: #F9FAFB
	•	Card background: #FFFFFF
	•	Accent orange: #F97316 (offers, warnings)
	•	Borders: #E5E7EB

Buttons:
	•	Primary: Primary green bg, white text, rounded-full, subtle shadow.
	•	Secondary: White bg, green border, green text.

9.2 Typography
	•	Headings: Poppins, weight 600
	•	Body: Inter, weight 400–500

Sizes:
	•	H1: 32–36 px
	•	H2: 24–28 px
	•	H3: 20–22 px
	•	Body: 14–16 px

9.3 Components
	•	Cards: 16–20 px radius, light shadow, 16–24 px padding.
	•	Chips: pill-shaped, 1 px border, selected state with primary border & soft bg.
	•	Inputs: full-width, 12 px radius, grey border, green focus ring.
	•	Toasts: top-right (desktop), full-width top (mobile).

⸻

10. Landing Page Spec (mywabiz)

10.1 Structure
	1.	Hero section
	2.	How it works (3 steps)
	3.	Who it’s for (Delhi merchants)
	4.	Features grid
	5.	Demo & screenshots
	6.	Pricing
	7.	Testimonials (future)
	8.	FAQ & support

10.2 Hero
	•	H1: “Turn your WhatsApp into a proper store in 10 minutes.”
	•	Subtext:
“mywabiz lets Delhi shops sell with a simple link, Google Sheet catalog, and WhatsApp checkout. No app, no coding.”
	•	Primary CTA: “Create your free store”
	•	Secondary CTA: “View demo store”
	•	Visual: Phone mockup showing store catalog + WhatsApp order message.

10.3 How It Works

Title: “From zero to WhatsApp store in 3 steps”
	1.	Create your store
Enter store name, WhatsApp number, and language. Get your link instantly.
	2.	Add products in Google Sheet
We create a ready-made sheet. Edit like Excel – Name, Price, Size, Stock.
	3.	Share & receive orders on WhatsApp
Customers browse your catalog, checkout, and you get full order details in WhatsApp.

10.4 Who It’s For

Title: “Perfect for small businesses in Delhi”

Cards:
	•	Clothing & boutiques
	•	Kirana & grocery shops
	•	Home chefs & tiffin services

Text:

“If your customers already message you on WhatsApp, mywabiz helps you stop doing manual chat and start taking structured orders.”

10.5 Features

Highlight blocks:
	•	WhatsApp-first checkout
Orders arrive as clean, detailed WhatsApp messages – not random chats.
	•	Google Sheet catalog
Add hundreds of products faster than any mobile app.
	•	Mobile-ready storefront
Your link opens a neat catalog that looks great on any phone.
	•	Basic analytics
See orders, sales, and visits at a glance.

Premium callout:

“Upgrade for coupons, custom pages, and branded links.”

10.6 Demo Section
	•	Button: “Open demo store”
	•	Embed or GIF showing: template selection → sheet edit → storefront → WhatsApp order message.

10.7 Pricing

Plans (see next section for details):
	•	Free (Starter)
	•	Growth (main paid plan)
	•	Pro (optional future)

10.8 FAQ

Sample questions:
	•	“Do I need a website or app?”
	•	“Can I use this only with WhatsApp?”
	•	“Can I take Cash on Delivery?”
	•	“Can I change my language later?”

⸻

11. Pricing & Packaging (Delhi-Focused)

11.1 Starter (Free)
	•	1 store
	•	Up to 50 products
	•	Google Sheet or in-app catalog
	•	WhatsApp checkout
	•	Basic analytics
	•	“Powered by mywabiz” branding
	•	No coupons, no custom pages

Positioning: zero-risk entry, good for testing.

11.2 Growth – Recommended Paid Plan
	•	Price suggestion: ₹299/month or ₹2,499/year
	•	Includes:
	•	Everything in Free
	•	Up to 500 products
	•	Coupons
	•	Custom pages
	•	Custom store link (yourname.mywabiz.in)
	•	Remove or minimize “Powered by mywabiz” branding
	•	Priority WhatsApp support

Positioning: for serious small businesses making frequent sales.

11.3 Pro (Later)
	•	Price suggestion: ₹699/month or ₹5,999/year
	•	Includes Growth plus:
	•	Advanced analytics (per product, per customer)
	•	Staff logins (2–3 users)
	•	Higher product limits
	•	Done-for-you setup or onboarding call

⸻

12. Non-Functional Requirements
	•	Mobile-first, fully responsive.
	•	Hosted on reliable cloud (e.g., AWS).
	•	Fast catalog sync (<5 minutes typical; immediate on Force Sync).
	•	SEO-friendly storefront pages.
	•	UTF-8 encoding everywhere (to support Indian languages in UI and messages).
	•	Secure integrations with Google Sheets and payment providers.

⸻

13. Acceptance Criteria (Examples)
	•	Merchant can create a store, add 3 products via Google Sheet or in-app UI, sync them, and see them on storefront within 5 minutes.
	•	Buyer can:
	•	Choose a product with size/color
	•	Add it to order
	•	Fill checkout
	•	Choose shipping
	•	Click “Place order on WhatsApp” and see a correctly formatted message in the store’s chosen language.
	•	Toggling “All products” section in design hides/shows product grid in preview and live store.
	•	Force Sync updates product price changes immediately.
	•	Free users see upsell gates for Coupons and Custom Pages; Growth users see full access.