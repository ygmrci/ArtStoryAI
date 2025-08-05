from openai import OpenAI
import os
import base64
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_speech_from_text(text: str, voice: str = "alloy") -> str:
    """
    Metni sesli anlatıma çevirir
    
    Args:
        text: Sesli anlatılacak metin
        voice: Ses türü (alloy, echo, fable, onyx, nova, shimmer)
        
    Returns:
        Base64 encoded audio data
    """
    try:
        response = client.audio.speech.create(
            model="tts-1",
            voice=voice,
            input=text,
            speed=1.0
        )
        
        # Audio data'yı base64'e çevir
        audio_data = response.content
        audio_base64 = base64.b64encode(audio_data).decode('utf-8')
        
        return audio_base64
        
    except Exception as e:
        print(f"Text-to-speech hatası: {e}")
        return None

def generate_story_audio(art_name: str, story: str) -> str:
    """
    Sanat eseri hikayesi için sesli anlatım oluşturur
    
    Args:
        art_name: Sanat eseri adı
        story: Hikaye metni
        
    Returns:
        Base64 encoded audio data
    """
    # Hikaye için özel prompt oluştur
    audio_text = f"{art_name} adlı eserin hikayesi: {story}"
    
    return generate_speech_from_text(audio_text, "nova")

def get_available_voices() -> list:
    """
    Kullanılabilir ses türlerini döndürür
    """
    return [
        {"id": "alloy", "name": "Alloy", "description": "Çok amaçlı, dengeli ses"},
        {"id": "echo", "name": "Echo", "description": "Sıcak ve samimi ses"},
        {"id": "fable", "name": "Fable", "description": "Hikaye anlatımı için ideal"},
        {"id": "onyx", "name": "Onyx", "description": "Güçlü ve etkileyici ses"},
        {"id": "nova", "name": "Nova", "description": "Genç ve enerjik ses"},
        {"id": "shimmer", "name": "Shimmer", "description": "Yumuşak ve nazik ses"}
    ] 