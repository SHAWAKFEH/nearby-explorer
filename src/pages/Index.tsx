import { useState, useEffect, useMemo } from 'react';
import { RefreshCw, SlidersHorizontal, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useFavorites } from '@/hooks/useFavorites';
import { fetchNearbyPOIs } from '@/services/poiService';
import { BottomNav } from '@/components/BottomNav';
import { POICard } from '@/components/POICard';
import { POIDetail } from '@/components/POIDetail';
import { FilterSheet } from '@/components/FilterSheet';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { EmptyState } from '@/components/EmptyState';
import type { POI, FilterState } from '@/types/poi';
import { Button } from '@/components/ui/button';

type Tab = 'explore' | 'favorites' | 'settings';

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>('explore');
  const [pois, setPois] = useState<POI[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    maxDistance: 2000,
  });

  const { location, error: locationError, loading: locationLoading, refresh: refreshLocation } = useGeolocation();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const loadPOIs = async () => {
    if (!location) return;
    
    setLoading(true);
    setApiError(null);
    
    try {
      const data = await fetchNearbyPOIs(location, filters.maxDistance);
      setPois(data);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Failed to load places');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location) {
      loadPOIs();
    }
  }, [location, filters.maxDistance]);

  const filteredPois = useMemo(() => {
    let result = pois;
    
    // Filter by categories if any selected
    if (filters.categories.length > 0) {
      result = result.filter(poi => filters.categories.includes(poi.category));
    }
    
    // Filter by distance
    result = result.filter(poi => poi.distance <= filters.maxDistance);
    
    return result;
  }, [pois, filters]);

  const favoritePois = useMemo(() => {
    return pois.filter(poi => isFavorite(poi.id));
  }, [pois, favorites]);

  const handleRefresh = () => {
    refreshLocation();
  };

  // Settings tab content
  const renderSettings = () => (
    <div className="px-4 py-6">
      <h2 className="text-xl font-display font-bold text-foreground mb-6">Settings</h2>
      
      <div className="space-y-4">
        <div className="bg-card rounded-xl p-4 shadow-card">
          <h3 className="font-semibold text-card-foreground mb-2">About POI Finder</h3>
          <p className="text-sm text-muted-foreground">
            Discover interesting places around you using GPS location and OpenStreetMap data.
          </p>
        </div>
        
        <div className="bg-card rounded-xl p-4 shadow-card">
          <h3 className="font-semibold text-card-foreground mb-2">Current Location</h3>
          {location ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={16} className="text-primary" />
              <span>{location.lat.toFixed(6)}, {location.lon.toFixed(6)}</span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Location not available</p>
          )}
        </div>

        <div className="bg-card rounded-xl p-4 shadow-card">
          <h3 className="font-semibold text-card-foreground mb-2">Data Source</h3>
          <p className="text-sm text-muted-foreground">
            POI data provided by OpenStreetMap via Overpass API.
          </p>
        </div>

        <div className="bg-card rounded-xl p-4 shadow-card">
          <h3 className="font-semibold text-card-foreground mb-2">Version</h3>
          <p className="text-sm text-muted-foreground">1.0.0</p>
        </div>
      </div>
    </div>
  );

  // Main content based on state
  const renderContent = () => {
    if (activeTab === 'settings') {
      return renderSettings();
    }

    if (locationLoading) {
      return <LoadingState message="Getting your location..." />;
    }

    if (locationError) {
      return <ErrorState type="location" message={locationError} onRetry={refreshLocation} />;
    }

    if (loading) {
      return <LoadingState />;
    }

    if (apiError) {
      return <ErrorState type="api" message={apiError} onRetry={loadPOIs} />;
    }

    if (activeTab === 'favorites') {
      if (favoritePois.length === 0) {
        return <EmptyState type="no-favorites" />;
      }
      return (
        <div className="space-y-3 px-4 py-4">
          {favoritePois.map((poi, index) => (
            <POICard
              key={poi.id}
              poi={poi}
              isFavorite={true}
              onToggleFavorite={() => toggleFavorite(poi.id)}
              onSelect={() => setSelectedPoi(poi)}
              index={index}
            />
          ))}
        </div>
      );
    }

    if (filteredPois.length === 0) {
      return <EmptyState type="no-results" />;
    }

    return (
      <div className="space-y-3 px-4 py-4">
        {filteredPois.map((poi, index) => (
          <POICard
            key={poi.id}
            poi={poi}
            isFavorite={isFavorite(poi.id)}
            onToggleFavorite={() => toggleFavorite(poi.id)}
            onSelect={() => setSelectedPoi(poi)}
            index={index}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-md z-30 safe-area-top">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">
                {activeTab === 'explore' && 'Explore'}
                {activeTab === 'favorites' && 'Favorites'}
                {activeTab === 'settings' && 'Settings'}
              </h1>
              {location && activeTab === 'explore' && (
                <p className="text-sm text-muted-foreground">
                  {filteredPois.length} places nearby
                </p>
              )}
            </div>
            {activeTab === 'explore' && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleRefresh}
                  className="rounded-xl"
                  disabled={loading}
                >
                  <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowFilters(true)}
                  className="rounded-xl relative"
                >
                  <SlidersHorizontal size={18} />
                  {filters.categories.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-xs text-primary-foreground flex items-center justify-center">
                      {filters.categories.length}
                    </span>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main>{renderContent()}</main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* POI Detail Sheet */}
      {selectedPoi && (
        <POIDetail
          poi={selectedPoi}
          isFavorite={isFavorite(selectedPoi.id)}
          onToggleFavorite={() => toggleFavorite(selectedPoi.id)}
          onClose={() => setSelectedPoi(null)}
        />
      )}

      {/* Filter Sheet */}
      <FilterSheet
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFiltersChange={setFilters}
      />
    </div>
  );
};

export default Index;
