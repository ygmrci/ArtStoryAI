"""
Filter Routes for ArtStoryAI
Filtreleme API endpoint'leri
"""

from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Optional
from pydantic import BaseModel
from app.services.filter_service import FilterService

router = APIRouter(prefix="/api/filter", tags=["filter"])
filter_service = FilterService()

class FilterRequest(BaseModel):
    periods: Optional[List[str]] = []
    styles: Optional[List[str]] = []
    colors: Optional[List[str]] = []
    sizes: Optional[List[str]] = []
    museums: Optional[List[str]] = []
    sources: Optional[List[str]] = ["manual", "met_museum"]

class FilterResponse(BaseModel):
    total: int
    sources: Dict[str, int]
    artworks: List[Dict]

@router.get("/options", response_model=Dict)
async def get_filter_options():
    """Mevcut filtre seçeneklerini döndürür"""
    try:
        options = filter_service.get_available_filters()
        return {
            "success": True,
            "data": options
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Filtre seçenekleri alınamadı: {str(e)}")

@router.post("/artworks", response_model=FilterResponse)
async def filter_artworks(filters: FilterRequest):
    """Filtrelenmiş sanat eserlerini döndürür"""
    try:
        # Filtreleri dict'e çevir
        filter_dict = {
            "periods": filters.periods,
            "styles": filters.styles,
            "colors": filters.colors,
            "sizes": filters.sizes,
            "museums": filters.museums
        }
        
        # Boş filtreleri temizle
        filter_dict = {k: v for k, v in filter_dict.items() if v}
        
        # Kaynak listesini belirle
        sources = []
        if "Manuel Görseller" in filters.sources:
            sources.append("manual")
        if "MET Museum" in filters.sources:
            sources.append("met_museum")
        
        # Filtrelenmiş sonuçları al
        results = await filter_service.get_filtered_artworks(filter_dict, sources)
        
        return FilterResponse(
            total=results["total"],
            sources=results["sources"],
            artworks=results["artworks"]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Filtreleme hatası: {str(e)}")

@router.get("/manual-artworks", response_model=List[Dict])
async def get_manual_artworks():
    """Manuel eklenen görselleri listeler"""
    try:
        artworks = filter_service.get_manual_artworks()
        return artworks
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Manuel görseller alınamadı: {str(e)}")

@router.get("/api-artworks", response_model=List[Dict])
async def get_api_artworks(
    source: str = Query(..., description="API kaynağı (met_museum, art_institute, wikimedia)"),
    limit: int = Query(10, description="Maksimum sonuç sayısı")
):
    """API'den görselleri çeker"""
    try:
        if source == "met_museum":
            artworks = await filter_service.get_met_museum_artworks()
            return artworks[:limit]
        else:
            raise HTTPException(status_code=400, detail=f"Desteklenmeyen kaynak: {source}")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"API görselleri alınamadı: {str(e)}")

@router.get("/stats", response_model=Dict)
async def get_filter_stats():
    """Filtreleme istatistiklerini döndürür"""
    try:
        manual_count = len(filter_service.get_manual_artworks())
        
        return {
            "success": True,
            "data": {
                "manual_artworks": manual_count,
                "available_sources": ["manual", "met_museum"],
                "total_available": f"{manual_count} manuel + API'den dinamik"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"İstatistikler alınamadı: {str(e)}")
