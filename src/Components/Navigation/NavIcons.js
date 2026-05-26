import React from 'react';

const iconProps = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg',
  'aria-hidden': true,
};

export function NavHomeIcon({ active }) {
  const stroke = active ? 'var(--olx-primary)' : 'currentColor';
  return (
    <svg {...iconProps}>
      <path
        d="M4 10.5L12 4l8 6.5V19a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-8.5z"
        stroke={stroke}
        strokeWidth="1.75"
        strokeLinejoin="round"
        fill={active ? 'rgba(232, 197, 71, 0.2)' : 'none'}
      />
    </svg>
  );
}

export function NavSearchIcon({ active }) {
  const stroke = active ? 'var(--olx-primary)' : 'currentColor';
  return (
    <svg {...iconProps}>
      <circle cx="11" cy="11" r="6.5" stroke={stroke} strokeWidth="1.75" />
      <path d="M16 16l5 5" stroke={stroke} strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function NavDashboardIcon({ active }) {
  const stroke = active ? 'var(--olx-primary)' : 'currentColor';
  return (
    <svg {...iconProps}>
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="2"
        stroke={stroke}
        strokeWidth="1.75"
        fill={active ? 'rgba(232, 197, 71, 0.2)' : 'none'}
      />
      <path d="M8 9h8M8 12h8M8 15h5" stroke={stroke} strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function NavDealerIcon({ active }) {
  const stroke = active ? 'var(--olx-primary)' : 'currentColor';
  return (
    <svg {...iconProps}>
      <path
        d="M4 19V5l8-2 8 2v14H4z"
        stroke={stroke}
        strokeWidth="1.75"
        strokeLinejoin="round"
        fill={active ? 'rgba(232, 197, 71, 0.15)' : 'none'}
      />
      <path d="M9 11h6M9 14h4" stroke={stroke} strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
