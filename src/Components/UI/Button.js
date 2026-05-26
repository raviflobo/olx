import React from 'react';

function Button({
  children,
  variant = 'primary',
  type = 'button',
  className = '',
  block = false,
  small = false,
  icon = false,
  disabled,
  onClick,
  ...rest
}) {
  const classes = [
    'cs-btn',
    `cs-btn--${variant}`,
    block ? 'cs-btn--block' : '',
    small ? 'cs-btn--sm' : '',
    icon ? 'cs-btn--icon' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
