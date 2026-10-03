import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function StatCard({
  label,
  value,
  unit = '',
  trend = null,
  trendLabel = '',
  subtitle = '',
  icon: Icon,
  className = '',
}) {
  const isPositive = trend && (typeof trend === 'string' ? trend.startsWith('+') : trend > 0);
  const isNegative = trend && (typeof trend === 'string' ? trend.startsWith('-') : trend < 0);

  return (
    <div className={`stat-card ${className}`}>
      <div className="stat-card-header">
        <span className="stat-card-label">{label}</span>
        {Icon && <Icon size={16} className="stat-card-icon" />}
      </div>
      <div className="stat-card-main">
        <span className="stat-card-value">
          {value}
          {unit && <small className="stat-card-unit">{unit}</small>}
        </span>
      </div>
      {(trend || subtitle) && (
        <div className="stat-card-footer">
          {trend && (
            <span className={`stat-trend ${isPositive ? 'trend-positive' : isNegative ? 'trend-negative' : ''}`}>
              {isPositive ? <TrendingUp size={12} /> : isNegative ? <TrendingDown size={12} /> : null}
              {trend}
            </span>
          )}
          {trendLabel && <span className="stat-trend-label">{trendLabel}</span>}
          {subtitle && <span className="stat-subtitle">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
