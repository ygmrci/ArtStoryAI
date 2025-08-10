"""
Agent Registry Module

This module handles agent registration and management operations.
"""

from typing import Dict, List, Optional, Any
from ..base_agent import BaseAgent


class AgentRegistry:
    """
    Registry for managing agent instances.
    
    This class provides:
    - Agent registration and unregistration
    - Agent retrieval by name
    - Agent listing and status reporting
    """
    
    def __init__(self):
        self.agents: Dict[str, BaseAgent] = {}
    
    def register_agent(self, agent: BaseAgent) -> None:
        """
        Register an agent with the registry.
        
        Args:
            agent: Agent instance to register
        """
        self.agents[agent.name] = agent
        print(f"Agent '{agent.name}' registered successfully")
    
    def unregister_agent(self, agent_name: str) -> None:
        """
        Unregister an agent from the registry.
        
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