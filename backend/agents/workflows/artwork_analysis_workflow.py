"""
Artwork Analysis Workflow Module

This module defines the workflow for analyzing artwork and generating content.
"""

from typing import Dict, Any
from ..base_agent import AgentResult


class ArtworkAnalysisWorkflow:
    """
    Workflow for analyzing artwork and generating comprehensive content.
    
    This workflow:
    1. Analyzes the artwork using ArtworkAnalyzerAgent
    2. Generates content using ContentGeneratorAgent
    3. Returns combined results
    """
    
    @staticmethod
    async def run_artwork_analysis_workflow(
        agent_manager,
        artwork_name: str, 
        artist_name: str = "", 
        style: str = "romantic"
    ) -> Dict[str, Any]:
        """
        Run the complete artwork analysis workflow.
        
        Args:
            agent_manager: Agent manager instance
            artwork_name: Name of the artwork
            artist_name: Name of the artist (optional)
            style: Art style for analysis
            
        Returns:
            Dictionary containing analysis results and generated content
        """
        # Prepare input data
        input_data = {
            "artwork_name": artwork_name,
            "artist_name": artist_name,
            "style": style,
            "analysis_type": "comprehensive"
        }
        
        try:
            # Run the workflow
            workflow_results = await agent_manager.run_workflow(
                "artwork_analysis", 
                input_data
            )
            
            # Extract results
            analysis_result = workflow_results.get("ArtworkAnalyzer")
            content_result = workflow_results.get("ContentGenerator")
            
            # Combine results
            combined_result = {
                "success": True,
                "artwork_name": artwork_name,
                "artist_name": artist_name,
                "style": style,
                "analysis": analysis_result.data if analysis_result and analysis_result.success else None,
                "content": content_result.data if content_result and content_result.success else None,
                "workflow_results": workflow_results
            }
            
            return combined_result
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "artwork_name": artwork_name,
                "artist_name": artist_name,
                "style": style
            } 