import React from 'react';

function Badge({ children, variant = 'muted' }) {
  return <span className={`cs-badge cs-badge--${variant}`}>{children}</span>;
}

export default Badge;
