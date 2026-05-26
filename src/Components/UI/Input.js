import React from 'react';

function Input({ label, error, id, className = '', ...props }) {
  const inputId = id || props.name;
  return (
    <div className={`cs-field ${className}`}>
      {label && (
        <label className="cs-label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`cs-input ${error ? 'cs-input--error' : ''}`}
        {...props}
      />
      {error && <p className="cs-error">{error}</p>}
    </div>
  );
}

export default Input;
