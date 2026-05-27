// Map our app categories to OSM tags
const categoryToOSMTags = {
  hospital: ['nwr["amenity"="hospital"]', 'nwr["amenity"="clinic"]', 'nwr["amenity"="doctors"]'],
  repair: ['nwr["shop"="car_repair"]', 'nwr["shop"="motorcycle_repair"]', 'nwr["shop"="bicycle"]', 'nwr["shop"="tyres"]', 'nwr["shop"="car_parts"]', 'nwr["shop"="mobile_phone"]', 'nwr["shop"="hardware"]', 'nwr["craft"="mechanic"]'],
  food: ['nwr["amenity"="restaurant"]', 'nwr["amenity"="fast_food"]', 'nwr["amenity"="cafe"]'],
  pharmacy: ['nwr["amenity"="pharmacy"]'],
  police: ['nwr["amenity"="police"]'],
  fuel: ['nwr["amenity"="fuel"]'],
  clothes: ['nwr["shop"="clothes"]', 'nwr["shop"="fashion"]', 'nwr["shop"="boutique"]', 'nwr["shop"="mall"]', 'nwr["shop"="department_store"]'],
  public: ['nwr["amenity"="police"]', 'nwr["amenity"="post_office"]', 'nwr["amenity"="fire_station"]', 'nwr["amenity"="library"]', 'nwr["amenity"="townhall"]', 'nwr["railway"="station"]', 'nwr["public_transport"="station"]'],
  train: ['nwr["railway"="station"]', 'nwr["public_transport"="station"]'],
  post: ['nwr["amenity"="post_office"]'],
  fire: ['nwr["amenity"="fire_station"]'],
  library: ['nwr["amenity"="library"]'],
  atm: ['nwr["amenity"="atm"]'],
  bank: ['nwr["amenity"="bank"]'],
  park: ['nwr["leisure"="park"]', 'nwr["leisure"="playground"]'],
  school: ['nwr["amenity"="school"]', 'nwr["amenity"="college"]', 'nwr["amenity"="university"]', 'nwr["amenity"="kindergarten"]'],
  hotel: ['nwr["tourism"="hotel"]', 'nwr["tourism"="guest_house"]'],
  grocery: ['nwr["shop"="supermarket"]', 'nwr["shop"="convenience"]', 'nwr["shop"="grocery"]'],
  coffee: ['nwr["amenity"="cafe"]'],
  gym: ['nwr["leisure"="fitness_centre"]'],
  movie: ['nwr["amenity"="cinema"]'],
};

export const fetchNearbyPlaces = async (lat, lng, category, radius = 5000) => {
  // 5000 meters = 5km default radius
  
  const tags = categoryToOSMTags[category];
  if (!tags) return [];

  // Build Overpass query
  // We search around the lat,lng point. Overpass expects (around:radius,lat,lng)
  const aroundStr = `(around:${radius},${lat},${lng})`;
  
  // Combine all specific tags for the category
  const queries = tags.map(tag => `${tag}${aroundStr};`).join('\n  ');

  const query = `
    [out:json][timeout:15];
    (
      ${queries}
    );
    out center 60;
  `;

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query
    });

    if (!response.ok) throw new Error('Overpass API error');
    
    const data = await response.json();
    return formatOverpassResults(data.elements, lat, lng, category);
  } catch (error) {
    console.error("Failed fetching from Overpass:", error);
    return []; // fallback gracefully
  }
};

// Calculate distance between two coordinates in km using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return (R * c).toFixed(1);
};

