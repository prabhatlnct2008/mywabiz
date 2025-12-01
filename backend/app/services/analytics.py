"""Analytics Service for tracking store metrics and performance."""

from typing import Dict, Any, Optional
from datetime import datetime, timedelta
from bson import ObjectId


TIMEFRAME_DAYS = {
    "1d": 1,
    "7d": 7,
    "30d": 30,
    "90d": 90,
}


async def aggregate_orders_by_timeframe(
    db,
    store_id: str,
    timeframe: str = "30d",
) -> Dict[str, Any]:
    """
    Aggregate orders for a store by timeframe.

    Args:
        db: Database instance
        store_id: Store ID
        timeframe: Time period (1d, 7d, 30d, 90d)

    Returns:
        Dictionary with:
        - orders_count: Number of orders in timeframe
        - sales_total: Total sales amount in timeframe
        - timeframe: Timeframe used
        - start_date: Start date of the period
        - end_date: End date of the period
    """
    # Get number of days for timeframe
    days = TIMEFRAME_DAYS.get(timeframe, 30)

    # Calculate date range
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=days)

    # Query orders in timeframe
    query = {
        "store_id": ObjectId(store_id),
        "created_at": {
            "$gte": start_date,
            "$lte": end_date,
        },
    }

    # Count orders
    orders_count = await db.orders.count_documents(query)

    # Calculate total sales using aggregation pipeline
    pipeline = [
        {"$match": query},
        {
            "$group": {
                "_id": None,
                "total_sales": {"$sum": "$total"},
            }
        },
    ]

    result = await db.orders.aggregate(pipeline).to_list(length=1)
    sales_total = result[0]["total_sales"] if result else 0.0

    return {
        "orders_count": orders_count,
        "sales_total": sales_total,
        "timeframe": timeframe,
        "start_date": start_date,
        "end_date": end_date,
    }


async def get_store_analytics(
    db,
    store_id: str,
    timeframes: Optional[list] = None,
) -> Dict[str, Any]:
    """
    Get comprehensive analytics for a store across multiple timeframes.

    Args:
        db: Database instance
        store_id: Store ID
        timeframes: List of timeframes to calculate (default: ["1d", "7d", "30d", "90d"])

    Returns:
        Dictionary with analytics for each timeframe
    """
    if timeframes is None:
        timeframes = ["1d", "7d", "30d", "90d"]

    analytics = {}

    for timeframe in timeframes:
        analytics[timeframe] = await aggregate_orders_by_timeframe(
            db, store_id, timeframe
        )

    # Add total product count
    total_products = await db.products.count_documents({
        "store_id": ObjectId(store_id),
        "availability": "show",
    })

    analytics["total_products"] = total_products

    # Add total orders (all time)
    total_orders = await db.orders.count_documents({
        "store_id": ObjectId(store_id),
    })

    analytics["total_orders"] = total_orders

    return analytics


async def track_page_visit(
    db,
    store_id: str,
    page_type: str = "store",
    visitor_info: Optional[Dict] = None,
) -> bool:
    """
    Track a page visit by incrementing counter.

    Args:
        db: Database instance
        store_id: Store ID
        page_type: Type of page visited (store, product, order_tracking)
        visitor_info: Optional visitor information (IP, user agent, etc.)

    Returns:
        True if tracking successful
    """
    try:
        # Get current date (for daily tracking)
        today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)

        # Create or update analytics snapshot
        filter_query = {
            "store_id": ObjectId(store_id),
            "date": today,
        }

        update_query = {
            "$inc": {
                f"visits.{page_type}": 1,
                "visits.total": 1,
            },
            "$setOnInsert": {
                "store_id": ObjectId(store_id),
                "date": today,
                "created_at": datetime.utcnow(),
            },
            "$set": {
                "updated_at": datetime.utcnow(),
            },
        }

        await db.analytics_snapshots.update_one(
            filter_query,
            update_query,
            upsert=True,
        )

        # Optionally store detailed visitor log
        if visitor_info:
            visitor_log = {
                "store_id": ObjectId(store_id),
                "page_type": page_type,
                "visitor_info": visitor_info,
                "timestamp": datetime.utcnow(),
            }
            await db.visitor_logs.insert_one(visitor_log)

        return True

    except Exception as e:
        # Log error but don't fail the request
        print(f"Error tracking page visit: {str(e)}")
        return False


