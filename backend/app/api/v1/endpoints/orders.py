from fastapi import APIRouter, HTTPException, Request, Query
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
import uuid
from urllib.parse import quote

from app.core.database import get_database
from app.core.security import get_current_user
from app.schemas.order import OrderCreate, OrderUpdate, OrderResponse, OrderTrackingResponse

router = APIRouter()


def order_to_response(order: dict, whatsapp_url: Optional[str] = None) -> OrderResponse:
    """Convert MongoDB order document to response schema."""
    return OrderResponse(
        id=str(order["_id"]),
        store_id=str(order["store_id"]),
        order_number=order["order_number"],
        customer=order["customer"],
        items=order["items"],
        currency=order.get("currency", "INR"),
        subtotal=order["subtotal"],
        shipping_method=order["shipping_method"],
        shipping_fee=order.get("shipping_fee", 0),
        discount_amount=order.get("discount_amount", 0),
        coupon_code=order.get("coupon_code"),
        total=order["total"],
        payment_method=order.get("payment_method", "cash"),
        payment_status=order.get("payment_status", "pending"),
        status=order["status"],
        track_token=order["track_token"],
        whatsapp_url=whatsapp_url,
        created_at=order["created_at"],
        updated_at=order["updated_at"],
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


async def get_next_order_number(store_id: str, db) -> str:
    """Generate the next sequential order number for a store."""
    last_order = await db.orders.find_one(
        {"store_id": ObjectId(store_id)},
        sort=[("created_at", -1)],
    )

    if last_order:
        try:
            last_num = int(last_order["order_number"])
            return str(last_num + 1)
        except ValueError:
            pass

    return "10001"


def generate_whatsapp_message(order: dict, store: dict) -> str:
    """Generate WhatsApp order message in store's language."""
    # TODO: Implement full i18n support in Track 1
    # For now, using English template

    lines = [
        f"Order from {store['slug']}.mywabiz.in",
        "",
        f"Order Number: {order['order_number']}",
        f"Date: {order['created_at'].strftime('%d/%m/%Y')}",
        f"Name: {order['customer']['name']}",
    ]

    if order["customer"].get("email"):
        lines.append(f"Email: {order['customer']['email']}")
    lines.append(f"Phone: {order['customer']['phone']}")
    lines.append("")
    lines.append("Products:")

    for item in order["items"]:
        variant_info = ""
        if item.get("size") or item.get("color"):
            variants = []
            if item.get("size"):
                variants.append(f"Size - {item['size']}")
            if item.get("color"):
                variants.append(f"Color - {item['color']}")
            variant_info = f" ( {', '.join(variants)} )"
        lines.append(f"{item['quantity']} x {item['name']}{variant_info}")

    lines.append("")
    lines.append(f"Shipping: {'Delivery' if order['shipping_method'] == 'delivery' else 'Pickup'}")

    if order["customer"].get("address"):
        lines.append(f"Address: {order['customer']['address']}")

    lines.append(f"Payment Method: {order.get('payment_method', 'Cash').title()}")
    lines.append(f"Total: ₹{order['total']}")
    lines.append("")

    track_url = f"https://{store['slug']}.mywabiz.in/orders/{order['track_token']}"
    lines.append(f"You can track your order at {track_url}")

    return "\n".join(lines)


@router.post("", response_model=OrderResponse)
async def create_order(store_id: str, order_data: OrderCreate, request: Request):
    """Create a new order (public endpoint for buyers)."""
    db = get_database()

    # Get store (no auth required for order creation)
    store = await db.stores.find_one({"_id": ObjectId(store_id)})
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")

    # Validate products and build order items
    order_items = []
    subtotal = 0.0

    for item in order_data.items:
        product = await db.products.find_one({
            "_id": ObjectId(item.product_id),
            "store_id": ObjectId(store_id),
            "availability": "show",
        })

        if not product:
            raise HTTPException(
                status_code=400,
                detail=f"Product {item.product_id} not found or unavailable",
            )

        # Check stock
        if product["stock"] != -1 and product["stock"] < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for {product['name']}",
            )

        line_total = product["price"] * item.quantity
        subtotal += line_total

        order_items.append({
            "product_id": ObjectId(item.product_id),
            "name": product["name"],
            "size": item.size,
            "color": item.color,
            "quantity": item.quantity,
            "unit_price": product["price"],
            "line_total": line_total,
        })

    # Calculate shipping fee
    shipping_fee = 0.0
    if order_data.shipping_method.value == "delivery":
        shipping_fee = store.get("shipping", {}).get("delivery_fee", 0)

    # Apply coupon if provided
    discount_amount = 0.0
    if order_data.coupon_code:
        # TODO: Validate coupon in Track 4 (Premium)
        pass

    total = subtotal + shipping_fee - discount_amount

    # Generate order number and track token
    order_number = await get_next_order_number(store_id, db)
    track_token = str(uuid.uuid4())

    # Create order document
    order_doc = {
        "store_id": ObjectId(store_id),
        "order_number": order_number,
        "customer": order_data.customer.model_dump(),
        "items": order_items,
        "currency": "INR",
        "subtotal": subtotal,
        "shipping_method": order_data.shipping_method.value,
        "shipping_fee": shipping_fee,
        "discount_amount": discount_amount,
        "coupon_code": order_data.coupon_code,
        "total": total,
        "payment_method": order_data.payment_method.value,
        "payment_status": "pending",
        "status": "initiated",
        "track_token": track_token,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }

    # Generate WhatsApp message
    whatsapp_message = generate_whatsapp_message(order_doc, store)
    order_doc["whatsapp_message"] = whatsapp_message

    # Insert order
    result = await db.orders.insert_one(order_doc)
    order_doc["_id"] = result.inserted_id

    # Update order status
    await db.orders.update_one(
        {"_id": result.inserted_id},
        {"$set": {"status": "sent_to_whatsapp"}},
    )
    order_doc["status"] = "sent_to_whatsapp"

    # Update stock for each product
    for item in order_items:
        await db.products.update_one(
            {"_id": item["product_id"], "stock": {"$gt": 0}},
            {"$inc": {"stock": -item["quantity"]}},
        )

    # Generate WhatsApp URL
    whatsapp_number = store["whatsapp_number"].replace("+", "").replace(" ", "")
    encoded_message = quote(whatsapp_message)
    whatsapp_url = f"https://wa.me/{whatsapp_number}?text={encoded_message}"

    return order_to_response(order_doc, whatsapp_url)


