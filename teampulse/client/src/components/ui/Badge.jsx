import React from 'react';

export function Badge({ children, variant = 'default', icon: Icon, className = '' }) {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {Icon && <Icon size={12} className="badge-icon" />}
      <span>{children}</span>
    </span>
  );
}
