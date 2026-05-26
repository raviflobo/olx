import React from 'react';

function Chip({ label, active, onClick, className = '' }) {
  return (
    <button
      type="button"
      className={`cs-chip ${active ? 'cs-chip--active' : ''} ${className}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export default Chip;
