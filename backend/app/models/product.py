from pydantic import BaseModel, Field
from typing import Optional, List
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


class AvailabilityEnum(str, Enum):
    SHOW = "show"
    HIDE = "hide"


class UpdateSourceEnum(str, Enum):
    SHEET = "sheet"
    DASHBOARD = "dashboard"


class ProductModel(BaseModel):
    """Product model."""

    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    store_id: PyObjectId
    name: str
    category: Optional[str] = None
    price: float
    description: Optional[str] = None

    # Variants
    sizes: List[str] = []
    colors: List[str] = []
    tags: List[str] = []
    brand: Optional[str] = None

    # Stock
    stock: int = -1  # -1 means unlimited
    availability: AvailabilityEnum = AvailabilityEnum.SHOW

    # Images
    thumbnail_url: Optional[str] = None
    image_urls: List[str] = []

    # Sync tracking
    sheet_row_index: Optional[int] = None
    last_updated_source: UpdateSourceEnum = UpdateSourceEnum.DASHBOARD

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
