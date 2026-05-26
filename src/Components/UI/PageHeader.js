import React from 'react';
import Button from './Button';

function PageHeader({ title, actionLabel, onAction }) {
  return (
    <div className="cs-page-header">
      <h1 className="cs-page-header__title">{title}</h1>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default PageHeader;
