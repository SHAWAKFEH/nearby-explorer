import { useState, useEffect, useCallback } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import type { Location } from '@/types/poi';

interface GeolocationState {
  location: Location | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    error: null,
    loading: true,
  });

  const getCurrentPosition = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Request permissions first
      const permStatus = await Geolocation.checkPermissions();
      
      if (permStatus.location === 'denied') {
        const requestResult = await Geolocation.requestPermissions();
        if (requestResult.location === 'denied') {
          throw new Error('Location permission denied. Please enable location services.');
        }
      }

      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });

      setState({
        location: {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        },
        error: null,
        loading: false,
      });
    } catch (err) {
      // Fallback to browser geolocation API
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setState({
              location: {
                lat: position.coords.latitude,
                lon: position.coords.longitude,
              },
              error: null,
              loading: false,
            });
          },
          (error) => {
            setState({
              location: null,
              error: error.message || 'Failed to get location',
              loading: false,
            });
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      } else {
        setState({
          location: null,
          error: err instanceof Error ? err.message : 'Failed to get location',
          loading: false,
        });
      }
    }
  }, []);

  useEffect(() => {
    getCurrentPosition();
  }, [getCurrentPosition]);

  return { ...state, refresh: getCurrentPosition };
}
