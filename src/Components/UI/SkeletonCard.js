import React from 'react';
import './SkeletonCard.css';

function SkeletonCard() {
  return (
    <div className="cs-skeleton-card">
      <div className="cs-skeleton cs-skeleton-card__image" />
      <div className="cs-skeleton-card__body">
        <div className="cs-skeleton cs-skeleton-card__line cs-skeleton-card__line--short" />
        <div className="cs-skeleton cs-skeleton-card__line" />
        <div className="cs-skeleton cs-skeleton-card__line cs-skeleton-card__line--meta" />
      </div>
    </div>
  );
}

export default SkeletonCard;
