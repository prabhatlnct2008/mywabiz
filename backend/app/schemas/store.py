from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.models.store import (
    LanguageEnum,
    TemplateEnum,
    ThemeEnum,
    PlanEnum,
    StoreBranding,
    StoreSections,
    SheetsConfig,
    ShippingConfig,
    PaymentConfig,
)


class StoreCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    whatsapp_number: str = Field(..., min_length=10, max_length=15)
    language: LanguageEnum = LanguageEnum.EN
    template: TemplateEnum = TemplateEnum.MULTI_PURPOSE


class StoreUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    whatsapp_number: Optional[str] = Field(None, min_length=10, max_length=15)
    language: Optional[LanguageEnum] = None
    template: Optional[TemplateEnum] = None
    theme: Optional[ThemeEnum] = None
    branding: Optional[StoreBranding] = None
    sections: Optional[StoreSections] = None
    sheets_config: Optional[SheetsConfig] = None
    shipping: Optional[ShippingConfig] = None
    payments: Optional[PaymentConfig] = None


class StorePremiumResponse(BaseModel):
    plan: PlanEnum
    coupons_enabled: bool
    custom_pages_enabled: bool
    branding_removal: bool
    product_limit: int


class StoreResponse(BaseModel):
    id: str
    owner_id: str
    name: str
    slug: str
    url: Optional[str]
    whatsapp_number: str
    language: LanguageEnum
    template: TemplateEnum
    theme: ThemeEnum
    branding: StoreBranding
    sections: StoreSections
    premium: StorePremiumResponse
    sheets_config: SheetsConfig
    shipping: ShippingConfig
    payments: PaymentConfig
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class StoreStats(BaseModel):
    orders_count: int
    sales_total: float
    visits: int
    timeframe: str
