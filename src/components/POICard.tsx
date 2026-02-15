import { Heart, ChevronRight, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import type { POI } from '@/types/poi';
import { CategoryIcon, categoryLabels } from './CategoryIcon';

interface POICardProps {
  poi: POI;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onSelect: () => void;
  index: number;
}

function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

export function POICard({ poi, isFavorite, onToggleFavorite, onSelect, index }: POICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="bg-card rounded-xl shadow-card p-4 active:scale-[0.98] transition-transform"
      onClick={onSelect}
    >
      <div className="flex items-center gap-3">
        <CategoryIcon category={poi.category} />
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-card-foreground truncate">{poi.name}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-sm text-muted-foreground">{categoryLabels[poi.category]}</span>
            <span className="text-muted-foreground">•</span>
            <div className="flex items-center gap-1 text-sm text-primary font-medium">
              <Navigation size={12} />
              {formatDistance(poi.distance)}
            </div>
          </div>
          {poi.address && (
            <p className="text-xs text-muted-foreground mt-1 truncate">{poi.address}</p>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="p-2 rounded-full hover:bg-secondary transition-colors"
        >
          <Heart
            size={20}
            className={isFavorite ? 'fill-primary text-primary' : 'text-muted-foreground'}
          />
        </button>
        
        <ChevronRight size={20} className="text-muted-foreground" />
      </div>
    </motion.div>
  );
}
