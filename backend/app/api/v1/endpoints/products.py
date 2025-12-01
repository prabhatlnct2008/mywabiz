from fastapi import APIRouter, HTTPException, Depends, Request, Query
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

from app.core.database import get_database
from app.core.security import get_current_user
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse, SyncResponse

router = APIRouter()


def product_to_response(product: dict) -> ProductResponse:
    """Convert MongoDB product document to response schema."""
    return ProductResponse(
        id=str(product["_id"]),
        store_id=str(product["store_id"]),
        name=product["name"],
        category=product.get("category"),
        price=product["price"],
        description=product.get("description"),
        sizes=product.get("sizes", []),
        colors=product.get("colors", []),
        tags=product.get("tags", []),
        brand=product.get("brand"),
        stock=product.get("stock", -1),
        availability=product.get("availability", "show"),
        thumbnail_url=product.get("thumbnail_url"),
        image_urls=product.get("image_urls", []),
        last_updated_source=product.get("last_updated_source", "dashboard"),
        created_at=product["created_at"],
        updated_at=product["updated_at"],
    )


async def verify_store_ownership(store_id: str, user: dict, db) -> dict:
    """Verify that the user owns the store."""
    store = await db.stores.find_one({
        "_id": ObjectId(store_id),
        "owner_id": user["_id"],
    })
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    return store


@router.post("", response_model=ProductResponse)
async def create_product(store_id: str, product_data: ProductCreate, request: Request):
    """Create a new product."""
    user = await get_current_user(request, None)
    db = get_database()

    store = await verify_store_ownership(store_id, user, db)

    # Check product limit
    product_count = await db.products.count_documents({"store_id": ObjectId(store_id)})
    product_limit = store.get("premium", {}).get("product_limit", 50)

    if product_count >= product_limit:
        raise HTTPException(
            status_code=403,
            detail=f"Product limit reached ({product_limit}). Upgrade to add more products.",
        )

    # Create product document
    product_doc = {
        "store_id": ObjectId(store_id),
        "name": product_data.name,
        "category": product_data.category,
        "price": product_data.price,
        "description": product_data.description,
        "sizes": product_data.sizes,
        "colors": product_data.colors,
        "tags": product_data.tags,
        "brand": product_data.brand,
        "stock": product_data.stock,
        "availability": product_data.availability.value,
        "thumbnail_url": product_data.thumbnail_url,
        "image_urls": product_data.image_urls,
        "last_updated_source": "dashboard",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }

    result = await db.products.insert_one(product_doc)
    product_doc["_id"] = result.inserted_id

    return product_to_response(product_doc)


@router.get("", response_model=List[ProductResponse])
async def list_products(
    store_id: str,
    request: Request,
    category: Optional[str] = None,
    availability: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
):
    """List products for a store."""
    user = await get_current_user(request, None)
    db = get_database()

    await verify_store_ownership(store_id, user, db)

    # Build query
    query = {"store_id": ObjectId(store_id)}
    if category:
        query["category"] = category
    if availability:
        query["availability"] = availability

    # Paginate
    skip = (page - 1) * limit

    products = await db.products.find(query).skip(skip).limit(limit).to_list(length=limit)
    return [product_to_response(product) for product in products]


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(store_id: str, product_id: str, request: Request):
    """Get a specific product."""
    user = await get_current_user(request, None)
    db = get_database()

    await verify_store_ownership(store_id, user, db)

    product = await db.products.find_one({
        "_id": ObjectId(product_id),
        "store_id": ObjectId(store_id),
    })

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return product_to_response(product)


@router.patch("/{product_id}", response_model=ProductResponse)
async def update_product(
    store_id: str, product_id: str, product_data: ProductUpdate, request: Request
):
    """Update a product."""
    user = await get_current_user(request, None)
    db = get_database()

    await verify_store_ownership(store_id, user, db)

    # Check if product exists
    product = await db.products.find_one({
        "_id": ObjectId(product_id),
        "store_id": ObjectId(store_id),
    })

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Build update document
    update_doc = {
        "updated_at": datetime.utcnow(),
        "last_updated_source": "dashboard",
    }

    for field, value in product_data.model_dump(exclude_unset=True).items():
        if value is not None:
            update_doc[field] = value if not hasattr(value, "value") else value.value

    await db.products.update_one({"_id": ObjectId(product_id)}, {"$set": update_doc})

    # Fetch updated product
    updated_product = await db.products.find_one({"_id": ObjectId(product_id)})
    return product_to_response(updated_product)


@router.delete("/{product_id}")
async def delete_product(store_id: str, product_id: str, request: Request):
    """Delete a product."""
    user = await get_current_user(request, None)
    db = get_database()

    await verify_store_ownership(store_id, user, db)

    result = await db.products.delete_one({
        "_id": ObjectId(product_id),
        "store_id": ObjectId(store_id),
    })

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")

    return {"message": "Product deleted successfully"}


@router.post("/sync", response_model=SyncResponse)
async def sync_from_sheet(store_id: str, request: Request):
    """Force sync products from Google Sheet."""
    user = await get_current_user(request, None)
    db = get_database()

    store = await verify_store_ownership(store_id, user, db)

    sheet_id = store.get("sheets_config", {}).get("sheet_id")
    if not sheet_id:
        raise HTTPException(
            status_code=400,
            detail="No Google Sheet configured. Please add a sheet URL first.",
        )

    # TODO: Implement Google Sheets sync logic
    # This will be fully implemented in Track 1 (Backend Core)

    return SyncResponse(
        success=True,
        products_synced=0,
        products_skipped=0,
        errors=["Google Sheets sync not yet implemented"],
    )
