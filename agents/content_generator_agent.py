"""
Content Generator Agent for ArtStoryAI

This agent generates various types of content including descriptions, titles, and metadata.
"""

import random
from typing import Dict, List, Optional, Any
from base_agent import BaseAgent, AgentResult


class ContentGeneratorAgent(BaseAgent):
    """
    Agent responsible for generating various types of content.
    
    This agent can:
    - Generate engaging titles
    - Create SEO-friendly descriptions
    - Generate social media content
    - Create metadata for artworks
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        super().__init__("ContentGenerator", config)
        self.title_templates = {
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
        
        self.description_templates = {
            "short": "{artwork_name} eseri, {artist} tarafından yaratılmış muhteşem bir sanat eseridir.",
            "medium": "{artwork_name}, {artist}'ın {year} yılında yarattığı başyapıtıdır. {movement} akımının en güzel örneklerinden biri olan bu eser, sanat tarihinin önemli yapıtları arasında yer alır.",
            "long": "{artwork_name} eseri, {artist} tarafından {year} yılında yaratılmıştır. {movement} akımının en güzel örneklerinden biri olan bu eser, {technique} tekniğiyle yapılmıştır. Sanatçının {style_description} tarzını yansıtan bu başyapıt, sanat tarihinin en önemli eserleri arasında yer alır."
        }
    
    async def process(self, input_data: Dict[str, Any]) -> AgentResult:
        """
        Process content generation request.
        
        Args:
            input_data: Dictionary containing content generation parameters
                - content_type: Type of content to generate (title, description, social)
                - artwork_info: Artwork information
                - style: Content style (short, medium, long)
                - language: Output language
        
        Returns:
            AgentResult: Generated content
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
            
            content_type = input_data.get("content_type", "title")
            artwork_info = input_data.get("artwork_info", {})
            style = input_data.get("style", "medium")
            language = input_data.get("language", "tr")
            
            # Generate content based on type
            if content_type == "title":
                content = await self._generate_title(artwork_info, style)
            elif content_type == "description":
                content = await self._generate_description(artwork_info, style)
            elif content_type == "social":
                content = await self._generate_social_content(artwork_info, style)
            elif content_type == "metadata":
                content = await self._generate_metadata(artwork_info)
            else:
                return AgentResult(
                    success=False,
                    data=None,
                    message=f"Unknown content type: {content_type}",
                    timestamp=None
                )
            
            return AgentResult(
                success=True,
                data={
                    "content": content,
                    "content_type": content_type,
                    "style": style,
                    "language": language,
                    "artwork_info": artwork_info
                },
                message=f"{content_type} content generated successfully",
                timestamp=None
            )
            
        except Exception as e:
            self.logger.error(f"Error in content generation: {str(e)}")
            return AgentResult(
                success=False,
                data=None,
                message=f"Content generation failed: {str(e)}",
                timestamp=None
            )
    
    async def _generate_title(self, artwork_info: Dict[str, Any], style: str) -> str:
        """
        Generate an engaging title.
        
        Args:
            artwork_info: Artwork information
            style: Title style
            
        Returns:
            Generated title
        """
        artwork_name = artwork_info.get("title", "Bu Eser")
        artist = artwork_info.get("artist", "Bilinmeyen Sanatçı")
        
        templates = self.title_templates.get("artwork", [])
        if not templates:
            return f"{artwork_name} - {artist}"
        
        template = random.choice(templates)
        return template.format(
            artwork_name=artwork_name,
            artist=artist
        )
    
    async def _generate_description(self, artwork_info: Dict[str, Any], style: str) -> str:
        """
        Generate a description.
        
        Args:
            artwork_info: Artwork information
            style: Description style (short, medium, long)
            
        Returns:
            Generated description
        """
        template = self.description_templates.get(style, self.description_templates["medium"])
        
        return template.format(
            artwork_name=artwork_info.get("title", "Bu Eser"),
            artist=artwork_info.get("artist", "Bilinmeyen Sanatçı"),
            year=artwork_info.get("year", "bilinmeyen tarih"),
            movement=artwork_info.get("movement", "bilinmeyen akım"),
            technique=artwork_info.get("technique", "bilinmeyen teknik"),
            style_description=artwork_info.get("style_description", "kendine özgü")
        )
    
    async def _generate_social_content(self, artwork_info: Dict[str, Any], style: str) -> Dict[str, str]:
        """
        Generate social media content.
        
        Args:
            artwork_info: Artwork information
            style: Content style
            
        Returns:
            Dictionary containing social media content
        """
        title = await self._generate_title(artwork_info, "artwork")
        description = await self._generate_description(artwork_info, "short")
        
        hashtags = [
            "#sanat",
            "#art",
            "#artwork",
            "#painting",
            "#museum",
            "#culture"
        ]
        
        # Add specific hashtags based on artwork info
        if artwork_info.get("artist"):
            hashtags.append(f"#{artwork_info['artist'].replace(' ', '').lower()}")
        
        if artwork_info.get("movement"):
            hashtags.append(f"#{artwork_info['movement'].replace(' ', '').lower()}")
        
        return {
            "title": title,
            "description": description,
            "hashtags": " ".join(hashtags),
            "full_post": f"{title}\n\n{description}\n\n{' '.join(hashtags)}"
        }
    
    async def _generate_metadata(self, artwork_info: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate metadata for SEO and content management.
        
        Args:
            artwork_info: Artwork information
            
        Returns:
            Dictionary containing metadata
        """
        return {
            "title": artwork_info.get("title", "Sanat Eseri"),
            "description": artwork_info.get("description", "Sanat eseri hakkında bilgi"),
            "keywords": [
                "sanat",
                "artwork",
                artwork_info.get("artist", "sanatçı"),
                artwork_info.get("movement", "sanat akımı"),
                artwork_info.get("technique", "teknik")
            ],
            "author": artwork_info.get("artist", "Bilinmeyen Sanatçı"),
            "category": "Art",
            "tags": [
                "art",
                "painting",
                "culture",
                "history"
            ]
        }
    
    def validate_input(self, input_data: Any) -> bool:
        """
        Validate input data for content generation.
        
        Args:
            input_data: Input data to validate
            
        Returns:
            bool: True if input is valid, False otherwise
        """
        if not isinstance(input_data, dict):
            return False
        
        if "content_type" not in input_data:
            return False
        
        if "artwork_info" not in input_data:
            return False
        
        return True 