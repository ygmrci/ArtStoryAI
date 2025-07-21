from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import urllib.parse
import json
from typing import Optional, Dict, Any
import openai
from dotenv import load_dotenv
import os

app = FastAPI()

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

# CORS middleware ekleyelim
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL'iniz
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello, ArtStoryAI!"}

def get_art_institute_image(art_name: str) -> Optional[str]:
    """Art Institute of Chicago API'sinden resim getir"""
    try:
        # IIIF API kullanarak yüksek kaliteli resimler
        search_url = "https://api.artic.edu/api/v1/artworks/search"
        params = {
            "q": art_name,
            "fields": "id,title,artist_display,image_id",
            "limit": 5
        }
        
        response = requests.get(search_url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if data.get("data"):
            for artwork in data["data"]:
                if artwork.get("image_id"):
                    # IIIF URL oluştur (orta boyut, iyi kalite)
                    image_id = artwork["image_id"]
                    iiif_url = f"https://www.artic.edu/iiif/2/{image_id}/full/843,/0/default.jpg"
                    return iiif_url
                    
    except Exception as e:
        print(f"Art Institute API hatası: {e}")
    
    return None

def get_met_museum_image(art_name: str) -> Optional[str]:
    """Metropolitan Museum API'sinden resim getir"""
    try:
        # MET Museum'un açık API'si
        search_url = "https://collectionapi.metmuseum.org/public/collection/v1/search"
        params = {
            "q": art_name,
            "hasImages": "true"
        }
        
        response = requests.get(search_url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if data.get("objectIDs"):
            # İlk birkaç sonucu deneyelim
            for obj_id in data["objectIDs"][:3]:
                try:
                    obj_url = f"https://collectionapi.metmuseum.org/public/collection/v1/objects/{obj_id}"
                    obj_response = requests.get(obj_url, timeout=10)
                    obj_data = obj_response.json()
                    
                    if obj_data.get("primaryImage"):
                        return obj_data["primaryImage"]
                except:
                    continue
                    
    except Exception as e:
        print(f"MET Museum API hatası: {e}")
    
    return None

def get_wikimedia_image(art_name: str) -> Optional[str]:
    """Wikipedia'dan resim URL'i getir (iyileştirilmiş)"""
    try:
        url = "https://en.wikipedia.org/w/api.php"
        
        # Önce sayfa ID'sini alalım
        search_params = {
            "action": "query",
            "format": "json",
            "list": "search",
            "srsearch": f'"{art_name}" painting',
            "srlimit": 3
        }
        
        response = requests.get(url, params=search_params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        search_results = data.get("query", {}).get("search", [])
        
        for result in search_results:
            page_title = result["title"]
            
            # Sayfa resimlerini getir
            params = {
                "action": "query",
                "format": "json",
                "prop": "pageimages|images",
                "titles": page_title,
                "pithumbsize": 800,  # Daha büyük resim
                "pilimit": 5
            }
            
            page_response = requests.get(url, params=params, timeout=10)
            page_data = page_response.json()
            pages = page_data.get("query", {}).get("pages", {})
            
            for page in pages.values():
                # Önce thumbnail deneyelim
                if "thumbnail" in page:
                    thumbnail_url = page["thumbnail"]["source"]
                    # Daha büyük versiyonunu iste
                    high_res_url = thumbnail_url.replace("/thumb/", "/").split("/")
                    if len(high_res_url) > 1:
                        # Orijinal dosya adını bul
                        original_name = high_res_url[-1].split("px-")[0] if "px-" in high_res_url[-1] else high_res_url[-1]
                        return thumbnail_url.replace(high_res_url[-1], original_name)
                    return thumbnail_url
                
                # Resim listesinden deneyelim
                if "images" in page and page["images"]:
                    for image in page["images"][:3]:  # İlk 3 resmi dene
                        image_title = image["title"]
                        if any(ext in image_title.lower() for ext in ['.jpg', '.jpeg', '.png', '.svg']):
                            # Resim bilgilerini getir
                            img_params = {
                                "action": "query",
                                "format": "json",
                                "prop": "imageinfo",
                                "titles": image_title,
                                "iiprop": "url|size",
                                "iiurlwidth": 800
                            }
                            
                            img_response = requests.get(url, params=img_params, timeout=10)
                            img_data = img_response.json()
                            img_pages = img_data.get("query", {}).get("pages", {})
                            
                            for img_page in img_pages.values():
                                if "imageinfo" in img_page and img_page["imageinfo"]:
                                    imageinfo = img_page["imageinfo"][0]
                                    if "thumburl" in imageinfo:
                                        return imageinfo["thumburl"]
                                    elif "url" in imageinfo:
                                        return imageinfo["url"]
        
    except Exception as e:
        print(f"Wikipedia API hatası: {e}")
    
    return None

def get_fallback_images(art_name: str) -> Optional[str]:
    """Yedek resim kaynakları"""
    # Yaygın eserlerin doğrudan URL'leri
    fallback_urls = {
        "starry night": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
        "the starry night": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
        "mona lisa": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/687px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
        "the scream": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg/471px-Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg",
        "sunflowers": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Vincent_Willem_van_Gogh_128.jpg/473px-Vincent_Willem_van_Gogh_128.jpg",
        "guernica": "https://upload.wikimedia.org/wikipedia/en/thumb/7/74/PicassoGuernica.jpg/1200px-PicassoGuernica.jpg",
        "the last supper": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Leonardo_da_Vinci_%281452-1519%29_-_The_Last_Supper_%281495-1498%29.jpg/1280px-Leonardo_da_Vinci_%281452-1519%29_-_The_Last_Supper_%281495-1498%29.jpg",
        "girl with a pearl earring": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/540px-1665_Girl_with_a_Pearl_Earring.jpg",
        "the great wave": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/The_Great_Wave_off_Kanagawa.jpg/1280px-The_Great_Wave_off_Kanagawa.jpg",
        "birth of venus": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg/1280px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg"
    }
    
    name_lower = art_name.lower().strip()
    return fallback_urls.get(name_lower)

def generate_story_with_openai(art_name: str) -> str:
    prompt = f"'{art_name}' adlı tablo için kısa, yaratıcı ve özgün bir hikaye yaz. Hikaye 3-4 cümle olsun."
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Sen yaratıcı bir sanat hikayesi anlatıcısısın."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=200,
            temperature=0.8
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print("OpenAI API hatası:", e)
        return "AI ile hikaye üretilemedi."

@app.get("/artwork/{art_name}")
def get_artwork_info(art_name: str):
    """Sanat eseri bilgilerini getir (çoklu kaynak)"""
    try:
        # URL decode
        decoded_name = urllib.parse.unquote(art_name)
        print(f"Aranan eser: {decoded_name}")
        
        # Çoklu kaynak stratejisi - sırasıyla dene
        image_url = None
        
        # 1. Önce fallback'lere bak (hızlı)
        image_url = get_fallback_images(decoded_name)
        
        # 2. Art Institute of Chicago (yüksek kalite)
        if not image_url:
            print("Art Institute'dan deneniyor...")
            image_url = get_art_institute_image(decoded_name)
        
        # 3. MET Museum (geniş koleksiyon)
        if not image_url:
            print("MET Museum'dan deneniyor...")
            image_url = get_met_museum_image(decoded_name)
        
        # 4. Wikipedia (son çare, ama iyileştirilmiş)
        if not image_url:
            print("Wikipedia'dan deneniyor...")
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
                    print(f"Alternatif deneniyor: {alt_name}")
                    image_url = get_wikimedia_image(alt_name)
                    if image_url:
                        break
        
        # 5. Son çare - placeholder
        if not image_url:
            image_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png"
        
        print(f"Bulunan resim URL: {image_url}")
        
        # TODO: Buraya AI entegrasyonu eklenecek (OpenAI/Claude API)
        story = generate_story_with_openai(decoded_name)
        return {
            "art_name": decoded_name,
            "artist": "Bilinmiyor",  # AI ile doldurulacak
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