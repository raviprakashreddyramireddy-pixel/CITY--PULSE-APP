import { useState, useEffect, useRef } from 'react';
import './Hero.css';
import { Activity, Coffee, Wrench, ShieldPlus, Fuel, MapPin, ChevronRight, Navigation, Menu, X, User } from 'lucide-react';

const markers = [
  { id: 'hospital', label: 'Hospital', icon: <Activity size={16}/>, color: '#EF4444', x: 1360, y: 240, delay: 0 },
  { id: 'restaurant', label: 'Restaurant', icon: <Coffee size={16}/>, color: '#F97316', x: 560, y: 240, delay: 200 },
  { id: 'repair', label: 'Repair Shop', icon: <Wrench size={16}/>, color: '#F59E0B', x: 560, y: 840, delay: 400 },
  { id: 'pharmacy', label: 'Pharmacy', icon: <ShieldPlus size={16}/>, color: '#8B5CF6', x: 1360, y: 840, delay: 600 },
  { id: 'fuel', label: 'Fuel Station', icon: <Fuel size={16}/>, color: '#06B6D4', x: 960, y: 840, delay: 800 }
];

const brands = [
  { name: 'Apollo Hospitals', icon: '🏥' },
  { name: 'Saravana Bhavan', icon: '🍽️' },
  { name: 'QuickFix Garage', icon: '🔧' },
  { name: 'City Pharmacy', icon: '💊' },
  { name: 'Metro Fuel', icon: '⛽' },
  { name: 'Urban Police Help', icon: '🚔' },
];

