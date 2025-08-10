"""
Content Templates Module

This module contains templates for generating various types of content.
"""

from typing import Dict, List


class ContentTemplates:
    """
    Templates for generating different types of content.
    
    This class provides:
    - Title templates for artworks and artists
    - Description templates of varying lengths
    - Social media content templates
    """
    
    @staticmethod
    def get_title_templates() -> Dict[str, List[str]]:
        """Get title templates for different content types."""
        return {
            "artwork": [
                "{artwork_name} - {artist} Eseri Hakkında Bilmeniz Gerekenler",
                "{artwork_name}: {artist}'ın Başyapıtının Hikayesi",
                "{artwork_name} Tablosunun Ardındaki Gizem",
                "{artist} ve {artwork_name}: Sanat Tarihinin Unutulmaz Anı"
            ],
            "artist": [
                "{artist}: Sanat Tarihinin Büyük Ustası",
                "{artist}'ın Hayatı ve Eserleri",
                "{artist} Kimdir? Sanatçının Hikayesi",
                "{artist}: Bir Dahinin Portresi"
            ]
        }
    
    @staticmethod
    def get_description_templates() -> Dict[str, str]:
        """Get description templates of different lengths."""
        return {
            "short": "{artwork_name} eseri, {artist} tarafından yaratılmış muhteşem bir sanat eseridir.",
            "medium": "{artwork_name}, {artist}'ın {year} yılında yarattığı başyapıtıdır. {movement} akımının en güzel örneklerinden biri olan bu eser, sanat tarihinin önemli yapıtları arasında yer alır.",
            "long": "{artwork_name} eseri, {artist} tarafından {year} yılında yaratılmıştır. {movement} akımının en güzel örneklerinden biri olan bu eser, {technique} tekniğiyle yapılmıştır. Sanatçının {style_description} tarzını yansıtan bu başyapıt, sanat tarihinin en önemli eserleri arasında yer alır."
        }
    
    @staticmethod
    def get_social_templates() -> Dict[str, str]:
        """Get social media content templates."""
        return {
            "instagram": "🎨 {artwork_name} | {artist}\n\n{description}\n\n#sanat #art #{artist_hashtag} #{artwork_hashtag}",
            "twitter": "🎨 {artwork_name} - {artist}'ın başyapıtı\n\n{short_description}\n\n#Sanat #Art",
            "facebook": "Sanat Tarihinin En Büyük Eserlerinden: {artwork_name}\n\n{description}\n\nBu muhteşem eser hakkında ne düşünüyorsunuz?",
            "linkedin": "Profesyonel Sanat Analizi: {artwork_name}\n\n{technical_description}\n\n#SanatTarihi #Kültür #Eğitim"
        } 