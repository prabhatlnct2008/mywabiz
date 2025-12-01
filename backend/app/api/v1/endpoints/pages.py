from fastapi import APIRouter, HTTPException, Depends, Request
from typing import List
from datetime import datetime
from bson import ObjectId
import re

from app.core.database import get_database
from app.core.security import get_current_user
from app.schemas.custom_page import (
    CustomPageCreate,
    CustomPageUpdate,
    CustomPageResponse,
)

router = APIRouter()


async def check_premium_access(store_id: str, user: dict, db):
    """Check if store has premium access for custom pages."""
    store = await db.stores.find_one({
        "_id": ObjectId(store_id),
        "owner_id": user["_id"],
    })

    if not store:
        raise HTTPException(status_code=404, detail="Store not found")

    # Check if plan is starter (not premium)
    if store.get("premium", {}).get("plan") == "starter":
        raise HTTPException(
            status_code=403,
            detail="Custom pages are a premium feature. Please upgrade your plan.",
        )

    return store


def sanitize_slug(slug: str) -> str:
    """Sanitize slug to be URL-friendly."""
    slug = slug.lower().strip()
    slug = re.sub(r"[^a-z0-9]+", "-", slug)
    slug = slug.strip("-")
    return slug


def page_to_response(page: dict) -> CustomPageResponse:
    """Convert MongoDB page document to response schema."""
    return CustomPageResponse(
        id=str(page["_id"]),
        store_id=str(page["store_id"]),
        title=page["title"],
        slug=page["slug"],
        content=page["content"],
        status=page["status"],
        created_at=page["created_at"],
        updated_at=page["updated_at"],
    )


@router.post("", response_model=CustomPageResponse)
async def create_page(store_id: str, page_data: CustomPageCreate, request: Request):
    """Create a new custom page (premium only)."""
    user = await get_current_user(request, None)
    db = get_database()

    # Check premium access
    await check_premium_access(store_id, user, db)

    # Sanitize slug
    slug = sanitize_slug(page_data.slug)

    # Check if slug already exists for this store
    existing = await db.custom_pages.find_one({
        "store_id": ObjectId(store_id),
        "slug": slug,
    })

    if existing:
        raise HTTPException(
            status_code=400,
            detail="A page with this slug already exists for this store",
        )

    # Create page document
    page_doc = {
        "store_id": ObjectId(store_id),
        "title": page_data.title,
        "slug": slug,
        "content": page_data.content,
        "status": page_data.status.value,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }

    result = await db.custom_pages.insert_one(page_doc)
    page_doc["_id"] = result.inserted_id

    return page_to_response(page_doc)


@router.get("", response_model=List[CustomPageResponse])
async def list_pages(store_id: str, request: Request):
    """List all custom pages for a store."""
    user = await get_current_user(request, None)
    db = get_database()

    # Verify store ownership (but don't check premium for listing)
    store = await db.stores.find_one({
        "_id": ObjectId(store_id),
        "owner_id": user["_id"],
    })

    if not store:
        raise HTTPException(status_code=404, detail="Store not found")

    pages = await db.custom_pages.find({"store_id": ObjectId(store_id)}).to_list(
        length=100
    )

    return [page_to_response(page) for page in pages]


@router.get("/{page_id}", response_model=CustomPageResponse)
async def get_page(store_id: str, page_id: str, request: Request):
    """Get a specific custom page."""
    user = await get_current_user(request, None)
    db = get_database()

    # Verify store ownership
    store = await db.stores.find_one({
        "_id": ObjectId(store_id),
        "owner_id": user["_id"],
    })

    if not store:
        raise HTTPException(status_code=404, detail="Store not found")

    page = await db.custom_pages.find_one({
        "_id": ObjectId(page_id),
        "store_id": ObjectId(store_id),
    })

    if not page:
        raise HTTPException(status_code=404, detail="Page not found")

    return page_to_response(page)


@router.patch("/{page_id}", response_model=CustomPageResponse)
async def update_page(
    store_id: str, page_id: str, page_data: CustomPageUpdate, request: Request
):
    """Update a custom page."""
    user = await get_current_user(request, None)
    db = get_database()

    # Check premium access
    await check_premium_access(store_id, user, db)

    # Check if page exists
    page = await db.custom_pages.find_one({
        "_id": ObjectId(page_id),
        "store_id": ObjectId(store_id),
    })

    if not page:
        raise HTTPException(status_code=404, detail="Page not found")

    # Build update document
    update_doc = {"updated_at": datetime.utcnow()}

    for field, value in page_data.model_dump(exclude_unset=True).items():
        if value is not None:
            if field == "slug":
                # Sanitize and check if new slug already exists
                new_slug = sanitize_slug(value)
                existing = await db.custom_pages.find_one({
                    "store_id": ObjectId(store_id),
                    "slug": new_slug,
                    "_id": {"$ne": ObjectId(page_id)},
                })
                if existing:
                    raise HTTPException(
                        status_code=400,
                        detail="A page with this slug already exists for this store",
                    )
                update_doc[field] = new_slug
            else:
                update_doc[field] = value if not hasattr(value, "value") else value.value

    await db.custom_pages.update_one({"_id": ObjectId(page_id)}, {"$set": update_doc})

    # Fetch updated page
    updated_page = await db.custom_pages.find_one({"_id": ObjectId(page_id)})
    return page_to_response(updated_page)


@router.delete("/{page_id}")
async def delete_page(store_id: str, page_id: str, request: Request):
    """Delete a custom page."""
    user = await get_current_user(request, None)
    db = get_database()

    # Check premium access
    await check_premium_access(store_id, user, db)

    # Check if page exists
    page = await db.custom_pages.find_one({
        "_id": ObjectId(page_id),
        "store_id": ObjectId(store_id),
    })

    if not page:
        raise HTTPException(status_code=404, detail="Page not found")

    await db.custom_pages.delete_one({"_id": ObjectId(page_id)})

    return {"message": "Page deleted successfully"}
