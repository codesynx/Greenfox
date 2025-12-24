import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { favoriteService } from '../services/favoriteService';

interface FavoritesContextType {
  favorites: Set<string>;
  isFavorite: (resortId: string) => boolean;
  toggleFavorite: (resortId: string) => Promise<void>;
  refreshFavorites: () => Promise<void>;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites on mount
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      const response = await favoriteService.getFavorites(0, 100);
      const favoriteIds = new Set(response.content.map(fav => fav.resort.id));
      setFavorites(favoriteIds);
    } catch (err: any) {
      console.error('Error loading favorites:', err);
      // If unauthorized or error, just set empty favorites
      if (err.response?.status === 401) {
        setFavorites(new Set());
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isFavorite = useCallback((resortId: string) => {
    return favorites.has(resortId);
  }, [favorites]);

  const toggleFavorite = useCallback(async (resortId: string) => {
    const wasFavorite = favorites.has(resortId);

    // Optimistic update - update UI immediately
    const newFavorites = new Set(favorites);
    if (wasFavorite) {
      newFavorites.delete(resortId);
    } else {
      newFavorites.add(resortId);
    }
    setFavorites(newFavorites);

    // Make API call in background
    try {
      if (wasFavorite) {
        await favoriteService.removeFavorite(resortId);
      } else {
        await favoriteService.addFavorite(resortId);
      }
    } catch (err: any) {
      console.error('Error toggling favorite:', err);

      // If it's a 400 error saying already favorited, sync with backend
      if (err.response?.status === 400) {
        // Refresh favorites to sync with backend state
        await loadFavorites();
      } else {
        // Rollback optimistic update on other errors
        setFavorites(favorites);
      }
    }
  }, [favorites]);

  const refreshFavorites = useCallback(async () => {
    await loadFavorites();
  }, []);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
        refreshFavorites,
        isLoading
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
