from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum
from bson import ObjectId


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, handler):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, core_schema, handler):
        return {"type": "string"}


class ShippingMethodEnum(str, Enum):
    PICKUP = "pickup"
    DELIVERY = "delivery"


class PaymentMethodEnum(str, Enum):
    CASH = "cash"
    PAYPAL = "paypal"


class PaymentStatusEnum(str, Enum):
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"


class OrderStatusEnum(str, Enum):
    INITIATED = "initiated"
    SENT_TO_WHATSAPP = "sent_to_whatsapp"
    CONFIRMED = "confirmed"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class OrderCustomer(BaseModel):
    name: str
    email: Optional[str] = None
    phone: str
    address: Optional[str] = None
    custom_fields: Dict[str, Any] = {}


class OrderItem(BaseModel):
    product_id: PyObjectId
    name: str
    size: Optional[str] = None
    color: Optional[str] = None
    quantity: int
    unit_price: float
    line_total: float


class OrderModel(BaseModel):
    """Order model."""

    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    store_id: PyObjectId
    order_number: str

    customer: OrderCustomer
    items: List[OrderItem]

    currency: str = "INR"
    subtotal: float
    shipping_method: ShippingMethodEnum
    shipping_fee: float = 0.0
    discount_amount: float = 0.0
    coupon_code: Optional[str] = None
    total: float

    payment_method: PaymentMethodEnum = PaymentMethodEnum.CASH
    payment_status: PaymentStatusEnum = PaymentStatusEnum.PENDING
    paypal_order_id: Optional[str] = None

    status: OrderStatusEnum = OrderStatusEnum.INITIATED
    track_token: str

    whatsapp_message: Optional[str] = None

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
