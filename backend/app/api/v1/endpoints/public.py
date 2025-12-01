from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from bson import ObjectId

from app.core.database import get_database
from app.schemas.store import StoreResponse
from app.schemas.product import ProductResponse
from app.schemas.order import OrderTrackingResponse

router = APIRouter()


@router.get("/stores/{slug}")
async def get_public_store(slug: str):
    """Get public store information by slug."""
    db = get_database()

    store = await db.stores.find_one({"slug": slug})
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")

    # Return only public fields
    return {
        "id": str(store["_id"]),
        "name": store["name"],
        "slug": store["slug"],
        "language": store["language"],
        "theme": store.get("theme", "minimal"),
        "branding": store.get("branding", {}),
        "sections": store.get("sections", {}),
        "shipping": {
            "pickup_enabled": store.get("shipping", {}).get("pickup_enabled", True),
            "delivery_enabled": store.get("shipping", {}).get("delivery_enabled", True),
            "delivery_fee": store.get("shipping", {}).get("delivery_fee", 0),
        },
        "payments": {
            "cod_enabled": store.get("payments", {}).get("cod_enabled", True),
        },
        "whatsapp_number": store["whatsapp_number"],
    }


@router.get("/stores/{slug}/products")
async def get_public_products(
    slug: str,
    category: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
):
    """Get public products for a store."""
    db = get_database()

    # Find store by slug
    store = await db.stores.find_one({"slug": slug})
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")

    # Build query - only show visible products
    query = {
        "store_id": store["_id"],
        "availability": "show",
    }
    if category:
        query["category"] = category

    # Paginate
    skip = (page - 1) * limit

    products = await db.products.find(query).skip(skip).limit(limit).to_list(length=limit)

    # Get unique categories
    categories = await db.products.distinct("category", {"store_id": store["_id"], "availability": "show"})
    categories = [c for c in categories if c]  # Remove None values

    return {
        "products": [
            {
                "id": str(p["_id"]),
                "name": p["name"],
                "category": p.get("category"),
                "price": p["price"],
                "description": p.get("description"),
                "sizes": p.get("sizes", []),
                "colors": p.get("colors", []),
                "brand": p.get("brand"),
                "stock": p.get("stock", -1),
                "thumbnail_url": p.get("thumbnail_url"),
                "image_urls": p.get("image_urls", []),
            }
            for p in products
        ],
        "categories": categories,
        "total": await db.products.count_documents(query),
    }


@router.get("/stores/{slug}/products/{product_id}")
async def get_public_product(slug: str, product_id: str):
    """Get a specific public product."""
    db = get_database()

    # Find store by slug
    store = await db.stores.find_one({"slug": slug})
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")

    # Find product
    product = await db.products.find_one({
        "_id": ObjectId(product_id),
        "store_id": store["_id"],
        "availability": "show",
    })

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return {
        "id": str(product["_id"]),
        "name": product["name"],
        "category": product.get("category"),
        "price": product["price"],
        "description": product.get("description"),
        "sizes": product.get("sizes", []),
        "colors": product.get("colors", []),
        "tags": product.get("tags", []),
        "brand": product.get("brand"),
        "stock": product.get("stock", -1),
        "thumbnail_url": product.get("thumbnail_url"),
        "image_urls": product.get("image_urls", []),
    }


@router.get("/orders/track/{track_token}", response_model=OrderTrackingResponse)
async def track_order(track_token: str):
    """Public order tracking endpoint."""
    db = get_database()

    order = await db.orders.find_one({"track_token": track_token})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Get store info
    store = await db.stores.find_one({"_id": order["store_id"]})
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")

    return OrderTrackingResponse(
        order_number=order["order_number"],
        status=order["status"],
        items=[
            {
                "product_id": str(item["product_id"]),
                "name": item["name"],
                "size": item.get("size"),
                "color": item.get("color"),
                "quantity": item["quantity"],
                "unit_price": item["unit_price"],
                "line_total": item["line_total"],
            }
            for item in order["items"]
        ],
        total=order["total"],
        currency=order.get("currency", "INR"),
        created_at=order["created_at"],
        store_name=store["name"],
        store_whatsapp=store["whatsapp_number"],
    )
