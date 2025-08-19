"""
Recommendation Service for ArtStoryAI

This service provides intelligent artwork recommendations based on:
- Artist similarity
- Period similarity  
- Movement similarity
- Theme similarity
- User preferences
"""

from typing import List, Dict, Optional, Tuple
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import logging

logger = logging.getLogger(__name__)


class ArtworkSimilarityCalculator:
    """Calculate similarity between artworks based on various factors"""
    
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            max_features=1000,
            stop_words='english',
            ngram_range=(1, 2)
        )
    
    def calculate_text_similarity(self, text1: str, text2: str) -> float:
        """Calculate similarity between two text descriptions"""
        try:
            if not text1 or not text2:
                return 0.0
            
            # Combine texts for vectorization
            texts = [text1, text2]
            vectors = self.vectorizer.fit_transform(texts)
            
            # Calculate cosine similarity
            similarity = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]
            return float(similarity)
            
        except Exception as e:
            logger.error(f"Text similarity calculation error: {e}")
            return 0.0
    
    def calculate_artist_similarity(self, artist1: str, artist2: str) -> float:
        """Calculate similarity based on artist names"""
        if not artist1 or not artist2:
            return 0.0
        
        # Exact match
        if artist1.lower() == artist2.lower():
            return 1.0
        
        # Partial match (same artist, different spelling)
        if self._is_same_artist(artist1, artist2):
            return 0.9
        
        return 0.0
    
    def calculate_period_similarity(self, year1: int, year2: int) -> float:
        """Calculate similarity based on creation years"""
        if not year1 or not year2:
            return 0.0
        
        year_diff = abs(year1 - year2)
        
        # Same decade
        if year_diff <= 10:
            return 0.9
        # Same century
        elif year_diff <= 100:
            return 0.7
        # Same millennium
        elif year_diff <= 1000:
            return 0.3
        else:
            return 0.1
    
    def calculate_movement_similarity(self, movement1: str, movement2: str) -> float:
        """Calculate similarity based on art movements"""
        if not movement1 or not movement2:
            return 0.0
        
        # Exact match
        if movement1.lower() == movement2.lower():
            return 1.0
        
        # Related movements
        related_movements = self._get_related_movements()
        for group in related_movements:
            if movement1.lower() in group and movement2.lower() in group:
                return 0.8
        
        return 0.0
    
    def _is_same_artist(self, artist1: str, artist2: str) -> bool:
        """Check if two artist names refer to the same person"""
        # Common variations
        variations = {
            'leonardo da vinci': ['leonardo', 'da vinci', 'vinci'],
            'vincent van gogh': ['van gogh', 'gogh'],
            'pablo picasso': ['picasso'],
            'claude monet': ['monet'],
            'salvador dali': ['dali'],
        }
        
        for main_name, aliases in variations.items():
            if (artist1.lower() in [main_name] + aliases and 
                artist2.lower() in [main_name] + aliases):
                return True
        
        return False
    
    def _get_related_movements(self) -> List[List[str]]:
        """Get groups of related art movements"""
        return [
            ['impressionism', 'post-impressionism', 'neo-impressionism'],
            ['cubism', 'futurism', 'constructivism'],
            ['surrealism', 'dada', 'expressionism'],
            ['renaissance', 'mannerism', 'baroque'],
            ['modernism', 'contemporary', 'postmodernism']
        ]


