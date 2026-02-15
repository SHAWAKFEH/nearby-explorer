import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { POICategory, FilterState } from '@/types/poi';
import { CategoryIcon, categoryLabels } from './CategoryIcon';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const allCategories: POICategory[] = [
  'restaurant', 'cafe', 'bar', 'shop', 'hotel', 'attraction',
  'museum', 'park', 'pharmacy', 'hospital', 'bank', 'gas_station', 'parking'
];

export function FilterSheet({ isOpen, onClose, filters, onFiltersChange }: FilterSheetProps) {
  const toggleCategory = (category: POICategory) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const setMaxDistance = (value: number[]) => {
    onFiltersChange({ ...filters, maxDistance: value[0] });
  };

  const clearFilters = () => {
    onFiltersChange({ categories: [], maxDistance: 5000 });
  };

  if (!isOpen) return null;

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

          {/* Header */}
          <div className="flex items-center justify-between px-6 pb-4">
            <h2 className="text-xl font-display font-bold text-card-foreground">Filters</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <X size={20} className="text-muted-foreground" />
            </button>
          </div>

          <div className="px-6 pb-8">
            {/* Distance slider */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-card-foreground">Maximum Distance</h3>
                <span className="text-primary font-medium">
                  {filters.maxDistance >= 1000 
                    ? `${(filters.maxDistance / 1000).toFixed(1)} km` 
                    : `${filters.maxDistance}m`}
                </span>
              </div>
              <Slider
                value={[filters.maxDistance]}
                onValueChange={setMaxDistance}
                min={200}
                max={5000}
                step={100}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>200m</span>
                <span>5km</span>
              </div>
            </div>

            {/* Categories */}
            <div className="mb-8">
              <h3 className="font-semibold text-card-foreground mb-4">Categories</h3>
              <div className="grid grid-cols-2 gap-2">
                {allCategories.map((category) => {
                  const isSelected = filters.categories.includes(category);
                  return (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={`flex items-center gap-2 p-3 rounded-xl transition-all ${
                        isSelected
                          ? 'bg-primary/10 ring-2 ring-primary'
                          : 'bg-secondary hover:bg-secondary/80'
                      }`}
                    >
                      <CategoryIcon category={category} size="sm" />
                      <span className="text-sm font-medium text-card-foreground flex-1 text-left">
                        {categoryLabels[category]}
                      </span>
                      {isSelected && <Check size={16} className="text-primary" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={clearFilters}
              >
                Clear All
              </Button>
              <Button
                className="flex-1 bg-gradient-hero hover:opacity-90"
                onClick={onClose}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