const Hero = () => {
  const [phase, setPhase] = useState(0);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    const schedule = [
      { phase: 0, delay: 0 },
      { phase: 1, delay: 2000 },
      { phase: 2, delay: 3500 },
      { phase: 3, delay: 6000 },
      { phase: 4, delay: 9000 },
      { phase: 5, delay: 13000 }
    ];
    const totalDuration = 14000;
    let timeouts = [];
    const startLoop = () => {
      schedule.forEach((s, i) => {
        const t = setTimeout(() => setPhase(schedule[i].phase), schedule[i].delay);
        timeouts.push(t);
      });
    };
    startLoop();
    const interval = setInterval(startLoop, totalDuration);
    return () => { timeouts.forEach(clearTimeout); clearInterval(interval); };
  }, []);

  return (
    <section className="hero-section" id="hero">
      {/* Background Video */}
      <video
        className="hero-bg-video"
        autoPlay
        loop
        muted
        playsInline
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260309_042944_4a2205b7-b061-490a-852b-92d9e9955ce9.mp4"
      />
      <div className="hero-video-overlay" />

      {/* === Navbar === */}
      <nav className="hero-navbar liquid-glass">
        <a href="#" className="hero-nav-logo">
          <div className="nav-logo-icon">
            <MapPin size={18} />
          </div>
          <span className="nav-logo-text">CivicConnect</span>
        </a>

        <div className="hero-nav-links desktop-only">
          <a href="#features" className="hero-nav-link">Features</a>
          <a href="#discover" className="hero-nav-link">Services</a>
          <a href="#how-it-works" className="hero-nav-link">How It Works</a>
          <a href="#" className="hero-nav-link">Cities</a>
        </div>

        <button className="hero-nav-cta btn btn-primary desktop-only">Open App</button>

        <button className="mobile-nav-toggle mobile-only" onClick={() => setMobileNav(!mobileNav)}>
          {mobileNav ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {mobileNav && (
        <div className="mobile-nav-dropdown liquid-glass">
          <a href="#features" className="hero-nav-link" onClick={() => setMobileNav(false)}>Features</a>
          <a href="#discover" className="hero-nav-link" onClick={() => setMobileNav(false)}>Services</a>
          <a href="#how-it-works" className="hero-nav-link" onClick={() => setMobileNav(false)}>How It Works</a>
          <a href="#" className="hero-nav-link" onClick={() => setMobileNav(false)}>Cities</a>
          <button className="btn btn-primary" onClick={() => setMobileNav(false)}>Open App</button>
        </div>
      )}

      {/* === Announcement Badge === */}
      <div className="hero-badge liquid-glass">
        <span>🚀 Live Smart Service Discovery Demo</span>
        <span className="badge-chip">Explore <ChevronRight size={14} /></span>
      </div>

      {/* === Heading === */}
      <h1 className="hero-heading">
        Find Essential Services<br />
        <span className="heading-green">Around You</span> Instantly
      </h1>

      {/* === Subheading === */}
      <p className="hero-subheading">
        Discover nearby hospitals, restaurants, repair shops, pharmacies, and emergency services using real-time location intelligence.
      </p>

      {/* === CTA Buttons === */}
      <div className="hero-cta-group">
        <button className="btn btn-primary hero-cta-primary" onClick={() => document.getElementById('discovery')?.scrollIntoView({behavior: 'smooth'})}>
          Find Services Near Me
        </button>
        <button className="btn hero-cta-secondary liquid-glass">
          See How It Works
        </button>
      </div>

      {/* === Animated Map Demo === */}
      <div className="hero-map-demo">
        <div className="map-demo-inner liquid-glass">
          <svg viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" className="demo-map-svg">
            <rect x="0" y="0" width="1920" height="1080" fill="hsl(260, 87%, 3%)" fillOpacity="0.6" />

            {/* Roads */}
            <g>
              <path d="M 0,240 L 1920,240" stroke="rgba(255,255,255,0.06)" strokeWidth="32" fill="none" strokeLinecap="round" />
              <path d="M 0,540 L 1920,540" stroke="rgba(255,255,255,0.08)" strokeWidth="48" fill="none" strokeLinecap="round" />
              <path d="M 0,840 L 1920,840" stroke="rgba(255,255,255,0.06)" strokeWidth="32" fill="none" strokeLinecap="round" />
              <path d="M 560,0 L 560,1080" stroke="rgba(255,255,255,0.06)" strokeWidth="32" fill="none" strokeLinecap="round" />
              <path d="M 960,0 L 960,1080" stroke="rgba(255,255,255,0.08)" strokeWidth="48" fill="none" strokeLinecap="round" />
              <path d="M 1360,0 L 1360,1080" stroke="rgba(255,255,255,0.06)" strokeWidth="32" fill="none" strokeLinecap="round" />
              
              {/* City Blocks */}
              <rect x="600" y="280" width="320" height="220" rx="12" fill="rgba(255,255,255,0.015)" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <rect x="1000" y="280" width="320" height="220" rx="12" fill="rgba(255,255,255,0.015)" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <rect x="600" y="580" width="320" height="220" rx="12" fill="rgba(255,255,255,0.015)" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <rect x="1000" y="580" width="320" height="220" rx="12" fill="rgba(255,255,255,0.015)" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

              {/* Intersections */}
              <circle cx="560" cy="240" r="8" fill="rgba(255,255,255,0.08)" />
              <circle cx="960" cy="240" r="12" fill="rgba(255,255,255,0.08)" />
              <circle cx="1360" cy="240" r="8" fill="rgba(255,255,255,0.08)" />
              <circle cx="560" cy="540" r="12" fill="rgba(255,255,255,0.08)" />
              <circle cx="960" cy="540" r="16" fill="rgba(255,255,255,0.1)" />
              <circle cx="1360" cy="540" r="12" fill="rgba(255,255,255,0.08)" />
              <circle cx="560" cy="840" r="8" fill="rgba(255,255,255,0.08)" />
              <circle cx="960" cy="840" r="12" fill="rgba(255,255,255,0.08)" />
              <circle cx="1360" cy="840" r="8" fill="rgba(255,255,255,0.08)" />
            </g>

            {/* Routes */}
            <g>
              <path className={`route-line ${phase >= 2 ? 'draw' : ''} ${phase >= 3 ? 'highlighted' : (phase >= 2 ? 'dimmed' : '')}`} d="M 960,540 L 960,240 L 1360,240" />
              <path className={`route-line ${phase >= 2 ? 'draw' : ''} ${phase >= 3 ? 'dimmed' : ''}`} d="M 960,540 L 960,240 L 560,240" />
              <path className={`route-line ${phase >= 2 ? 'draw' : ''} ${phase >= 3 ? 'dimmed' : ''}`} d="M 960,540 L 960,840 L 560,840" />
              <path className={`route-line ${phase >= 2 ? 'draw' : ''} ${phase >= 3 ? 'dimmed' : ''}`} d="M 960,540 L 960,840 L 1360,840" />
              <path className={`route-line ${phase >= 2 ? 'draw' : ''} ${phase >= 3 ? 'dimmed' : ''}`} d="M 960,540 L 960,840" />
            </g>

            {/* Service Markers */}
            {markers.map((m) => (
              <foreignObject key={m.id} x={m.x - 60} y={m.y - 80} width="120" height="120">
                <div
                  className={`map-pin ${phase >= 1 ? 'visible' : ''} ${phase >= 3 && m.id !== 'hospital' ? 'dimmed' : ''} ${phase >= 4 && m.id === 'hospital' ? 'arrived' : ''}`}
                  style={{ transitionDelay: phase === 1 ? `${m.delay}ms` : '0ms' }}
                >
                  <div className="map-pin-icon" style={{ backgroundColor: m.color }}>{m.icon}</div>
                  <span className="map-pin-label">{m.label}</span>
                </div>
              </foreignObject>
            ))}

            {/* User Person Icon */}
            <foreignObject x="0" y="0" width="1920" height="1080" style={{ pointerEvents: 'none' }}>
              <div className={`user-person-wrapper ${phase === 0 || phase === 1 ? 'pulsing' : ''} ${phase === 3 ? 'navigating' : ''} ${phase >= 4 && phase < 5 ? 'arrived-user' : ''} ${phase === 5 ? 'resetting' : ''}`}>
                <div className="user-person-dot">
                  <User size={14} color="hsl(260, 87%, 3%)" />
                </div>
              </div>
            </foreignObject>

            {/* Arrival Card */}
            <foreignObject x="1380" y="100" width="200" height="120" style={{ pointerEvents: 'none', overflow: 'visible' }}>
              <div className={`demo-arrival-card ${phase === 4 ? 'visible' : ''}`}>
                <strong>Apollo Hospital</strong>
                <span>2.1 km away</span>
                <span className="demo-rating">⭐ 4.6</span>
              </div>
            </foreignObject>
          </svg>
        </div>
      </div>

      {/* === Social Proof Marquee === */}
      <div className="hero-marquee-section">
        <p className="marquee-label">Trusted by local service providers</p>
        <div className="marquee-track">
          <div className="marquee-scroll">
            {[...brands, ...brands].map((b, i) => (
              <div className="marquee-item" key={i}>
                <span className="marquee-icon">{b.icon}</span>
                <span className="marquee-name">{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
