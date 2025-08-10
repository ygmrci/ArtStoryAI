"""
Content Generator Agent for ArtStoryAI

This agent generates various types of content including descriptions, titles, and metadata.
"""

from typing import Dict, List, Optional, Any
from .base_agent import BaseAgent, AgentResult
from .content.generators import ContentGenerators


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
                content = await ContentGenerators.generate_title(artwork_info, style)
            elif content_type == "description":
                content = await ContentGenerators.generate_description(artwork_info, style)
            elif content_type == "social":
                content = await ContentGenerators.generate_social_content(artwork_info, style)
            elif content_type == "metadata":
                content = await ContentGenerators.generate_metadata(artwork_info)
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
                message="Content generated successfully",
                timestamp=None
            )
            
        except Exception as e:
            return AgentResult(
                success=False,
                data=None,
                message=f"Error generating content: {str(e)}",
                timestamp=None
            )
    
    def validate_input(self, input_data: Any) -> bool:
        """
        Validate input data for content generation.
        
        Args:
            input_data: Input data to validate
            
        Returns:
            True if valid, False otherwise
        """
        if not isinstance(input_data, dict):
            return False
        
        required_fields = ["artwork_info"]
        for field in required_fields:
            if field not in input_data:
                return False
        
        artwork_info = input_data.get("artwork_info", {})
        if not isinstance(artwork_info, dict):
            return False
        
        # Check if at least one artwork identifier is present
        artwork_identifiers = ["title", "artwork_name", "artist"]
        if not any(identifier in artwork_info for identifier in artwork_identifiers):
            return False
        
        return True 