// Transform OSM raw data into a friendly format for our UI
const formatOverpassResults = (elements, userLat, userLng, category) => {
  const results = [];
  
  for (const el of elements) {
    if (!el.tags) continue; // Skip elements without tags
    
    // Support nodes, ways, and relations by checking bounds/center
    const lat = el.lat || (el.center && el.center.lat);
    const lon = el.lon || (el.center && el.center.lon);
    if (!lat || !lon) continue;
    
    // Attempt to extract the most useful name
    const name = el.tags.name || el.tags.brand || el.tags.operator || `Unnamed ${category}`;
    
    // We only want named entities for a premium feel, unless it's critical like police
    if (name.startsWith('Unnamed') && category !== 'police') continue;

    // Build a fake rating for realism since OSM doesn't have reliable ratings natively
    // In a production app, we would cross-reference with Google Places or Yelp
    const ratingSeed = name.length + el.id;
    const rating = ((ratingSeed % 20) / 10 + 3.0).toFixed(1); // generates 3.0 to 4.9

    // Build address string
    const street = el.tags['addr:street'] || '';
    const city = el.tags['addr:city'] || '';
    const address = [street, city].filter(Boolean).join(', ') || 'Address not listed';

    // Specialties/Features
    let description = el.tags.amenity || el.tags.shop || category;
    if (el.tags.cuisine) description += ` (${el.tags.cuisine})`;
    if (el.tags.emergency === 'yes') description = `Emergency Care Available`;

    results.push({
      id: el.id.toString(),
      category: category,
      name: name,
      position: { lat: lat, lng: lon },
      rating: parseFloat(rating) > 5.0 ? 5.0 : rating, // cap at 5
      distance: calculateDistance(userLat, userLng, lat, lon),
      address: address,
      description: description.charAt(0).toUpperCase() + description.slice(1) // capitalize
    });
  }

  // Sort by closest first
  results.sort((a,b) => parseFloat(a.distance) - parseFloat(b.distance));
  
  return results;
};

// Search places by text name using Overpass API
export const searchPlacesByText = async (lat, lng, searchText, radius = 5000) => {
  if (!searchText || searchText.length < 3) return [];
  
  // Clean search text for regex
  const safeText = searchText.replace(/[.*+?^$\\{}()|[\\]\\\\]/g, '\\\\$&');
  
  const aroundStr = `(around:${radius},${lat},${lng})`;
  
  // Search for nodes, ways, and relations with a name matching the text
  const query = `
    [out:json][timeout:15];
    (
      nwr["name"~"${safeText}",i]${aroundStr};
    );
    out center 60;
  `;

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query
    });

    if (!response.ok) throw new Error('Overpass Search API error');
    
    const data = await response.json();
    return formatSearchResults(data.elements, lat, lng);
  } catch (error) {
    console.error("Failed searching from Overpass:", error);
    return [];
  }
};

const formatSearchResults = (elements, userLat, userLng) => {
  const results = [];
  
  for (const el of elements) {
    if (!el.tags || !el.tags.name) continue; // Skip unnamed
    
    const lat = el.lat || (el.center && el.center.lat);
    const lon = el.lon || (el.center && el.center.lon);
    
    if (!lat || !lon) continue;

    // Try to guess a category for icon coloring
    let category = 'search';
    if (el.tags.amenity === 'hospital' || el.tags.amenity === 'clinic') category = 'hospital';
    else if (el.tags.amenity === 'restaurant' || el.tags.amenity === 'fast_food' || el.tags.amenity === 'cafe') category = 'food';
    else if (el.tags.amenity === 'pharmacy') category = 'pharmacy';
    else if (el.tags.amenity === 'fuel') category = 'fuel';
    else if (el.tags.shop === 'clothes' || el.tags.shop === 'mall') category = 'clothes';
    else if (el.tags.amenity === 'police' || el.tags.amenity === 'post_office' || el.tags.amenity === 'fire_station' || el.tags.amenity === 'library' || el.tags.amenity === 'townhall' || el.tags.railway === 'station' || el.tags.public_transport === 'station') category = 'public';
    else if (el.tags.amenity === 'atm' || el.tags.amenity === 'bank') category = 'bank';
    else if (el.tags.leisure === 'park' || el.tags.leisure === 'playground') category = 'park';
    else if (el.tags.amenity === 'school' || el.tags.amenity === 'college' || el.tags.amenity === 'university') category = 'school';
    else if (el.tags.shop === 'supermarket' || el.tags.shop === 'convenience') category = 'grocery';
    else if (el.tags.tourism === 'hotel') category = 'hotel';
    else if (el.tags.leisure === 'fitness_centre') category = 'gym';
    else if (el.tags.amenity === 'cinema') category = 'movie';

    const street = el.tags['addr:street'] || '';
    const city = el.tags['addr:city'] || '';
    const address = [street, city].filter(Boolean).join(', ') || 'Address not listed';

    results.push({
      id: el.id.toString(),
      category: category,
      name: el.tags.name,
      position: { lat, lng: lon },
      rating: ((Math.random() * 1.5) + 3.5).toFixed(1), // Random 3.5 - 5.0 rating
      distance: calculateDistance(userLat, userLng, lat, lon),
      address: address,
      description: el.tags.amenity || el.tags.shop || el.tags.building || 'Place'
    });
  }

  results.sort((a,b) => parseFloat(a.distance) - parseFloat(b.distance));
  return results;
};
