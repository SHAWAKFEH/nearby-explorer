import { X, Heart, Navigation, Phone, Globe, Clock, MapPin, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { POI } from '@/types/poi';
import { CategoryIcon, categoryLabels } from './CategoryIcon';
import { Button } from '@/components/ui/button';

interface POIDetailProps {
  poi: POI | null;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClose: () => void;
}

function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} meters away`;
  }
  return `${(meters / 1000).toFixed(1)} km away`;
}

export function POIDetail({ poi, isFavorite, onToggleFavorite, onClose }: POIDetailProps) {
  if (!poi) return null;

  const openInMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${poi.lat},${poi.lon}`;
    window.open(url, '_blank');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl shadow-elevated max-h-[85vh] overflow-y-auto safe-area-bottom"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <X size={20} className="text-muted-foreground" />
          </button>

          <div className="px-6 pb-8">
            {/* Header */}
            <div className="flex items-start gap-4 mb-6">
              <CategoryIcon category={poi.category} size="lg" />
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-display font-bold text-card-foreground">{poi.name}</h2>
                <p className="text-muted-foreground">{categoryLabels[poi.category]}</p>
                <div className="flex items-center gap-1 mt-1 text-primary font-medium">
                  <Navigation size={14} />
                  {formatDistance(poi.distance)}
                </div>
              </div>
            </div>

            {/* Map preview */}
            <div className="relative rounded-2xl overflow-hidden mb-6 bg-muted h-40">
              <img
                src={`https://static-maps.yandex.ru/1.x/?lang=en_US&ll=${poi.lon},${poi.lat}&size=600,300&z=15&l=map&pt=${poi.lon},${poi.lat},pm2rdm`}
                alt="Map preview"
                className="w-full h-full object-cover"
              />
              <button
                onClick={openInMaps}
                className="absolute bottom-3 right-3 bg-card/90 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium shadow-card"
              >
                <ExternalLink size={14} />
                Open in Maps
              </button>
            </div>

            {/* Info items */}
            <div className="space-y-4 mb-6">
              {poi.address && (
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span className="text-card-foreground">{poi.address}</span>
                </div>
              )}
              {poi.phone && (
                <a href={`tel:${poi.phone}`} className="flex items-center gap-3 text-primary">
                  <Phone size={20} className="flex-shrink-0" />
                  <span>{poi.phone}</span>
                </a>
              )}
              {poi.website && (
                <a
                  href={poi.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-primary"
                >
                  <Globe size={20} className="flex-shrink-0" />
                  <span className="truncate">{poi.website}</span>
                </a>
              )}
              {poi.openingHours && (
                <div className="flex items-start gap-3">
                  <Clock size={20} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span className="text-card-foreground">{poi.openingHours}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={onToggleFavorite}
              >
                <Heart
                  size={18}
                  className={`mr-2 ${isFavorite ? 'fill-primary text-primary' : ''}`}
                />
                {isFavorite ? 'Saved' : 'Save'}
              </Button>
              <Button
                className="flex-1 bg-gradient-hero hover:opacity-90"
                onClick={openInMaps}
              >
                <Navigation size={18} className="mr-2" />
                Directions
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
