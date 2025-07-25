# Tüm API'lerden görsel çekme fonksiyonları
import requests
from typing import Optional
import re

def normalize_art_name(art_name: str) -> str:
    """Sanat eseri adını normalize eder"""
    # Küçük harfe çevir
    normalized = art_name.lower().strip()
    # Özel karakterleri temizle
    normalized = re.sub(r'[^\w\s]', '', normalized)
    # Fazla boşlukları temizle
    normalized = re.sub(r'\s+', ' ', normalized)
    return normalized

def get_art_institute_image(art_name: str) -> Optional[str]:
    try:
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
                    image_id = artwork["image_id"]
                    iiif_url = f"https://www.artic.edu/iiif/2/{image_id}/full/843,/0/default.jpg"
                    return iiif_url
    except Exception as e:
        print(f"Art Institute API hatası: {e}")
    return None

def get_met_museum_image(art_name: str) -> Optional[str]:
    try:
        search_url = "https://collectionapi.metmuseum.org/public/collection/v1/search"
        params = {
            "q": art_name,
            "hasImages": "true"
        }
        response = requests.get(search_url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        if data.get("objectIDs"):
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
    try:
        url = "https://en.wikipedia.org/w/api.php"
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
            params = {
                "action": "query",
                "format": "json",
                "prop": "pageimages|images",
                "titles": page_title,
                "pithumbsize": 800,
                "pilimit": 5
            }
            page_response = requests.get(url, params=params, timeout=10)
            page_data = page_response.json()
            pages = page_data.get("query", {}).get("pages", {})
            for page in pages.values():
                if "thumbnail" in page:
                    return page["thumbnail"]["source"]
    except Exception as e:
        print(f"Wikipedia API hatası: {e}")
    return None

def get_harvard_art_museums_image(art_name: str) -> Optional[str]:
    """Harvard Art Museums API'den görsel çeker"""
    try:
        # Harvard Art Museums API key gerekli (ücretsiz kayıt)
        api_key = "YOUR_HARVARD_API_KEY"  # Gerçek API key ile değiştirilmeli
        search_url = "https://api.harvardartmuseums.org/object"
        params = {
            "apikey": api_key,
            "q": f"title:*{art_name}*",
            "size": 5,
            "hasimage": 1
        }
        response = requests.get(search_url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        if data.get("records"):
            for record in data["records"]:
                if record.get("images"):
                    for image in record["images"]:
                        if image.get("baseimageurl"):
                            return image["baseimageurl"]
    except Exception as e:
        print(f"Harvard Art Museums API hatası: {e}")
    return None

def get_rijksmuseum_image(art_name: str) -> Optional[str]:
    """Rijksmuseum API'den görsel çeker"""
    try:
        search_url = "https://www.rijksmuseum.nl/api/en/collection"
        params = {
            "q": art_name,
            "imgonly": True,
            "ps": 5
        }
        response = requests.get(search_url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        if data.get("artObjects"):
            for artwork in data["artObjects"]:
                if artwork.get("webImage"):
                    return artwork["webImage"]["url"]
    except Exception as e:
        print(f"Rijksmuseum API hatası: {e}")
    return None

def get_unsplash_art_image(art_name: str) -> Optional[str]:
    """Unsplash API'den sanat temalı görsel çeker"""
    try:
        # Unsplash API key gerekli (ücretsiz kayıt)
        api_key = "YOUR_UNSPLASH_API_KEY"  # Gerçek API key ile değiştirilmeli
        search_url = "https://api.unsplash.com/search/photos"
        headers = {
            "Authorization": f"Client-ID {api_key}"
        }
        params = {
            "query": f"{art_name} art painting",
            "per_page": 5,
            "orientation": "landscape"
        }
        response = requests.get(search_url, headers=headers, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        if data.get("results"):
            for result in data["results"]:
                if result.get("urls", {}).get("regular"):
                    return result["urls"]["regular"]
    except Exception as e:
        print(f"Unsplash API hatası: {e}")
    return None

def search_artwork_image(art_name: str) -> Optional[str]:
    """Tüm API'leri sırayla dener ve en iyi görseli döner"""
    normalized_name = normalize_art_name(art_name)
    
    # Arama stratejileri
    search_variations = [
        art_name,
        normalized_name,
        f"{art_name} painting",
        f"{art_name} artwork",
        f"{art_name} masterpiece",
        art_name.replace("'", ""),
        art_name.replace("'", "'"),
    ]
    
    # Her API'yi her varyasyonla dene
    apis = [
        get_art_institute_image,
        get_met_museum_image,
        get_wikimedia_image,
        get_rijksmuseum_image,
    ]
    
    for api_func in apis:
        for variation in search_variations:
            try:
                image_url = api_func(variation)
                if image_url:
                    print(f"Görsel bulundu: {api_func.__name__} - {variation}")
                    return image_url
            except Exception as e:
                print(f"API hatası {api_func.__name__}: {e}")
                continue
    
    return None