async def get_analytics_snapshots(
    db,
    store_id: str,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    limit: int = 30,
) -> list:
    """
    Get analytics snapshots for a store within a date range.

    Args:
        db: Database instance
        store_id: Store ID
        start_date: Start date (default: 30 days ago)
        end_date: End date (default: today)
        limit: Maximum number of snapshots to return

    Returns:
        List of analytics snapshots
    """
    # Set default date range
    if end_date is None:
        end_date = datetime.utcnow().replace(hour=23, minute=59, second=59, microsecond=999999)

    if start_date is None:
        start_date = end_date - timedelta(days=30)
        start_date = start_date.replace(hour=0, minute=0, second=0, microsecond=0)

    # Query snapshots
    query = {
        "store_id": ObjectId(store_id),
        "date": {
            "$gte": start_date,
            "$lte": end_date,
        },
    }

    snapshots = await db.analytics_snapshots.find(query).sort("date", -1).limit(limit).to_list(length=limit)

    # Convert ObjectId to string for JSON serialization
    for snapshot in snapshots:
        snapshot["_id"] = str(snapshot["_id"])
        snapshot["store_id"] = str(snapshot["store_id"])

    return snapshots


async def get_top_products(
    db,
    store_id: str,
    timeframe: str = "30d",
    limit: int = 10,
) -> list:
    """
    Get top-selling products for a store.

    Args:
        db: Database instance
        store_id: Store ID
        timeframe: Time period (1d, 7d, 30d, 90d)
        limit: Maximum number of products to return

    Returns:
        List of top products with sales data
    """
    # Get number of days for timeframe
    days = TIMEFRAME_DAYS.get(timeframe, 30)

    # Calculate date range
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=days)

    # Aggregation pipeline to get top products
    pipeline = [
        {
            "$match": {
                "store_id": ObjectId(store_id),
                "created_at": {
                    "$gte": start_date,
                    "$lte": end_date,
                },
            }
        },
        {"$unwind": "$items"},
        {
            "$group": {
                "_id": "$items.product_id",
                "product_name": {"$first": "$items.name"},
                "total_quantity": {"$sum": "$items.quantity"},
                "total_revenue": {"$sum": "$items.line_total"},
                "order_count": {"$sum": 1},
            }
        },
        {"$sort": {"total_revenue": -1}},
        {"$limit": limit},
    ]

    top_products = await db.orders.aggregate(pipeline).to_list(length=limit)

    # Convert ObjectId to string
    for product in top_products:
        product["product_id"] = str(product["_id"])
        del product["_id"]

    return top_products


async def get_revenue_by_day(
    db,
    store_id: str,
    days: int = 30,
) -> list:
    """
    Get daily revenue for a store over a period.

    Args:
        db: Database instance
        store_id: Store ID
        days: Number of days to retrieve

    Returns:
        List of daily revenue data with date and total
    """
    # Calculate date range
    end_date = datetime.utcnow().replace(hour=23, minute=59, second=59, microsecond=999999)
    start_date = end_date - timedelta(days=days)
    start_date = start_date.replace(hour=0, minute=0, second=0, microsecond=0)

    # Aggregation pipeline to group by date
    pipeline = [
        {
            "$match": {
                "store_id": ObjectId(store_id),
                "created_at": {
                    "$gte": start_date,
                    "$lte": end_date,
                },
            }
        },
        {
            "$group": {
                "_id": {
                    "$dateToString": {
                        "format": "%Y-%m-%d",
                        "date": "$created_at"
                    }
                },
                "revenue": {"$sum": "$total"},
                "orders": {"$sum": 1},
            }
        },
        {"$sort": {"_id": 1}},
    ]

    daily_data = await db.orders.aggregate(pipeline).to_list(length=days)

    # Format response
    revenue_data = []
    for item in daily_data:
        revenue_data.append({
            "date": item["_id"],
            "revenue": item["revenue"],
            "orders": item["orders"],
        })

    return revenue_data
