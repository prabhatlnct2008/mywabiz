"""Google Sheets Sync Service for product synchronization."""

import re
import json
from typing import Dict, List, Optional, Tuple
from datetime import datetime
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from bson import ObjectId

from app.core.config import settings


def parse_sheet_url(url: str) -> Optional[str]:
    """
    Parse Google Sheet URL and extract Sheet ID.

    Args:
        url: Google Sheet URL

    Returns:
        Sheet ID if found, None otherwise

    Examples:
        https://docs.google.com/spreadsheets/d/SHEET_ID/edit...
        https://docs.google.com/spreadsheets/d/SHEET_ID
    """
    patterns = [
        r'/spreadsheets/d/([a-zA-Z0-9-_]+)',
        r'id=([a-zA-Z0-9-_]+)',
    ]

    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)

    return None


def get_sheets_service():
    """
    Create and return Google Sheets API service.

    Returns:
        Google Sheets API service instance

    Raises:
        ValueError: If GOOGLE_SERVICE_ACCOUNT_JSON is not configured
    """
    if not settings.GOOGLE_SERVICE_ACCOUNT_JSON:
        raise ValueError("GOOGLE_SERVICE_ACCOUNT_JSON not configured")

    try:
        # Parse service account JSON
        service_account_info = json.loads(settings.GOOGLE_SERVICE_ACCOUNT_JSON)

        # Create credentials
        credentials = service_account.Credentials.from_service_account_info(
            service_account_info,
            scopes=['https://www.googleapis.com/auth/spreadsheets.readonly']
        )

        # Build and return service
        service = build('sheets', 'v4', credentials=credentials)
        return service

    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid GOOGLE_SERVICE_ACCOUNT_JSON format: {str(e)}")
    except Exception as e:
        raise ValueError(f"Failed to create Google Sheets service: {str(e)}")


async def fetch_sheet_data(sheet_id: str, range_name: str = "Sheet1") -> List[List[str]]:
    """
    Fetch data from Google Sheet using Sheets API v4.

    Args:
        sheet_id: Google Sheet ID
        range_name: Sheet range to fetch (default: Sheet1)

    Returns:
        List of rows, where each row is a list of cell values

    Raises:
        HttpError: If API request fails
        ValueError: If sheet is empty or invalid
    """
    try:
        service = get_sheets_service()

        # Call the Sheets API
        sheet = service.spreadsheets()
        result = sheet.values().get(
            spreadsheetId=sheet_id,
            range=range_name
        ).execute()

        values = result.get('values', [])

        if not values:
            raise ValueError("Sheet is empty")

        return values

    except HttpError as e:
        error_details = e.error_details if hasattr(e, 'error_details') else str(e)
        raise HttpError(e.resp, e.content, uri=e.uri) from e


def validate_product_row(row: List[str], row_index: int) -> Tuple[bool, Optional[str], Optional[Dict]]:
    """
    Validate a product row from the sheet.

    Expected columns (case-insensitive headers):
    - Name (required)
    - Price (required)
    - Category (optional)
    - Description (optional)
    - Sizes (optional, comma-separated)
    - Colors (optional, comma-separated)
    - Tags (optional, comma-separated)
    - Brand (optional)
    - Stock (optional, -1 for unlimited)
    - Thumbnail URL (optional)

    Args:
        row: List of cell values from the sheet
        row_index: Row index (for tracking)

    Returns:
        Tuple of (is_valid, error_message, product_data)
    """
    # Skip if row is completely empty
    if not row or all(cell.strip() == "" for cell in row):
        return False, "Empty row", None

    # Ensure we have at least 2 columns (Name and Price)
    if len(row) < 2:
        return False, "Row must have at least Name and Price columns", None

    # Extract and validate required fields
    name = row[0].strip() if len(row) > 0 else ""
    price_str = row[1].strip() if len(row) > 1 else ""

    if not name:
        return False, "Name is required", None

    if not price_str:
        return False, "Price is required", None

    # Parse price
    try:
        price = float(price_str)
        if price < 0:
            return False, "Price must be non-negative", None
    except ValueError:
        return False, f"Invalid price format: {price_str}", None

    # Extract optional fields
    category = row[2].strip() if len(row) > 2 and row[2].strip() else None
    description = row[3].strip() if len(row) > 3 and row[3].strip() else None

    # Parse comma-separated lists
    sizes = [s.strip() for s in row[4].split(",")] if len(row) > 4 and row[4].strip() else []
    colors = [c.strip() for c in row[5].split(",")] if len(row) > 5 and row[5].strip() else []
    tags = [t.strip() for t in row[6].split(",")] if len(row) > 6 and row[6].strip() else []

    brand = row[7].strip() if len(row) > 7 and row[7].strip() else None

    # Parse stock
    stock = -1  # Default to unlimited
    if len(row) > 8 and row[8].strip():
        try:
            stock = int(row[8].strip())
        except ValueError:
            stock = -1

    thumbnail_url = row[9].strip() if len(row) > 9 and row[9].strip() else None

    # Build product data
    product_data = {
        "name": name,
        "price": price,
        "category": category,
        "description": description,
        "sizes": sizes,
        "colors": colors,
        "tags": tags,
        "brand": brand,
        "stock": stock,
        "thumbnail_url": thumbnail_url,
        "image_urls": [thumbnail_url] if thumbnail_url else [],
        "sheet_row_index": row_index,
        "availability": "show",
        "last_updated_source": "sheet",
    }

    return True, None, product_data


