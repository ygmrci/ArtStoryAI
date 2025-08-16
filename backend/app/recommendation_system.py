"""
Recommendation System for ArtStoryAI
Handles artwork similarity, artist recommendations, and user preference-based suggestions
"""

import numpy as np
from typing import List, Dict, Optional, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json
import os
from pathlib import Path

class ArtworkRecommendationSystem:
    """Advanced artwork recommendation system using embeddings and similarity algorithms"""
    
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            max_features=1000,
            stop_words='english',
            ngram_range=(1, 2)
        )
        self.artwork_embeddings = {}
        self.artwork_features = {}
        self._load_artwork_database()
        self._build_embeddings()
    
    def _load_artwork_database(self):
        """Load comprehensive artwork database with features"""
        self.artwork_features = {
            "Sunflowers": {
                "title": "Sunflowers",
                "artist": "Vincent van Gogh",
                "year": "1888",
                "movement": "Post-impressionism",
                "style": "Oil on canvas",
                "colors": ["yellow", "brown", "green"],
                "subjects": ["flowers", "nature", "still life"],
                "technique": "impasto",
                "mood": "vibrant",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Vincent_Willem_van_Gogh_127.jpg/1280px-Vincent_Willem_van_Gogh_127.jpg",
                "description": "A series of still life paintings of sunflowers in a vase"
            },
            "Kafe Terasta Gece": {
                "title": "Kafe Terasta Gece",
                "artist": "Vincent van Gogh",
                "year": "1888",
                "movement": "Post-impressionism",
                "style": "Oil on canvas",
                "colors": ["blue", "yellow", "orange"],
                "subjects": ["night", "cafe", "urban"],
                "technique": "impasto",
                "mood": "mysterious",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Vincent_van_Gogh_-_Cafe_Terrace_at_Night_%28Yorck%29.jpg/1280px-Vincent_van_Gogh_-_Cafe_Terrace_at_Night_%28Yorck%29.jpg",
                "description": "Night scene of a cafe terrace with warm lighting"
            },
            "Mona Lisa": {
                "title": "Mona Lisa",
                "artist": "Leonardo da Vinci",
                "year": "1503-1519",
                "movement": "Renaissance",
                "style": "Oil on poplar",
                "colors": ["brown", "green", "blue"],
                "subjects": ["portrait", "woman", "landscape"],
                "technique": "sfumato",
                "mood": "enigmatic",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/1280px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
                "description": "Famous portrait of a woman with mysterious smile"
            },
            "Guernica": {
                "title": "Guernica",
                "artist": "Pablo Picasso",
                "year": "1937",
                "movement": "Cubism",
                "style": "Oil on canvas",
                "colors": ["black", "white", "gray"],
                "subjects": ["war", "suffering", "political"],
                "technique": "cubist",
                "mood": "tragic",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/PicassoGuernica.jpg/1280px-PicassoGuernica.jpg",
                "description": "Powerful anti-war painting depicting the horrors of war"
            },
            "The Scream": {
                "title": "The Scream",
                "artist": "Edvard Munch",
                "year": "1893",
                "movement": "Expressionism",
                "style": "Oil, tempera and pastel on cardboard",
                "colors": ["red", "orange", "blue"],
                "subjects": ["anxiety", "emotion", "figure"],
                "technique": "expressionist",
                "mood": "anxious",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg/1280px-Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg",
                "description": "Expressionist painting depicting existential anxiety"
            },
            "The Persistence of Memory": {
                "title": "The Persistence of Memory",
                "artist": "Salvador Dalí",
                "year": "1931",
                "movement": "Surrealism",
                "style": "Oil on canvas",
                "colors": ["brown", "blue", "yellow"],
                "subjects": ["time", "dreams", "surreal"],
                "technique": "surrealist",
                "mood": "dreamlike",
                "image_url": "https://upload.wikimedia.org/wikipedia/en/d/dd/The_Persistence_of_Memory.jpg",
                "description": "Surrealist painting with melting clocks in a dreamlike landscape"
            }
        }
    
    def _build_embeddings(self):
        """Build TF-IDF embeddings for all artworks"""
        # Create feature text for each artwork
        feature_texts = []
        artwork_names = []
        
        for artwork_name, features in self.artwork_features.items():
            # Combine all features into a single text
            feature_text = f"{features['title']} {features['artist']} {features['movement']} {features['style']} {' '.join(features['colors'])} {' '.join(features['subjects'])} {features['technique']} {features['mood']} {features['description']}"
            feature_texts.append(feature_text)
            artwork_names.append(artwork_name)
        
        # Create TF-IDF vectors
        if feature_texts:
            tfidf_matrix = self.vectorizer.fit_transform(feature_texts)
            
            # Store embeddings
            for i, artwork_name in enumerate(artwork_names):
                self.artwork_embeddings[artwork_name] = tfidf_matrix[i].toarray().flatten()
    
    def calculate_similarity(self, artwork1: str, artwork2: str) -> float:
        """Calculate cosine similarity between two artworks"""
        if artwork1 not in self.artwork_embeddings or artwork2 not in self.artwork_embeddings:
            return 0.0
        
        embedding1 = self.artwork_embeddings[artwork1]
        embedding2 = self.artwork_embeddings[artwork2]
        
        similarity = cosine_similarity([embedding1], [embedding2])[0][0]
        return float(similarity)
    
    def get_similar_artworks(self, artwork_name: str, limit: int = 3) -> List[Dict]:
        """Get similar artworks based on embedding similarity"""
        if artwork_name not in self.artwork_features:
            return []
        
        similarities = []
        for other_artwork in self.artwork_features:
            if other_artwork != artwork_name:
                similarity = self.calculate_similarity(artwork_name, other_artwork)
                similarities.append((other_artwork, similarity))
        
        # Sort by similarity (descending)
        similarities.sort(key=lambda x: x[1], reverse=True)
        
        # Return top similar artworks
        similar_artworks = []
        for artwork_name, similarity in similarities[:limit]:
            features = self.artwork_features[artwork_name]
            similar_artworks.append({
                "title": features["title"],
                "artist": features["artist"],
                "year": features["year"],
                "image_url": features["image_url"],
                "similarity_score": round(similarity, 3),
                "similarity_reason": self._get_similarity_reason(features, self.artwork_features[artwork_name])
            })
        
        return similar_artworks
    
    def get_artist_artworks(self, artist_name: str, exclude_title: str = None, limit: int = 5) -> List[Dict]:
        """Get other important artworks by the same artist"""
        artist_artworks = []
        
        for artwork_name, features in self.artwork_features.items():
            if (features["artist"].lower() == artist_name.lower() and 
                artwork_name != exclude_title):
                artist_artworks.append({
                    "title": features["title"],
                    "artist": features["artist"],
                    "year": features["year"],
                    "image_url": features["image_url"],
                    "movement": features["movement"],
                    "style": features["style"],
                    "description": features["description"]
                })
        
        # Sort by year (ascending)
        artist_artworks.sort(key=lambda x: x["year"])
        return artist_artworks[:limit]
    
    def get_movement_artworks(self, movement_name: str, exclude_title: str = None, limit: int = 5) -> List[Dict]:
        """Get artworks from the same art movement"""
        movement_artworks = []
        
        for artwork_name, features in self.artwork_features.items():
            if (features["movement"].lower() == movement_name.lower() and 
                artwork_name != exclude_title):
                movement_artworks.append({
                    "title": features["title"],
                    "artist": features["artist"],
                    "year": features["year"],
                    "image_url": features["image_url"],
                    "movement": features["movement"],
                    "style": features["style"],
                    "description": features["description"]
                })
        
        # Sort by year (ascending)
        movement_artworks.sort(key=lambda x: x["year"])
        return movement_artworks[:limit]
    
    def _get_similarity_reason(self, artwork1_features: Dict, artwork2_features: Dict) -> str:
        """Generate human-readable reason for similarity"""
        reasons = []
        
        if artwork1_features["artist"] == artwork2_features["artist"]:
            reasons.append("Aynı sanatçının eseri")
        
        if artwork1_features["movement"] == artwork2_features["movement"]:
            reasons.append(f"Aynı sanat akımı ({artwork1_features['movement']})")
        
        if artwork1_features["technique"] == artwork2_features["technique"]:
            reasons.append(f"Benzer teknik ({artwork1_features['technique']})")
        
        # Check for color similarity
        common_colors = set(artwork1_features["colors"]) & set(artwork2_features["colors"])
        if len(common_colors) >= 2:
            reasons.append(f"Benzer renk paleti ({', '.join(list(common_colors)[:2])})")
        
        # Check for subject similarity
        common_subjects = set(artwork1_features["subjects"]) & set(artwork2_features["subjects"])
        if common_subjects:
            reasons.append(f"Benzer konular ({', '.join(list(common_subjects))})")
        
        if not reasons:
            reasons.append("Genel sanat eseri önerisi")
        
        return " + ".join(reasons[:2])  # Limit to 2 reasons
    
    def get_user_preference_recommendations(self, user_preferences: Dict, limit: int = 5) -> List[Dict]:
        """Get recommendations based on user preferences (advanced feature)"""
        # This is a placeholder for future user preference system
        # For now, return general recommendations
        return self.get_similar_artworks("Mona Lisa", limit)

# Global instance
recommendation_system = ArtworkRecommendationSystem()
