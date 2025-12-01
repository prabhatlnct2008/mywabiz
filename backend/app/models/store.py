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


class LanguageEnum(str, Enum):
    EN = "en"
    HI = "hi"
    PA = "pa"
    HR = "hr"
    GU = "gu"


class TemplateEnum(str, Enum):
    MULTI_PURPOSE = "multi-purpose"
    QUICK_ORDER = "quick-order"
    WHOLESALE = "wholesale"
    DIGITAL_DOWNLOAD = "digital-download"
    SERVICE_BOOKING = "service-booking"
    LINKS_LIST = "links-list"
    BLANK = "blank"


class ThemeEnum(str, Enum):
    MINIMAL = "minimal"
    BOLD = "bold"
    DARK = "dark"


class PlanEnum(str, Enum):
    STARTER = "starter"
    GROWTH = "growth"
    PRO = "pro"


class SyncStatusEnum(str, Enum):
    IDLE = "idle"
    SYNCING = "syncing"
    ERROR = "error"


class StoreBranding(BaseModel):
    logo_url: Optional[str] = None
    brand_color: str = "#22C55E"
    banner_url: Optional[str] = None
    banner_text: Optional[str] = None


class StoreSections(BaseModel):
    header: bool = True
    banner: bool = False
    products: bool = True
    footer: bool = True


class StorePremium(BaseModel):
    plan: PlanEnum = PlanEnum.STARTER
    coupons_enabled: bool = False
    custom_pages_enabled: bool = False
    branding_removal: bool = False
    product_limit: int = 50


class SheetsConfig(BaseModel):
    sheet_id: Optional[str] = None
    sheet_url: Optional[str] = None
    last_synced_at: Optional[datetime] = None
    sync_status: SyncStatusEnum = SyncStatusEnum.IDLE
    sync_error: Optional[str] = None


class ShippingConfig(BaseModel):
    pickup_enabled: bool = True
    pickup_address: Optional[str] = None
    delivery_enabled: bool = True
    delivery_fee: float = 0.0
    delivery_zones: List[str] = []


class PaymentConfig(BaseModel):
    cod_enabled: bool = True
    paypal_enabled: bool = False
    paypal_client_id: Optional[str] = None


class StoreModel(BaseModel):
    """Store model."""

    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    owner_id: PyObjectId
    name: str
    slug: str
    url: Optional[str] = None
    whatsapp_number: str
    language: LanguageEnum = LanguageEnum.EN
    template: TemplateEnum = TemplateEnum.MULTI_PURPOSE

    branding: StoreBranding = Field(default_factory=StoreBranding)
    sections: StoreSections = Field(default_factory=StoreSections)
    theme: ThemeEnum = ThemeEnum.MINIMAL
    premium: StorePremium = Field(default_factory=StorePremium)
    sheets_config: SheetsConfig = Field(default_factory=SheetsConfig)
    shipping: ShippingConfig = Field(default_factory=ShippingConfig)
    payments: PaymentConfig = Field(default_factory=PaymentConfig)

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
