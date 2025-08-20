"""
Filter Service for ArtStoryAI
Manuel ve API görsellerini birleştirip filtreleme yapar
"""

import os
import json
from typing import List, Dict, Optional
from pathlib import Path
import aiohttp
import asyncio

class FilterService:
    def __init__(self):
        self.manual_images_dir = Path("manual_images")
        self.api_sources = {
            "met_museum": "https://collectionapi.metmuseum.org/public/collection/v1",
            "art_institute": "https://api.artic.edu/api/v1",
            "wikimedia": "https://en.wikipedia.org/w/api.php"
        }
        
    def get_manual_artworks(self) -> List[Dict]:
        """Manuel eklenen görselleri listeler"""
        artworks = []
        
        print(f"Manuel görseller aranıyor: {self.manual_images_dir.absolute()}")
        
        if self.manual_images_dir.exists():
            print(f"Manuel görseller dizini bulundu")
            for image_file in self.manual_images_dir.glob("*.jpg"):
                print(f"Görsel bulundu: {image_file.name}")
                # Dosya adından sanat eseri bilgilerini çıkar
                filename = image_file.stem
                # Dosya adından sanat eseri bilgilerini çıkar
                filename = image_file.stem
                
                # Manuel görsellere gerçek değerler ata
                artwork_info = self._get_artwork_info_from_filename(filename)
                
                artwork = {
                    "id": f"manual_{filename}",
                    "title": self._format_title(filename),
                    "artist": artwork_info["artist"],
                    "year": artwork_info["year"],
                    "period": artwork_info["period"],
                    "style": artwork_info["style"],
                    "museum": artwork_info["museum"],
                    "imageUrl": f"http://localhost:8000/manual_images/{image_file.name}",
                    "source": "manual",
                    "description": f"Manuel eklenen sanat eseri: {self._format_title(filename)}",
                    "culture": artwork_info["culture"],
                    "medium": "Digital Image",
                    "dimensions": "N/A"
                }
                artworks.append(artwork)
        else:
            print(f"Manuel görseller dizini bulunamadı: {self.manual_images_dir.absolute()}")
        
        print(f"Toplam {len(artworks)} manuel görsel bulundu")
        return artworks
    
    def _format_title(self, filename: str) -> str:
        """Dosya adını okunabilir başlığa çevirir"""
        # Alt çizgileri boşluklarla değiştir
        title = filename.replace("_", " ")
        # İlk harfleri büyük yap
        title = title.title()
        return title
    
    def _get_artwork_info_from_filename(self, filename: str) -> Dict:
        """Dosya adından sanat eseri bilgilerini çıkarır"""
        filename_lower = filename.lower()
        
        # Dönem bilgisi
        if "adem" in filename_lower or "venus" in filename_lower:
            period = "Rönesans"
        elif "amerikan" in filename_lower or "campbell" in filename_lower:
            period = "Çağdaş"
        elif "kaplumbaga" in filename_lower or "koylu" in filename_lower:
            period = "Modern"
        elif "niluferler" in filename_lower:
            period = "Modern"
        elif "davut" in filename_lower:
            period = "Rönesans"
        else:
            period = "Modern"
        
        # Stil bilgisi
        if "campbell" in filename_lower:
            style = "Pop Art"
        elif "niluferler" in filename_lower:
            style = "Empresyonizm"
        elif "amerikan" in filename_lower:
            style = "Regionalism"
        elif "kaplumbaga" in filename_lower:
            style = "Osmanlı"
        elif "koylu" in filename_lower:
            style = "Realizm"
        else:
            style = "Klasik"
        
        # Sanatçı bilgisi
        if "adem" in filename_lower:
            artist = "Michelangelo"
        elif "venus" in filename_lower:
            artist = "Sandro Botticelli"
        elif "campbell" in filename_lower:
            artist = "Andy Warhol"
        elif "niluferler" in filename_lower:
            artist = "Claude Monet"
        elif "amerikan" in filename_lower:
            artist = "Grant Wood"
        elif "kaplumbaga" in filename_lower:
            artist = "Osman Hamdi Bey"
        elif "koylu" in filename_lower:
            artist = "Vincent van Gogh"
        elif "davut" in filename_lower:
            artist = "Michelangelo"
        else:
            artist = "Bilinmeyen Sanatçı"
        
        # Yıl bilgisi
        if "adem" in filename_lower or "davut" in filename_lower:
            year = "1501-1504"
        elif "venus" in filename_lower:
            year = "1485"
        elif "campbell" in filename_lower:
            year = "1962"
        elif "niluferler" in filename_lower:
            year = "1899"
        elif "amerikan" in filename_lower:
            year = "1930"
        elif "kaplumbaga" in filename_lower:
            year = "1906"
        elif "koylu" in filename_lower:
            year = "1885"
        else:
            year = "Bilinmeyen"
        
        # Müze bilgisi
        if "adem" in filename_lower or "davut" in filename_lower:
            museum = "Vatican Museums"
        elif "venus" in filename_lower:
            museum = "Uffizi"
        elif "campbell" in filename_lower:
            museum = "MOMA"
        elif "niluferler" in filename_lower:
            museum = "Louvre"
        elif "amerikan" in filename_lower:
            museum = "Art Institute of Chicago"
        elif "kaplumbaga" in filename_lower:
            museum = "Pera Museum"
        elif "koylu" in filename_lower:
            museum = "Van Gogh Museum"
        else:
            museum = "Local Collection"
        
        # Kültür bilgisi
        if "kaplumbaga" in filename_lower:
            culture = "Osmanlı"
        elif "koylu" in filename_lower:
            culture = "Hollanda"
        else:
            culture = "Avrupa"
        
        return {
            "period": period,
            "style": style,
            "artist": artist,
            "year": year,
            "museum": museum,
            "culture": culture
        }
    
    async def get_met_museum_artworks(self, filters: Dict = None) -> List[Dict]:
        """MET Museum'dan görselleri çeker"""
        try:
            params = {
                "hasImages": "true",
                "medium": "Paintings",
                "limit": 20
            }
            
            # Filtreleri uygula
            if filters:
                if filters.get("periods"):
                    period_mapping = {
                        "rönesans": "Renaissance",
                        "barok": "Baroque",
                        "klasik": "Classical",
                        "modern": "Modern",
                        "çağdaş": "Contemporary"
                    }
                    for period in filters["periods"]:
                        if period.lower() in period_mapping:
                            params["period"] = period_mapping[period.lower()]
                            break
                
                if filters.get("styles"):
                    # Style filtreleri için classification kullan
                    pass
            
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{self.api_sources['met_museum']}/search", params=params) as response:
                    if response.status == 200:
                        data = await response.json()
                        object_ids = data.get("objectIDs", [])
                        
                        artworks = []
                        for obj_id in object_ids[:10]:  # İlk 10 eser
                            artwork = await self._get_met_artwork_details(obj_id)
                            if artwork:
                                artwork["source"] = "met_museum"
                                artworks.append(artwork)
                        
                        return artworks
                    else:
                        print(f"MET Museum API hatası: {response.status}")
                        return []
                        
        except Exception as e:
            print(f"MET Museum görselleri alınırken hata: {e}")
            return []
    
    async def _get_met_artwork_details(self, object_id: int) -> Optional[Dict]:
        """MET Museum'dan eser detaylarını alır"""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{self.api_sources['met_museum']}/objects/{object_id}") as response:
                    if response.status == 200:
                        data = await response.json()
                        
                        artwork = {
                            "id": f"met_{object_id}",
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
    
    async def get_filtered_artworks(self, filters: Dict, sources: List[str] = None) -> Dict:
        """Filtrelenmiş sanat eserlerini döndürür - Akıllı filtreleme"""
        print(f"Filtreleme başlıyor - filters: {filters}, sources: {sources}")
        
        if sources is None:
            sources = ["manual", "met_museum"]
        
        # Filtre uyumluluğunu kontrol et
        validation = self.validate_filter_combination(filters)
        print(f"Filtre validasyonu: {validation}")
        
        all_artworks = []
        
        # Manuel görselleri ekle
        if "manual" in sources:
            print("Manuel görseller ekleniyor...")
            manual_artworks = self.get_manual_artworks()
            all_artworks.extend(manual_artworks)
            print(f"Manuel görseller eklendi: {len(manual_artworks)}")
        
        # API görsellerini ekle
        if "met_museum" in sources:
            print("MET Museum görselleri ekleniyor...")
            met_artworks = await self.get_met_museum_artworks(filters)
            all_artworks.extend(met_artworks)
            print(f"MET Museum görselleri eklendi: {len(met_artworks)}")
        
        print(f"Toplam görsel sayısı: {len(all_artworks)}")
        
        # Filtreleri uygula
        filtered_artworks = self._apply_filters(all_artworks, filters)
        print(f"Filtreleme sonrası görsel sayısı: {len(filtered_artworks)}")
        
        # Sonuçları grupla
        results = {
            "total": len(filtered_artworks),
            "sources": {
                "manual": len([a for a in filtered_artworks if a.get("source") == "manual"]),
                "met_museum": len([a for a in filtered_artworks if a.get("source") == "met_museum"])
            },
            "artworks": filtered_artworks,
            "validation": validation,
            "original_filters": filters
        }
        
        print(f"Sonuçlar: {results}")
        return results
    
    def _apply_filters(self, artworks: List[Dict], filters: Dict) -> List[Dict]:
        """Görselleri filtreler - Akıllı filtreleme mantığı"""
        if not filters:
            return artworks
        
        print(f"Filtreleme başlıyor - {len(artworks)} eser mevcut")
        print(f"Uygulanacak filtreler: {filters}")
        
        filtered = artworks
        
        # Dönem filtresi
        if filters.get("periods"):
            filtered = [a for a in filtered if any(
                period.lower() in a.get("period", "").lower() 
                for period in filters["periods"]
            )]
            print(f"Dönem filtresi sonrası: {len(filtered)} eser")
        
        # Stil filtresi
        if filters.get("styles"):
            filtered = [a for a in filtered if any(
                style.lower() in a.get("style", "").lower() 
                for style in filters["styles"]
            )]
            print(f"Stil filtresi sonrası: {len(filtered)} eser")
        
        # Müze filtresi
        if filters.get("museums"):
            filtered = [a for a in filtered if any(
                museum.lower() in a.get("museum", "").lower() 
                for museum in filters["museums"]
            )]
            print(f"Müze filtresi sonrası: {len(filtered)} eser")
        
        # Eğer hiç sonuç yoksa, daha geniş arama yap
        if not filtered and (filters.get("periods") or filters.get("styles")):
            print("Hiç sonuç bulunamadı, alternatif arama yapılıyor...")
            
            # Sadece dönem ile dene
            if filters.get("periods"):
                period_only = [a for a in artworks if any(
                    period.lower() in a.get("period", "").lower() 
                    for period in filters["periods"]
                )]
                print(f"Sadece dönem filtresi ile: {len(period_only)} eser")
                
                if period_only:
                    filtered = period_only
                    print("Dönem filtresi ile sonuç bulundu")
            
            # Sadece stil ile dene
            elif filters.get("styles") and not filtered:
                style_only = [a for a in artworks if any(
                    style.lower() in a.get("style", "").lower() 
                    for style in filters["styles"]
                )]
                print(f"Sadece stil filtresi ile: {len(style_only)} eser")
                
                if style_only:
                    filtered = style_only
                    print("Stil filtresi ile sonuç bulundu")
        
        print(f"Final filtreleme sonucu: {len(filtered)} eser")
        return filtered
    
    def get_available_filters(self) -> Dict:
        """Mevcut filtre seçeneklerini döndürür"""
        return {
            "periods": ["Rönesans", "Barok", "Klasik", "Modern", "Çağdaş"],
            "styles": ["Empresyonizm", "Ekspresyonizm", "Kübizm", "Sürrealizm", "Realizm", "Romantizm"],
            "colors": ["Sıcak", "Soğuk", "Monokrom", "Renkli", "Pastel", "Canlı"],
            "sizes": ["Küçük", "Orta", "Büyük"],
            "museums": ["Louvre", "MET", "Uffizi", "Prado", "British Museum", "Vatican Museums"],
            "sources": ["Manuel Görseller", "MET Museum", "Art Institute", "Wikimedia"]
        }
    
    def validate_filter_combination(self, filters: Dict) -> Dict:
        """Filtre kombinasyonlarının uyumluluğunu kontrol eder"""
        warnings = []
        suggestions = []
        
        # Çağdaş + Kübizm uyumsuzluğu
        if filters.get("periods") and filters.get("styles"):
            if "Çağdaş" in filters["periods"] and "Kübizm" in filters["styles"]:
                warnings.append({
                    "type": "incompatible",
                    "message": "Çağdaş dönem + Kübizm stili uyumsuz kombinasyon",
                    "suggestion": "Kübizm için 'Modern' dönemi seçin"
                })
                suggestions.append("Modern")
        
        # Modern + Rönesans uyumsuzluğu
        if filters.get("periods"):
            if "Modern" in filters["periods"] and "Rönesans" in filters["periods"]:
                warnings.append({
                    "type": "conflicting",
                    "message": "Modern ve Rönesans dönemleri aynı anda seçilemez",
                    "suggestion": "Tek bir dönem seçin"
                })
        
        # Çok fazla müze seçimi
        if filters.get("museums") and len(filters["museums"]) > 4:
            warnings.append({
                "type": "too_many",
                "message": f"Çok fazla müze seçildi ({len(filters['museums'])})",
                "suggestion": "En önemli 2-3 müze seçin"
            })
        
        return {
            "warnings": warnings,
            "suggestions": suggestions,
            "is_valid": len(warnings) == 0
        }
