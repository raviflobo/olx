import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footerParentDiv">
      <div className="footerBottom">
        <div className="footerBottomInner cs-container">
          <p>
            © {new Date().getFullYear()} CARONSELL — Car dealer marketplace
            {' · '}
            <Link to="/privacy">Privacy</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
