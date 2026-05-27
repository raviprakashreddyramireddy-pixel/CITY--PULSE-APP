import { useState } from 'react';
import './Dashboard.css';
import {
  MapPin, Activity, Coffee, Wrench, ShieldPlus, Shield, Fuel,
  Navigation, ChevronRight, Zap, Menu, X, Map, Route, User
} from 'lucide-react';

const categories = [
  { id: 'hospital', label: 'Hospital', icon: Activity, count: 10, color: '#ef4444' },
  { id: 'food', label: 'Food', icon: Coffee, count: 7, color: '#f97316' },
  { id: 'repair', label: 'Repair', icon: Wrench, count: 7, color: '#eab308' },
  { id: 'pharmacy', label: 'Pharmacy', icon: ShieldPlus, count: 7, color: '#8b5cf6' },
  { id: 'police', label: 'Police', icon: Shield, count: 7, color: '#3b82f6' },
  { id: 'fuel', label: 'Fuel', icon: Fuel, count: 11, color: '#06b6d4' },
];

const markers = [
  { id: 1,  x: 72, y: 12, cat: 'hospital' },
  { id: 2,  x: 22, y: 18, cat: 'food' },
  { id: 3,  x: 88, y: 8,  cat: 'fuel' },
  { id: 4,  x: 55, y: 22, cat: 'pharmacy' },
  { id: 5,  x: 38, y: 15, cat: 'repair' },
  { id: 6,  x: 80, y: 28, cat: 'food' },
  { id: 7,  x: 15, y: 35, cat: 'fuel' },
  { id: 8,  x: 65, y: 32, cat: 'police' },
  { id: 9,  x: 45, y: 48, cat: 'hospital', name: 'Community Health Center', address: '123 Main St', dist: '0.5km' },
  { id: 10, x: 78, y: 45, cat: 'food' },
  { id: 11, x: 25, y: 55, cat: 'fuel' },
  { id: 12, x: 90, y: 52, cat: 'pharmacy' },
  { id: 13, x: 12, y: 68, cat: 'repair' },
  { id: 14, x: 58, y: 72, cat: 'hospital' },
  { id: 15, x: 82, y: 68, cat: 'fuel' },
  { id: 16, x: 35, y: 78, cat: 'food' },
  { id: 17, x: 68, y: 85, cat: 'police' },
  { id: 18, x: 92, y: 80, cat: 'hospital' },
  { id: 19, x: 48, y: 32, cat: 'fuel' },
  { id: 20, x: 30, y: 42, cat: 'pharmacy' },
  { id: 21, x: 75, y: 58, cat: 'repair' },
  { id: 22, x: 18, y: 82, cat: 'hospital' },
  { id: 23, x: 60, y: 92, cat: 'fuel' },
  { id: 24, x: 42, y: 62, cat: 'food' },
];

