import React from 'react';

export function ThriveLoopLogo({ size = 26, showText = true, className = '', variant = 'default' }) {
  const isSilver = variant === 'silver';
  const strokeOuter = isSilver ? '#CBD5E1' : '#10B981';
  const strokeInner = isSilver ? '#E2E8F0' : '#059669';
  const strokeStem = isSilver ? '#94A3B8' : '#047857';
  const textColor = isSilver ? '#FFFFFF' : '#0F172A';

  return (
    <div className={`thriveloop-logo-wrap ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '9px' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <path
          d="M14 2L24.3923 8V20L14 26L3.6077 20V8L14 2Z"
          stroke={strokeOuter}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M14 8C14 8 10 12 10 16C10 18.2091 11.7909 20 14 20C16.2091 20 18 18.2091 18 16C18 12 14 8 14 8Z"
          stroke={strokeInner}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M14 13V19"
          stroke={strokeStem}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
      {showText && (
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 800,
          fontSize: '19px',
          letterSpacing: '-0.5px',
          color: textColor,
        }}>
          ThriveLoop
        </span>
      )}
    </div>
  );
}
