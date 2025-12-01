from fastapi import APIRouter
from app.api.v1.endpoints import auth, stores, products, orders, public

api_router = APIRouter()

# Auth routes
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])

# Store routes (protected)
api_router.include_router(stores.router, prefix="/stores", tags=["Stores"])

# Product routes (protected)
api_router.include_router(products.router, prefix="/stores/{store_id}/products", tags=["Products"])

# Order routes (protected for merchants)
api_router.include_router(orders.router, prefix="/stores/{store_id}/orders", tags=["Orders"])

# Public routes (no auth required)
api_router.include_router(public.router, prefix="/public", tags=["Public"])
