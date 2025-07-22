from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import urllib.parse
from app.features.image_sources import (
    get_art_institute_image,
    get_met_museum_image,
    get_wikimedia_image
)
from app.features.fallback import get_fallback_images
from app.features.openai_story import generate_story_with_openai

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

        # Görsel URL’sini sırayla dene
        image_url = get_fallback_images(decoded_name)

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

        # AI ile hikaye oluştur
        story = generate_story_with_openai(decoded_name)

        return {
            "art_name": decoded_name,
            "artist": "Bilinmiyor",
            "year": "?",
            "movement": "?",
            "museum": "?",
            "image_url": image_url,
            "story": story,
            "artist_bio": "Sanatçı biyografisi AI ile oluşturulacak.",
            "movement_desc": "Akım açıklaması AI ile oluşturulacak."
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
