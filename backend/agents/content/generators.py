"""
Content Generators Module

This module contains functions for generating different types of content.
"""

import random
from typing import Dict, Any
from .templates import ContentTemplates


class ContentGenerators:
    """
    Generators for different types of content.
    
    This class provides:
    - Title generation
    - Description generation
    - Social media content generation
    - Metadata generation
    """
    
    @staticmethod
    async def generate_title(artwork_info: Dict[str, Any], style: str) -> str:
        """Generate a title for the artwork."""
        templates = ContentTemplates.get_title_templates()
        
        # Determine template type based on available info
        if "artist" in artwork_info and artwork_info["artist"]:
            template_type = "artist"
        else:
            template_type = "artwork"
        
        template_list = templates.get(template_type, templates["artwork"])
        template = random.choice(template_list)
        
        # Fill template with artwork info
        title = template.format(
            artwork_name=artwork_info.get("title", artwork_info.get("artwork_name", "")),
            artist=artwork_info.get("artist", "")
        )
        
        return title
    
    @staticmethod
    async def generate_description(artwork_info: Dict[str, Any], style: str) -> str:
        """Generate a description for the artwork."""
        templates = ContentTemplates.get_description_templates()
        template = templates.get(style, templates["medium"])
        
        # Fill template with artwork info
        description = template.format(
            artwork_name=artwork_info.get("title", artwork_info.get("artwork_name", "")),
            artist=artwork_info.get("artist", ""),
            year=artwork_info.get("year", ""),
            movement=artwork_info.get("movement", ""),
            technique=artwork_info.get("technique", ""),
            style_description=artwork_info.get("style_description", "")
        )
        
        return description
    
    @staticmethod
    async def generate_social_content(artwork_info: Dict[str, Any], style: str) -> Dict[str, str]:
        """Generate social media content for the artwork."""
        templates = ContentTemplates.get_social_templates()
        social_content = {}
        
        # Generate short description for social media
        short_description = await ContentGenerators.generate_description(artwork_info, "short")
        
        # Create hashtags
        artist_hashtag = artwork_info.get("artist", "").replace(" ", "").lower()
        artwork_hashtag = artwork_info.get("title", "").replace(" ", "").lower()
        
        # Generate content for each platform
        for platform, template in templates.items():
            content = template.format(
                artwork_name=artwork_info.get("title", artwork_info.get("artwork_name", "")),
                artist=artwork_info.get("artist", ""),
                description=short_description,
                short_description=short_description[:100] + "..." if len(short_description) > 100 else short_description,
                technical_description=artwork_info.get("technique", ""),
                artist_hashtag=artist_hashtag,
                artwork_hashtag=artwork_hashtag
            )
            social_content[platform] = content
        
        return social_content
    
    @staticmethod
    async def generate_metadata(artwork_info: Dict[str, Any]) -> Dict[str, Any]:
        """Generate metadata for the artwork."""
        metadata = {
            "title": artwork_info.get("title", artwork_info.get("artwork_name", "")),
            "artist": artwork_info.get("artist", ""),
            "year": artwork_info.get("year", ""),
            "technique": artwork_info.get("technique", ""),
            "movement": artwork_info.get("movement", ""),
            "dimensions": artwork_info.get("dimensions", ""),
            "location": artwork_info.get("location", ""),
            "keywords": [
                artwork_info.get("artist", ""),
                artwork_info.get("movement", ""),
                artwork_info.get("technique", ""),
                "sanat",
                "art",
                "resim",
                "painting"
            ],
            "description": artwork_info.get("description", ""),
            "tags": [
                "sanat",
                "art",
                "resim",
                "painting",
                artwork_info.get("artist", "").lower(),
                artwork_info.get("movement", "").lower()
            ]
        }
        
        # Remove empty values
        metadata = {k: v for k, v in metadata.items() if v}
        
        return metadata 