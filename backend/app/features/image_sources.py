# Tüm API’lerden görsel çekme fonksiyonları
import requests
from typing import Optional

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
