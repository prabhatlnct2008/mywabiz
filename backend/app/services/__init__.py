# Services module
from app.services.sheets_sync import (
    parse_sheet_url,
    sync_products_from_sheet,
    fetch_sheet_data,
)
from app.services.whatsapp import (
    generate_whatsapp_message,
    generate_whatsapp_url,
    generate_order_whatsapp,
)
from app.services.analytics import (
    aggregate_orders_by_timeframe,
    get_store_analytics,
    track_page_visit,
    get_analytics_snapshots,
    get_top_products,
    get_revenue_by_day,
)
from app.services.upload import (
    upload_image,
    upload_logo,
    upload_banner,
    upload_product_image,
    delete_image,
    is_cloudinary_configured,
)

__all__ = [
    # Sheets sync
    "parse_sheet_url",
    "sync_products_from_sheet",
    "fetch_sheet_data",
    # WhatsApp
    "generate_whatsapp_message",
    "generate_whatsapp_url",
    "generate_order_whatsapp",
    # Analytics
    "aggregate_orders_by_timeframe",
    "get_store_analytics",
    "track_page_visit",
    "get_analytics_snapshots",
    "get_top_products",
    "get_revenue_by_day",
    # Upload
    "upload_image",
    "upload_logo",
    "upload_banner",
    "upload_product_image",
    "delete_image",
    "is_cloudinary_configured",
]
