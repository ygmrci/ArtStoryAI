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
    allow_origins=["http://localhost:3000"],  # Frontend URL'in
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

        return {
            "art_name": decoded_name,
            "artist": artwork_details.get("artist", "AI ile üretiliyor..."),
            "year": artwork_details.get("year", "AI ile üretiliyor..."),
            "movement": artwork_details.get("movement", "AI ile üretiliyor..."),
            "museum": artwork_details.get("museum", "AI ile üretiliyor..."),
            "image_url": image_url,
            "story": story,
            "artist_bio": artist_bio,
            "movement_desc": movement_desc
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
