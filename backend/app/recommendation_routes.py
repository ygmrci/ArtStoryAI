"""
Recommendation API Routes for ArtStoryAI

This module provides API endpoints for:
- Similar artwork recommendations
- Artist-based recommendations
- Period-based recommendations
- User preference recommendations
"""

from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Optional
import logging
import traceback

from .services.recommendation_service import recommendation_engine
from .artwork_service import artwork_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/recommendations", tags=["recommendations"])


@router.get("/similar/{artwork_name}")
async def get_similar_artworks(
    artwork_name: str,
    limit: int = Query(default=5, ge=1, le=20, description="Number of recommendations")
) -> Dict:
    """
    Get similar artworks based on the specified artwork
    
    Args:
        artwork_name: Name of the artwork to find similarities for
        limit: Maximum number of recommendations (1-20)
    
    Returns:
        Dictionary containing similar artworks with similarity scores
    """
    try:
        logger.info(f"Getting similar artworks for: {artwork_name}")
        
        # Get target artwork info
        target_artwork = artwork_service.get_artwork_info(artwork_name)
        if not target_artwork or 'error' in target_artwork:
            raise HTTPException(
                status_code=404, 
                detail=f"Artwork '{artwork_name}' not found"
            )
        
        logger.info(f"Target artwork found: {target_artwork.get('art_name', 'Unknown')}")
        
        # Get all available artworks for comparison (with timeout protection)
        all_artworks = artwork_service.get_all_artworks()
        if not all_artworks:
            logger.warning("No artworks available for comparison")
            raise HTTPException(
                status_code=500, 
                detail="No artworks available for comparison"
            )
        
        logger.info(f"Found {len(all_artworks)} artworks for comparison")
        
        # Limit comparison set to prevent timeout (max 50 artworks)
        if len(all_artworks) > 50:
            logger.info(f"Limiting comparison set from {len(all_artworks)} to 50 artworks")
            all_artworks = all_artworks[:50]
        
        # Get recommendations with timeout protection
        recommendations = recommendation_engine.get_similar_artworks(
            target_artwork, 
            all_artworks, 
            limit
        )
        
        logger.info(f"Generated {len(recommendations)} similar artwork recommendations")
        
        # Format response
        formatted_recommendations = []
        for rec in recommendations:
            artwork = rec['artwork']
            formatted_recommendations.append({
                'title': artwork.get('art_name', ''),
                'artist': artwork.get('artist', ''),
                'year': artwork.get('year', ''),
                'image_url': artwork.get('image_url', ''),
                'similarity_score': rec['similarity_score'],
                'similarity_reasons': rec['similarity_reasons']
            })
        
        return {
            "success": True,
            "target_artwork": artwork_name,
            "recommendations": formatted_recommendations,
            "total_recommendations": len(formatted_recommendations)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting similar artworks for {artwork_name}: {e}")
        logger.error(f"Error details: {str(e)}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500, 
            detail=f"Internal server error while generating recommendations: {str(e)}"
        )


@router.get("/artist/{artist_name}")
async def get_artist_recommendations(
    artist_name: str,
    limit: int = Query(default=5, ge=1, le=20, description="Number of recommendations")
) -> Dict:
    """
    Get recommendations for other artworks by the same artist
    
    Args:
        artist_name: Name of the artist
        limit: Maximum number of recommendations (1-20)
    
    Returns:
        Dictionary containing artist's other artworks
    """
    try:
        logger.info(f"Getting artist recommendations for: {artist_name}")
        
        # Get all artworks by the artist
        all_artworks = artwork_service.get_all_artworks()
        if not all_artworks:
            logger.warning("No artworks available for recommendations")
            raise HTTPException(
                status_code=500, 
                detail="No artworks available"
            )
        
        logger.info(f"Found {len(all_artworks)} total artworks")
        
        # Get artist recommendations
        recommendations = recommendation_engine.get_artist_recommendations(
            artist_name, 
            all_artworks, 
            limit
        )
        
        logger.info(f"Generated {len(recommendations)} artist recommendations")
        
        # Format response
        formatted_recommendations = []
        for artwork in recommendations:
            formatted_recommendations.append({
                'title': artwork.get('art_name', ''),
                'artist': artwork.get('artist', ''),
                'year': artwork.get('year', ''),
                'image_url': artwork.get('image_url', ''),
                'story': artwork.get('story', ''),
                'movement': artwork.get('movement', '')
            })
        
        return {
            "success": True,
            "artist": artist_name,
            "recommendations": formatted_recommendations,
            "total_recommendations": len(formatted_recommendations)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting artist recommendations for {artist_name}: {e}")
        logger.error(f"Error details: {str(e)}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500, 
            detail=f"Internal server error while generating artist recommendations: {str(e)}"
        )


@router.get("/period/{year}")
async def get_period_recommendations(
    year: int,
    limit: int = Query(default=5, ge=1, le=20, description="Number of recommendations")
) -> Dict:
    """
    Get recommendations for artworks from the same period
    
    Args:
        year: Year to find artworks from
        limit: Maximum number of recommendations (1-20)
    
    Returns:
        Dictionary containing period-based artwork recommendations
    """
    try:
        logger.info(f"Getting period recommendations for year: {year}")
        
        # Get all available artworks
        all_artworks = artwork_service.get_all_artworks()
        if not all_artworks:
            logger.warning("No artworks available for period recommendations")
            raise HTTPException(
                status_code=500, 
                detail="No artworks available"
            )
        
        logger.info(f"Found {len(all_artworks)} total artworks")
        
        # Get period recommendations
        recommendations = recommendation_engine.get_period_recommendations(
            year, 
            all_artworks, 
            limit
        )
        
        logger.info(f"Generated {len(recommendations)} period recommendations")
        
        # Format response
        formatted_recommendations = []
        for artwork in recommendations:
            formatted_recommendations.append({
                'title': artwork.get('art_name', ''),
                'artist': artwork.get('artist', ''),
                'year': artwork.get('year', ''),
                'image_url': artwork.get('image_url', ''),
                'story': artwork.get('story', ''),
                'movement': artwork.get('movement', '')
            })
        
        return {
            "success": True,
            "target_year": year,
            "recommendations": formatted_recommendations,
            "total_recommendations": len(formatted_recommendations)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting period recommendations for year {year}: {e}")
        logger.error(f"Error details: {str(e)}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500, 
            detail=f"Internal server error while generating period recommendations: {str(e)}"
        )


@router.get("/movement/{movement_name}")
async def get_movement_recommendations(
    movement_name: str,
    limit: int = Query(default=5, ge=1, le=20, description="Number of recommendations")
) -> Dict:
    """
    Get recommendations for artworks from the same art movement
    
    Args:
        movement_name: Name of the art movement
        limit: Maximum number of recommendations (1-20)
    
    Returns:
        Dictionary containing movement-based recommendations
    """
    try:
        # Get all artworks
        all_artworks = artwork_service.get_all_artworks()
        if not all_artworks:
            raise HTTPException(
                status_code=500, 
                detail="No artworks available"
            )
        
        # Filter artworks by movement
        movement_artworks = [
            artwork for artwork in all_artworks
            if artwork.get('movement', '').lower() == movement_name.lower()
        ]
        
        if not movement_artworks:
            raise HTTPException(
                status_code=404, 
                detail=f"No artworks found for movement '{movement_name}'"
            )
        
        # Sort by year (most recent first)
        movement_artworks.sort(
            key=lambda x: x.get('year', 0), 
            reverse=True
        )
        
        # Format response
        formatted_recommendations = []
        for artwork in movement_artworks[:limit]:
            formatted_recommendations.append({
                'title': artwork.get('art_name', ''),
                'artist': artwork.get('artist', ''),
                'year': artwork.get('year', ''),
                'image_url': artwork.get('image_url', ''),
                'story': artwork.get('story', ''),
                'museum': artwork.get('museum', '')
            })
        
        return {
            "success": True,
            "movement": movement_name,
            "recommendations": formatted_recommendations,
            "total_recommendations": len(formatted_recommendations)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting movement recommendations: {e}")
        raise HTTPException(
            status_code=500, 
            detail="Internal server error while generating movement recommendations"
        )


@router.get("/debug/artworks")
async def debug_all_artworks() -> Dict:
    """Debug endpoint to see all available artworks"""
    try:
        all_artworks = artwork_service.get_all_artworks()
        return {
            "success": True,
            "total_artworks": len(all_artworks),
            "artworks": all_artworks[:10],  # İlk 10 eser
            "debug_info": {
                "manual_artworks_count": len([a for a in all_artworks if a.get('source') == 'manual']),
                "recommendation_artworks_count": len([a for a in all_artworks if a.get('source') == 'recommendation'])
            }
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "traceback": str(traceback.format_exc())
        }


@router.get("/explore")
async def get_exploration_recommendations(
    limit: int = Query(default=10, ge=1, le=50, description="Number of recommendations")
) -> Dict:
    """
    Get diverse exploration recommendations for discovering new artworks
    
    Args:
        limit: Maximum number of recommendations (1-50)
    
    Returns:
        Dictionary containing diverse artwork recommendations
    """
    try:
        # Get all artworks
        all_artworks = artwork_service.get_all_artworks()
        if not all_artworks:
            raise HTTPException(
                status_code=500, 
                detail="No artworks available"
            )
        
        # Create diverse recommendations
        diverse_recommendations = []
        
        # Different periods
        periods = [1500, 1600, 1700, 1800, 1900, 2000]
        for period in periods:
            period_artworks = []
            for artwork in all_artworks:
                year = artwork.get('year')
                if year:
                    # String'i int'e çevir
                    try:
                        if isinstance(year, str):
                            year_int = int(year)
                        elif isinstance(year, (int, float)):
                            year_int = int(year)
                        else:
                            continue
                        
                        if abs(year_int - period) <= 100:
                            period_artworks.append(artwork)
                    except (ValueError, TypeError):
                        continue
            
            if period_artworks:
                diverse_recommendations.append(period_artworks[0])
        
        # Different movements
        movements = ['renaissance', 'baroque', 'impressionism', 'cubism', 'surrealism']
        for movement in movements:
            movement_artworks = []
            for artwork in all_artworks:
                movement_name = artwork.get('movement')
                if movement_name and isinstance(movement_name, str):
                    try:
                        if movement_name.lower() == movement:
                            movement_artworks.append(artwork)
                    except (AttributeError, TypeError):
                        continue
            
            if movement_artworks:
                diverse_recommendations.append(movement_artworks[0])
        
        # Remove duplicates and limit
        unique_recommendations = []
        seen_titles = set()
        for rec in diverse_recommendations:
            if rec.get('art_name') not in seen_titles:
                unique_recommendations.append(rec)
                seen_titles.add(rec.get('art_name'))
        
        # Format response
        formatted_recommendations = []
        for artwork in unique_recommendations[:limit]:
            formatted_recommendations.append({
                'title': artwork.get('art_name', ''),
                'artist': artwork.get('artist', ''),
                'year': artwork.get('year', ''),
                'image_url': artwork.get('image_url', ''),
                'movement': artwork.get('movement', ''),
                'exploration_reason': _get_exploration_reason(artwork)
            })
        
        return {
            "success": True,
            "recommendations": formatted_recommendations,
            "total_recommendations": len(formatted_recommendations),
            "exploration_type": "diverse_periods_and_movements"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting exploration recommendations: {e}")
        raise HTTPException(
            status_code=500, 
            detail="Internal server error while generating exploration recommendations"
        )


def _get_period_category(year_diff: int) -> str:
    """Get human-readable period category"""
    if year_diff <= 10:
        return "Aynı on yıl"
    elif year_diff <= 50:
        return "Aynı dönem"
    elif year_diff <= 100:
        return "Aynı yüzyıl"
    else:
        return "Farklı dönem"


def _get_exploration_reason(artwork: Dict) -> str:
    """Get reason why this artwork is recommended for exploration"""
    year = artwork.get('year', 0)
    movement = artwork.get('movement', '').lower()
    
    if year >= 1900:
        return "Modern sanat eseri"
    elif year >= 1800:
        return "19. yüzyıl başyapıtı"
    elif year >= 1500:
        return "Rönesans dönemi eseri"
    else:
        return "Klasik sanat eseri"
