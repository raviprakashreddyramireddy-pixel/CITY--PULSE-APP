import { useState } from 'react';
import { LocateFixed, Search, Hospital, Wrench, Utensils, Pill, Shield, Fuel } from 'lucide-react';
import MapView from './MapView';
import './ServiceDiscovery.css';

const categories = [
  { id: 'hospital', label: 'Hospital', icon: Hospital },
  { id: 'repair', label: 'Repair', icon: Wrench },
  { id: 'food', label: 'Food', icon: Utensils },
  { id: 'pharmacy', label: 'Pharmacy', icon: Pill },
  { id: 'police', label: 'Police', icon: Shield },
  { id: 'fuel', label: 'Fuel', icon: Fuel },
];

const keywordMap = {
  repair: ['bike', 'car', 'break', 'fix', 'mechanic', 'broken', 'puncture'],
  hospital: ['sick', 'pain', 'doctor', 'health', 'injury', 'accident'],
  food: ['hungry', 'food', 'eat', 'restaurant', 'meal', 'cafe'],
  pharmacy: ['medicine', 'pill', 'pharmacy', 'drugs', 'chemist'],
  police: ['police', 'crime', 'robbed', 'stolen', 'danger', 'help'],
  fuel: ['fuel', 'gas', 'petrol', 'diesel', 'station']
};

const ServiceDiscovery = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);

  const detectLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location: ", error);
          alert("Could not detect your location. Please ensure location permissions are granted.");
          setIsLocating(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
      setIsLocating(false);
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    
    // NLP-lite keyword matching
    if (val.trim() === '') return;
    
    const words = val.toLowerCase().split(' ');
    let matchedCategory = null;

    for (const [category, keywords] of Object.entries(keywordMap)) {
      if (words.some(word => keywords.some(k => word.includes(k) || k.includes(word)))) {
        matchedCategory = category;
        break;
      }
    }

    if (matchedCategory) {
      setSelectedCategory(matchedCategory);
      setEmergencyMode(false);
    }
  };

  const handleCategorySelect = (id) => {
    setSelectedCategory(id);
    setEmergencyMode(false);
  };

  const activateEmergency = () => {
    setEmergencyMode(true);
    setSelectedCategory(null);
    if (!userLocation) detectLocation();
  };

  return (
    <section id="discover" className="discovery-section">
      <div className="container">
        
        <div className="discovery-header">
          <h2>Find Nearby Services</h2>
          <p>Search or use your location to discover the nearest verified providers</p>
        </div>

        <div className="discovery-grid">
          
          {/* Controls Panel */}
          <div className="controls-panel glass-card">
            
            <button 
              className={`btn ${userLocation ? 'btn-outline active-location' : 'btn-primary'} w-full map-detect-btn`}
              onClick={detectLocation}
              disabled={isLocating}
            >
              <LocateFixed size={20} className={isLocating ? 'spin' : ''} />
              {isLocating ? 'Detecting...' : userLocation ? 'Location Detected' : 'Detect My Location'}
            </button>

            <div className="search-box">
              <Search className="search-icon" size={20} />
              <input 
                type="text" 
                placeholder="Describe your problem (example: my bike broke down)" 
                className="search-input"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            <div className="categories-list">
              <h4 className="categories-title">Categories</h4>
              <div className="pills-container">
                {categories.map(cat => {
                  const Icon = cat.icon;
                  const isActive = selectedCategory === cat.id && !emergencyMode;
                  return (
                    <button 
                      key={cat.id} 
                      className={`category-pill ${isActive ? 'active' : ''} cat-${cat.id}`}
                      onClick={() => handleCategorySelect(cat.id)}
                    >
                      <Icon size={16} />
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="emergency-section">
              <h4 className="categories-title">Need Urgent Help?</h4>
              <button className="btn btn-emergency w-full emergency-btn" onClick={activateEmergency}>
                Emergency Mode
              </button>
              <p className="emergency-hint">Shows nearest Hospitals, Police Stations, and Pharmacies instantly.</p>
            </div>

          </div>

          {/* Map Display */}
          <div className="map-panel">
            <MapView 
              userLocation={userLocation} 
              selectedCategory={selectedCategory} 
              emergencyMode={emergencyMode}
            />
          </div>

        </div>

      </div>
    </section>
  );
};

export default ServiceDiscovery;
