'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FavoriteArtwork {
  id: string;
  art_name: string;
  artist: string;
  year: number;
  image_url: string;
}

interface FavoritesContextType {
  favorites: FavoriteArtwork[];
  addFavorite: (artwork: FavoriteArtwork) => void;
  removeFavorite: (artworkId: string) => void;
  isFavorite: (artworkId: string) => boolean;
  toggleFavorite: (artwork: FavoriteArtwork) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteArtwork[]>([]);

  useEffect(() => {
    // LocalStorage'dan favorileri yükle
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const addFavorite = (artwork: FavoriteArtwork) => {
    setFavorites((prev) => {
      const newFavorites = [...prev, artwork];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const removeFavorite = (artworkId: string) => {
    setFavorites((prev) => {
      const newFavorites = prev.filter((fav) => fav.id !== artworkId);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (artworkId: string) => {
    return favorites.some((fav) => fav.id === artworkId);
  };

  const toggleFavorite = (artwork: FavoriteArtwork) => {
    if (isFavorite(artwork.id)) {
      removeFavorite(artwork.id);
    } else {
      addFavorite(artwork);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
