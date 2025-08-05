# Yedek görsel URL'leri
from typing import Optional

def get_fallback_images(art_name: str) -> Optional[str]:
    fallback_urls = {
        # Van Gogh eserleri
        "starry night": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
        "the starry night": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
        "sunflowers": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Vincent_Willem_van_Gogh_128.jpg/473px-Vincent_Willem_van_Gogh_128.jpg",
        "the sunflowers": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Vincent_Willem_van_Gogh_128.jpg/473px-Vincent_Willem_van_Gogh_128.jpg",
        "self portrait": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg/1280px-Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg",
        
        # Leonardo da Vinci eserleri
        "mona lisa": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/687px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
        "the last supper": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Leonardo_da_Vinci_-_The_Last_Supper.jpg/1280px-Leonardo_da_Vinci_-_The_Last_Supper.jpg",
        "vitruvian man": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Da_Vinci_Vitruve_Luc_Viatour.jpg/800px-Da_Vinci_Vitruve_Luc_Viatour.jpg",
        
        # Edvard Munch eserleri
        "the scream": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Edvard_Munch%2C_1893%2C_The_Scream.jpg/471px-The_Scream.jpg",
        "scream": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Edvard_Munch%2C_1893%2C_The_Scream.jpg/471px-The_Scream.jpg",
        
        # Pablo Picasso eserleri
        "guernica": "https://upload.wikimedia.org/wikipedia/en/thumb/7/74/PicassoGuernica.jpg/1200px-PicassoGuernica.jpg",
        "les demoiselles davignon": "https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Les_Demoiselles_d%27Avignon.jpg/1200px-Les_Demoiselles_d%27Avignon.jpg",
        
        # Johannes Vermeer eserleri
        "girl with a pearl earring": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/540px-Girl_with_a_Pearl_Earring.jpg",
        "the girl with a pearl earring": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/540px-Girl_with_a_Pearl_Earring.jpg",
        "the milkmaid": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/540px-Girl_with_a_Pearl_Earring.jpg",
        "milkmaid": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/540px-Girl_with_a_Pearl_Earring.jpg",
        
        # Hokusai eserleri
        "the great wave": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/The_Great_Wave_off_Kanagawa.jpg/1280px-The_Great_Wave.jpg",
        "great wave off kanagawa": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/The_Great_Wave_off_Kanagawa.jpg/1280px-The_Great_Wave.jpg",
        
        # Sandro Botticelli eserleri
        "birth of venus": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere.jpg/1280px-Birth_of_Venus.jpg",
        "the birth of venus": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere.jpg/1280px-Birth_of_Venus.jpg",
        
        # Michelangelo eserleri
        "the creation of adam": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg/1280px-Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg",
        "creation of adam": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg/1280px-Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg",
        
        # Claude Monet eserleri
        "water lilies": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Claude_Monet_-_Water_Lilies_-_Google_Art_Project.jpg/1280px-Claude_Monet_-_Water_Lilies_-_Google_Art_Project.jpg",
        "impression sunrise": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Monet_-_Impression%2C_Sunrise.jpg/1280px-Monet_-_Impression%2C_Sunrise.jpg",
        
        # Salvador Dalí eserleri
        "the persistence of memory": "https://upload.wikimedia.org/wikipedia/en/thumb/d/dd/The_Persistence_of_Memory.jpg/1200px-The_Persistence_of_Memory.jpg",
        "persistence of memory": "https://upload.wikimedia.org/wikipedia/en/thumb/d/dd/The_Persistence_of_Memory.jpg/1200px-The_Persistence_of_Memory.jpg",
        
        # Frida Kahlo eserleri
        "the two fridas": "https://upload.wikimedia.org/wikipedia/en/thumb/4/4e/Las_dos_Fridas.jpg/1200px-Las_dos_Fridas.jpg",
        "self portrait with thorn necklace": "https://upload.wikimedia.org/wikipedia/en/thumb/4/4e/Frida_Kahlo_-_Self-Portrait_with_Thorn_Necklace_and_Hummingbird.jpg/1200px-Frida_Kahlo_-_Self-Portrait_with_Thorn_Necklace_and_Hummingbird.jpg",
        
        # Gustav Klimt eserleri
        "the kiss": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg/1280px-The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg",
        "kiss": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg/1280px-The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg",
        
        # Rembrandt eserleri
        "the night watch": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Rembrandt_van_Rijn_-_The_Night_Watch_-_Google_Art_Project.jpg/1280px-Rembrandt_van_Rijn_-_The_Night_Watch_-_Google_Art_Project.jpg",
        "night watch": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Rembrandt_van_Rijn_-_The_Night_Watch_-_Google_Art_Project.jpg/1280px-Rembrandt_van_Rijn_-_The_Night_Watch_-_Google_Art_Project.jpg",
        
        # Vincent van Gogh diğer eserleri
        "bedroom in arles": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Vincent_van_Gogh_-_Bedroom_in_Arles_-_Google_Art_Project.jpg/1280px-Vincent_van_Gogh_-_Bedroom_in_Arles_-_Google_Art_Project.jpg",
        "irises": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Vincent_van_Gogh_-_Irises_-_Google_Art_Project.jpg/1280px-Vincent_van_Gogh_-_Irises_-_Google_Art_Project.jpg",
        "almond blossoms": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Vincent_van_Gogh_-_Almond_Blossom_-_Google_Art_Project.jpg/1280px-Vincent_van_Gogh_-_Almond_Blossom_-_Google_Art_Project.jpg",
    }
    name_lower = art_name.lower().strip()
    return fallback_urls.get(name_lower) 