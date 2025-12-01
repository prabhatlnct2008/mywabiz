"""Image Upload Service using Cloudinary for cloud storage."""

import cloudinary
import cloudinary.uploader
import cloudinary.api
from typing import Dict, Optional, BinaryIO
import os
import uuid

from app.core.config import settings


# Initialize Cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
)


def is_cloudinary_configured() -> bool:
    """
    Check if Cloudinary is properly configured.

    Returns:
        True if all Cloudinary credentials are set
    """
    return all([
        settings.CLOUDINARY_CLOUD_NAME,
        settings.CLOUDINARY_API_KEY,
        settings.CLOUDINARY_API_SECRET,
    ])


def upload_image(
    file: BinaryIO,
    folder: str = "mywabiz",
    resource_type: str = "image",
    public_id: Optional[str] = None,
    tags: Optional[list] = None,
) -> Dict[str, str]:
    """
    Upload image to Cloudinary and return URL.

    Args:
        file: File object or path to file
        folder: Cloudinary folder to store image in
        resource_type: Type of resource (image, video, raw, auto)
        public_id: Optional custom public ID for the image
        tags: Optional list of tags for the image

    Returns:
        Dictionary with:
        - url: Public URL of uploaded image
        - secure_url: HTTPS URL of uploaded image
        - public_id: Cloudinary public ID
        - format: Image format (jpg, png, etc.)
        - width: Image width in pixels
        - height: Image height in pixels
        - bytes: File size in bytes

    Raises:
        ValueError: If Cloudinary is not configured
        Exception: If upload fails
    """
    if not is_cloudinary_configured():
        raise ValueError(
            "Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, "
            "CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables."
        )

    try:
        # Generate unique public_id if not provided
        if not public_id:
            public_id = str(uuid.uuid4())

        # Upload to Cloudinary
        upload_options = {
            "folder": folder,
            "resource_type": resource_type,
            "public_id": public_id,
        }

        if tags:
            upload_options["tags"] = tags

        result = cloudinary.uploader.upload(file, **upload_options)

        # Return relevant information
        return {
            "url": result.get("url"),
            "secure_url": result.get("secure_url"),
            "public_id": result.get("public_id"),
            "format": result.get("format"),
            "width": result.get("width"),
            "height": result.get("height"),
            "bytes": result.get("bytes"),
        }

    except Exception as e:
        raise Exception(f"Failed to upload image to Cloudinary: {str(e)}")


def upload_logo(
    file: BinaryIO,
    store_id: str,
) -> str:
    """
    Upload store logo image.

    Args:
        file: File object
        store_id: Store ID for organizing uploads

    Returns:
        Secure URL of uploaded logo
    """
    result = upload_image(
        file=file,
        folder=f"mywabiz/stores/{store_id}/branding",
        public_id=f"logo_{uuid.uuid4()}",
        tags=["logo", store_id],
    )

    return result["secure_url"]


def upload_banner(
    file: BinaryIO,
    store_id: str,
) -> str:
    """
    Upload store banner image.

    Args:
        file: File object
        store_id: Store ID for organizing uploads

    Returns:
        Secure URL of uploaded banner
    """
    result = upload_image(
        file=file,
        folder=f"mywabiz/stores/{store_id}/branding",
        public_id=f"banner_{uuid.uuid4()}",
        tags=["banner", store_id],
    )

    return result["secure_url"]


def upload_product_image(
    file: BinaryIO,
    store_id: str,
    product_id: Optional[str] = None,
) -> str:
    """
    Upload product image.

    Args:
        file: File object
        store_id: Store ID for organizing uploads
        product_id: Optional product ID for organizing uploads

    Returns:
        Secure URL of uploaded product image
    """
    folder = f"mywabiz/stores/{store_id}/products"
    if product_id:
        folder = f"{folder}/{product_id}"

    tags = ["product", store_id]
    if product_id:
        tags.append(product_id)

    result = upload_image(
        file=file,
        folder=folder,
        public_id=f"product_{uuid.uuid4()}",
        tags=tags,
    )

    return result["secure_url"]


def delete_image(public_id: str) -> bool:
    """
    Delete an image from Cloudinary.

    Args:
        public_id: Cloudinary public ID of the image

    Returns:
        True if deletion successful

    Raises:
        ValueError: If Cloudinary is not configured
        Exception: If deletion fails
    """
    if not is_cloudinary_configured():
        raise ValueError("Cloudinary is not configured")

    try:
        result = cloudinary.uploader.destroy(public_id)
        return result.get("result") == "ok"

    except Exception as e:
        raise Exception(f"Failed to delete image from Cloudinary: {str(e)}")


def get_image_info(public_id: str) -> Dict:
    """
    Get information about an uploaded image.

    Args:
        public_id: Cloudinary public ID of the image

    Returns:
        Dictionary with image information

    Raises:
        ValueError: If Cloudinary is not configured
        Exception: If request fails
    """
    if not is_cloudinary_configured():
        raise ValueError("Cloudinary is not configured")

    try:
        result = cloudinary.api.resource(public_id)
        return {
            "url": result.get("url"),
            "secure_url": result.get("secure_url"),
            "public_id": result.get("public_id"),
            "format": result.get("format"),
            "width": result.get("width"),
            "height": result.get("height"),
            "bytes": result.get("bytes"),
            "created_at": result.get("created_at"),
        }

    except Exception as e:
        raise Exception(f"Failed to get image info from Cloudinary: {str(e)}")


def generate_transformation_url(
    public_id: str,
    width: Optional[int] = None,
    height: Optional[int] = None,
    crop: str = "fill",
    quality: str = "auto",
    format: str = "auto",
) -> str:
    """
    Generate a transformed image URL with specified dimensions and quality.

    Args:
        public_id: Cloudinary public ID of the image
        width: Desired width in pixels
        height: Desired height in pixels
        crop: Crop mode (fill, fit, scale, crop, etc.)
        quality: Image quality (auto, best, good, eco, low)
        format: Image format (auto, jpg, png, webp, etc.)

    Returns:
        Transformed image URL

    Examples:
        # Thumbnail (200x200)
        generate_transformation_url(public_id, width=200, height=200)

        # Responsive width
        generate_transformation_url(public_id, width=800, quality="auto", format="webp")
    """
    if not is_cloudinary_configured():
        raise ValueError("Cloudinary is not configured")

    transformation = {
        "quality": quality,
        "fetch_format": format,
    }

    if width:
        transformation["width"] = width
    if height:
        transformation["height"] = height
    if width or height:
        transformation["crop"] = crop

    url = cloudinary.CloudinaryImage(public_id).build_url(**transformation)
    return url
