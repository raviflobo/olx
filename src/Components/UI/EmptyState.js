import React from 'react';
import Button from './Button';

function EmptyState({ title, text, actionLabel, onAction }) {
  return (
    <div className="cs-empty">
      <h3 className="cs-empty__title">{title}</h3>
      {text && <p className="cs-empty__text">{text}</p>}
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
