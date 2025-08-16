"""
Database models for ArtStoryAI
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    """User model for storing user information"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    favorites = relationship("UserFavorite", back_populates="user")
    search_history = relationship("SearchHistory", back_populates="user")

class Artwork(Base):
    """Artwork model for storing artwork information"""
    __tablename__ = "artworks"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False, index=True)
    artist = Column(String(100), nullable=False, index=True)
    year = Column(Integer)
    movement = Column(String(100), index=True)
    museum = Column(String(200))
    image_url = Column(String(500))
    story = Column(Text)
    artist_bio = Column(Text)
    movement_desc = Column(Text)
    source = Column(String(50), default="ai")  # ai, manual, external
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    favorites = relationship("UserFavorite", back_populates="artwork")
    search_history = relationship("SearchHistory", back_populates="artwork")
    similar_artworks = relationship("SimilarArtwork", back_populates="artwork")

class UserFavorite(Base):
    """User favorites model for storing user-artwork relationships"""
    __tablename__ = "user_favorites"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    artwork_id = Column(Integer, ForeignKey("artworks.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="favorites")
    artwork = relationship("Artwork", back_populates="favorites")

class SearchHistory(Base):
    """Search history model for storing user search queries"""
    __tablename__ = "search_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    artwork_id = Column(Integer, ForeignKey("artworks.id"), nullable=False)
    search_query = Column(String(200), nullable=False)
    search_timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="search_history")
    artwork = relationship("Artwork", back_populates="search_history")

class SimilarArtwork(Base):
    """Similar artworks model for storing artwork relationships"""
    __tablename__ = "similar_artworks"
    
    id = Column(Integer, primary_key=True, index=True)
    artwork_id = Column(Integer, ForeignKey("artworks.id"), nullable=False)
    similar_artwork_id = Column(Integer, ForeignKey("artworks.id"), nullable=False)
    similarity_score = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    artwork = relationship("Artwork", back_populates="similar_artworks")

class CacheEntry(Base):
    """Cache model for storing API responses and AI outputs"""
    __tablename__ = "cache_entries"
    
    id = Column(Integer, primary_key=True, index=True)
    cache_key = Column(String(255), unique=True, index=True, nullable=False)
    cache_value = Column(Text, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def is_expired(self):
        """Check if cache entry is expired"""
        from datetime import datetime
        return datetime.utcnow() > self.expires_at
