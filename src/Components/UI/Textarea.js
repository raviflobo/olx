import React from 'react';

function Textarea({ label, error, id, className = '', ...props }) {
  const textareaId = id || props.name;
  return (
    <div className={`cs-field ${className}`}>
      {label && (
        <label className="cs-label" htmlFor={textareaId}>
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`cs-textarea ${error ? 'cs-textarea--error' : ''}`}
        {...props}
      />
      {error && <p className="cs-error">{error}</p>}
    </div>
  );
}

export default Textarea;
