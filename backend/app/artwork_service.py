"""
Artwork Service for ArtStoryAI
Handles artwork information retrieval and processing
"""

import urllib.parse
import json
from typing import Dict, List, Optional
from openai import OpenAI
from app.features.image_sources import (
    get_art_institute_image,
    get_met_museum_image,
    get_wikimedia_image,
    search_artwork_image
)
from app.features.fallback import get_fallback_images
from app.features.openai_story import (
    generate_story_with_openai, 
    generate_artist_bio_with_openai, 
    generate_movement_desc_with_openai
)
from app.cache_service import cache_result, get_cached_artwork_image, get_cached_artwork_content
from app.manual_artworks import manual_artwork_manager
from app.manual_image_manager import manual_image_manager

class ArtworkService:
    """Service class for handling artwork operations"""
    
    @staticmethod
    @cache_result(ttl=7200)  # Cache for 2 hours
    def get_artwork_image(art_name: str) -> str:
        """Get artwork image URL from various sources"""
        decoded_name = urllib.parse.unquote(art_name)
        
        # 1. Önce manuel resimlerde ara (en yüksek öncelik)
        manual_image_path = manual_image_manager.get_manual_image(decoded_name)
        if manual_image_path:
            print(f"Manuel resim bulundu: {decoded_name}")
            # Local dosya yolu yerine API endpoint'i döndür
            return f"/manual-images/{decoded_name}"
        
        # 2. Manuel eserlerde ara
        manual_artwork = manual_artwork_manager.get_manual_artwork(decoded_name)
        if manual_artwork and manual_artwork.get("image_url"):
            print(f"Manuel eser resmi bulundu: {decoded_name}")
            return manual_artwork["image_url"]
        
        # 3. Recommendation system'de görsel var mı kontrol et
        try:
            from app.recommendation_system import recommendation_system
            if decoded_name in recommendation_system.artwork_features:
                stored_image_url = recommendation_system.artwork_features[decoded_name]["image_url"]
                if stored_image_url and stored_image_url != "":
                    print(f"Recommendation system'den görsel bulundu: {decoded_name}")
                    return stored_image_url
        except Exception as e:
            print(f"Recommendation system kontrol hatası: {e}")
        
        # 4. Fallback görseli dene
        image_url = get_fallback_images(decoded_name)
        
        # 5. Fallback yoksa gelişmiş arama sistemi
        if not image_url:
            image_url = search_artwork_image(decoded_name)
        
        # 6. Hala yoksa diğer API'leri sırayla dene
        if not image_url:
            image_url = get_art_institute_image(decoded_name)
        if not image_url:
            image_url = get_met_museum_image(decoded_name)
        if not image_url:
            image_url = get_wikimedia_image(decoded_name)
            # Alternatif isimlerle dene
            if not image_url:
                alternatives = [
                    "The " + decoded_name,
                    decoded_name + " painting",
                    decoded_name + " (painting)",
                    decoded_name.replace("'", ""),
                ]
                for alt_name in alternatives:
                    image_url = get_wikimedia_image(alt_name)
                    if image_url:
                        break
        
        # 7. Hiçbiri bulunamazsa placeholder resim
        if not image_url:
            image_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png"
        
        return image_url
    
    @staticmethod
    @cache_result(ttl=3600)  # Cache for 1 hour (AI content is expensive)
    def generate_artwork_content(art_name: str) -> Dict[str, str]:
        """Generate AI content for artwork"""
        decoded_name = urllib.parse.unquote(art_name)
        
        # AI ile tüm bilgileri üret
        story = generate_story_with_openai(decoded_name)
        artist_bio = generate_artist_bio_with_openai(decoded_name)
        movement_desc = generate_movement_desc_with_openai(decoded_name)
        artwork_details = generate_artwork_details_with_openai(decoded_name)
        
        return {
            "story": story,
            "artist_bio": artist_bio,
            "movement_desc": movement_desc,
            "artwork_details": artwork_details
        }
    
    @staticmethod
    @cache_result(ttl=1800)  # Cache for 30 minutes
    def get_artwork_info(art_name: str) -> Dict:
        """Get complete artwork information with fuzzy matching"""
        decoded_name = urllib.parse.unquote(art_name)
        
        # Önce manuel eserlerde ara (fuzzy match ile)
        manual_artwork = manual_artwork_manager.get_manual_artwork(decoded_name)
        if manual_artwork:
            print(f"✅ Manuel eser bulundu: {decoded_name}")
            
            # Manuel resim var mı kontrol et (fuzzy match ile)
            manual_image_path = manual_image_manager.get_manual_image(decoded_name)
            
            if manual_image_path:
                print(f"✅ Manuel resim bulundu: {decoded_name}")
                image_url = f"/manual-images/{decoded_name}"
            else:
                print(f"⚠️ Manuel resim bulunamadı, veritabanı URL'si kullanılıyor: {decoded_name}")
                # Manuel eser veritabanındaki resim URL'sini kullan
                image_url = manual_artwork["image_url"]
            
            return {
                "art_name": decoded_name,
                "artist": manual_artwork["artist"],
                "year": manual_artwork["year"],
                "movement": manual_artwork["movement"],
                "museum": manual_artwork["museum"],
                "image_url": image_url,
                "story": manual_artwork["story"],
                "artist_bio": manual_artwork["artist_bio"],
                "movement_desc": manual_artwork["movement_desc"],
                "similar_artworks": get_similar_artworks(decoded_name, manual_artwork),
                "source": "manual"
            }
        
        # Manuel eser bulunamazsa AI ile üret
        print(f"❌ Manuel eser bulunamadı, AI ile üretiliyor: {decoded_name}")
        
        # Get image (cached)
        image_url = get_cached_artwork_image(decoded_name)
        
        # Generate content (cached)
        content = get_cached_artwork_content(decoded_name)
        
        # Get similar artworks
        similar_artworks = get_similar_artworks(decoded_name, content["artwork_details"])
        
        return {
            "art_name": decoded_name,
            "artist": content["artwork_details"].get("artist", "AI ile üretiliyor..."),
            "year": content["artwork_details"].get("year", "AI ile üretiliyor..."),
            "movement": content["artwork_details"].get("movement", "AI ile üretiliyor..."),
            "museum": content["artwork_details"].get("museum", "AI ile üretiliyor..."),
            "image_url": image_url,
            "story": content["story"],
            "artist_bio": content["artist_bio"],
            "movement_desc": content["movement_desc"],
            "similar_artworks": similar_artworks,
            "source": "ai"
        }

