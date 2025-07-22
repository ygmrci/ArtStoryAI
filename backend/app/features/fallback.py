# Yedek görsel URL’leri
from typing import Optional

def get_fallback_images(art_name: str) -> Optional[str]:
    fallback_urls = {
        "starry night": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
        "the starry night": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
        "mona lisa": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/687px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
        "the scream": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Edvard_Munch%2C_1893%2C_The_Scream.jpg/471px-The_Scream.jpg",
        "sunflowers": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Vincent_Willem_van_Gogh_128.jpg/473px-Vincent_Willem_van_Gogh_128.jpg",
        "guernica": "https://upload.wikimedia.org/wikipedia/en/thumb/7/74/PicassoGuernica.jpg/1200px-PicassoGuernica.jpg",
        "the last supper": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Leonardo_da_Vinci_-_The_Last_Supper.jpg/1280px-The_Last_Supper.jpg",
        "girl with a pearl earring": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/540px-Girl_with_a_Pearl_Earring.jpg",
        "the great wave": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/The_Great_Wave_off_Kanagawa.jpg/1280px-The_Great_Wave.jpg",
        "birth of venus": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere.jpg/1280px-Birth_of_Venus.jpg"
    }
    name_lower = art_name.lower().strip()
    return fallback_urls.get(name_lower)
