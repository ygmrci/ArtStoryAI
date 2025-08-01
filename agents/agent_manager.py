"""
Agent Manager for ArtStoryAI

This module manages multiple agents and provides a unified interface for the application.
"""

import asyncio
from typing import Dict, List, Optional, Any, Type
from base_agent import BaseAgent, AgentResult
from artwork_analyzer_agent import ArtworkAnalyzerAgent
from content_generator_agent import ContentGeneratorAgent


class AgentManager:
    """
    Manager class for coordinating multiple agents.
    
    This class provides:
    - Agent registration and management
    - Workflow orchestration
    - Result aggregation
    - Error handling
    """
    
    def __init__(self):
        self.agents: Dict[str, BaseAgent] = {}
        self.workflows: Dict[str, List[str]] = {}
        self.is_running = False
    
    def register_agent(self, agent: BaseAgent) -> None:
        """
        Register an agent with the manager.
        
        Args:
            agent: Agent instance to register
        """
        self.agents[agent.name] = agent
        print(f"Agent '{agent.name}' registered successfully")
    
    def unregister_agent(self, agent_name: str) -> None:
        """
        Unregister an agent from the manager.
        
        Args:
            agent_name: Name of the agent to unregister
        """
        if agent_name in self.agents:
            del self.agents[agent_name]
            print(f"Agent '{agent_name}' unregistered successfully")
        else:
            print(f"Agent '{agent_name}' not found")
    
    def get_agent(self, agent_name: str) -> Optional[BaseAgent]:
        """
        Get an agent by name.
        
        Args:
            agent_name: Name of the agent
            
        Returns:
            Agent instance or None if not found
        """
        return self.agents.get(agent_name)
    
    def list_agents(self) -> List[str]:
        """
        Get list of registered agent names.
        
        Returns:
            List of agent names
        """
        return list(self.agents.keys())
    
    def get_agent_status(self) -> Dict[str, Dict[str, Any]]:
        """
        Get status of all registered agents.
        
        Returns:
            Dictionary containing status of all agents
        """
        status = {}
        for name, agent in self.agents.items():
            status[name] = agent.get_status()
        return status
    
    async def run_agent(self, agent_name: str, input_data: Any) -> AgentResult:
        """
        Run a specific agent.
        
        Args:
            agent_name: Name of the agent to run
            input_data: Input data for the agent
            
        Returns:
            AgentResult from the agent
        """
        agent = self.get_agent(agent_name)
        if not agent:
            return AgentResult(
                success=False,
                data=None,
                message=f"Agent '{agent_name}' not found",
                timestamp=None
            )
        
        return await agent.run(input_data)
    
    def create_workflow(self, workflow_name: str, agent_sequence: List[str]) -> None:
        """
        Create a workflow with a sequence of agents.
        
        Args:
            workflow_name: Name of the workflow
            agent_sequence: List of agent names in execution order
        """
        # Validate that all agents exist
        missing_agents = [name for name in agent_sequence if name not in self.agents]
        if missing_agents:
            raise ValueError(f"Agents not found: {missing_agents}")
        
        self.workflows[workflow_name] = agent_sequence
        print(f"Workflow '{workflow_name}' created with agents: {agent_sequence}")
    
    async def run_workflow(self, workflow_name: str, initial_input: Any) -> Dict[str, AgentResult]:
        """
        Run a workflow with the given input.
        
        Args:
            workflow_name: Name of the workflow to run
            initial_input: Initial input data
            
        Returns:
            Dictionary containing results from all agents in the workflow
        """
        if workflow_name not in self.workflows:
            return {
                "error": AgentResult(
                    success=False,
                    data=None,
                    message=f"Workflow '{workflow_name}' not found",
                    timestamp=None
                )
            }
        
        workflow = self.workflows[workflow_name]
        results = {}
        current_input = initial_input
        
        for agent_name in workflow:
            print(f"Running agent: {agent_name}")
            result = await self.run_agent(agent_name, current_input)
            results[agent_name] = result
            
            if not result.success:
                print(f"Workflow failed at agent '{agent_name}': {result.message}")
                break
            
            # Transform data for next agent if needed
            if agent_name == "ArtworkAnalyzer" and "ContentGenerator" in workflow:
                # Transform ArtworkAnalyzer output for ContentGenerator
                artwork_data = result.data
                current_input = {
                    "content_type": "title",
                    "artwork_info": {
                        "title": artwork_data.get("artwork_name", ""),
                        "artist": artwork_data.get("artist_name", ""),
                        "year": artwork_data.get("year", ""),
                        "technique": artwork_data.get("technique", ""),
                        "movement": artwork_data.get("metadata", {}).get("movement", ""),
                        "description": artwork_data.get("metadata", {}).get("description", "")
                    },
                    "style": "medium"
                }
            else:
                # Use the result data as input for the next agent
                current_input = result.data
        
        return results
    
    async def run_artwork_analysis_workflow(self, artwork_name: str, artist_name: str = "", style: str = "romantic") -> Dict[str, Any]:
        """
        Run the complete artwork analysis workflow.
        
        Args:
            artwork_name: Name of the artwork to analyze
            artist_name: Name of the artist (optional)
            style: Story style preference
            
        Returns:
            Complete analysis result
        """
        # Create workflow if it doesn't exist
        if "artwork_analysis" not in self.workflows:
            self.create_workflow("artwork_analysis", ["ArtworkAnalyzer", "ContentGenerator"])
        
        # Initial input for the workflow
        initial_input = {
            "artwork_name": artwork_name,
            "artist_name": artist_name,
            "style": style,
            "language": "tr"
        }
        
        # Run the workflow
        workflow_results = await self.run_workflow("artwork_analysis", initial_input)
        
        # Process results
        if "error" in workflow_results:
            return {
                "success": False,
                "error": workflow_results["error"].message
            }
        
        # Extract and format results
        analysis_result = workflow_results.get("ArtworkAnalyzer")
        content_result = workflow_results.get("ContentGenerator")
        
        if not analysis_result or not analysis_result.success:
            return {
                "success": False,
                "error": "Artwork analysis failed"
            }
        
        # Combine results
        final_result = {
            "success": True,
            "artwork_info": analysis_result.data,
            "content": content_result.data if content_result and content_result.success else None,
            "workflow_results": workflow_results
        }
        
        return final_result
    
    def setup_default_agents(self) -> None:
        """
        Set up default agents for ArtStoryAI.
        """
        # Create and register default agents
        artwork_analyzer = ArtworkAnalyzerAgent()
        content_generator = ContentGeneratorAgent()
        
        self.register_agent(artwork_analyzer)
        self.register_agent(content_generator)
        
        # Create default workflows
        self.create_workflow("artwork_analysis", ["ArtworkAnalyzer", "ContentGenerator"])
        self.create_workflow("content_generation", ["ContentGenerator"])
        
        print("Default agents and workflows set up successfully")


