"""
Pydantic schemas for ArtStoryAI API
"""

from pydantic import BaseModel
from typing import Optional, List

class StoryAudioRequest(BaseModel):
    """Request model for story audio generation"""
    art_name: str
    story: str
    voice: str = "nova"

class TextAudioRequest(BaseModel):
    """Request model for text audio generation"""
    text: str
    voice: str = "alloy"

class ArtworkInfo(BaseModel):
    """Response model for artwork information"""
    art_name: str
    artist: str
    year: str
    movement: str
    museum: str
    image_url: str
    story: str
    artist_bio: str
    movement_desc: str
    similar_artworks: List[dict]
    source: str = "ai"

class SimilarArtwork(BaseModel):
    """Response model for similar artwork"""
    title: str
    artist: str
    year: str
    image_url: str
    similarity_reason: str

class ErrorResponse(BaseModel):
    """Error response model"""
    error: str
    details: Optional[str] = None

class SuccessResponse(BaseModel):
    """Success response model"""
    message: str
    status: str = "success"
