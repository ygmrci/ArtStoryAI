from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import urllib.parse
from app.features.image_sources import (
    get_art_institute_image,
    get_met_museum_image,
    get_wikimedia_image,
    search_artwork_image
)
from app.features.fallback import get_fallback_images
from app.features.openai_story import generate_story_with_openai, generate_artist_bio_with_openai, generate_movement_desc_with_openai

app = FastAPI()

# CORS ayarı: Frontend'den gelen istekleri kabul et
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Frontend URL'leri
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello, ArtStoryAI!"}

@app.get("/artwork/{art_name}")
def get_artwork_info(art_name: str):
    try:
        decoded_name = urllib.parse.unquote(art_name)
        print(f"Aranan eser: {decoded_name}")

        # Önce fallback görseli dene
        image_url = get_fallback_images(decoded_name)

        # Fallback yoksa gelişmiş arama sistemi
        if not image_url:
            image_url = search_artwork_image(decoded_name)

        # Hala yoksa diğer API'leri sırayla dene
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

        # Hiçbiri bulunamazsa placeholder resim
        if not image_url:
            image_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png"

        # AI ile tüm bilgileri üret
        story = generate_story_with_openai(decoded_name)
        artist_bio = generate_artist_bio_with_openai(decoded_name)
        movement_desc = generate_movement_desc_with_openai(decoded_name)

        # AI'dan sanat eseri detaylarını al (yeni fonksiyon ekleyeceğiz)
        artwork_details = generate_artwork_details_with_openai(decoded_name)

        # Benzer eserleri bul
        similar_artworks = get_similar_artworks(decoded_name, artwork_details)

        return {
            "art_name": decoded_name,
            "artist": artwork_details.get("artist", "AI ile üretiliyor..."),
            "year": artwork_details.get("year", "AI ile üretiliyor..."),
            "movement": artwork_details.get("movement", "AI ile üretiliyor..."),
            "museum": artwork_details.get("museum", "AI ile üretiliyor..."),
            "image_url": image_url,
            "story": story,
            "artist_bio": artist_bio,
            "movement_desc": movement_desc,
            "similar_artworks": similar_artworks
        }

    except Exception as e:
        print(f"API hatası: {e}")
        return {
            "art_name": art_name,
            "artist": "Hata",
            "year": "?",
            "movement": "?",
            "museum": "?",
            "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png",
            "story": "Bir hata oluştu, lütfen tekrar deneyin.",
            "artist_bio": "",
            "movement_desc": ""
        }

def generate_artwork_details_with_openai(art_name: str):
    """AI ile sanat eseri detaylarını üretir"""
    try:
        from openai import OpenAI
        import os
        from dotenv import load_dotenv

        load_dotenv()
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

        prompt = f"""
        "{art_name}" adlı sanat eseri hakkında aşağıdaki bilgileri JSON formatında ver:
        - artist: Sanatçının tam adı
        - year: Eserin yapıldığı yıl (yaklaşık yıl da olabilir)
        - movement: Sanat akımı
        - museum: Eserin bulunduğu müze (varsa)

        Sadece JSON formatında cevap ver, başka açıklama yapma.
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

        import json
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


def get_similar_artworks(art_name: str, artwork_details: dict) -> list:
    """Benzer sanat eserlerini bulur"""
    try:
        artist = artwork_details.get("artist", "")
        movement = artwork_details.get("movement", "")
        
        # Benzer eserler veritabanı (gerçek uygulamada bu veriler API'den gelecek)
        similar_artworks_db = {
            "Vincent van Gogh": [
                {
                    "title": "Yıldızlı Gece",
                    "artist": "Vincent van Gogh",
                    "year": "1889",
                    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
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
                }
            ]
        }
        
        # Sanatçıya göre benzer eserleri bul
        if artist in similar_artworks_db:
            return similar_artworks_db[artist][:3]  # En fazla 3 eser döndür
        
        # Sanat akımına göre benzer eserler
        movement_similar = {
            "Empresyonizm": [
                {
                    "title": "Dans Eden Kızlar",
                    "artist": "Edgar Degas",
                    "year": "1874",
                    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Edgar_Degas_-_The_Dance_Class_-_Google_Art_Project.jpg/1280px-Edgar_Degas_-_The_Dance_Class_-_Google_Art_Project.jpg",
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
                }
            ]
        }
        
        if movement in movement_similar:
            return movement_similar[movement]
        
        # Genel öneriler
        return [
            {
                "title": "Yıldızlı Gece",
                "artist": "Vincent van Gogh",
                "year": "1889",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
                "similarity_reason": "Popüler sanat eseri"
            },
            {
                "title": "Mona Lisa",
                "artist": "Leonardo da Vinci",
                "year": "1503-1519",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/1280px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
                "similarity_reason": "Klasik sanat eseri"
            }
        ]
        
    except Exception as e:
        print(f"Benzer eserler hatası: {e}")
        return []
