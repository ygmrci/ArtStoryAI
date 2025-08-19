"""
Artwork Info Service - Sanat eseri bilgi toplama
"""

from typing import Dict, Optional
from app.services.artwork_search_service import ArtworkSearchService
from app.services.content_service import ContentService

class ArtworkInfoService:
    """Sanat eseri bilgi toplama işlemlerini yöneten servis"""
    
    def __init__(self):
        self.search_service = ArtworkSearchService()
        self.content_service = ContentService()
    
    async def get_artwork_info(self, art_name: str) -> Dict:
        """
        Sanat eseri hakkında kapsamlı bilgi toplar:
        - Görsel (web'den)
        - Hikaye (AI ile)
        - Sanatçı bilgisi (AI ile)
        """
        try:
            print(f"🔍 Sanat eseri bilgisi toplanıyor: {art_name}")
            
            # 1. Görsel ara
            image_url = await self.search_service.search_artwork_image(art_name)
            
            # 2. Temel bilgileri hazırla
            artwork_info = {
                "name": art_name,
                "image_url": image_url,
                "source": "web"
            }
            
            # 3. AI ile hikaye üret
            try:
                story = await self.content_service.generate_artwork_story(art_name)
                artwork_info["story"] = story
            except Exception as e:
                print(f"⚠️ Hikaye üretim hatası: {e}")
                artwork_info["story"] = f"{art_name} hakkında detaylı bilgi bulunamadı."
            
            # 4. AI ile sanatçı bilgisi üret
            try:
                artist_bio = await self.content_service.generate_artist_bio(art_name)
                artwork_info["artist_bio"] = artist_bio
            except Exception as e:
                print(f"⚠️ Biyografi üretim hatası: {e}")
                artwork_info["artist_bio"] = f"{art_name} hakkında biyografik bilgi bulunamadı."
            
            print(f"✅ Sanat eseri bilgisi başarıyla toplandı: {art_name}")
            return artwork_info
            
        except Exception as e:
            print(f"❌ Sanat eseri bilgi toplama hatası: {e}")
            return {
                "error": "Sanat eseri bilgisi alınırken hata oluştu",
                "details": str(e),
                "name": art_name
            }
