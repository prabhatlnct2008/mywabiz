"""WhatsApp Message Generator Service for localized order notifications."""

from typing import Dict, Any, Optional
from datetime import datetime
from urllib.parse import quote


# i18n dictionaries for WhatsApp message labels in all 5 languages
I18N_LABELS = {
    "en": {
        "order_from": "Order from",
        "order_number": "Order Number",
        "date": "Date",
        "name": "Name",
        "email": "Email",
        "phone": "Phone",
        "products": "Products",
        "size": "Size",
        "color": "Color",
        "shipping": "Shipping",
        "delivery": "Delivery",
        "pickup": "Pickup",
        "address": "Address",
        "payment_method": "Payment Method",
        "cash": "Cash",
        "paypal": "PayPal",
        "subtotal": "Subtotal",
        "shipping_fee": "Shipping Fee",
        "discount": "Discount",
        "total": "Total",
        "track_order": "You can track your order at",
        "coupon": "Coupon",
    },
    "hi": {
        "order_from": "से ऑर्डर",
        "order_number": "ऑर्डर नंबर",
        "date": "तारीख",
        "name": "नाम",
        "email": "ईमेल",
        "phone": "फ़ोन",
        "products": "उत्पाद",
        "size": "साइज़",
        "color": "रंग",
        "shipping": "शिपिंग",
        "delivery": "डिलीवरी",
        "pickup": "पिकअप",
        "address": "पता",
        "payment_method": "भुगतान विधि",
        "cash": "कैश",
        "paypal": "PayPal",
        "subtotal": "उप-योग",
        "shipping_fee": "शिपिंग शुल्क",
        "discount": "छूट",
        "total": "कुल",
        "track_order": "आप अपने ऑर्डर को यहाँ ट्रैक कर सकते हैं",
        "coupon": "कूपन",
    },
    "pa": {
        "order_from": "ਤੋਂ ਆਰਡਰ",
        "order_number": "ਆਰਡਰ ਨੰਬਰ",
        "date": "ਤਾਰੀਖ",
        "name": "ਨਾਮ",
        "email": "ਈਮੇਲ",
        "phone": "ਫ਼ੋਨ",
        "products": "ਉਤਪਾਦ",
        "size": "ਸਾਈਜ਼",
        "color": "ਰੰਗ",
        "shipping": "ਸ਼ਿਪਿੰਗ",
        "delivery": "ਡਿਲੀਵਰੀ",
        "pickup": "ਪਿਕਅੱਪ",
        "address": "ਪਤਾ",
        "payment_method": "ਭੁਗਤਾਨ ਵਿਧੀ",
        "cash": "ਨਕਦ",
        "paypal": "PayPal",
        "subtotal": "ਉਪ-ਜੋੜ",
        "shipping_fee": "ਸ਼ਿਪਿੰਗ ਫੀਸ",
        "discount": "ਛੋਟ",
        "total": "ਕੁੱਲ",
        "track_order": "ਤੁਸੀਂ ਆਪਣੇ ਆਰਡਰ ਨੂੰ ਇੱਥੇ ਟਰੈਕ ਕਰ ਸਕਦੇ ਹੋ",
        "coupon": "ਕੂਪਨ",
    },
    "hr": {
        "order_from": "Narudžba od",
        "order_number": "Broj narudžbe",
        "date": "Datum",
        "name": "Ime",
        "email": "E-pošta",
        "phone": "Telefon",
        "products": "Proizvodi",
        "size": "Veličina",
        "color": "Boja",
        "shipping": "Dostava",
        "delivery": "Dostava",
        "pickup": "Preuzimanje",
        "address": "Adresa",
        "payment_method": "Način plaćanja",
        "cash": "Gotovina",
        "paypal": "PayPal",
        "subtotal": "Podzbroj",
        "shipping_fee": "Troškovi dostave",
        "discount": "Popust",
        "total": "Ukupno",
        "track_order": "Možete pratiti svoju narudžbu na",
        "coupon": "Kupon",
    },
    "gu": {
        "order_from": "થી ઓર્ડર",
        "order_number": "ઓર્ડર નંબર",
        "date": "તારીખ",
        "name": "નામ",
        "email": "ઈમેલ",
        "phone": "ફોન",
        "products": "ઉત્પાદનો",
        "size": "સાઇઝ",
        "color": "રંગ",
        "shipping": "શિપિંગ",
        "delivery": "ડિલિવરી",
        "pickup": "પિકઅપ",
        "address": "સરનામું",
        "payment_method": "ચુકવણી પદ્ધતિ",
        "cash": "રોકડ",
        "paypal": "PayPal",
        "subtotal": "પેટા-કુલ",
        "shipping_fee": "શિપિંગ ફી",
        "discount": "છૂટ",
        "total": "કુલ",
        "track_order": "તમે તમારા ઓર્ડરને અહીં ટ્રૅક કરી શકો છો",
        "coupon": "કૂપન",
    },
}


def get_currency_symbol(currency: str) -> str:
    """Get currency symbol for a currency code."""
    currency_symbols = {
        "INR": "₹",
        "USD": "$",
        "EUR": "€",
        "GBP": "£",
        "JPY": "¥",
        "CNY": "¥",
        "AUD": "A$",
        "CAD": "C$",
        "CHF": "CHF",
        "HKD": "HK$",
        "SGD": "S$",
        "NZD": "NZ$",
    }
    return currency_symbols.get(currency.upper(), currency)


