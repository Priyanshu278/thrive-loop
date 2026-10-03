import React from 'react';

export function Skeleton({ width = '100%', height = '20px', radius = '8px', className = '' }) {
  return (
    <div
      className={`skeleton-pulse ${className}`}
      style={{ width, height, borderRadius: radius }}
      aria-hidden="true"
    />
  );
}

export function SkeletonTable({ rows = 4 }) {
  return (
    <div className="skeleton-table-wrapper" aria-busy="true" aria-label="Loading data">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton-table-row">
          <Skeleton width="40%" height="20px" />
          <Skeleton width="20%" height="20px" />
          <Skeleton width="20%" height="20px" />
        </div>
      ))}
    </div>
  );
}
