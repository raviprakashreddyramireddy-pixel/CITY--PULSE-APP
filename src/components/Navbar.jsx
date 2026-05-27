import { useState } from 'react';
import { Menu, X, Navigation } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar glass">
      <div className="container nav-container">
        <a href="#" className="nav-logo">
          <div className="logo-icon">
            <Navigation size={24} color="var(--primary)" />
          </div>
          <span className="logo-text">CivicConnect</span>
        </a>

        {/* Desktop Menu */}
        <div className="nav-links desktop-only">
          <a href="#how-it-works" className="nav-link">How it Works</a>
          <a href="#discover" className="nav-link">Discover Services</a>
          <button className="btn btn-primary">Get Started</button>
        </div>

        {/* Mobile Hamburger */}
        <button className="mobile-toggle mobile-only" onClick={toggleMenu} aria-label="Toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mobile-menu glass-card">
          <a href="#how-it-works" className="nav-link" onClick={toggleMenu}>How it Works</a>
          <a href="#discover" className="nav-link" onClick={toggleMenu}>Discover Services</a>
          <button className="btn btn-primary" onClick={toggleMenu}>Get Started</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
