import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <h3 className="footer-logo">CivicConnect</h3>
            <p>A location-aware platform helping you discover nearby essential services instantly.</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Services</h4>
              <a href="#">Hospitals</a>
              <a href="#">Repair</a>
              <a href="#">Pharmacies</a>
              <a href="#">Police Stations</a>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <a href="#">About Us</a>
              <a href="#">Contact</a>
              <a href="#">Privacy Policy</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} CivicConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
