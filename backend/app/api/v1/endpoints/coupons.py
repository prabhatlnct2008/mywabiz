from fastapi import APIRouter, HTTPException, Depends, Request
from typing import List
from datetime import datetime
from bson import ObjectId

from app.core.database import get_database
from app.core.security import get_current_user
from app.schemas.coupon import (
    CouponCreate,
    CouponUpdate,
    CouponResponse,
    CouponValidateRequest,
    CouponValidateResponse,
)
from app.models.coupon import CouponStatusEnum

router = APIRouter()


async def check_premium_access(store_id: str, user: dict, db):
    """Check if store has premium access for coupons."""
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
            detail="Coupons are a premium feature. Please upgrade your plan.",
        )

    return store


def coupon_to_response(coupon: dict) -> CouponResponse:
    """Convert MongoDB coupon document to response schema."""
    return CouponResponse(
        id=str(coupon["_id"]),
        store_id=str(coupon["store_id"]),
        code=coupon["code"],
        type=coupon["type"],
        value=coupon["value"],
        status=coupon["status"],
        start_at=coupon.get("start_at"),
        end_at=coupon.get("end_at"),
        usage_limit=coupon["usage_limit"],
        used_count=coupon["used_count"],
        min_order_amount=coupon["min_order_amount"],
        created_at=coupon["created_at"],
        updated_at=coupon["updated_at"],
    )


@router.post("", response_model=CouponResponse)
async def create_coupon(
    store_id: str, coupon_data: CouponCreate, request: Request
):
    """Create a new coupon (premium only)."""
    user = await get_current_user(request, None)
    db = get_database()

    # Check premium access
    await check_premium_access(store_id, user, db)

    # Check if coupon code already exists for this store
    existing = await db.coupons.find_one({
        "store_id": ObjectId(store_id),
        "code": coupon_data.code,
    })

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Coupon code already exists for this store",
        )

    # Create coupon document
    coupon_doc = {
        "store_id": ObjectId(store_id),
        "code": coupon_data.code.upper(),  # Store codes in uppercase
        "type": coupon_data.type.value,
        "value": coupon_data.value,
        "status": CouponStatusEnum.ACTIVE.value,
        "start_at": coupon_data.start_at,
        "end_at": coupon_data.end_at,
        "usage_limit": coupon_data.usage_limit,
        "used_count": 0,
        "min_order_amount": coupon_data.min_order_amount,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }

    result = await db.coupons.insert_one(coupon_doc)
    coupon_doc["_id"] = result.inserted_id

    return coupon_to_response(coupon_doc)


@router.get("", response_model=List[CouponResponse])
async def list_coupons(store_id: str, request: Request):
    """List all coupons for a store."""
    user = await get_current_user(request, None)
    db = get_database()

    # Verify store ownership (but don't check premium for listing)
    store = await db.stores.find_one({
        "_id": ObjectId(store_id),
        "owner_id": user["_id"],
    })

    if not store:
        raise HTTPException(status_code=404, detail="Store not found")

    coupons = await db.coupons.find({"store_id": ObjectId(store_id)}).to_list(
        length=100
    )

    return [coupon_to_response(coupon) for coupon in coupons]


@router.patch("/{coupon_id}", response_model=CouponResponse)
async def update_coupon(
    store_id: str, coupon_id: str, coupon_data: CouponUpdate, request: Request
):
    """Update a coupon."""
    user = await get_current_user(request, None)
    db = get_database()

    # Check premium access
    await check_premium_access(store_id, user, db)

    # Check if coupon exists
    coupon = await db.coupons.find_one({
        "_id": ObjectId(coupon_id),
        "store_id": ObjectId(store_id),
    })

    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found")

    # Build update document
    update_doc = {"updated_at": datetime.utcnow()}

    for field, value in coupon_data.model_dump(exclude_unset=True).items():
        if value is not None:
            if field == "code":
                # Check if new code already exists
                existing = await db.coupons.find_one({
                    "store_id": ObjectId(store_id),
                    "code": value.upper(),
                    "_id": {"$ne": ObjectId(coupon_id)},
                })
                if existing:
                    raise HTTPException(
                        status_code=400,
                        detail="Coupon code already exists for this store",
                    )
                update_doc[field] = value.upper()
            else:
                update_doc[field] = value if not hasattr(value, "value") else value.value

    await db.coupons.update_one({"_id": ObjectId(coupon_id)}, {"$set": update_doc})

    # Fetch updated coupon
    updated_coupon = await db.coupons.find_one({"_id": ObjectId(coupon_id)})
    return coupon_to_response(updated_coupon)


@router.delete("/{coupon_id}")
async def delete_coupon(store_id: str, coupon_id: str, request: Request):
    """Delete a coupon."""
    user = await get_current_user(request, None)
    db = get_database()

    # Check premium access
    await check_premium_access(store_id, user, db)

    # Check if coupon exists
    coupon = await db.coupons.find_one({
        "_id": ObjectId(coupon_id),
        "store_id": ObjectId(store_id),
    })

    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found")

    await db.coupons.delete_one({"_id": ObjectId(coupon_id)})

    return {"message": "Coupon deleted successfully"}


@router.post("/validate", response_model=CouponValidateResponse)
async def validate_coupon(store_id: str, validate_data: CouponValidateRequest):
    """Validate a coupon code at checkout (public endpoint)."""
    db = get_database()

    # Find coupon
    coupon = await db.coupons.find_one({
        "store_id": ObjectId(store_id),
        "code": validate_data.code.upper(),
    })

    if not coupon:
        return CouponValidateResponse(
            valid=False, message="Invalid coupon code"
        )

    # Check if coupon is active
    if coupon["status"] != CouponStatusEnum.ACTIVE.value:
        return CouponValidateResponse(
            valid=False, message="Coupon is not active"
        )

    # Check start date
    now = datetime.utcnow()
    if coupon.get("start_at") and coupon["start_at"] > now:
        return CouponValidateResponse(
            valid=False, message="Coupon is not yet valid"
        )

    # Check end date
    if coupon.get("end_at") and coupon["end_at"] < now:
        return CouponValidateResponse(
            valid=False, message="Coupon has expired"
        )

    # Check usage limit
    if coupon["usage_limit"] > 0 and coupon["used_count"] >= coupon["usage_limit"]:
        return CouponValidateResponse(
            valid=False, message="Coupon usage limit reached"
        )

    # Check minimum order amount
    if validate_data.order_total < coupon["min_order_amount"]:
        return CouponValidateResponse(
            valid=False,
            message=f"Minimum order amount is {coupon['min_order_amount']}",
        )

    # Calculate discount
    discount_amount = 0.0
    if coupon["type"] == "flat":
        discount_amount = min(coupon["value"], validate_data.order_total)
    elif coupon["type"] == "percent":
        discount_amount = (validate_data.order_total * coupon["value"]) / 100

    return CouponValidateResponse(
        valid=True,
        discount_amount=discount_amount,
        message="Coupon applied successfully",
        coupon=coupon_to_response(coupon),
    )