@router.get("", response_model=List[OrderResponse])
async def list_orders(
    store_id: str,
    request: Request,
    status: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
):
    """List orders for a store (merchant only)."""
    user = await get_current_user(request, None)
    db = get_database()

    await verify_store_ownership(store_id, user, db)

    # Build query
    query = {"store_id": ObjectId(store_id)}
    if status:
        query["status"] = status

    # Paginate
    skip = (page - 1) * limit

    orders = await db.orders.find(query).sort("created_at", -1).skip(skip).limit(limit).to_list(length=limit)
    return [order_to_response(order) for order in orders]


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(store_id: str, order_id: str, request: Request):
    """Get a specific order (merchant only)."""
    user = await get_current_user(request, None)
    db = get_database()

    await verify_store_ownership(store_id, user, db)

    order = await db.orders.find_one({
        "_id": ObjectId(order_id),
        "store_id": ObjectId(store_id),
    })

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    return order_to_response(order)


@router.patch("/{order_id}", response_model=OrderResponse)
async def update_order(
    store_id: str, order_id: str, order_data: OrderUpdate, request: Request
):
    """Update order status (merchant only)."""
    user = await get_current_user(request, None)
    db = get_database()

    await verify_store_ownership(store_id, user, db)

    # Check if order exists
    order = await db.orders.find_one({
        "_id": ObjectId(order_id),
        "store_id": ObjectId(store_id),
    })

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Build update document
    update_doc = {"updated_at": datetime.utcnow()}

    if order_data.status:
        update_doc["status"] = order_data.status.value
    if order_data.payment_status:
        update_doc["payment_status"] = order_data.payment_status.value

    await db.orders.update_one({"_id": ObjectId(order_id)}, {"$set": update_doc})

    # Fetch updated order
    updated_order = await db.orders.find_one({"_id": ObjectId(order_id)})
    return order_to_response(updated_order)
