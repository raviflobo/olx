import React from 'react';

function Select({ label, error, id, children, className = '', ...props }) {
  const selectId = id || props.name;
  return (
    <div className={`cs-field ${className}`}>
      {label && (
        <label className="cs-label" htmlFor={selectId}>
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`cs-select ${error ? 'cs-select--error' : ''}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="cs-error">{error}</p>}
    </div>
  );
}

export default Select;
