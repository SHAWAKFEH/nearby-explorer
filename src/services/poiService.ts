import type { POI, POICategory, Location } from '@/types/poi';

// Multiple Overpass API endpoints for fallback
const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
];

const OSM_CATEGORY_MAP: Record<string, POICategory> = {
  'restaurant': 'restaurant',
  'fast_food': 'restaurant',
  'cafe': 'cafe',
  'bar': 'bar',
  'pub': 'bar',
  'supermarket': 'shop',
  'convenience': 'shop',
  'clothes': 'shop',
  'hotel': 'hotel',
  'hostel': 'hotel',
  'motel': 'hotel',
  'museum': 'museum',
  'gallery': 'museum',
  'attraction': 'attraction',
  'viewpoint': 'attraction',
  'park': 'park',
  'garden': 'park',
  'pharmacy': 'pharmacy',
  'hospital': 'hospital',
  'clinic': 'hospital',
  'bank': 'bank',
  'atm': 'bank',
  'fuel': 'gas_station',
  'parking': 'parking',
};

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}

function mapCategory(tags: Record<string, string>): POICategory {
  const amenity = tags.amenity;
  const tourism = tags.tourism;
  const shop = tags.shop;
  const leisure = tags.leisure;

  if (amenity && OSM_CATEGORY_MAP[amenity]) return OSM_CATEGORY_MAP[amenity];
  if (tourism && OSM_CATEGORY_MAP[tourism]) return OSM_CATEGORY_MAP[tourism];
  if (shop) return 'shop';
  if (leisure === 'park' || leisure === 'garden') return 'park';
  
  return 'other';
}

async function fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function tryFetchFromEndpoint(endpoint: string, query: string): Promise<any> {
  const response = await fetchWithTimeout(
    endpoint,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(query)}`,
    },
    15000 // 15 second timeout per endpoint
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const text = await response.text();
  
  // Check if response is HTML (error page) instead of JSON
  if (text.includes('<!DOCTYPE') || text.includes('<html')) {
    throw new Error('Server returned error page');
  }

  return JSON.parse(text);
}

export async function fetchNearbyPOIs(
  location: Location,
  radius: number = 1000
): Promise<POI[]> {
  // Simplified query with smaller radius for faster response
  const effectiveRadius = Math.min(radius, 1500);
  
  const query = `
    [out:json][timeout:15];
    (
      node["amenity"~"restaurant|fast_food|cafe|bar|pub|pharmacy|bank|fuel"](around:${effectiveRadius},${location.lat},${location.lon});
      node["tourism"~"hotel|museum|attraction"](around:${effectiveRadius},${location.lat},${location.lon});
      node["shop"~"supermarket|convenience"](around:${effectiveRadius},${location.lat},${location.lon});
    );
    out body 50;
  `;

  let lastError: Error | null = null;

  // Try each endpoint until one works
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      console.log(`Trying endpoint: ${endpoint}`);
      const data = await tryFetchFromEndpoint(endpoint, query);
      
      const pois: POI[] = data.elements
        .filter((el: any) => el.tags?.name)
        .map((el: any) => ({
          id: String(el.id),
          name: el.tags.name,
          category: mapCategory(el.tags),
          distance: calculateDistance(location.lat, location.lon, el.lat, el.lon),
          lat: el.lat,
          lon: el.lon,
          address: el.tags['addr:street'] 
            ? `${el.tags['addr:street']} ${el.tags['addr:housenumber'] || ''}`.trim()
            : undefined,
          phone: el.tags.phone || el.tags['contact:phone'],
          website: el.tags.website || el.tags['contact:website'],
          openingHours: el.tags.opening_hours,
        }))
        .sort((a: POI, b: POI) => a.distance - b.distance);

      console.log(`Found ${pois.length} POIs`);
      return pois;
    } catch (err) {
      console.warn(`Endpoint ${endpoint} failed:`, err);
      lastError = err instanceof Error ? err : new Error('Unknown error');
      // Continue to next endpoint
    }
  }

  throw new Error(lastError?.message || 'All API endpoints failed. Please try again later.');
}
