import React, { useState } from 'react';
import { Card } from '../ui/Card';

export function HRTrendCharts({ weekData = [] }) {
  const [activeStepPoint, setActiveStepPoint] = useState(null);
  const [activeSleepPoint, setActiveSleepPoint] = useState(null);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const stepsData = [7200, 7800, 8400, 8100, 8900, 8240, 8600];
  const sleepData = [6.8, 7.2, 7.0, 7.5, 6.9, 7.1, 7.4];

  // SVG dimensions
  const width = 420;
  const height = 150;
  const padX = 35;
  const padY = 25;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;

  // Scales
  const minSteps = 4000;
  const maxSteps = 12000;
  const stepPoints = stepsData.map((val, idx) => {
    const x = padX + (idx / (stepsData.length - 1)) * chartW;
    const y = padY + chartH - ((val - minSteps) / (maxSteps - minSteps)) * chartH;
    return { x, y, val, day: days[idx] };
  });

  const minSleep = 5.0;
  const maxSleep = 9.0;
  const sleepPoints = sleepData.map((val, idx) => {
    const x = padX + (idx / (sleepData.length - 1)) * chartW;
    const y = padY + chartH - ((val - minSleep) / (maxSleep - minSleep)) * chartH;
    return { x, y, val, day: days[idx] };
  });

  const stepPathD = stepPoints.reduce(
    (acc, pt, i) => (i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`),
    ''
  );
  const stepAreaD = `${stepPathD} L ${stepPoints[stepPoints.length - 1].x},${height - padY} L ${stepPoints[0].x},${height - padY} Z`;

  const sleepPathD = sleepPoints.reduce(
    (acc, pt, i) => (i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`),
    ''
  );
  const sleepAreaD = `${sleepPathD} L ${sleepPoints[sleepPoints.length - 1].x},${height - padY} L ${sleepPoints[0].x},${height - padY} Z`;

  return (
    <div className="hr-charts-grid">
      <Card className="chart-card">
        <div className="chart-header">
          <div>
            <h3 className="chart-title">Steps trend</h3>
            <span className="chart-subtitle">Avg. daily steps</span>
          </div>
          {activeStepPoint && (
            <span className="chart-active-stat text-primary">
              {activeStepPoint.day}: {activeStepPoint.val.toLocaleString()}
            </span>
          )}
        </div>
        <div className="svg-chart-container">
          <svg viewBox={`0 0 ${width} ${height}`} className="svg-chart">
            <defs>
              <linearGradient id="stepsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 0.5, 1].map((pct, i) => {
              const y = padY + chartH * pct;
              return (
                <line
                  key={i}
                  x1={padX}
                  y1={y}
                  x2={width - padX}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Area & line */}
            <path d={stepAreaD} fill="url(#stepsFill)" />
            <path d={stepPathD} fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />

            {/* Data nodes */}
            {stepPoints.map((pt, i) => (
              <g key={i} onMouseEnter={() => setActiveStepPoint(pt)} onMouseLeave={() => setActiveStepPoint(null)}>
                <circle cx={pt.x} cy={pt.y} r="4" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.5" />
                <text x={pt.x} y={height - 8} textAnchor="middle" className="chart-axis-label">
                  {pt.day}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </Card>

      <Card className="chart-card">
        <div className="chart-header">
          <div>
            <h3 className="chart-title">Sleep trend</h3>
            <span className="chart-subtitle">Avg. sleep hours</span>
          </div>
          {activeSleepPoint && (
            <span className="chart-active-stat text-indigo">
              {activeSleepPoint.day}: {activeSleepPoint.val}h
            </span>
          )}
        </div>
        <div className="svg-chart-container">
          <svg viewBox={`0 0 ${width} ${height}`} className="svg-chart">
            <defs>
              <linearGradient id="sleepFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366F1" stopOpacity="0.20" />
                <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 0.5, 1].map((pct, i) => {
              const y = padY + chartH * pct;
              return (
                <line
                  key={i}
                  x1={padX}
                  y1={y}
                  x2={width - padX}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Area & line */}
            <path d={sleepAreaD} fill="url(#sleepFill)" />
            <path d={sleepPathD} fill="none" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" />

            {/* Data nodes */}
            {sleepPoints.map((pt, i) => (
              <g key={i} onMouseEnter={() => setActiveSleepPoint(pt)} onMouseLeave={() => setActiveSleepPoint(null)}>
                <circle cx={pt.x} cy={pt.y} r="4" fill="#FFFFFF" stroke="#6366F1" strokeWidth="2.5" />
                <text x={pt.x} y={height - 8} textAnchor="middle" className="chart-axis-label">
                  {pt.day}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </Card>
    </div>
  );
}
