export interface POI {
  id: string;
  name: string;
  category: POICategory;
  distance: number; // in meters
  lat: number;
  lon: number;
  address?: string;
  phone?: string;
  website?: string;
  openingHours?: string;
  rating?: number;
  isFavorite?: boolean;
}

export type POICategory = 
  | 'restaurant'
  | 'cafe'
  | 'bar'
  | 'shop'
  | 'hotel'
  | 'attraction'
  | 'museum'
  | 'park'
  | 'pharmacy'
  | 'hospital'
  | 'bank'
  | 'gas_station'
  | 'parking'
  | 'other';

export interface Location {
  lat: number;
  lon: number;
}

export interface FilterState {
  categories: POICategory[];
  maxDistance: number; // in meters
}