# Global agent manager instance
agent_manager = AgentManager()


async def main():
    """
    Example usage of the agent manager.
    """
    # Set up default agents
    agent_manager.setup_default_agents()
    
    # Example: Analyze an artwork
    print("\n=== Artwork Analysis Example ===")
    result = await agent_manager.run_artwork_analysis_workflow(
        artwork_name="Ayçiçekleri",
        artist_name="Vincent van Gogh",
        style="romantic"
    )
    
    if result["success"]:
        print("Analysis completed successfully!")
        print(f"Artwork: {result['artwork_info']['artwork_name']}")
        print(f"Artist: {result['artwork_info']['artist_name']}")
        print(f"Story: {result['artwork_info']['story']}")
        
        if result['content']:
            print(f"Generated Title: {result['content']['content']}")
    else:
        print(f"Analysis failed: {result['error']}")
    
    # Example: Run individual agent
    print("\n=== Individual Agent Example ===")
    content_result = await agent_manager.run_agent("ContentGenerator", {
        "content_type": "social",
        "artwork_info": {
            "title": "Mona Lisa",
            "artist": "Leonardo da Vinci",
            "year": "1503-1519",
            "movement": "Rönesans",
            "technique": "Yağlı boya"
        },
        "style": "medium"
    })
    
    if content_result.success:
        print("Social content generated:")
        print(content_result.data["content"]["full_post"])
    else:
        print(f"Content generation failed: {content_result.message}")


if __name__ == "__main__":
    asyncio.run(main()) 