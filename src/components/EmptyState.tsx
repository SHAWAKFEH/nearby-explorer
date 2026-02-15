import { Search, Heart, MapPin } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-results' | 'no-favorites';
}

const emptyConfig = {
  'no-results': {
    icon: Search,
    title: 'No places found',
    message: 'Try adjusting your filters or increasing the search distance.',
  },
  'no-favorites': {
    icon: Heart,
    title: 'No favorites yet',
    message: 'Start exploring and save places you love!',
  },
};

export function EmptyState({ type }: EmptyStateProps) {
  const config = emptyConfig[type];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] px-6 text-center">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <Icon size={28} className="text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{config.title}</h3>
      <p className="text-muted-foreground text-sm">{config.message}</p>
    </div>
  );
}
