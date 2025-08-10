"""
Agent Manager for ArtStoryAI

This module manages multiple agents and provides a unified interface for the application.
"""

import asyncio
from typing import Dict, List, Optional, Any
from .base_agent import BaseAgent, AgentResult
from .core.agent_registry import AgentRegistry
from .core.workflow_manager import WorkflowManager
from .workflows.artwork_analysis_workflow import ArtworkAnalysisWorkflow
from .setup.agent_setup import AgentSetup


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
        self.registry = AgentRegistry()
        self.workflow_manager = WorkflowManager()
        self.is_running = False
    
    def register_agent(self, agent: BaseAgent) -> None:
        """Register an agent with the manager."""
        self.registry.register_agent(agent)
    
    def unregister_agent(self, agent_name: str) -> None:
        """Unregister an agent from the manager."""
        self.registry.unregister_agent(agent_name)
    
    def get_agent(self, agent_name: str) -> Optional[BaseAgent]:
        """Get an agent by name."""
        return self.registry.get_agent(agent_name)
    
    def list_agents(self) -> List[str]:
        """Get list of registered agent names."""
        return self.registry.list_agents()
    
    def get_agent_status(self) -> Dict[str, Dict[str, Any]]:
        """Get status of all registered agents."""
        return self.registry.get_agent_status()
    
    async def run_agent(self, agent_name: str, input_data: Any) -> AgentResult:
        """Run a specific agent."""
        agent = self.get_agent(agent_name)
        if not agent:
            return AgentResult(
                success=False,
                data=None,
                message=f"Agent '{agent_name}' not found",
                timestamp=None
            )
        
        try:
            return await agent.process(input_data)
        except Exception as e:
            return AgentResult(
                success=False,
                data=None,
                message=f"Error running agent '{agent_name}': {str(e)}",
                timestamp=None
            )
    
    def create_workflow(self, workflow_name: str, agent_sequence: List[str]) -> None:
        """Create a new workflow."""
        self.workflow_manager.create_workflow(workflow_name, agent_sequence)
    
    async def run_workflow(self, workflow_name: str, initial_input: Any) -> Dict[str, AgentResult]:
        """Execute a workflow."""
        return await self.workflow_manager.run_workflow(
            workflow_name, 
            initial_input, 
            self.registry
        )
    
    async def run_artwork_analysis_workflow(
        self, 
        artwork_name: str, 
        artist_name: str = "", 
        style: str = "romantic"
    ) -> Dict[str, Any]:
        """Run the artwork analysis workflow."""
        return await ArtworkAnalysisWorkflow.run_artwork_analysis_workflow(
            self, 
            artwork_name, 
            artist_name, 
            style
        )
    
    def setup_default_agents(self) -> None:
        """Setup default agents and workflows."""
        AgentSetup.setup_default_agents(self)


async def main():
    """Main function for testing the agent manager."""
    manager = AgentManager()
    manager.setup_default_agents()
    
    # Test artwork analysis
    result = await manager.run_artwork_analysis_workflow(
        "The Starry Night",
        "Vincent van Gogh",
        "post-impressionist"
    )
    
    print("Workflow result:", result)


if __name__ == "__main__":
    asyncio.run(main()) 