import React from 'react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  ...props
}) {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${loading ? 'is-loading' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="btn-spinner" aria-hidden="true" />
      ) : Icon ? (
        <Icon className="btn-icon" size={size === 'sm' ? 14 : 18} />
      ) : null}
      <span className="btn-text">{children}</span>
    </button>
  );
}
