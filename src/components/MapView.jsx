import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import './MapView.css';
import { fetchNearbyPlaces } from '../utils/overpassAPI';
import { Navigation2, Map as MapIcon, X } from 'lucide-react';

// Fix for default marker icons in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const customIcons = {
    hospital: new L.Icon({ iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png', shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41]}),
    repair: new L.Icon({ iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png', shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41]}),
    food: new L.Icon({ iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png', shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41]}),
    pharmacy: new L.Icon({ iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png', shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41]}),
    police: new L.Icon({ iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png', shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41]}),
    fuel: new L.Icon({ iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png', shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41]}),
    user: new L.Icon({ iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png', shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41]})
}

// Component to handle Routing
function RoutingControl({ start, end, onRouteCalculated }) {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!start || !end || !map) return;

    // Clean up previous route if exists
    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

    const control = L.Routing.control({
      waypoints: [
        L.latLng(start.lat, start.lng),
        L.latLng(end.lat, end.lng)
      ],
      routeWhileDragging: false,
      showAlternatives: false,
      fitSelectedRoutes: true,
      lineOptions: {
        styles: [{ color: '#0EA5E9', opacity: 0.8, weight: 6 }]
      },
      createMarker: () => null, // We already draw our own markers
      // Hide the instruction panel (we'll show our own summary)
      show: false
    }).addTo(map);

    control.on('routesfound', function(e) {
      const routes = e.routes;
      if (routes && routes.length > 0) {
        const summary = routes[0].summary;
        onRouteCalculated({
          distance: (summary.totalDistance / 1000).toFixed(1), // in km
          time: Math.round(summary.totalTime / 60) // in minutes
        });
      }
    });

    routingControlRef.current = control;

    return () => {
      if (routingControlRef.current && map) {
        map.removeControl(routingControlRef.current);
      }
    };
  }, [start, end, map]);

  return null;
}

// Component to recenter map when location changes
function ChangeMapCenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
        map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

const MapView = ({ userLocation, selectedCategory, emergencyMode }) => {
  // Default to a generic city center if no user location (e.g. New York)
  const defaultCenter = { lat: 40.7128, lng: -74.0060 };
  const center = userLocation || defaultCenter;

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [showDirections, setShowDirections] = useState(false);

  // Fetch real data when category or location changes
  useEffect(() => {
     const loadData = async () => {
         if (!userLocation) return;
         
         setLoading(true);
         setPlaces([]);
         setSelectedPlace(null);
         setShowDirections(false);
         setRouteInfo(null);
         
         let fetchedPlaces = [];
         
         if (emergencyMode) {
             // Fetch multiple concurrently
             const categories = ['hospital', 'police', 'pharmacy'];
             const promises = categories.map(cat => fetchNearbyPlaces(userLocation.lat, userLocation.lng, cat));
             const results = await Promise.all(promises);
             fetchedPlaces = results.flat();
         } else if (selectedCategory) {
             fetchedPlaces = await fetchNearbyPlaces(userLocation.lat, userLocation.lng, selectedCategory);
         }
         
         // Sort completely by distance
         fetchedPlaces.sort((a,b) => parseFloat(a.distance) - parseFloat(b.distance));
         setPlaces(fetchedPlaces);
         setLoading(false);
     };

     loadData();
  }, [selectedCategory, emergencyMode, userLocation?.lat, userLocation?.lng]);

  const handlePlaceSelect = (place) => {
      setSelectedPlace(place);
      setShowDirections(false);
      setRouteInfo(null);
  };

  const handleGetDirections = () => {
      if (!userLocation) {
          alert("Please detect your location first.");
          return;
      }
      setShowDirections(true);
  };

  const cancelDirections = () => {
      setShowDirections(false);
      setRouteInfo(null);
  };

  const openGoogleMaps = (place) => {
      if (userLocation) {
          window.open(`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${place.position.lat},${place.position.lng}`, '_blank');
      } else {
          window.open(`https://www.google.com/maps/search/?api=1&query=${place.position.lat},${place.position.lng}`, '_blank');
      }
  };

  return (
    <div className="map-view-container">
        <div className="side-list-panel">
            <h3 className="side-list-title">
                {emergencyMode ? "Emergency Services" : selectedCategory ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Nearby` : "Select a service"}
                {loading && <span className="loading-badge">Loading live data...</span>}
            </h3>
            
            <div className="results-list">
                {!loading && places.length === 0 && (
                    <div className="no-results">
                        <p>{selectedCategory || emergencyMode ? "No places found nearby. Try expanding search." : "Choose a category to find nearby real places."}</p>
                    </div>
                )}
                
                {places.map(place => (
                    <div 
                        key={place.id} 
                        className={`result-card cat-${place.category} ${selectedPlace?.id === place.id ? 'selected' : ''}`}
                        onClick={() => handlePlaceSelect(place)}
                    >
                        <h4>{place.name}</h4>
                        <p className="card-desc">{place.description}</p>
                        <div className="result-meta">
                            <span>{place.distance} km away</span>
                            <span>⭐ {place.rating}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="leaflet-container-wrapper">
            
            {/* Overlay Panel for Selected Place Info */}
            {selectedPlace && (
                <div className="place-info-overlay glass-card">
                    <button className="close-panel-btn" onClick={() => setSelectedPlace(null)}>
                        <X size={20} />
                    </button>
                    <h2>{selectedPlace.name}</h2>
                    <p className="info-address">{selectedPlace.address}</p>
                    <div className="info-meta">
                        <span className="info-badge highlight">⭐ {selectedPlace.rating} Rating</span>
                        <span className="info-badge">{selectedPlace.distance} km</span>
                        <span className="info-badge capitalize">{selectedPlace.category}</span>
                    </div>

                    {!showDirections ? (
                        <div className="info-actions">
                            <button className="btn btn-primary" onClick={handleGetDirections}>
                                <Navigation2 size={18} />
                                Get Directions
                            </button>
                            <button className="btn btn-outline" onClick={() => openGoogleMaps(selectedPlace)}>
                                <MapIcon size={18} />
                                Navigate
                            </button>
                        </div>
                    ) : (
                        <div className="route-details-panel">
                            <h4>Route Calculated</h4>
                            {routeInfo ? (
                                <div className="route-stats">
                                    <div className="stat">
                                        <span className="stat-label">Distance</span>
                                        <span className="stat-value">{routeInfo.distance} km</span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-label">Est. Time</span>
                                        <span className="stat-value">{routeInfo.time} min</span>
                                    </div>
                                </div>
                            ) : (
                                <p className="calculating-text">Calculating optimal route...</p>
                            )}
                            <div className="info-actions mt-3">
                                <button className="btn btn-primary" onClick={() => openGoogleMaps(selectedPlace)}>
                                    Start Navigation (Google Maps)
                                </button>
                                <button className="btn btn-outline" onClick={cancelDirections}>
                                    Clear Route
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
                <ChangeMapCenter center={selectedPlace ? selectedPlace.position : center} />
                
                <TileLayer
                    attribution='&copy; <a href="https://www.esri.com/">Esri</a>, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />
                
                {/* Routing Line */}
                {showDirections && userLocation && selectedPlace && (
                    <RoutingControl 
                        start={userLocation} 
                        end={selectedPlace.position} 
                        onRouteCalculated={setRouteInfo}
                    />
                )}

                {/* User Location Marker */}
                {userLocation && (
                    <Marker position={userLocation} icon={customIcons.user}>
                        <Popup>
                            <strong>Your Location</strong>
                        </Popup>
                    </Marker>
                )}

                {/* Service Markers */}
                {places.map(place => (
                    <Marker 
                        key={`marker-${place.id}`} 
                        position={place.position}
                        icon={customIcons[place.category]}
                        eventHandlers={{
                            click: () => handlePlaceSelect(place),
                        }}
                    >
                        <Popup className="custom-popup">
                            <strong>{place.name}</strong><br/>
                            {place.distance} km away<br/>
                            ⭐ {place.rating} rating
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    </div>
  );
};

export default MapView;
