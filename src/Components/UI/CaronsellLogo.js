import React from 'react';
import { Link } from 'react-router-dom';
import './CaronsellLogo.css';

function CaronsellLogo({ asLink = true, className = '' }) {
  const logo = (
    <span className={`cs-logo ${className}`}>
      <span className="cs-logo__caron">CARON</span>
      <span className="cs-logo__sell">SELL</span>
    </span>
  );

  if (asLink) {
    return (
      <Link to="/" className="cs-logo-link">
        {logo}
      </Link>
    );
  }
  return logo;
}

export default CaronsellLogo;
