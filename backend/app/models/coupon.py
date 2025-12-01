from pydantic import BaseModel, Field
from typing import Optional
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


class CouponTypeEnum(str, Enum):
    FLAT = "flat"
    PERCENT = "percent"


class CouponStatusEnum(str, Enum):
    ACTIVE = "active"
    EXPIRED = "expired"
    DISABLED = "disabled"


class CouponModel(BaseModel):
    """Coupon model."""

    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    store_id: PyObjectId
    code: str
    type: CouponTypeEnum
    value: float

    status: CouponStatusEnum = CouponStatusEnum.ACTIVE
    start_at: Optional[datetime] = None
    end_at: Optional[datetime] = None

    usage_limit: int = -1  # -1 means unlimited
    used_count: int = 0
    min_order_amount: float = 0.0

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
