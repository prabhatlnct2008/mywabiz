from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.models.order import (
    ShippingMethodEnum,
    PaymentMethodEnum,
    PaymentStatusEnum,
    OrderStatusEnum,
)


class OrderItemCreate(BaseModel):
    product_id: str
    size: Optional[str] = None
    color: Optional[str] = None
    quantity: int = Field(..., gt=0)


class OrderCustomerCreate(BaseModel):
    name: str = Field(..., min_length=1)
    email: Optional[str] = None
    phone: str = Field(..., min_length=10)
    address: Optional[str] = None
    custom_fields: Dict[str, Any] = {}


class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    customer: OrderCustomerCreate
    shipping_method: ShippingMethodEnum
    coupon_code: Optional[str] = None
    payment_method: PaymentMethodEnum = PaymentMethodEnum.CASH


class OrderUpdate(BaseModel):
    status: Optional[OrderStatusEnum] = None
    payment_status: Optional[PaymentStatusEnum] = None


class OrderItemResponse(BaseModel):
    product_id: str
    name: str
    size: Optional[str]
    color: Optional[str]
    quantity: int
    unit_price: float
    line_total: float


class OrderCustomerResponse(BaseModel):
    name: str
    email: Optional[str]
    phone: str
    address: Optional[str]
    custom_fields: Dict[str, Any]


class OrderResponse(BaseModel):
    id: str
    store_id: str
    order_number: str
    customer: OrderCustomerResponse
    items: List[OrderItemResponse]
    currency: str
    subtotal: float
    shipping_method: ShippingMethodEnum
    shipping_fee: float
    discount_amount: float
    coupon_code: Optional[str]
    total: float
    payment_method: PaymentMethodEnum
    payment_status: PaymentStatusEnum
    status: OrderStatusEnum
    track_token: str
    whatsapp_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class OrderTrackingResponse(BaseModel):
    order_number: str
    status: OrderStatusEnum
    items: List[OrderItemResponse]
    total: float
    currency: str
    created_at: datetime
    store_name: str
    store_whatsapp: str
