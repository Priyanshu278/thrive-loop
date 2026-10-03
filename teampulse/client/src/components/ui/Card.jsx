import React from 'react';

export function Card({ children, className = '', highlight = false, ...props }) {
  return (
    <section className={`card ${highlight ? 'card-highlight' : ''} ${className}`} {...props}>
      {children}
    </section>
  );
}
