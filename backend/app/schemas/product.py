from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.models.product import AvailabilityEnum, UpdateSourceEnum


class ProductCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    category: Optional[str] = None
    price: float = Field(..., gt=0)
    description: Optional[str] = None
    sizes: List[str] = []
    colors: List[str] = []
    tags: List[str] = []
    brand: Optional[str] = None
    stock: int = -1
    availability: AvailabilityEnum = AvailabilityEnum.SHOW
    thumbnail_url: Optional[str] = None
    image_urls: List[str] = []


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    category: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    description: Optional[str] = None
    sizes: Optional[List[str]] = None
    colors: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    brand: Optional[str] = None
    stock: Optional[int] = None
    availability: Optional[AvailabilityEnum] = None
    thumbnail_url: Optional[str] = None
    image_urls: Optional[List[str]] = None


class ProductResponse(BaseModel):
    id: str
    store_id: str
    name: str
    category: Optional[str]
    price: float
    description: Optional[str]
    sizes: List[str]
    colors: List[str]
    tags: List[str]
    brand: Optional[str]
    stock: int
    availability: AvailabilityEnum
    thumbnail_url: Optional[str]
    image_urls: List[str]
    last_updated_source: UpdateSourceEnum
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SyncResponse(BaseModel):
    success: bool
    products_synced: int
    products_skipped: int
    errors: List[str] = []
