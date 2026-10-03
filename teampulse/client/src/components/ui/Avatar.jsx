import React from 'react';

export function Avatar({ name = '', size = 'md', className = '' }) {
  const initial = (name || 'U').trim().charAt(0).toUpperCase();

  return (
    <div className={`avatar avatar-${size} ${className}`} aria-label={name}>
      <span>{initial}</span>
    </div>
  );
}
