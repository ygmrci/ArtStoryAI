"""
Manual Image Management API Routes
"""

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from typing import List, Dict
from .manual_image_manager import manual_image_manager

router = APIRouter(prefix="/manual-images", tags=["manual-images"])

@router.post("/upload")
async def upload_artwork_image(
    artwork_name: str = Form(...),
    image_file: UploadFile = File(...)
):
    """Sanat eseri resmi yükle"""
    try:
        result = manual_image_manager.upload_artwork_image(artwork_name, image_file)
        if result["success"]:
            return result
        else:
            raise HTTPException(status_code=400, detail=result["error"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Yükleme hatası: {str(e)}")

@router.get("/{artwork_name}")
async def get_artwork_image(artwork_name: str):
    """Sanat eseri resmini getir"""
    try:
        image_path = manual_image_manager.get_manual_image(artwork_name)
        if image_path:
            return FileResponse(image_path)
        else:
            raise HTTPException(status_code=404, detail="Resim bulunamadı")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resim getirme hatası: {str(e)}")

@router.delete("/{artwork_name}")
async def delete_artwork_image(artwork_name: str):
    """Sanat eseri resmini sil"""
    try:
        result = manual_image_manager.delete_manual_image(artwork_name)
        if result["success"]:
            return result
        else:
            raise HTTPException(status_code=400, detail=result["error"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Silme hatası: {str(e)}")

@router.get("/list/all")
async def list_all_manual_images():
    """Tüm manuel resimleri listele"""
    try:
        return {
            "images": manual_image_manager.get_all_manual_images(),
            "total_count": len(manual_image_manager.manual_images)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Listeleme hatası: {str(e)}")

@router.get("/search/{query}")
async def search_manual_images(query: str):
    """Manuel resimlerde arama yap"""
    try:
        results = manual_image_manager.search_manual_images(query)
        return {
            "query": query,
            "results": results,
            "result_count": len(results)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Arama hatası: {str(e)}")

@router.get("/stats/overview")
async def get_manual_images_stats():
    """Manuel resim istatistikleri"""
    try:
        all_images = manual_image_manager.get_all_manual_images()
        total_size = sum(img["file_size"] for img in all_images)
        
        return {
            "total_images": len(all_images),
            "total_size_bytes": total_size,
            "total_size_mb": round(total_size / (1024 * 1024), 2),
            "storage_directory": str(manual_image_manager.images_dir)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"İstatistik hatası: {str(e)}")