def generate_artwork_details_with_openai(art_name: str) -> Dict:
    """Generate artwork details using OpenAI"""
    try:
        import os
        from dotenv import load_dotenv
        load_dotenv()
        
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
        prompt = f"""
        Aşağıdaki sanat eseri için JSON formatında bilgi ver:
        {{
            "artist": "Sanatçı adı",
            "year": "Yapım yılı",
            "movement": "Sanat akımı",
            "museum": "Bulunduğu müze"
        }}
        
        Sanat eseri: {art_name}
        
        Örnek format:
        {{
            "artist": "Vincent van Gogh",
            "year": "1889",
            "movement": "Post-İzlenimcilik",
            "museum": "Museum of Modern Art, New York"
        }}
        """

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Sen bir sanat tarihi uzmanısın. Sadece JSON formatında cevap ver."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=200,
            temperature=0.3
        )

        result = json.loads(response.choices[0].message.content)
        return result

    except Exception as e:
        print(f"OpenAI API hatası (sanat eseri detayları): {e}")
        return {
            "artist": "AI ile üretiliyor...",
            "year": "AI ile üretiliyor...",
            "movement": "AI ile üretiliyor...",
            "museum": "AI ile üretiliyor..."
        }

def get_similar_artworks(art_name: str, artwork_details: dict) -> List[Dict]:
    """Benzer sanat eserlerini bulur - Yeni embedding tabanlı sistem kullanır"""
    try:
        from app.recommendation_system import recommendation_system
        
        # Try to use the new recommendation system first
        try:
            similar_artworks = recommendation_system.get_similar_artworks(art_name, 3)
            if similar_artworks:
                return similar_artworks
        except Exception as e:
            print(f"Yeni öneri sistemi hatası: {e}")
        
        # Fallback to old system if new system fails
        artist = artwork_details.get("artist", "")
        movement = artwork_details.get("movement", "")
        
        # Arama yapılan eserin adını normalize et (küçük harfe çevir ve boşlukları kaldır)
        normalized_art_name = art_name.lower().replace(" ", "").replace("-", "").replace("_", "")
        
        # Benzer eserler veritabanı (gerçek uygulamada bu veriler API'den gelecek)
        similar_artworks_db = {
            "Vincent van Gogh": [
                {
                    "title": "Sunflowers",
                    "artist": "Vincent van Gogh",
                    "year": "1888",
                    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Vincent_Willem_van_Gogh_127.jpg/1280px-Vincent_Willem_van_Gogh_127.jpg",
                    "similarity_reason": "Aynı sanatçının eseri"
                },
                {
                    "title": "Kafe Terasta Gece",
                    "artist": "Vincent van Gogh",
                    "year": "1888",
                    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Vincent_van_Gogh_-_Cafe_Terrace_at_Night_%28Yorck%29.jpg/1280px-Vincent_van_Gogh_-_Cafe_Terrace_at_Night_%28Yorck%29.jpg",
                    "similarity_reason": "Aynı dönemden eser"
                },
                {
                    "title": "Sarı Ev",
                    "artist": "Vincent van Gogh",
                    "year": "1888",
                    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Vincent_van_Gogh_-_The_yellow_house_%28%27The_street%27%29.jpg/1280px-Vincent_van_Gogh_-_The_yellow_house_%28%27The_street%27%29.jpg",
                    "similarity_reason": "Aynı sanatçının eseri"
                }
            ],
            "Leonardo da Vinci": [
                {
                    "title": "Son Akşam Yemeği",
                    "artist": "Leonardo da Vinci",
                    "year": "1495-1498",
                    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/%C3%9Altima_Cena_-_Da_Vinci_5.jpg/1280px-%C3%9Altima_Cena_-_Da_Vinci_5.jpg",
                    "similarity_reason": "Aynı sanatçının eseri"
                },
                {
                    "title": "Vitruvius Adamı",
                    "artist": "Leonardo da Vinci",
                    "year": "1490",
                    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Da_Vinci_Vitruve_Luc_Viatour.jpg/1280px-Da_Vinci_Vitruve_Luc_Viatour.jpg",
                    "similarity_reason": "Aynı sanatçının eseri"
                },
                {
                    "title": "Lady with an Ermine",
                    "artist": "Leonardo da Vinci",
                    "year": "1489-1491",
                    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Leonardo_da_Vinci_-_Lady_with_an_Ermine_-_Google_Art_Project.jpg/1280px-Leonardo_da_Vinci_-_Lady_with_an_Ermine_-_Google_Art_Project.jpg",
                    "similarity_reason": "Aynı sanatçının eseri"
                }
            ],
            "Claude Monet": [
                {
                    "title": "İzlenim: Gün Doğumu",
                    "artist": "Claude Monet",
                    "year": "1872",
                    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Monet_-_Impression%2C_Sunrise.jpg/1280px-Monet_-_Impression%2C_Sunrise.jpg",
                    "similarity_reason": "Aynı sanat akımı (Empresyonizm)"
                },
                {
                    "title": "Nilüferler",
                    "artist": "Claude Monet",
                    "year": "1916",
                    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Claude_Monet_-_Water_Lilies_-_Google_Art_Project.jpg/1280px-Claude_Monet_-_Water_Lilies_-_Google_Art_Project.jpg",
                    "similarity_reason": "Aynı sanatçının eseri"
                },
                {
                    "title": "Rouen Katedrali",
                    "artist": "Claude Monet",
                    "year": "1894",
                    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Claude_Monet_-_Rouen_Cathedral%2C_Facade_%28Sunset%29_-_Google_Art_Project.jpg/1280px-Claude_Monet_-_Rouen_Cathedral%2C_Facade_%28Sunset%29_-_Google_Art_Project.jpg",
                    "similarity_reason": "Aynı sanatçının eseri"
                }
            ],
            "Pablo Picasso": [
                {
                    "title": "Guernica",
                    "artist": "Pablo Picasso",
                    "year": "1937",
                    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/PicassoGuernica.jpg/1280px-PicassoGuernica.jpg",
                    "similarity_reason": "Aynı sanatçının eseri"
                },
                {
                    "title": "Avignonlu Kızlar",
                    "artist": "Pablo Picasso",
                    "year": "1907",
                    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Pablo_Picasso%2C_1907%2C_Les_Demoiselles_d%27Avignon%2C_oil_on_canvas%2C_243.9_x_233.7_cm%2C_Museum_of_Modern_Art.jpg/1280px-Picasso%2C_Les_Demoiselles_d%27Avignon.jpg",
                    "similarity_reason": "Aynı sanatçının eseri"
                },
                {
                    "title": "Weeping Woman",
                    "artist": "Pablo Picasso",
                    "year": "1937",
                    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Pablo_Picasso%2C_1937%2C_Weeping_Woman%2C_oil_on_canvas%2C_60_x_49_cm%2C_Tate_Modern%2C_London.jpg/1280px-Pablo_Picasso%2C_1937%2C_Weeping_Woman%2C_oil_on_canvas%2C_60_x_49_cm%2C_Tate_Modern%2C_London.jpg",
                    "similarity_reason": "Aynı sanatçının eseri"
                }
            ]
        }
        
        # Sanatçıya göre benzer eserleri bul
        if artist in similar_artworks_db:
            artworks = similar_artworks_db[artist]
            # Arama yapılan eserle aynı olanları filtrele
            filtered_artworks = []
            for artwork in artworks:
                normalized_title = artwork["title"].lower().replace(" ", "").replace("-", "").replace("_", "")
                if normalized_title not in normalized_art_name and normalized_art_name not in normalized_title:
                    filtered_artworks.append(artwork)
            
            # Eğer yeterli eser yoksa, genel önerilerden ekle
            if len(filtered_artworks) < 3:
                general_artworks = get_general_artworks()
                for general_artwork in general_artworks:
                    if len(filtered_artworks) >= 3:
                        break
                    normalized_title = general_artwork["title"].lower().replace(" ", "").replace("-", "").replace("_", "")
                    if normalized_title not in normalized_art_name and normalized_art_name not in normalized_title:
                        filtered_artworks.append(general_artwork)
            
            return filtered_artworks[:3]  # En fazla 3 eser döndür
        
        # Sanat akımına göre benzer eserler
        movement_similar = {
            "Empresyonizm": [
                {
                    "title": "Dans Eden Kızlar",
                    "artist": "Edgar Degas",
                    "year": "1874",
                    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Edgar_Degas_-_The_Dance_Class_-_Google_Art_Project.jpg/1280px-Edgar_Degas_-_The_Dance_Class_-_Google_Art_Project.jpg",
                    "similarity_reason": "Aynı sanat akımı (Empresyonizm)"
                },
                {
                    "title": "Bal du moulin de la Galette",
                    "artist": "Pierre-Auguste Renoir",
                    "year": "1876",
                    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Pierre-Auguste_Renoir_-_Dance_at_Le_Moulin_de_la_Galette_-_Google_Art_Project.jpg/1280px-Pierre-Auguste_Renoir_-_Dance_at_Le_Moulin_de_la_Galette_-_Google_Art_Project.jpg",
                    "similarity_reason": "Aynı sanat akımı (Empresyonizm)"
                },
                {
                    "title": "Olympia",
                    "artist": "Édouard Manet",
                    "year": "1863",
                    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Edouard_Manet_-_Olympia_-_Google_Art_Project.jpg/1280px-Edouard_Manet_-_Olympia_-_Google_Art_Project.jpg",
                    "similarity_reason": "Aynı sanat akımı (Empresyonizm)"
                }
            ],
            "Post-empresyonizm": [
                {
                    "title": "Büyük Jatte Adası'nda Bir Pazar Öğleden Sonrası",
                    "artist": "Georges Seurat",
                    "year": "1884-1886",
                    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Georges_Seurat_-_A_Sunday_on_La_Grande_Jatte_--_1884_-_Google_Art_Project.jpg/1280px-Georges_Seurat_-_A_Sunday_on_La_Grande_Jatte_--_1884_-_Google_Art_Project.jpg",
                    "similarity_reason": "Aynı sanat akımı (Post-empresyonizm)"
                },
                {
                    "title": "Tahiti'deki Kadınlar",
                    "artist": "Paul Gauguin",
                    "year": "1891",
                    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Paul_Gauguin_-_Tahitian_Women_on_the_Beach_-_Google_Art_Project.jpg/1280px-Paul_Gauguin_-_Tahitian_Women_on_the_Beach_-_Google_Art_Project.jpg",
                    "similarity_reason": "Aynı sanat akımı (Post-empresyonizm)"
                },
                {
                    "title": "Mont Sainte-Victoire",
                    "artist": "Paul Cézanne",
                    "year": "1904",
                    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Paul_C%C3%A9zanne_-_Mont_Sainte-Victoire_-_Google_Art_Project.jpg/1280px-Paul_C%C3%A9zanne_-_Mont_Sainte-Victoire_-_Google_Art_Project.jpg",
                    "similarity_reason": "Aynı sanat akımı (Post-empresyonizm)"
                }
            ]
        }
        
        if movement in movement_similar:
            artworks = movement_similar[movement]
            # Arama yapılan eserle aynı olanları filtrele
            filtered_artworks = []
            for artwork in artworks:
                normalized_title = artwork["title"].lower().replace(" ", "").replace("-", "").replace("_", "")
                if normalized_title not in normalized_art_name and normalized_art_name not in normalized_title:
                    filtered_artworks.append(artwork)
            
            # Eğer yeterli eser yoksa, genel önerilerden ekle
            if len(filtered_artworks) < 3:
                general_artworks = get_general_artworks()
                for general_artwork in general_artworks:
                    if len(filtered_artworks) >= 3:
                        break
                    normalized_title = general_artwork["title"].lower().replace(" ", "").replace("-", "").replace("_", "")
                    if normalized_title not in normalized_art_name and normalized_art_name not in normalized_title:
                        filtered_artworks.append(general_artwork)
            
            return filtered_artworks[:3]
        
        # Genel öneriler
        general_artworks = get_general_artworks()
        # Arama yapılan eserle aynı olanları filtrele
        filtered_artworks = []
        for artwork in general_artworks:
            normalized_title = artwork["title"].lower().replace(" ", "").replace("-", "").replace("_", "")
            if normalized_title not in normalized_art_name and normalized_art_name not in normalized_title:
                filtered_artworks.append(artwork)
        
        return filtered_artworks[:3]
        
    except Exception as e:
        print(f"Benzer eserler hatası: {e}")
        return []

def get_general_artworks():
    """Genel sanat eseri önerilerini döndürür"""
    return [
        {
            "title": "Mona Lisa",
            "artist": "Leonardo da Vinci",
            "year": "1503-1519",
            "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/1280px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
            "similarity_reason": "Klasik sanat eseri"
        },
        {
            "title": "The Scream",
            "artist": "Edvard Munch",
            "year": "1893",
            "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg/1280px-Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg",
            "similarity_reason": "Modern sanat eseri"
        },
        {
            "title": "The Persistence of Memory",
            "artist": "Salvador Dalí",
            "year": "1931",
            "image_url": "https://upload.wikimedia.org/wikipedia/en/d/dd/The_Persistence_of_Memory.jpg",
            "similarity_reason": "Sürrealist sanat eseri"
        }
    ]

# Create service instance
artwork_service = ArtworkService()
