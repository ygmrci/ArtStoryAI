"""
Base Agent Class for ArtStoryAI

This module provides a base class for all AI agents in the ArtStoryAI application.
"""

import asyncio
import logging
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
from dataclasses import dataclass
from datetime import datetime


@dataclass
class AgentResult:
    """Result object for agent operations."""
    success: bool
    data: Any
    message: str
    timestamp: datetime
    metadata: Optional[Dict[str, Any]] = None


class BaseAgent(ABC):
    """
    Base class for all AI agents in ArtStoryAI.
    
    This class provides common functionality for:
    - Logging
    - Error handling
    - Result formatting
    - Async operations
    """
    
    def __init__(self, name: str, config: Optional[Dict[str, Any]] = None):
        self.name = name
        self.config = config or {}
        self.logger = logging.getLogger(f"agent.{name}")
        self.is_running = False
        
    @abstractmethod
    async def process(self, input_data: Any) -> AgentResult:
        """
        Main processing method that must be implemented by subclasses.
        
        Args:
            input_data: Input data for the agent to process
            
        Returns:
            AgentResult: Result of the processing operation
        """
        pass
    
    async def run(self, input_data: Any) -> AgentResult:
        """
        Run the agent with proper error handling and logging.
        
        Args:
            input_data: Input data for the agent to process
            
        Returns:
            AgentResult: Result of the processing operation
        """
        self.is_running = True
        start_time = datetime.now()
        
        try:
            self.logger.info(f"Starting {self.name} agent")
            result = await self.process(input_data)
            result.timestamp = datetime.now()
            
            if result.success:
                self.logger.info(f"{self.name} completed successfully")
            else:
                self.logger.warning(f"{self.name} completed with issues: {result.message}")
                
        except Exception as e:
            self.logger.error(f"Error in {self.name}: {str(e)}")
            result = AgentResult(
                success=False,
                data=None,
                message=f"Agent error: {str(e)}",
                timestamp=datetime.now()
            )
        
        finally:
            self.is_running = False
            duration = datetime.now() - start_time
            self.logger.info(f"{self.name} completed in {duration.total_seconds():.2f}s")
        
        return result
    
    def validate_input(self, input_data: Any) -> bool:
        """
        Validate input data before processing.
        
        Args:
            input_data: Input data to validate
            
        Returns:
            bool: True if input is valid, False otherwise
        """
        return input_data is not None
    
    def get_status(self) -> Dict[str, Any]:
        """
        Get current status of the agent.
        
        Returns:
            Dict containing agent status information
        """
        return {
            "name": self.name,
            "is_running": self.is_running,
            "config": self.config
        } 