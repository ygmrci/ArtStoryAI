"""
Agent Setup Module

This module handles the setup and initialization of default agents.
"""

from typing import Dict, Any
from ..artwork_analyzer_agent import ArtworkAnalyzerAgent
from ..content_generator_agent import ContentGeneratorAgent


class AgentSetup:
    """
    Setup class for initializing default agents and workflows.
    
    This class provides:
    - Default agent creation
    - Default workflow configuration
    - Agent manager initialization
    """
    
    @staticmethod
    def setup_default_agents(agent_manager) -> None:
        """
        Setup default agents for the application.
        
        Args:
            agent_manager: Agent manager instance to configure
        """
        # Create and register ArtworkAnalyzerAgent
        artwork_analyzer = ArtworkAnalyzerAgent()
        agent_manager.register_agent(artwork_analyzer)
        
        # Create and register ContentGeneratorAgent
        content_generator = ContentGeneratorAgent()
        agent_manager.register_agent(content_generator)
        
        # Create default workflow
        agent_manager.create_workflow(
            "artwork_analysis",
            ["ArtworkAnalyzer", "ContentGenerator"]
        )
        
        print("Default agents and workflows setup completed")
    
    @staticmethod
    def create_agent_config() -> Dict[str, Any]:
        """
        Create default configuration for agents.
        
        Returns:
            Dictionary containing default agent configurations
        """
        return {
            "artwork_analyzer": {
                "analysis_depth": "comprehensive",
                "include_technical_details": True,
                "include_historical_context": True,
                "language": "tr"
            },
            "content_generator": {
                "content_style": "engaging",
                "include_seo_optimization": True,
                "target_audience": "general",
                "language": "tr"
            }
        } 