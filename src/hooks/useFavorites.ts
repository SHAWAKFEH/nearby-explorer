import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'poi_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(new Set(JSON.parse(stored)));
      }
    } catch (err) {
      console.error('Failed to load favorites:', err);
    }
  }, []);

  const toggleFavorite = useCallback((poiId: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(poiId)) {
        next.delete(poiId);
      } else {
        next.add(poiId);
      }
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  const isFavorite = useCallback((poiId: string) => {
    return favorites.has(poiId);
  }, [favorites]);

  return { favorites, toggleFavorite, isFavorite };
}
