"""
Workflow Manager Module

This module handles workflow creation and execution.
"""

import asyncio
from typing import Dict, List, Any
from ..base_agent import AgentResult


class WorkflowManager:
    """
    Manager for workflow operations.
    
    This class provides:
    - Workflow creation and definition
    - Workflow execution with agent sequences
    - Result aggregation from multiple agents
    """
    
    def __init__(self):
        self.workflows: Dict[str, List[str]] = {}
    
    def create_workflow(self, workflow_name: str, agent_sequence: List[str]) -> None:
        """
        Create a new workflow with a sequence of agents.
        
        Args:
            workflow_name: Name of the workflow
            agent_sequence: List of agent names in execution order
        """
        self.workflows[workflow_name] = agent_sequence
        print(f"Workflow '{workflow_name}' created with {len(agent_sequence)} agents")
    
    async def run_workflow(
        self, 
        workflow_name: str, 
        initial_input: Any,
        agent_registry
    ) -> Dict[str, AgentResult]:
        """
        Execute a workflow with the given input.
        
        Args:
            workflow_name: Name of the workflow to execute
            initial_input: Initial input data for the workflow
            agent_registry: Agent registry instance
            
        Returns:
            Dictionary mapping agent names to their results
        """
        if workflow_name not in self.workflows:
            raise ValueError(f"Workflow '{workflow_name}' not found")
        
        workflow = self.workflows[workflow_name]
        results = {}
        current_input = initial_input
        
        for agent_name in workflow:
            agent = agent_registry.get_agent(agent_name)
            if not agent:
                results[agent_name] = AgentResult(
                    success=False,
                    data=None,
                    message=f"Agent '{agent_name}' not found",
                    timestamp=None
                )
                continue
            
            try:
                result = await agent.process(current_input)
                results[agent_name] = result
                
                # Use the result as input for the next agent if successful
                if result.success and result.data:
                    current_input = result.data
                else:
                    # Stop workflow if an agent fails
                    break
                    
            except Exception as e:
                results[agent_name] = AgentResult(
                    success=False,
                    data=None,
                    message=f"Error in agent '{agent_name}': {str(e)}",
                    timestamp=None
                )
                break
        
        return results 