const Dashboard = () => {
  const [activeCat, setActiveCat] = useState('hospital');
  const [selected, setSelected] = useState(null);
  const [openNow, setOpenNow] = useState(true);
  const [accessible, setAccessible] = useState(false);
  const [dist, setDist] = useState(3);
  const [panel, setPanel] = useState(false);

  const userX = 50, userY = 50;
  const visible = markers.filter(m => !activeCat || m.cat === activeCat);

  const selectMarker = (m) => setSelected(m);

  return (
    <div className="dash">
      {/* ══════ TOP NAV ══════ */}
      <header className="dash-nav">
        <div className="nav-left">
          <button className="nav-burger" onClick={() => setPanel(!panel)}>
            {panel ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div className="nav-logo-wrap">
            <div className="nav-logo-icon"><MapPin size={15} /></div>
            <span className="nav-logo-text">CivicConnect</span>
          </div>
        </div>
        <div className="nav-center">
          <a href="#" className="nav-link active">Home</a>
          <a href="#" className="nav-link">Plan Steps <ChevronRight size={12} /></a>
          <a href="#" className="nav-link">Services</a>
        </div>
        <div className="nav-right">
          <button className="nav-route-btn">
            <Route size={14} />
            <span>Route Planning</span>
          </button>
          <div className="nav-avatar"></div>
          <button className="nav-close-btn"><X size={16} /></button>
        </div>
      </header>

      {/* ══════ SUB BAR ══════ */}
      <div className="dash-subbar">
        <h2>Smart Service Discovery Platform</h2>
        <p>Smart service discovery nearby.</p>
      </div>

      {/* ══════ BODY ══════ */}
      <div className="dash-body">
        {/* Mobile overlay */}
        {panel && <div className="panel-overlay" onClick={() => setPanel(false)} />}

        {/* ── LEFT PANEL ── */}
        <aside className={`dash-panel ${panel ? 'open' : ''}`}>
          {/* Categories header */}
          <div className="panel-header">
            <Menu size={15} />
            <span>Service Categories</span>
          </div>

          {/* Category buttons */}
          <div className="cat-list">
            {categories.map(c => {
              const Icon = c.icon;
              const active = activeCat === c.id;
              return (
                <button
                  key={c.id}
                  className={`cat-btn ${active ? 'active' : ''}`}
                  onClick={() => { setActiveCat(c.id); setSelected(null); setPanel(false); }}
                >
                  <div className="cat-icon-wrap">
                    <Icon size={15} />
                  </div>
                  <span className="cat-label">{c.label}</span>
                  <span className="cat-count">{c.count}</span>
                </button>
              );
            })}
          </div>

          {/* Filters */}
          <div className="panel-filters">
            <label className="filter-row">
              <span>Open Now</span>
              <div className={`toggle ${openNow ? 'on' : ''}`} onClick={() => setOpenNow(!openNow)}>
                <div className="toggle-thumb" />
              </div>
            </label>
            <label className="filter-row">
              <span>Accessible</span>
              <div className={`toggle ${accessible ? 'on' : ''}`} onClick={() => setAccessible(!accessible)}>
                <div className="toggle-thumb" />
              </div>
            </label>
            <div className="filter-dist">
              <div className="filter-dist-header">
                <span>Distance</span>
                <span className="dist-value">&lt; {dist} km</span>
              </div>
              <input type="range" min="0" max="5" step="0.5" value={dist} onChange={e => setDist(+e.target.value)} className="dist-slider" />
            </div>
          </div>

          {/* Emergency */}
          <button className="emergency-btn" onClick={() => setActiveCat('hospital')}>
            <Zap size={18} />
            <div>
              <strong>Emergency Mode</strong>
              <small>Find &amp; Nearest</small>
            </div>
          </button>
        </aside>

        {/* ── MAP AREA ── */}
        <main className="dash-map">
          {/* Map controls */}
          <div className="map-controls">
            <button className="map-ctrl-btn primary">
              <span className="ctrl-dot" />
              Live Map View
            </button>
            <button className="map-ctrl-btn">
              <Map size={13} />
              Route Planning
            </button>
          </div>

          {/* SVG Map */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="map-svg">
            <defs>
              <filter id="glow"><feGaussianBlur stdDeviation="0.25" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              <filter id="bigGlow"><feGaussianBlur stdDeviation="0.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              <radialGradient id="mapBg" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="#111e17" />
                <stop offset="100%" stopColor="#080d0a" />
              </radialGradient>
            </defs>
            <rect width="100" height="100" fill="url(#mapBg)" />

            {/* Major roads */}
            <g stroke="#1a2e22" strokeLinecap="round">
              <line x1="0" y1="20" x2="100" y2="20" strokeWidth="1.6" />
              <line x1="0" y1="40" x2="100" y2="40" strokeWidth="2" />
              <line x1="0" y1="55" x2="100" y2="55" strokeWidth="2.4" />
              <line x1="0" y1="72" x2="100" y2="72" strokeWidth="1.6" />
              <line x1="0" y1="88" x2="100" y2="88" strokeWidth="1.4" />
              <line x1="18" y1="0" x2="18" y2="100" strokeWidth="1.6" />
              <line x1="38" y1="0" x2="38" y2="100" strokeWidth="1.8" />
              <line x1="55" y1="0" x2="55" y2="100" strokeWidth="2.2" />
              <line x1="72" y1="0" x2="72" y2="100" strokeWidth="1.6" />
              <line x1="88" y1="0" x2="88" y2="100" strokeWidth="1.8" />
            </g>

            {/* Minor roads */}
            <g stroke="#142018" strokeWidth="0.6" strokeLinecap="round">
              <line x1="0" y1="30" x2="55" y2="30" />
              <line x1="38" y1="48" x2="100" y2="48" />
              <line x1="55" y1="65" x2="100" y2="65" />
              <line x1="0" y1="80" x2="55" y2="80" />
              <line x1="28" y1="0" x2="28" y2="55" />
              <line x1="48" y1="20" x2="48" y2="72" />
              <line x1="62" y1="40" x2="62" y2="100" />
              <line x1="80" y1="0" x2="80" y2="88" />
            </g>

            {/* City blocks */}
            <g fill="#0c1610" stroke="#15261b" strokeWidth="0.25">
              <rect x="19" y="21" rx="0.4" width="18" height="8" />
              <rect x="39" y="21" rx="0.4" width="15" height="8" />
              <rect x="56" y="21" rx="0.4" width="15" height="18" />
              <rect x="73" y="21" rx="0.4" width="14" height="18" />
              <rect x="19" y="41" rx="0.4" width="18" height="13" />
              <rect x="39" y="41" rx="0.4" width="15" height="13" />
              <rect x="73" y="41" rx="0.4" width="14" height="13" />
              <rect x="56" y="56" rx="0.4" width="15" height="15" />
              <rect x="73" y="56" rx="0.4" width="14" height="15" />
              <rect x="19" y="56" rx="0.4" width="18" height="15" />
              <rect x="39" y="73" rx="0.4" width="15" height="14" />
              <rect x="56" y="73" rx="0.4" width="15" height="14" />
              <rect x="89" y="41" rx="0.4" width="10" height="13" />
            </g>

            {/* Intersections */}
            <g fill="rgba(57,255,107,0.04)">
              <circle cx="18" cy="20" r="0.6" /><circle cx="38" cy="20" r="0.6" />
              <circle cx="55" cy="20" r="0.8" /><circle cx="72" cy="20" r="0.6" />
              <circle cx="88" cy="20" r="0.6" /><circle cx="18" cy="40" r="0.6" />
              <circle cx="38" cy="40" r="0.8" /><circle cx="55" cy="40" r="1" />
              <circle cx="72" cy="40" r="0.8" /><circle cx="88" cy="40" r="0.6" />
              <circle cx="55" cy="55" r="1" /><circle cx="72" cy="55" r="0.8" />
              <circle cx="38" cy="72" r="0.6" /><circle cx="55" cy="72" r="0.8" />
              <circle cx="72" cy="72" r="0.6" /><circle cx="88" cy="72" r="0.6" />
              <circle cx="55" cy="88" r="0.6" /><circle cx="72" cy="88" r="0.6" />
            </g>

            {/* Route */}
            {selected && (
              <path
                className="route-path"
                d={`M ${userX},${userY} L ${userX},${selected.y} L ${selected.x},${selected.y}`}
                filter="url(#bigGlow)"
              />
            )}

            {/* Service markers */}
            {visible.map(m => (
              <g key={m.id} className="marker-g" onClick={() => selectMarker(m)}>
                <circle cx={m.x} cy={m.y} r="1.6" fill="rgba(57,255,107,0.06)" />
                <circle cx={m.x} cy={m.y} r="0.9" fill="#0f1613" stroke="#39ff6b" strokeWidth="0.25" filter="url(#glow)" />
                <path d={`M ${m.x - 0.25} ${m.y + 0.15} L ${m.x} ${m.y - 0.35} L ${m.x + 0.25} ${m.y + 0.15} Z`} fill="#39ff6b" />
              </g>
            ))}

            {/* User */}
            <circle cx={userX} cy={userY} r="2.2" className="user-pulse" />
            <circle cx={userX} cy={userY} r="1" fill="var(--blue)" stroke="#fff" strokeWidth="0.25" filter="url(#glow)" />
          </svg>

          {/* Info Card */}
          {selected && (
            <div className="info-card" style={{
              left: `${Math.min(Math.max(selected.x, 20), 80)}%`,
              top: `${Math.max(selected.y - 6, 8)}%`,
            }}>
              <div className="info-card-inner">
                <div className="info-icon"><MapPin size={13} /></div>
                <div className="info-body">
                  <strong>{selected.name || 'Community Health Center'}</strong>
                  <span>{selected.address || '123 Main St'}, Open Now</span>
                  <span>Distance: {selected.dist || '0.5km'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Route Panel */}
          {selected && (
            <div className="route-panel">
              <p>Distance: <strong>2.1km</strong></p>
              <p>Time: <strong>6 min</strong></p>
              <button className="directions-btn">
                <Navigation size={14} />
                Get Directions
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
