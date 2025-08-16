"""
Manual Image Management System for ArtStoryAI
Handles local image uploads and storage for artworks
"""

import os
import shutil
from typing import Dict, List, Optional
from pathlib import Path
from fastapi import UploadFile, File
from fastapi.responses import FileResponse
import uuid

class ManualImageManager:
    """Manages manually uploaded artwork images"""

    def __init__(self):
        # Resimlerin saklandığı klasör (public/artworks)
        self.images_dir = Path("../frontend/public/artworks")
        
        # Manuel resim veritabanı (eser adı -> dosya yolu)
        self.manual_images = {}
        self._load_existing_images()

    def _load_existing_images(self):
        """Mevcut manuel resimleri yükle"""
        if self.images_dir.exists():
            for image_file in self.images_dir.glob("*.*"):
                # Dosya adından eser adını çıkar
                filename = image_file.stem
                file_extension = image_file.suffix.lower()
                
                # Sadece resim dosyalarını kabul et
                if file_extension not in ['.jpg', '.jpeg', '.png', '.webp']:
                    continue
                
                # Dosya adı -> eser adı eşleştirmesi (Public/Artworks klasöründeki dosyalar)
                filename_to_artwork = {
                    "VenüsDogusu": "Venüs'ün Doğuşu",
                    "Adem": "Adem'in Yaratılışı",
                    "Nilüferler": "Nilüferler",
                    "Cans": "Campbell'ın Çorba Kutuları",
                    "amerikanGotiği": "Amerikan Gotiği",
                    "David": "Davut",
                    "kaplumbagaTerbiyecisi": "Kaplumbağa Terbiyecisi",
                    "koyluKadın": "Köylü Kadın",
                    "Weeping-woman": "Ağlayan Kadın",
                    "Picasso_Guernica": "Guernica",
                    "avignonluKızlar": "Avignonlu Kızlar",
                    "themilkmaid": "Sütçü Kız",
                    "ladywithandermine": "Sansar ile Leydi",
                    "sarıev": "Sarı Ev",
                    "kafeTerastaGece": "Kafe Terasta Gece",
                    "sunflowers": "Ayçiçekleri"
                }

                # Eser adını bul
                artwork_name = filename_to_artwork.get(filename, filename.replace("_", " ").replace("-", " "))

                # Veritabanına ekle
                self.manual_images[artwork_name] = str(image_file)
                print(f"📁 Manuel resim yüklendi: {artwork_name} -> {filename}{file_extension}")

    def get_manual_image(self, artwork_name: str) -> Optional[str]:
        """Get manual image path for artwork with fuzzy matching"""
        # Exact match first
        if artwork_name in self.manual_images:
            return self.manual_images[artwork_name]
        
        # Case-insensitive fuzzy match
        artwork_name_lower = artwork_name.lower().strip()
        for name, image_path in self.manual_images.items():
            if (artwork_name_lower == name.lower() or 
                artwork_name_lower in name.lower() or 
                name.lower() in artwork_name_lower):
                return image_path
        
        return None

    def serve_image(self, image_path: str) -> FileResponse:
        """Serve image file"""
        if os.path.exists(image_path):
            return FileResponse(image_path)
        else:
            raise FileNotFoundError(f"Image not found: {image_path}")

    def get_all_manual_images(self) -> List[Dict]:
        """Get all manual images info"""
        images = []
        for artwork_name, image_path in self.manual_images.items():
            if os.path.exists(image_path):
                file_size = os.path.getsize(image_path)
                images.append({
                    "artwork_name": artwork_name,
                    "image_path": image_path,
                    "file_size": file_size
                })
        return images

    def search_manual_artworks(self, query: str) -> List[Dict]:
        """Search manual artworks by name"""
        results = []
        query_lower = query.lower()
        
        for artwork_name, image_path in self.manual_images.items():
            if query_lower in artwork_name.lower():
                if os.path.exists(image_path):
                    file_size = os.path.getsize(image_path)
                    results.append({
                        "artwork_name": artwork_name,
                        "image_path": image_path,
                        "file_size": file_size
                    })
        
        return results

# Global instance
manual_image_manager = ManualImageManager()
