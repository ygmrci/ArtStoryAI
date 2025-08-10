"""
Artwork Analyzer Agent for ArtStoryAI

This agent analyzes artwork and generates engaging stories and explanations.
"""

import json
import re
from typing import Dict, List, Optional, Any
from base_agent import BaseAgent, AgentResult


class ArtworkAnalyzerAgent(BaseAgent):
    """
    Agent responsible for analyzing artwork and generating stories.
    
    This agent can:
    - Extract artwork information from various sources
    - Generate engaging stories about artworks
    - Provide artist biographies
    - Analyze art movements and styles
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        super().__init__("ArtworkAnalyzer", config)
        self.artwork_cache = {}
        self.story_templates = {
            "romantic": "Bu muhteşem eser, {artist} tarafından {year} yılında yaratılmış. {description}",
            "educational": "{title} eseri, {artist} tarafından {year} yılında {technique} tekniğiyle yapılmıştır. {description}",
            "storytelling": "Bir zamanlar {artist} adında bir sanatçı vardı... {description}"
        }
    
    async def process(self, input_data: Dict[str, Any]) -> AgentResult:
        """
        Process artwork analysis request.
        
        Args:
            input_data: Dictionary containing artwork information
                - artwork_name: Name of the artwork
                - artist_name: Name of the artist (optional)
                - style: Preferred story style (optional)
                - language: Output language (optional)
        
        Returns:
            AgentResult: Analysis result with story and metadata
        """
        try:
            # Validate input
            if not self.validate_input(input_data):
                return AgentResult(
                    success=False,
                    data=None,
                    message="Invalid input data",
                    timestamp=None
                )
            
            artwork_name = input_data.get("artwork_name", "")
            artist_name = input_data.get("artist_name", "")
            style = input_data.get("style", "romantic")
            language = input_data.get("language", "tr")
            
            # Check cache first
            cache_key = f"{artwork_name}_{artist_name}_{style}_{language}"
            if cache_key in self.artwork_cache:
                self.logger.info(f"Returning cached result for {artwork_name}")
                return self.artwork_cache[cache_key]
            
            # Generate artwork information
            artwork_info = await self._generate_artwork_info(artwork_name, artist_name)
            
            # Generate story
            story = await self._generate_story(artwork_info, style, language)
            
            # Create result
            result = AgentResult(
                success=True,
                data={
                    "artwork_name": artwork_name,
                    "artist_name": artwork_info.get("artist", artist_name),
                    "year": artwork_info.get("year", "Bilinmiyor"),
                    "technique": artwork_info.get("technique", "Bilinmiyor"),
                    "story": story,
                    "style": style,
                    "language": language,
                    "metadata": artwork_info
                },
                message="Artwork analysis completed successfully",
                timestamp=None
            )
            
            # Cache the result
            self.artwork_cache[cache_key] = result
            
            return result
            
        except Exception as e:
            self.logger.error(f"Error in artwork analysis: {str(e)}")
            return AgentResult(
                success=False,
                data=None,
                message=f"Analysis failed: {str(e)}",
                timestamp=None
            )
    
    async def _generate_artwork_info(self, artwork_name: str, artist_name: str = "") -> Dict[str, Any]:
        """
        Generate basic artwork information.
        
        Args:
            artwork_name: Name of the artwork
            artist_name: Name of the artist (optional)
            
        Returns:
            Dict containing artwork information
        """
        # This is a simplified version - in real implementation, this would call external APIs
        # For now, we'll use mock data based on common patterns
        
        info = {
            "title": artwork_name,
            "artist": artist_name or "Bilinmeyen Sanatçı",
            "year": "19. yüzyıl",
            "technique": "Yağlı boya",
            "movement": "Empresyonizm",
            "description": f"{artwork_name} eseri, sanat tarihinin en önemli eserlerinden biridir."
        }
        
        # Add some specific information based on common artwork names
        if "güneş" in artwork_name.lower() or "sunflower" in artwork_name.lower():
            info.update({
                "artist": "Vincent van Gogh",
                "year": "1888",
                "technique": "Yağlı boya",
                "movement": "Post-empresyonizm",
                "description": "Van Gogh'un ünlü ayçiçekleri serisinden bir eser. Sanatçının sarı tonlara olan tutkusunu ve doğaya olan sevgisini yansıtır."
            })
        elif "mona lisa" in artwork_name.lower():
            info.update({
                "artist": "Leonardo da Vinci",
                "year": "1503-1519",
                "technique": "Yağlı boya",
                "movement": "Rönesans",
                "description": "Dünyanın en ünlü tablosu. Gizemli gülümsemesi ve mükemmel tekniği ile sanat tarihinin başyapıtlarından biri."
            })
        
        return info
    
    async def _generate_story(self, artwork_info: Dict[str, Any], style: str, language: str) -> str:
        """
        Generate a story based on artwork information and style.
        
        Args:
            artwork_info: Artwork information dictionary
            style: Story style (romantic, educational, storytelling)
            language: Output language
            
        Returns:
            Generated story string
        """
        template = self.story_templates.get(style, self.story_templates["romantic"])
        
        # Fill template with artwork information
        story = template.format(
            artist=artwork_info.get("artist", "Bilinmeyen Sanatçı"),
            year=artwork_info.get("year", "bilinmeyen tarih"),
            title=artwork_info.get("title", "Bu eser"),
            technique=artwork_info.get("technique", "bilinmeyen teknik"),
            description=artwork_info.get("description", "Bu eser sanat tarihinin önemli yapıtlarından biridir.")
        )
        
        return story
    
    def validate_input(self, input_data: Any) -> bool:
        """
        Validate input data for artwork analysis.
        
        Args:
            input_data: Input data to validate
            
        Returns:
            bool: True if input is valid, False otherwise
        """
        if not isinstance(input_data, dict):
            return False
        
        if "artwork_name" not in input_data:
            return False
        
        if not input_data["artwork_name"] or not input_data["artwork_name"].strip():
            return False
        
        return True
    
    def clear_cache(self) -> None:
        """Clear the artwork cache."""
        self.artwork_cache.clear()
        self.logger.info("Artwork cache cleared")
    
    def get_cache_stats(self) -> Dict[str, Any]:
        """
        Get cache statistics.
        
        Returns:
            Dict containing cache statistics
        """
        return {
            "cache_size": len(self.artwork_cache),
            "cached_items": list(self.artwork_cache.keys())
        } 