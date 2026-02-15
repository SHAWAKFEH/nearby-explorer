import { 
  Utensils, 
  Coffee, 
  Wine, 
  ShoppingBag, 
  Hotel, 
  Camera, 
  Building2, 
  Trees, 
  Cross, 
  HeartPulse, 
  Landmark, 
  Fuel, 
  ParkingCircle,
  MapPin
} from 'lucide-react';
import type { POICategory } from '@/types/poi';

const categoryIcons: Record<POICategory, typeof MapPin> = {
  restaurant: Utensils,
  cafe: Coffee,
  bar: Wine,
  shop: ShoppingBag,
  hotel: Hotel,
  attraction: Camera,
  museum: Building2,
  park: Trees,
  pharmacy: Cross,
  hospital: HeartPulse,
  bank: Landmark,
  gas_station: Fuel,
  parking: ParkingCircle,
  other: MapPin,
};

const categoryColors: Record<POICategory, string> = {
  restaurant: 'bg-orange-500',
  cafe: 'bg-amber-600',
  bar: 'bg-purple-500',
  shop: 'bg-pink-500',
  hotel: 'bg-blue-500',
  attraction: 'bg-red-500',
  museum: 'bg-indigo-500',
  park: 'bg-green-500',
  pharmacy: 'bg-emerald-500',
  hospital: 'bg-rose-500',
  bank: 'bg-slate-600',
  gas_station: 'bg-yellow-600',
  parking: 'bg-cyan-600',
  other: 'bg-gray-500',
};

export const categoryLabels: Record<POICategory, string> = {
  restaurant: 'Restaurant',
  cafe: 'Café',
  bar: 'Bar',
  shop: 'Shop',
  hotel: 'Hotel',
  attraction: 'Attraction',
  museum: 'Museum',
  park: 'Park',
  pharmacy: 'Pharmacy',
  hospital: 'Hospital',
  bank: 'Bank',
  gas_station: 'Gas Station',
  parking: 'Parking',
  other: 'Other',
};

interface CategoryIconProps {
  category: POICategory;
  size?: 'sm' | 'md' | 'lg';
}

export function CategoryIcon({ category, size = 'md' }: CategoryIconProps) {
  const Icon = categoryIcons[category];
  const colorClass = categoryColors[category];
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };
  
  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 24,
  };

  return (
    <div className={`${sizeClasses[size]} ${colorClass} rounded-xl flex items-center justify-center flex-shrink-0`}>
      <Icon size={iconSizes[size]} className="text-white" />
    </div>
  );
}
