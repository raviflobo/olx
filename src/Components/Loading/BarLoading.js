import React from 'react';
import CaronsellLogo from '../UI/CaronsellLogo';
import './barloading.css';

function BarLoading({ inline = false }) {
  return (
    <div
      className={`bar-loading${inline ? ' bar-loading--inline' : ''}`}
      role="status"
      aria-label="Loading CARONSELL"
    >
      <div className="bar-loading-inner">
        <CaronsellLogo asLink={false} className="bar-loading-logo" />
        <div className="bar-loading-shimmer" aria-hidden="true" />
      </div>
    </div>
  );
}

export default BarLoading;
