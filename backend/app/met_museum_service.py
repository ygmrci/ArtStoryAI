"""
MET Museum API Service for ArtStoryAI
Ücretsiz API ile sanat eserlerini çeker
"""

import aiohttp
import asyncio
from typing import List, Dict, Optional
import json

class METMuseumService:
    def __init__(self):
        self.base_url = "https://collectionapi.metmuseum.org/public/collection/v1"
        self.search_url = f"{self.base_url}/search"
        self.object_url = f"{self.base_url}/objects"
        
    async def search_artworks(self, query: str = None, period: str = None, 
                             style: str = None, artist: str = None) -> List[Dict]:
        """
        MET Museum'dan sanat eserlerini arar
        """
        try:
            # Search parameters
            params = {
                "q": query or "",
                "hasImages": "true",  # Sadece görseli olan eserler
                "medium": "Paintings",  # Resim türü
                "limit": 50  # Maksimum sonuç
            }
            
            # Period filter
            if period:
                if period.lower() == "rönesans":
                    params["period"] = "Renaissance"
                elif period.lower() == "barok":
                    params["period"] = "Baroque"
                elif period.lower() == "klasik":
                    params["period"] = "Classical"
                elif period.lower() == "modern":
                    params["period"] = "Modern"
                elif period.lower() == "çağdaş":
                    params["period"] = "Contemporary"
            
            async with aiohttp.ClientSession() as session:
                async with session.get(self.search_url, params=params) as response:
                    if response.status == 200:
                        data = await response.json()
                        object_ids = data.get("objectIDs", [])
                        
                        # İlk 10 eserin detaylarını al
                        artworks = []
                        for obj_id in object_ids[:10]:
                            artwork = await self.get_artwork_details(obj_id)
                            if artwork:
                                artworks.append(artwork)
                        
                        return artworks
                    else:
                        print(f"MET API search hatası: {response.status}")
                        return []
                        
        except Exception as e:
            print(f"MET Museum search hatası: {e}")
            return []
    
    async def get_artwork_details(self, object_id: int) -> Optional[Dict]:
        """
        Belirli bir sanat eserinin detaylarını alır
        """
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{self.object_url}/{object_id}") as response:
                    if response.status == 200:
                        data = await response.json()
                        
                        # Sanat eseri bilgilerini parse et
                        artwork = {
                            "id": str(object_id),
                            "title": data.get("title", "Bilinmeyen Eser"),
                            "artist": data.get("artistDisplayName", "Bilinmeyen Sanatçı"),
                            "year": data.get("objectDate", "Bilinmeyen Tarih"),
                            "period": data.get("period", "Bilinmeyen Dönem"),
                            "style": data.get("classification", "Bilinmeyen Stil"),
                            "museum": "MET Museum",
                            "imageUrl": data.get("primaryImage", ""),
                            "description": data.get("objectDescription", "Açıklama bulunamadı"),
                            "culture": data.get("culture", ""),
                            "medium": data.get("medium", ""),
                            "dimensions": data.get("dimensions", "")
                        }
                        
                        return artwork
                    else:
                        return None
                        
        except Exception as e:
            print(f"Artwork details hatası: {e}")
            return None
    
    async def get_filtered_artworks(self, filters: Dict) -> List[Dict]:
        """
        Filtrelere göre sanat eserlerini getirir
        """
        try:
            all_artworks = []
            
            # Period filter
            if filters.get("periods"):
                for period in filters["periods"]:
                    artworks = await self.search_artworks(period=period)
                    all_artworks.extend(artworks)
            
            # Style filter
            if filters.get("styles"):
                for style in filters["styles"]:
                    artworks = await self.search_artworks(style=style)
                    all_artworks.extend(artworks)
            
            # Artist search
            if filters.get("artists"):
                for artist in filters["artists"]:
                    artworks = await self.search_artworks(artist=artist)
                    all_artworks.extend(artworks)
            
            # Duplicate'ları kaldır
            unique_artworks = []
            seen_ids = set()
            for artwork in all_artworks:
                if artwork["id"] not in seen_ids:
                    unique_artworks.append(artwork)
                    seen_ids.add(artwork["id"])
            
            return unique_artworks[:50]  # Maksimum 50 eser
            
        except Exception as e:
            print(f"Filtered artworks hatası: {e}")
            return []

# Global instance
met_museum_service = METMuseumService()
