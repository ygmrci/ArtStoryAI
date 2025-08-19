"""
Main FastAPI application for ArtStoryAI
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from app.schemas import StoryAudioRequest, TextAudioRequest
from app.artwork_service import artwork_service
from app.features.text_to_speech import generate_story_audio, generate_speech_from_text, get_available_voices
from app.recommendation_routes import router as recommendation_router
from app.cache_service import artwork_cache
from app.manual_image_routes import router as manual_image_router


app = FastAPI(
    title="ArtStoryAI API",
    description="AI-powered art storytelling and recommendation system",
    version="1.0.0"
)

# CORS ayarı: Frontend'den gelen istekleri kabul et
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://localhost:3000/",
        "http://127.0.0.1:3000/"
    ],  # Frontend URL'leri
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Include recommendation routes
app.include_router(recommendation_router)

# Include manual image routes
app.include_router(manual_image_router)



@app.get("/")
def read_root():
    """Root endpoint"""
    return {"message": "Hello, ArtStoryAI!"}

@app.get("/manual-upload", response_class=HTMLResponse)
def get_manual_upload_page():
    """Manuel resim yükleme sayfası"""
    try:
        with open("app/manual_image_upload.html", "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    except FileNotFoundError:
        return HTMLResponse(content="<h1>Manuel yükleme sayfası bulunamadı</h1>")

@app.get("/artwork/{art_name}")
def get_artwork_info(art_name: str):
    """Get comprehensive artwork information"""
    try:
        return artwork_service.get_artwork_info(art_name)
    except Exception as e:
        print(f"Artwork info hatası: {e}")
        return {
            "error": "Sanat eseri bilgisi alınırken hata oluştu",
            "details": str(e)
        }

# Sesli Anlatım Endpoint'leri
@app.post("/audio/story")
def create_story_audio(request: StoryAudioRequest):
    """
    Sanat eseri hikayesi için sesli anlatım oluşturur
    """
    try:
        audio_url = generate_story_audio(request.art_name, request.story)
        return {
            "art_name": request.art_name,
            "audio_url": audio_url,
            "voice": request.voice,
            "status": "success"
        }
    except Exception as e:
        print(f"Sesli anlatım hatası: {e}")
        return {
            "error": "Sesli anlatım oluşturulurken hata oluştu",
            "details": str(e)
        }

@app.post("/audio/text")
def create_text_audio(request: TextAudioRequest):
    """
    Metin için sesli anlatım oluşturur
    """
    try:
        audio_url = generate_speech_from_text(request.text, request.voice)
        return {
            "text": request.text,
            "audio_url": audio_url,
            "voice": request.voice,
            "status": "success"
        }
    except Exception as e:
        print(f"Metin sesli anlatım hatası: {e}")
        return {
            "error": "Metin sesli anlatımı oluşturulurken hata oluştu",
            "details": str(e)
        }

@app.get("/audio/voices")
def get_voices():
    """
    Kullanılabilir sesleri döndürür
    """
    try:
        return {
            "voices": get_available_voices()
        }
    except Exception as e:
        print(f"Ses listesi hatası: {e}")
        return {
            "error": "Ses listesi alınırken hata oluştu",
            "details": str(e)
        }

# Cache Yönetim Endpoint'leri
@app.get("/cache/stats")
def get_cache_stats():
    """
    Cache istatistiklerini döndürür
    """
    try:
        return {
            "cache_stats": artwork_cache.get_stats(),
            "message": "Cache istatistikleri başarıyla alındı"
        }
    except Exception as e:
        print(f"Cache stats hatası: {e}")
        return {
            "error": "Cache istatistikleri alınırken hata oluştu",
            "details": str(e)
        }

@app.delete("/cache/clear")
def clear_cache():
    """
    Tüm cache'i temizler
    """
    try:
        artwork_cache.clear()
        return {
            "message": "Cache başarıyla temizlendi",
            "status": "success"
        }
    except Exception as e:
        print(f"Cache clear hatası: {e}")
        return {
            "error": "Cache temizlenirken hata oluştu",
            "details": str(e)
        }

@app.get("/cache/keys")
def get_cache_keys():
    """
    Cache'deki tüm anahtarları listeler
    """
    try:
        keys = list(artwork_cache.cache.keys())
        return {
            "total_keys": len(keys),
            "keys": keys[:50],  # İlk 50 anahtarı göster
            "message": "Cache anahtarları başarıyla alındı"
        }
    except Exception as e:
        print(f"Cache keys hatası: {e}")
        return {
            "error": "Cache anahtarları alınırken hata oluştu",
            "details": str(e)
        }
