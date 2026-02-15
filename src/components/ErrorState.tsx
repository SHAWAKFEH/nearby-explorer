import { AlertTriangle, RefreshCw, MapPinOff, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  type: 'location' | 'network' | 'api' | 'generic';
  message?: string;
  onRetry?: () => void;
}

const errorConfig = {
  location: {
    icon: MapPinOff,
    title: 'Location unavailable',
    defaultMessage: 'Please enable location services to discover nearby places.',
  },
  network: {
    icon: WifiOff,
    title: 'No internet connection',
    defaultMessage: 'Check your connection and try again.',
  },
  api: {
    icon: AlertTriangle,
    title: 'Something went wrong',
    defaultMessage: 'We couldn\'t load the places. Please try again.',
  },
  generic: {
    icon: AlertTriangle,
    title: 'Oops!',
    defaultMessage: 'Something unexpected happened.',
  },
};

export function ErrorState({ type, message, onRetry }: ErrorStateProps) {
  const config = errorConfig[type];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
        <Icon size={36} className="text-destructive" />
      </div>
      <h2 className="text-xl font-display font-bold text-foreground mb-2">{config.title}</h2>
      <p className="text-muted-foreground mb-6">{message || config.defaultMessage}</p>
      {onRetry && (
        <Button onClick={onRetry} className="bg-gradient-hero hover:opacity-90">
          <RefreshCw size={18} className="mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
}