async def upsert_products(
    db,
    store_id: str,
    products_data: List[Dict],
) -> Tuple[int, int, List[str]]:
    """
    Upsert products into the database (match by sheet_row_index).

    Args:
        db: Database instance
        store_id: Store ID
        products_data: List of product data dictionaries

    Returns:
        Tuple of (products_synced, products_skipped, errors)
    """
    products_synced = 0
    products_skipped = 0
    errors = []

    for product_data in products_data:
        try:
            sheet_row_index = product_data.get("sheet_row_index")

            # Check if product exists with this sheet_row_index
            existing_product = await db.products.find_one({
                "store_id": ObjectId(store_id),
                "sheet_row_index": sheet_row_index,
            })

            if existing_product:
                # Update existing product
                # Only update if last_updated_source is 'sheet' (don't override manual changes)
                if existing_product.get("last_updated_source") == "sheet":
                    update_data = {
                        **product_data,
                        "updated_at": datetime.utcnow(),
                    }

                    await db.products.update_one(
                        {"_id": existing_product["_id"]},
                        {"$set": update_data}
                    )
                    products_synced += 1
                else:
                    # Skip products that were manually edited
                    products_skipped += 1
            else:
                # Create new product
                product_doc = {
                    "store_id": ObjectId(store_id),
                    **product_data,
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow(),
                }

                await db.products.insert_one(product_doc)
                products_synced += 1

        except Exception as e:
            error_msg = f"Row {product_data.get('sheet_row_index', '?')}: {str(e)}"
            errors.append(error_msg)
            products_skipped += 1

    return products_synced, products_skipped, errors


async def sync_products_from_sheet(
    db,
    store_id: str,
    sheet_id: str,
    range_name: str = "Sheet1",
) -> Dict:
    """
    Main function to sync products from Google Sheet.

    Args:
        db: Database instance
        store_id: Store ID
        sheet_id: Google Sheet ID
        range_name: Sheet range to sync (default: Sheet1)

    Returns:
        Dictionary with sync results: {
            "success": bool,
            "products_synced": int,
            "products_skipped": int,
            "errors": List[str]
        }
    """
    # Update sync status to 'syncing'
    await db.stores.update_one(
        {"_id": ObjectId(store_id)},
        {
            "$set": {
                "sheets_config.sync_status": "syncing",
                "sheets_config.sync_error": None,
            }
        }
    )

    try:
        # Fetch sheet data
        rows = await fetch_sheet_data(sheet_id, range_name)

        # Skip header row (row 0)
        data_rows = rows[1:] if len(rows) > 1 else []

        if not data_rows:
            raise ValueError("No data rows found in sheet (only header)")

        # Validate and parse products
        valid_products = []
        errors = []

        for idx, row in enumerate(data_rows, start=2):  # Start from row 2 (after header)
            is_valid, error_msg, product_data = validate_product_row(row, idx)

            if is_valid and product_data:
                valid_products.append(product_data)
            elif error_msg and error_msg != "Empty row":
                errors.append(f"Row {idx}: {error_msg}")

        # Upsert products
        products_synced, products_skipped, upsert_errors = await upsert_products(
            db, store_id, valid_products
        )

        errors.extend(upsert_errors)

        # Update sync status
        await db.stores.update_one(
            {"_id": ObjectId(store_id)},
            {
                "$set": {
                    "sheets_config.sync_status": "idle",
                    "sheets_config.last_synced_at": datetime.utcnow(),
                    "sheets_config.sync_error": "; ".join(errors) if errors else None,
                }
            }
        )

        return {
            "success": True,
            "products_synced": products_synced,
            "products_skipped": products_skipped,
            "errors": errors,
        }

    except Exception as e:
        # Update sync status to 'error'
        error_msg = str(e)
        await db.stores.update_one(
            {"_id": ObjectId(store_id)},
            {
                "$set": {
                    "sheets_config.sync_status": "error",
                    "sheets_config.sync_error": error_msg,
                }
            }
        )

        return {
            "success": False,
            "products_synced": 0,
            "products_skipped": 0,
            "errors": [error_msg],
        }
