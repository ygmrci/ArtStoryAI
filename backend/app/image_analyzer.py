import io
import base64
import json
import asyncio
from PIL import Image
from fastapi import HTTPException
from typing import Optional

async def analyze_with_openai_vision(image_data: bytes, client) -> dict:
    """
    OpenAI Vision API ile görsel analizi
    """
    try:
        # Görseli base64'e çevir
        image_base64 = base64.b64encode(image_data).decode('utf-8')
        
        # OpenAI Vision API isteği
        response = await asyncio.to_thread(
            client.chat.completions.create,
            model="gpt-4-vision-preview",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": """Bu sanat eserini analiz et ve şu bilgileri ver:
                            
1. Eser adı (Türkçe)
2. Sanatçı adı (Türkçe)
3. Yapım yılı (yaklaşık)
4. Sanat akımı (Türkçe)
5. Eser hakkında kısa açıklama (Türkçe, 2-3 cümle)
6. Tanıma güveni (0.0-1.0 arası)

Sadece JSON formatında yanıt ver, başka açıklama ekleme:
{
  "artwork_name": "eser adı",
  "artist": "sanatçı adı", 
  "year": "yıl",
  "movement": "akım",
  "description": "açıklama",
  "confidence": 0.9
}"""
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image_base64}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=500
        )
        
        # Yanıtı parse et
        content = response.choices[0].message.content
        print(f"🤖 OpenAI yanıtı: {content}")
        
        # JSON'ı çıkar
        try:
            # JSON bloklarını bul
            start = content.find('{')
            end = content.rfind('}') + 1
            if start != -1 and end != 0:
                json_str = content[start:end]
                result = json.loads(json_str)
                print(f"✅ JSON parse edildi: {result}")
                return result
            else:
                raise ValueError("JSON bulunamadı")
        except json.JSONDecodeError as e:
            print(f"❌ JSON parse hatası: {e}")
            # Fallback analiz
            return await fallback_image_analysis(image_data)
            
    except Exception as e:
        print(f"❌ OpenAI Vision API hatası: {e}")
        # Fallback analiz
        return await fallback_image_analysis(image_data)

async def fallback_image_analysis(image_data: bytes) -> dict:
    """
    OpenAI API kullanılamadığında basit analiz
    """
    try:
        # Görsel boyutlarını al
        pil_image = Image.open(io.BytesIO(image_data))
        width, height = pil_image.size
        
        # Basit analiz
        aspect_ratio = width / height
        
        # Boyut ve orana göre tahmin
        if aspect_ratio > 1.5:  # Yatay
            style = "Manzara veya geniş kompozisyon"
        elif aspect_ratio < 0.8:  # Dikey
            style = "Portre veya dikey kompozisyon"
        else:  # Kare
            style = "Portre veya kare kompozisyon"
        
        # Renk analizi
        try:
            # Görseli küçült ve renk analizi yap
            small_image = pil_image.resize((50, 50))
            colors = small_image.getcolors(maxcolors=1000)
            
            if colors:
                # En çok kullanılan rengi bul
                dominant_color = max(colors, key=lambda x: x[0])[1]
                color_name = get_color_name(dominant_color)
            else:
                color_name = "Karışık renkler"
        except:
            color_name = "Renk analizi yapılamadı"
        
        return {
            "artwork_name": "Yüklenen Görsel (AI Analizi Gerekli)",
            "artist": "Bilinmeyen Sanatçı",
            "year": "Bilinmeyen",
            "movement": style,
            "description": f"Bu görsel {width}x{height} boyutlarında, {color_name} ağırlıklı bir eser. Daha detaylı analiz için eser adını yazarak arama yapabilirsiniz.",
            "confidence": 0.1
        }
        
    except Exception as e:
        print(f"❌ Fallback analiz hatası: {e}")
        return {
            "artwork_name": "Yüklenen Görsel",
            "artist": "Bilinmeyen",
            "year": "Bilinmeyen",
            "movement": "Bilinmeyen",
            "description": "Görsel analiz edilemedi. Lütfen eser adını yazarak arama yapın.",
            "confidence": 0.0
        }

def get_color_name(rgb):
    """
    RGB renk koduna göre renk adı döndür
    """
    r, g, b = rgb
    
    # Basit renk tanıma
    if r > 200 and g > 200 and b > 200:
        return "Açık tonlar"
    elif r < 50 and g < 50 and b < 50:
        return "Koyu tonlar"
    elif r > 200 and g > 200:
        return "Sarı tonlar"
    elif r > 200 and b > 200:
        return "Magenta tonlar"
    elif g > 200 and b > 200:
        return "Cyan tonlar"
    elif r > 200:
        return "Kırmızı tonlar"
    elif g > 200:
        return "Yeşil tonlar"
    elif b > 200:
        return "Mavi tonlar"
    else:
        return "Karışık renkler"
