from fastapi import APIRouter, HTTPException, Depends, Request
from typing import List
from datetime import datetime
from bson import ObjectId
import re
import uuid

from app.core.database import get_database
from app.core.security import get_current_user
from app.schemas.store import StoreCreate, StoreUpdate, StoreResponse, StoreStats

router = APIRouter()


def generate_slug(name: str) -> str:
    """Generate a URL-friendly slug from store name."""
    # Convert to lowercase and replace spaces with hyphens
    slug = name.lower().strip()
    slug = re.sub(r"[^a-z0-9]+", "-", slug)
    slug = slug.strip("-")
    # Add random suffix for uniqueness
    short_uuid = str(uuid.uuid4())[:8]
    return f"{slug}-{short_uuid}"


def store_to_response(store: dict) -> StoreResponse:
    """Convert MongoDB store document to response schema."""
    return StoreResponse(
        id=str(store["_id"]),
        owner_id=str(store["owner_id"]),
        name=store["name"],
        slug=store["slug"],
        url=store.get("url"),
        whatsapp_number=store["whatsapp_number"],
        language=store["language"],
        template=store["template"],
        theme=store.get("theme", "minimal"),
        branding=store.get("branding", {}),
        sections=store.get("sections", {}),
        premium=store.get("premium", {}),
        sheets_config=store.get("sheets_config", {}),
        shipping=store.get("shipping", {}),
        payments=store.get("payments", {}),
        created_at=store["created_at"],
        updated_at=store["updated_at"],
    )


@router.post("", response_model=StoreResponse)
async def create_store(store_data: StoreCreate, request: Request):
    """Create a new store."""
    user = await get_current_user(request, None)
    db = get_database()

    # Generate unique slug
    slug = generate_slug(store_data.name)

    # Check if slug already exists
    existing = await db.stores.find_one({"slug": slug})
    if existing:
        slug = generate_slug(store_data.name)  # Generate new one

    # Create store document
    store_doc = {
        "owner_id": user["_id"],
        "name": store_data.name,
        "slug": slug,
        "url": f"https://{slug}.mywabiz.in",
        "whatsapp_number": store_data.whatsapp_number,
        "language": store_data.language.value,
        "template": store_data.template.value,
        "theme": "minimal",
        "branding": {
            "logo_url": None,
            "brand_color": "#22C55E",
            "banner_url": None,
            "banner_text": None,
        },
        "sections": {
            "header": True,
            "banner": False,
            "products": True,
            "footer": True,
        },
        "premium": {
            "plan": "starter",
            "coupons_enabled": False,
            "custom_pages_enabled": False,
            "branding_removal": False,
            "product_limit": 50,
        },
        "sheets_config": {
            "sheet_id": None,
            "sheet_url": None,
            "last_synced_at": None,
            "sync_status": "idle",
            "sync_error": None,
        },
        "shipping": {
            "pickup_enabled": True,
            "pickup_address": None,
            "delivery_enabled": True,
            "delivery_fee": 0.0,
            "delivery_zones": [],
        },
        "payments": {
            "cod_enabled": True,
            "paypal_enabled": False,
            "paypal_client_id": None,
        },
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }

    result = await db.stores.insert_one(store_doc)
    store_doc["_id"] = result.inserted_id

    return store_to_response(store_doc)


@router.get("", response_model=List[StoreResponse])
async def list_stores(request: Request):
    """List all stores for the current user."""
    user = await get_current_user(request, None)
    db = get_database()

    stores = await db.stores.find({"owner_id": user["_id"]}).to_list(length=100)
    return [store_to_response(store) for store in stores]


@router.get("/{store_id}", response_model=StoreResponse)
async def get_store(store_id: str, request: Request):
    """Get a specific store."""
    user = await get_current_user(request, None)
    db = get_database()

    store = await db.stores.find_one({
        "_id": ObjectId(store_id),
        "owner_id": user["_id"],
    })

    if not store:
        raise HTTPException(status_code=404, detail="Store not found")

    return store_to_response(store)


@router.patch("/{store_id}", response_model=StoreResponse)
async def update_store(store_id: str, store_data: StoreUpdate, request: Request):
    """Update a store."""
    user = await get_current_user(request, None)
    db = get_database()

    # Check ownership
    store = await db.stores.find_one({
        "_id": ObjectId(store_id),
        "owner_id": user["_id"],
    })

    if not store:
        raise HTTPException(status_code=404, detail="Store not found")

    # Build update document
    update_doc = {"updated_at": datetime.utcnow()}

    for field, value in store_data.model_dump(exclude_unset=True).items():
        if value is not None:
            if isinstance(value, dict):
                # For nested objects, merge with existing
                existing = store.get(field, {})
                existing.update(value)
                update_doc[field] = existing
            else:
                update_doc[field] = value if not hasattr(value, "value") else value.value

    await db.stores.update_one({"_id": ObjectId(store_id)}, {"$set": update_doc})

    # Fetch updated store
    updated_store = await db.stores.find_one({"_id": ObjectId(store_id)})
    return store_to_response(updated_store)


@router.delete("/{store_id}")
async def delete_store(store_id: str, request: Request):
    """Delete a store and all its data."""
    user = await get_current_user(request, None)
    db = get_database()

    # Check ownership
    store = await db.stores.find_one({
        "_id": ObjectId(store_id),
        "owner_id": user["_id"],
    })

    if not store:
        raise HTTPException(status_code=404, detail="Store not found")

    # Delete store and related data
    await db.products.delete_many({"store_id": ObjectId(store_id)})
    await db.orders.delete_many({"store_id": ObjectId(store_id)})
    await db.coupons.delete_many({"store_id": ObjectId(store_id)})
    await db.stores.delete_one({"_id": ObjectId(store_id)})

    return {"message": "Store deleted successfully"}


@router.get("/{store_id}/stats", response_model=StoreStats)
async def get_store_stats(store_id: str, timeframe: str = "7d", request: Request = None):
    """Get store statistics."""
    user = await get_current_user(request, None)
    db = get_database()

    # Check ownership
    store = await db.stores.find_one({
        "_id": ObjectId(store_id),
        "owner_id": user["_id"],
    })

    if not store:
        raise HTTPException(status_code=404, detail="Store not found")

    # Parse timeframe
    from datetime import timedelta

    days = 7
    if timeframe == "1d":
        days = 1
    elif timeframe == "30d":
        days = 30
    elif timeframe == "90d":
        days = 90

    start_date = datetime.utcnow() - timedelta(days=days)

    # Aggregate orders
    pipeline = [
        {
            "$match": {
                "store_id": ObjectId(store_id),
                "created_at": {"$gte": start_date},
            }
        },
        {
            "$group": {
                "_id": None,
                "orders_count": {"$sum": 1},
                "sales_total": {"$sum": "$total"},
            }
        },
    ]

    result = await db.orders.aggregate(pipeline).to_list(length=1)

    if result:
        stats = result[0]
        return StoreStats(
            orders_count=stats["orders_count"],
            sales_total=stats["sales_total"],
            visits=0,  # TODO: Implement visit tracking
            timeframe=timeframe,
        )

    return StoreStats(
        orders_count=0,
        sales_total=0.0,
        visits=0,
        timeframe=timeframe,
    )
