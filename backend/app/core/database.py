from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from typing import Optional
from app.core.config import settings

# Global database client
client: Optional[AsyncIOMotorClient] = None
db: Optional[AsyncIOMotorDatabase] = None


async def connect_to_mongo():
    """Connect to MongoDB."""
    global client, db
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]

    # Create indexes
    await create_indexes()

    print(f"Connected to MongoDB: {settings.MONGODB_DB_NAME}")


async def close_mongo_connection():
    """Close MongoDB connection."""
    global client
    if client:
        client.close()
        print("Closed MongoDB connection")


async def create_indexes():
    """Create database indexes for optimal query performance."""
    global db
    if db is None:
        return

    # Users indexes
    await db.users.create_index("google_id", unique=True)
    await db.users.create_index("email", unique=True)

    # Stores indexes
    await db.stores.create_index("owner_id")
    await db.stores.create_index("slug", unique=True)

    # Products indexes
    await db.products.create_index([("store_id", 1), ("category", 1)])
    await db.products.create_index([("store_id", 1), ("availability", 1)])

    # Orders indexes
    await db.orders.create_index([("store_id", 1), ("created_at", -1)])
    await db.orders.create_index([("store_id", 1), ("status", 1)])
    await db.orders.create_index("track_token", unique=True)

    # Coupons indexes
    await db.coupons.create_index([("store_id", 1), ("code", 1)], unique=True)
    await db.coupons.create_index([("store_id", 1), ("status", 1)])

    # Analytics indexes
    await db.analytics_snapshots.create_index([("store_id", 1), ("date", -1)])

    print("Database indexes created")


def get_database() -> AsyncIOMotorDatabase:
    """Get database instance."""
    if db is None:
        raise RuntimeError("Database not initialized. Call connect_to_mongo first.")
    return db
