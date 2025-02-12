import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-links">
          <a href="#terms">Terms of Service</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#contact">Contact Us</a>
          <a href="https://t.me/tentacle01" target="_blank" rel="noopener noreferrer">
            Telegram: @tentacle01
          </a>
        </div>
        <div className="footer-info">
          <p>© 2024 TentacleCompany. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