class RecommendationEngine:
    """Main recommendation engine for artworks"""
    
    def __init__(self):
        self.similarity_calculator = ArtworkSimilarityCalculator()
        self.weights = {
            'artist': 0.4,      # Artist similarity weight
            'period': 0.2,      # Period similarity weight
            'movement': 0.25,   # Movement similarity weight
            'theme': 0.15       # Theme similarity weight
        }
    
    def get_similar_artworks(
        self, 
        target_artwork: Dict, 
        all_artworks: List[Dict], 
        limit: int = 5
    ) -> List[Dict]:
        """
        Get similar artworks based on target artwork
        
        Args:
            target_artwork: The artwork to find similarities for
            all_artworks: List of all available artworks
            limit: Maximum number of recommendations
            
        Returns:
            List of recommended artworks with similarity scores
        """
        try:
            recommendations = []
            
            for artwork in all_artworks:
                # Skip the target artwork itself
                if artwork.get('art_name') == target_artwork.get('art_name'):
                    continue
                
                # Calculate overall similarity score
                similarity_score = self._calculate_overall_similarity(
                    target_artwork, artwork
                )
                
                if similarity_score > 0.1:  # Minimum similarity threshold
                    recommendations.append({
                        'artwork': artwork,
                        'similarity_score': similarity_score,
                        'similarity_reasons': self._get_similarity_reasons(
                            target_artwork, artwork
                        )
                    })
            
            # Sort by similarity score (highest first)
            recommendations.sort(
                key=lambda x: x['similarity_score'], 
                reverse=True
            )
            
            # Return top recommendations
            return recommendations[:limit]
            
        except Exception as e:
            logger.error(f"Recommendation generation error: {e}")
            return []
    
    def get_artist_recommendations(
        self, 
        artist_name: str, 
        all_artworks: List[Dict], 
        limit: int = 5
    ) -> List[Dict]:
        """Get recommendations for other artworks by the same artist"""
        try:
            artist_artworks = [
                artwork for artwork in all_artworks 
                if artwork.get('artist', '').lower() == artist_name.lower()
            ]
            
            # Sort by year (most recent first)
            artist_artworks.sort(
                key=lambda x: x.get('year', 0), 
                reverse=True
            )
            
            return artist_artworks[:limit]
            
        except Exception as e:
            logger.error(f"Artist recommendation error: {e}")
            return []
    
    def get_period_recommendations(
        self, 
        year: int, 
        all_artworks: List[Dict], 
        limit: int = 5
    ) -> List[Dict]:
        """Get recommendations for artworks from the same period"""
        try:
            period_artworks = []
            
            for artwork in all_artworks:
                artwork_year = artwork.get('year', 0)
                if artwork_year and abs(artwork_year - year) <= 50:  # 50 year window
                    period_artworks.append(artwork)
            
            # Sort by year similarity
            period_artworks.sort(
                key=lambda x: abs(x.get('year', 0) - year)
            )
            
            return period_artworks[:limit]
            
        except Exception as e:
            logger.error(f"Period recommendation error: {e}")
            return []
    
    def _calculate_overall_similarity(
        self, 
        artwork1: Dict, 
        artwork2: Dict
    ) -> float:
        """Calculate overall similarity score between two artworks"""
        try:
            # Artist similarity
            artist_sim = self.similarity_calculator.calculate_artist_similarity(
                artwork1.get('artist', ''),
                artwork2.get('artist', '')
            )
            
            # Period similarity
            period_sim = self.similarity_calculator.calculate_period_similarity(
                artwork1.get('year', 0),
                artwork2.get('year', 0)
            )
            
            # Movement similarity
            movement_sim = self.similarity_calculator.calculate_movement_similarity(
                artwork1.get('movement', ''),
                artwork2.get('movement', '')
            )
            
            # Theme similarity (using story/description)
            theme_sim = self.similarity_calculator.calculate_text_similarity(
                artwork1.get('story', ''),
                artwork2.get('story', '')
            )
            
            # Weighted average
            overall_score = (
                artist_sim * self.weights['artist'] +
                period_sim * self.weights['period'] +
                movement_sim * self.weights['movement'] +
                theme_sim * self.weights['theme']
            )
            
            return round(overall_score, 3)
            
        except Exception as e:
            logger.error(f"Overall similarity calculation error: {e}")
            return 0.0
    
    def _get_similarity_reasons(
        self, 
        artwork1: Dict, 
        artwork2: Dict
    ) -> List[str]:
        """Get reasons why two artworks are similar"""
        reasons = []
        
        # Artist reason
        if (artwork1.get('artist', '').lower() == 
            artwork2.get('artist', '').lower()):
            reasons.append("Aynı sanatçı")
        
        # Period reason
        year1 = artwork1.get('year', 0)
        year2 = artwork2.get('year', 0)
        if year1 and year2 and abs(year1 - year2) <= 50:
            reasons.append("Aynı dönem")
        
        # Movement reason
        if (artwork1.get('movement', '').lower() == 
            artwork2.get('movement', '').lower()):
            reasons.append("Aynı sanat akımı")
        
        # Theme reason (if similarity > 0.3)
        theme_sim = self.similarity_calculator.calculate_text_similarity(
            artwork1.get('story', ''),
            artwork2.get('story', '')
        )
        if theme_sim > 0.3:
            reasons.append("Benzer tema")
        
        return reasons


# Global recommendation engine instance
recommendation_engine = RecommendationEngine()
