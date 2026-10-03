import React from 'react';

export function ProgressBar({
  value = 0,
  max = 100,
  color = 'primary',
  size = 'md',
  showLabel = false,
  className = '',
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return (
    <div className={`progress-container ${className}`}>
      {showLabel && (
        <div className="progress-label-row">
          <span>Progress</span>
          <span className="progress-percentage">{percentage}%</span>
        </div>
      )}
      <div className={`progress-track progress-${size}`}>
        <div
          className={`progress-fill progress-fill-${color}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}