def format_date(date: datetime, language: str) -> str:
    """Format date according to language preference."""
    # Use DD/MM/YYYY for most languages
    return date.strftime("%d/%m/%Y")


def generate_whatsapp_message(
    order: Dict[str, Any],
    store: Dict[str, Any],
    language: str = "en",
) -> str:
    """
    Generate localized WhatsApp order message from order data.

    Args:
        order: Order data dictionary with all order fields
        store: Store data dictionary (for store name, slug, etc.)
        language: Language code (en, hi, pa, hr, gu)

    Returns:
        Formatted WhatsApp message string

    Message includes:
    - Order number
    - Date
    - Customer info (name, email, phone)
    - Products with variants (size, color)
    - Shipping method and address
    - Payment method
    - Subtotal, shipping fee, discount, total
    - Tracking URL
    """
    # Get labels for selected language (fallback to English)
    labels = I18N_LABELS.get(language, I18N_LABELS["en"])

    # Get currency symbol
    currency = order.get("currency", "INR")
    currency_symbol = get_currency_symbol(currency)

    # Build message lines
    lines = []

    # Header
    store_url = f"{store['slug']}.mywabiz.in"
    lines.append(f"{labels['order_from']} {store_url}")
    lines.append("")

    # Order details
    lines.append(f"{labels['order_number']}: {order['order_number']}")
    lines.append(f"{labels['date']}: {format_date(order['created_at'], language)}")
    lines.append("")

    # Customer info
    customer = order.get("customer", {})
    lines.append(f"{labels['name']}: {customer.get('name', 'N/A')}")

    if customer.get("email"):
        lines.append(f"{labels['email']}: {customer['email']}")

    lines.append(f"{labels['phone']}: {customer.get('phone', 'N/A')}")
    lines.append("")

    # Products
    lines.append(f"{labels['products']}:")
    items = order.get("items", [])

    for item in items:
        # Build variant info
        variants = []
        if item.get("size"):
            variants.append(f"{labels['size']} - {item['size']}")
        if item.get("color"):
            variants.append(f"{labels['color']} - {item['color']}")

        variant_info = f" ( {', '.join(variants)} )" if variants else ""

        # Product line
        lines.append(f"{item['quantity']} x {item['name']}{variant_info}")

    lines.append("")

    # Shipping
    shipping_method = order.get("shipping_method", "pickup")
    shipping_label = labels["delivery"] if shipping_method == "delivery" else labels["pickup"]
    lines.append(f"{labels['shipping']}: {shipping_label}")

    if customer.get("address") and shipping_method == "delivery":
        lines.append(f"{labels['address']}: {customer['address']}")

    lines.append("")

    # Payment
    payment_method = order.get("payment_method", "cash")
    payment_label = labels["paypal"] if payment_method == "paypal" else labels["cash"]
    lines.append(f"{labels['payment_method']}: {payment_label}")
    lines.append("")

    # Pricing breakdown
    subtotal = order.get("subtotal", 0)
    shipping_fee = order.get("shipping_fee", 0)
    discount_amount = order.get("discount_amount", 0)
    total = order.get("total", 0)

    lines.append(f"{labels['subtotal']}: {currency_symbol}{subtotal:.2f}")

    if shipping_fee > 0:
        lines.append(f"{labels['shipping_fee']}: {currency_symbol}{shipping_fee:.2f}")

    if discount_amount > 0:
        coupon_code = order.get("coupon_code", "")
        coupon_info = f" ({labels['coupon']}: {coupon_code})" if coupon_code else ""
        lines.append(f"{labels['discount']}: -{currency_symbol}{discount_amount:.2f}{coupon_info}")

    lines.append(f"{labels['total']}: {currency_symbol}{total:.2f}")
    lines.append("")

    # Tracking URL
    track_token = order.get("track_token", "")
    track_url = f"https://{store['slug']}.mywabiz.in/orders/{track_token}"
    lines.append(f"{labels['track_order']} {track_url}")

    return "\n".join(lines)


def generate_whatsapp_url(
    whatsapp_number: str,
    message: str,
) -> str:
    """
    URL-encode message and generate wa.me URL.

    Args:
        whatsapp_number: WhatsApp number (with or without + and spaces)
        message: Message text to send

    Returns:
        wa.me URL with encoded message

    Example:
        generate_whatsapp_url("+91 98765 43210", "Hello!")
        -> "https://wa.me/919876543210?text=Hello%21"
    """
    # Clean phone number (remove +, spaces, dashes)
    clean_number = whatsapp_number.replace("+", "").replace(" ", "").replace("-", "")

    # URL-encode the message
    encoded_message = quote(message)

    # Build wa.me URL
    return f"https://wa.me/{clean_number}?text={encoded_message}"


def generate_order_whatsapp(
    order: Dict[str, Any],
    store: Dict[str, Any],
) -> Dict[str, str]:
    """
    Generate WhatsApp message and URL for an order.

    Args:
        order: Order data dictionary
        store: Store data dictionary

    Returns:
        Dictionary with:
        - message: Formatted WhatsApp message
        - url: wa.me URL with encoded message
    """
    # Get store language
    language = store.get("language", "en")

    # Generate message
    message = generate_whatsapp_message(order, store, language)

    # Generate URL
    whatsapp_number = store.get("whatsapp_number", "")
    url = generate_whatsapp_url(whatsapp_number, message)

    return {
        "message": message,
        "url": url,
    }
