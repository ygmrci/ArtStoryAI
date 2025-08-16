"""
Recommendation API Routes for ArtStoryAI
Provides endpoints for artwork recommendations and similarity
"""

from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Optional
from pydantic import BaseModel
from .recommendation_system import recommendation_system

router = APIRouter(prefix="/recommendations", tags=["recommendations"])

class SimilarityRequest(BaseModel):
    artwork_name: str
    limit: Optional[int] = 3

class ArtistRequest(BaseModel):
    artist_name: str
    exclude_title: Optional[str] = None
    limit: Optional[int] = 5

class MovementRequest(BaseModel):
    movement_name: str
    exclude_title: Optional[str] = None
    limit: Optional[int] = 5

class UserPreferencesRequest(BaseModel):
    preferred_artists: Optional[List[str]] = []
    preferred_movements: Optional[List[str]] = []
    preferred_subjects: Optional[List[str]] = []
    preferred_colors: Optional[List[str]] = []
    limit: Optional[int] = 5

@router.get("/similar/{artwork_name}")
async def get_similar_artworks(
    artwork_name: str,
    limit: int = Query(3, ge=1, le=10, description="Maximum number of similar artworks to return")
):
    """
    Get similar artworks based on embedding similarity
    """
    try:
        # Decode URL-encoded artwork name
        import urllib.parse
        decoded_name = urllib.parse.unquote(artwork_name)
        
        similar_artworks = recommendation_system.get_similar_artworks(decoded_name, limit)
        
        if not similar_artworks:
            raise HTTPException(
                status_code=404, 
                detail=f"Artwork '{decoded_name}' not found in database or no similar artworks available"
            )
        
        return {
            "artwork_name": decoded_name,
            "similar_artworks": similar_artworks,
            "total_count": len(similar_artworks)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting similar artworks: {str(e)}")

@router.get("/artist/{artist_name}")
async def get_artist_artworks(
    artist_name: str,
    exclude_title: Optional[str] = Query(None, description="Artwork title to exclude from results"),
    limit: int = Query(5, ge=1, le=20, description="Maximum number of artworks to return")
):
    """
    Get other important artworks by the same artist
    """
    try:
        # Decode URL-encoded artist name
        import urllib.parse
        decoded_name = urllib.parse.unquote(artist_name)
        
        artist_artworks = recommendation_system.get_artist_artworks(decoded_name, exclude_title, limit)
        
        if not artist_artworks:
            raise HTTPException(
                status_code=404, 
                detail=f"No artworks found for artist '{decoded_name}'"
            )
        
        return {
            "artist_name": decoded_name,
            "artworks": artist_artworks,
            "total_count": len(artist_artworks)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting artist artworks: {str(e)}")

@router.get("/movement/{movement_name}")
async def get_movement_artworks(
    movement_name: str,
    exclude_title: Optional[str] = Query(None, description="Artwork title to exclude from results"),
    limit: int = Query(5, ge=1, le=20, description="Maximum number of artworks to return")
):
    """
    Get artworks from the same art movement
    """
    try:
        # Decode URL-encoded movement name
        import urllib.parse
        decoded_name = urllib.parse.unquote(movement_name)
        
        movement_artworks = recommendation_system.get_movement_artworks(decoded_name, exclude_title, limit)
        
        if not movement_artworks:
            raise HTTPException(
                status_code=404, 
                detail=f"No artworks found for movement '{decoded_name}'"
            )
        
        return {
            "movement_name": decoded_name,
            "artworks": movement_artworks,
            "total_count": len(movement_artworks)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting movement artworks: {str(e)}")

@router.post("/user-preferences")
async def get_user_preference_recommendations(request: UserPreferencesRequest):
    """
    Get personalized recommendations based on user preferences
    """
    try:
        # For now, this is a basic implementation
        # In the future, this could use more sophisticated algorithms
        recommendations = recommendation_system.get_user_preference_recommendations(
            request.dict(), 
            request.limit
        )
        
        return {
            "user_preferences": request.dict(),
            "recommendations": recommendations,
            "total_count": len(recommendations)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting user recommendations: {str(e)}")

@router.get("/artwork/{artwork_name}/similarity/{other_artwork}")
async def calculate_artwork_similarity(
    artwork_name: str,
    other_artwork: str
):
    """
    Calculate similarity score between two specific artworks
    """
    try:
        # Decode URL-encoded names
        import urllib.parse
        decoded_name1 = urllib.parse.unquote(artwork_name)
        decoded_name2 = urllib.parse.unquote(other_artwork)
        
        similarity_score = recommendation_system.calculate_similarity(decoded_name1, decoded_name2)
        
        return {
            "artwork1": decoded_name1,
            "artwork2": decoded_name2,
            "similarity_score": similarity_score,
            "similarity_percentage": round(similarity_score * 100, 2)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating similarity: {str(e)}")

@router.get("/available-artworks")
async def get_available_artworks():
    """
    Get list of all available artworks in the recommendation system
    """
    try:
        artworks = []
        for title, features in recommendation_system.artwork_features.items():
            artworks.append({
                "title": title,
                "artist": features["artist"],
                "movement": features["movement"],
                "year": features["year"]
            })
        
        return {
            "total_artworks": len(artworks),
            "artworks": artworks
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting available artworks: {str(e)}")
