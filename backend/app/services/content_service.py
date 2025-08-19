"""
Content Service - İçerik üretimi işlevselliği
"""

from typing import Dict, Optional
from app.features.openai_story import (
    generate_story_with_openai, 
    generate_artist_bio_with_openai
)

class ContentService:
    """İçerik üretimi işlemlerini yöneten servis"""
    
    @staticmethod
    async def generate_artwork_story(art_name: str) -> str:
        """Sanat eseri hikayesi üretir"""
        try:
            story = generate_story_with_openai(art_name)
            return story
        except Exception as e:
            print(f"⚠️ Hikaye üretim hatası: {e}")
            return f"{art_name} hakkında detaylı bilgi bulunamadı."
    
    @staticmethod
    async def generate_artist_bio(artist_name: str) -> str:
        """Sanatçı biyografisi üretir"""
        try:
            bio = generate_artist_bio_with_openai(artist_name)
            return bio
        except Exception as e:
            print(f"⚠️ Biyografi üretim hatası: {e}")
            return f"{artist_name} hakkında biyografik bilgi bulunamadı."
