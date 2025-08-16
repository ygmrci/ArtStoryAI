"""
Manual Artwork Management System for ArtStoryAI
Handles manually curated artworks that AI cannot find
"""

from typing import Dict, List, Optional

class ManualArtworkManager:
    """Manages manually curated artwork information"""
    
    def __init__(self):
        self.manual_artworks = {
            # Türk Sanatçıları
            "Osman Hamdi Bey": {
                "title": "Kaplumbağa Terbiyecisi",
                "artist": "Osman Hamdi Bey",
                "year": "1906",
                "movement": "Oryantalizm",
                "style": "Oil on canvas",
                "museum": "Pera Müzesi, İstanbul",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Osman_Hamdi_Bey_-_Kaplumba%C4%9Fa_Terbiyecisi.jpg/1280px-Osman_Hamdi_Bey_-_Kaplumba%C4%9Fa_Terbiyecisi.jpg",
                "description": "Türk resim sanatının en önemli eserlerinden biri",
                "story": "Kaplumbağa Terbiyecisi, Osman Hamdi Bey'in en ünlü eseridir. Eserde, geleneksel kıyafetler giymiş bir adam, kaplumbağaları eğitmeye çalışmaktadır. Bu eser, Doğu ile Batı arasındaki kültürel çelişkiyi ve Osmanlı toplumundaki değişimi sembolize eder.",
                "artist_bio": "Osman Hamdi Bey (1842-1910), Türk ressam, arkeolog ve müzeci. İlk Türk arkeoloğu olarak bilinir ve İstanbul Arkeoloji Müzesi'nin kurucusudur. Oryantalist tarzda eserler üretmiştir.",
                "movement_desc": "Oryantalizm, 19. yüzyılda Batılı sanatçıların Doğu kültürlerini ve yaşam tarzlarını konu alan sanat akımıdır. Osman Hamdi Bey, bu akımı Türk sanatına uyarlayarak özgün eserler yaratmıştır."
            },
            
            # Az Bilinen Klasik Eserler
            "The Garden of Earthly Delights": {
                "title": "The Garden of Earthly Delights",
                "artist": "Hieronymus Bosch",
                "year": "1490-1510",
                "movement": "Early Netherlandish",
                "style": "Oil on oak panels",
                "museum": "Museo del Prado, Madrid",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/005_The_Garden_of_Earthly_Delights_by_Bosch_High_Resolution.jpg/1280px-005_The_Garden_of_Earthly_Delights_by_Bosch_High_Resolution.jpg",
                "description": "Bosch'un en ünlü ve gizemli eseri",
                "story": "Bu üç panelli eser, cennet, dünya ve cehennemi tasvir eder. Orta panelde, insanların dünyevi zevklerle dolu bir bahçede yaşadığı görülür. Eser, insan doğasının karmaşıklığını ve ahlaki seçimlerini yansıtır.",
                "artist_bio": "Hieronymus Bosch (1450-1516), Hollandalı ressam. Fantastik ve alegorik eserleriyle tanınır. Eserlerinde dini temaları ve insan doğasını karmaşık sembollerle işler.",
                "movement_desc": "Erken Hollanda resmi, 15. yüzyılda gelişen ve detaycılığı öne çıkaran bir sanat akımıdır. Bosch, bu geleneği fantastik unsurlarla birleştirerek özgün bir tarz yaratmıştır."
            },
            
            # Modern Türk Sanatı
            "Bedri Rahmi Eyüboğlu": {
                "title": "Köylü Kadın",
                "artist": "Bedri Rahmi Eyüboğlu",
                "year": "1933",
                "movement": "Modern Türk Resmi",
                "style": "Oil on canvas",
                "museum": "İstanbul Resim ve Heykel Müzesi",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Bedri_Rahmi_Ey%C3%BCbo%C4%9Flu_-_K%C3%B6yl%C3%BC_Kad%C4%B1n.jpg/1280px-Bedri_Rahmi_Ey%C3%BCbo%C4%9Flu_-_K%C3%B6yl%C3%BC_Kad%C4%B1n.jpg",
                "description": "Türk köy yaşamını yansıtan önemli eser",
                "story": "Köylü Kadın, Bedri Rahmi'nin erken dönem eserlerindendir. Eserde, geleneksel kıyafetler giymiş bir köylü kadın, doğal ve samimi bir şekilde tasvir edilmiştir. Bu eser, Türk halkının yaşam tarzını ve kültürel kimliğini yansıtır.",
                "artist_bio": "Bedri Rahmi Eyüboğlu (1911-1975), Türk ressam, şair ve yazar. Halk sanatından ilham alarak özgün bir tarz geliştirmiştir. Eserlerinde Anadolu kültürünü ve halk yaşamını konu alır.",
                "movement_desc": "Modern Türk Resmi, 20. yüzyılda gelişen ve geleneksel Türk sanatı ile modern teknikleri birleştiren bir akımdır. Bedri Rahmi, bu akımın öncülerinden biri olarak kabul edilir."
            },
            
            # Az Bilinen Rönesans Eserleri
            "The Arnolfini Portrait": {
                "title": "The Arnolfini Portrait",
                "artist": "Jan van Eyck",
                "year": "1434",
                "movement": "Early Netherlandish",
                "style": "Oil on oak panel",
                "museum": "National Gallery, London",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Jan_van_Eyck_-_The_Arnolfini_Portrait_-_Google_Art_Project.jpg/1280px-Jan_van_Eyck_-_The_Arnolfini_Portrait_-_Google_Art_Project.jpg",
                "description": "Van Eyck'in en ünlü portresi",
                "story": "Bu eser, İtalyan tüccar Giovanni di Nicolao Arnolfini ve eşinin evlilik portresidir. Eserde, çift evlerinde, evlilik yeminlerini ederken tasvir edilmiştir. Detaylı semboller ve ayna yansıması ile zenginleştirilmiştir.",
                "artist_bio": "Jan van Eyck (1390-1441), Flaman ressam. Yağlı boya tekniğini mükemmelleştiren sanatçılardan biri olarak kabul edilir. Eserlerinde detaycılık ve gerçekçilik öne çıkar.",
                "movement_desc": "Erken Hollanda resmi, 15. yüzyılda gelişen ve dini temaları gerçekçi bir şekilde işleyen bir akımdır. Van Eyck, bu akımın en önemli temsilcilerinden biridir."
            },
            
            # Kullanıcının İstediği Ünlü Eserler
            "Venüs'ün Doğuşu": {
                "title": "Venüs'ün Doğuşu (The Birth of Venus)",
                "artist": "Sandro Botticelli",
                "year": "1485-1486",
                "movement": "İtalyan Rönesansı",
                "style": "Tempera on canvas",
                "museum": "Uffizi Gallery, Florence",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project.jpg/1280px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project.jpg",
                "description": "Rönesans'ın en ünlü mitolojik eseri",
                "story": "Venüs'ün Doğuşu, Roma tanrıçası Venüs'ün deniz köpüğünden doğuşunu tasvir eder. Eserde, Venüs bir deniz kabuğunun üzerinde dururken, rüzgar tanrıları onu kıyıya doğru üfler. Bu eser, Rönesans'ın klasik mitolojiye olan ilgisini ve güzellik idealini yansıtır.",
                "artist_bio": "Sandro Botticelli (1445-1510), İtalyan Rönesans ressamı. Floransa'da yaşamış ve Medici ailesi için çalışmıştır. Eserlerinde zarif figürler ve mitolojik temalar öne çıkar.",
                "movement_desc": "İtalyan Rönesansı, 15. yüzyılda İtalya'da gelişen ve antik Yunan-Roma sanatını yeniden canlandıran bir sanat akımıdır. Botticelli, bu akımın en önemli temsilcilerinden biridir."
            },
            
            "Adem'in Yaratılışı": {
                "title": "Adem'in Yaratılışı (The Creation of Adam)",
                "artist": "Michelangelo",
                "year": "1508-1512",
                "movement": "Yüksek Rönesans",
                "style": "Fresco",
                "museum": "Sistine Chapel, Vatican",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg/1280px-Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg",
                "description": "Sistine Şapeli'nin en ünlü freski",
                "story": "Bu fresk, Tanrı'nın Adem'i yaratma anını tasvir eder. Tanrı'nın parmağı ile Adem'in parmağı arasındaki boşluk, insanlığın yaratılış anını sembolize eder. Michelangelo'nun en ünlü eserlerinden biri olan bu fresk, insan vücudunun mükemmelliğini ve ilahi yaratıcılığı yansıtır.",
                "artist_bio": "Michelangelo Buonarroti (1475-1564), İtalyan Rönesans'ının en büyük sanatçılarından biri. Heykel, resim ve mimari alanlarında eserler vermiştir. Sistine Şapeli'nin tavan freskleri onun en ünlü eserleridir.",
                "movement_desc": "Yüksek Rönesans, 16. yüzyılda İtalya'da gelişen ve sanatın mükemmelliğe ulaştığı dönemdir. Michelangelo, Leonardo da Vinci ve Raphael bu dönemin en önemli temsilcileridir."
            },
            
            "Nilüferler": {
                "title": "Nilüferler (Water Lilies)",
                "artist": "Claude Monet",
                "year": "1916",
                "movement": "Empresyonizm",
                "style": "Oil on canvas",
                "museum": "Musée de l'Orangerie, Paris",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Claude_Monet_-_Water_Lilies_-_Google_Art_Project.jpg/1280px-Claude_Monet_-_Water_Lilies_-_Google_Art_Project.jpg",
                "description": "Monet'nin en ünlü serisi",
                "story": "Nilüferler serisi, Monet'nin Giverny'deki bahçesindeki nilüfer havuzunu konu alır. Bu eserler, ışığın ve mevsimlerin değişimini yansıtır. Monet, aynı konuyu farklı ışık koşullarında resimleyerek empresyonist tekniğin en güzel örneklerini vermiştir.",
                "artist_bio": "Claude Monet (1840-1926), Fransız empresyonist ressam. Empresyonizm akımının kurucularından biri olarak kabul edilir. Işık ve renk üzerine yaptığı çalışmalarla tanınır.",
                "movement_desc": "Empresyonizm, 19. yüzyılda Fransa'da gelişen ve doğal ışığın etkilerini yakalamaya odaklanan bir sanat akımıdır. Monet, bu akımın en önemli temsilcilerinden biridir."
            },
            
            "Campbell'ın Çorba Kutuları": {
                "title": "Campbell'ın Çorba Kutuları (Campbell's Soup Cans)",
                "artist": "Andy Warhol",
                "year": "1962",
                "movement": "Pop Art",
                "style": "Synthetic polymer paint on canvas",
                "museum": "Museum of Modern Art, New York",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Andy_Warhol%2C_Campbell_Soup_Cans%2C_1962.jpg/1280px-Andy_Warhol%2C_Campbell_Soup_Cans%2C_1962.jpg",
                "description": "Pop Art'ın ikonik eseri",
                "story": "Bu eser, 32 adet Campbell çorba kutusu resminden oluşur. Warhol, günlük tüketim ürünlerini sanat eserine dönüştürerek ticari kültürü ve kitle üretimini sorgular. Bu eser, modern sanatın en tanınmış örneklerinden biridir.",
                "artist_bio": "Andy Warhol (1928-1987), Amerikalı pop art sanatçısı. Ticari ürünleri ve ünlüleri konu alan eserleriyle tanınır. Kitle kültürünü ve tüketim toplumunu sanatında işler.",
                "movement_desc": "Pop Art, 1950'lerde İngiltere'de başlayan ve 1960'larda Amerika'da gelişen bir sanat akımıdır. Günlük yaşamdan alınan nesneleri ve popüler kültürü sanatın konusu haline getirir."
            },
            
            "Amerikan Gotiği": {
                "title": "Amerikan Gotiği (American Gothic)",
                "artist": "Grant Wood",
                "year": "1930",
                "movement": "Regionalism",
                "style": "Oil on beaverboard",
                "museum": "Art Institute of Chicago",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Grant_Wood_-_American_Gothic_-_Google_Art_Project.jpg/1280px-Grant_Wood_-_American_Gothic_-_Google_Art_Project.jpg",
                "description": "Amerikan kırsal yaşamının ikonu",
                "story": "Bu eser, Iowa'da yaşayan bir çiftçi ve kızını tasvir eder. Gotik tarzda bir evin önünde duran çift, Amerikan kırsal yaşamının ve değerlerinin simgesi haline gelmiştir. Eser, Büyük Buhran döneminde Amerikan kimliğini yansıtır.",
                "artist_bio": "Grant Wood (1891-1942), Amerikalı ressam. Orta Batı Amerika'nın kırsal yaşamını konu alan eserleriyle tanınır. Regionalism akımının öncülerinden biridir.",
                "movement_desc": "Regionalism, 1930'larda Amerika'da gelişen ve yerel kültürleri ve yaşam tarzlarını konu alan bir sanat akımıdır. Wood, bu akımın en önemli temsilcilerinden biridir."
            },
            
            "Davut": {
                "title": "Davut (David)",
                "artist": "Michelangelo",
                "year": "1501-1504",
                "movement": "Yüksek Rönesans",
                "style": "Marble sculpture",
                "museum": "Galleria dell'Accademia, Florence",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Michelangelo%27s_David.jpg/1280px-Michelangelo%27s_David.jpg",
                "description": "Rönesans heykel sanatının başyapıtı",
                "story": "Davut heykeli, İncil'deki Goliath'ı yenmek üzere olan genç Davut'u tasvir eder. Michelangelo, Davut'u savaş öncesi kararlılık anında, sapanını omzuna atarken gösterir. Bu heykel, insan vücudunun mükemmelliğini ve Rönesans'ın ideal güzellik anlayışını yansıtır.",
                "artist_bio": "Michelangelo Buonarroti (1475-1564), İtalyan Rönesans'ının en büyük sanatçılarından biri. Heykel, resim ve mimari alanlarında eserler vermiştir. Davut heykeli onun en ünlü eserlerinden biridir.",
                "movement_desc": "Yüksek Rönesans, 16. yüzyılda İtalya'da gelişen ve sanatın mükemmelliğe ulaştığı dönemdir. Michelangelo, Leonardo da Vinci ve Raphael bu dönemin en önemli temsilcileridir."
            }
        }
    
    def get_manual_artwork(self, art_name: str) -> Optional[Dict]:
        """Get manual artwork with fuzzy matching"""
        # Exact match first
        if art_name in self.manual_artworks:
            return self.manual_artworks[art_name]
        
        # Case-insensitive fuzzy match
        art_name_lower = art_name.lower().strip()
        for name, artwork_data in self.manual_artworks.items():
            if (art_name_lower == name.lower() or 
                art_name_lower in name.lower() or 
                name.lower() in art_name_lower):
                return artwork_data
        
        return None
    
    def add_manual_artwork(self, art_name: str, artwork_data: Dict) -> bool:
        """Add new manual artwork"""
        try:
            self.manual_artworks[art_name] = artwork_data
            return True
        except Exception as e:
            print(f"Manuel eser ekleme hatası: {e}")
            return False
    
    def remove_manual_artwork(self, art_name: str) -> bool:
        """Remove manual artwork"""
        try:
            if art_name in self.manual_artworks:
                del self.manual_artworks[art_name]
                return True
            return False
        except Exception as e:
            print(f"Manuel eser silme hatası: {e}")
            return False
    
    def get_all_manual_artworks(self) -> List[str]:
        """Get list of all manual artwork names"""
        return list(self.manual_artworks.keys())
    
    def search_manual_artworks(self, query: str) -> List[Dict]:
        """Search manual artworks by query"""
        results = []
        query_lower = query.lower()
        
        for name, artwork in self.manual_artworks.items():
            if (query_lower in name.lower() or
                query_lower in artwork["title"].lower() or
                query_lower in artwork["artist"].lower() or
                query_lower in artwork["movement"].lower()):
                results.append(artwork)
        
        return results

# Global instance
manual_artwork_manager = ManualArtworkManager()
