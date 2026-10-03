import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { ShieldCheck, Flame, Target, Award } from 'lucide-react';

export function Insights({ week }) {
  const [hoveredDay, setHoveredDay] = useState(null);

  // Fallback realistic 7-day data if new account
  const fallbackDays = [
    { date: '2026-09-27', steps: 6500, sleep: 7.0 },
    { date: '2026-09-28', steps: 8200, sleep: 7.5 },
    { date: '2026-09-29', steps: 9100, sleep: 8.0 },
    { date: '2026-09-30', steps: 7800, sleep: 6.8 },
    { date: '2026-10-01', steps: 8420, sleep: 7.2 },
    { date: '2026-10-02', steps: 8900, sleep: 7.4 },
    { date: '2026-10-03', steps: 8420, sleep: 7.1 },
  ];

  const rawMetrics = week?.metrics?.length ? week.metrics : fallbackDays;
  const goal = week?.goal || 8000;
  const maxSteps = Math.max(goal, ...rawMetrics.map((m) => m.steps));
  const streak = week?.streak ?? 12;

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="page-container">
      <div className="insights-header">
        <div className="eyebrow">YOUR PERSONAL DATA</div>
        <h1 className="page-title">Insights</h1>
        <p className="page-subtitle">Personal consistency patterns over the last 7 days.</p>
      </div>

      <div className="insights-grid">
        {/* 7-Day Steps Bar Chart */}
        <Card className="insights-chart-card">
          <div className="chart-header-row">
            <div>
              <div className="eyebrow">7-DAY STEPS</div>
              <h3 className="card-subheading">Daily rhythm</h3>
            </div>
            {hoveredDay && (
              <span className="hovered-day-stat text-primary">
                {hoveredDay.steps.toLocaleString()} steps
              </span>
            )}
          </div>

          <div className="bars-container">
            <div className="goal-threshold-line" style={{ bottom: `${(goal / maxSteps) * 100}%` }}>
              <span className="goal-threshold-label">Goal ({goal.toLocaleString()})</span>
            </div>

            <div className="bars-track">
              {rawMetrics.map((item, idx) => {
                const heightPct = Math.min(100, Math.max(10, Math.round((item.steps / maxSteps) * 100)));
                const dateObj = new Date(item.date);
                const dayLabel = isNaN(dateObj) ? `D${idx + 1}` : dayNames[dateObj.getDay()];
                const isHit = item.steps >= goal;

                return (
                  <div
                    key={item.date || idx}
                    className="bar-column"
                    onMouseEnter={() => setHoveredDay(item)}
                    onMouseLeave={() => setHoveredDay(null)}
                  >
                    <div className="bar-wrapper">
                      <div
                        className={`bar-fill ${isHit ? 'bar-hit' : 'bar-normal'}`}
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="bar-day-label">{dayLabel}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Streak & Consistency Card */}
        <Card className="streak-stats-card">
          <div className="eyebrow">STREAK HEALTH</div>
          <div className="streak-stat-big">
            <Flame size={32} className="text-warning inline-flame" />
            <span className="big-streak-val">{streak}</span>
            <span className="streak-unit-small">days</span>
          </div>

          <p className="streak-summary-text">
            Consistency is measured by completing {goal.toLocaleString()} steps or accepting a Habit Rescue on lighter days.
          </p>

          <div className="stat-subrow">
            <div className="stat-sub-item">
              <span className="stat-sub-label">Daily goal</span>
              <span className="stat-sub-value">{goal.toLocaleString()} steps</span>
            </div>
            <div className="stat-sub-item">
              <span className="stat-sub-label">Habit rescue</span>
              <span className="stat-sub-value">4,000 steps</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Privacy Guarantee Card */}
      <Card className="privacy-highlight-card">
        <div className="privacy-card-icon">
          <ShieldCheck size={28} className="text-success" />
        </div>
        <div className="privacy-card-content">
          <h3 className="privacy-card-title">Your personal data stays strictly yours.</h3>
          <p className="privacy-card-desc">
            Company HR views only receive differential-privacy blended averages from teams with 5+ members. Your individual day logs and timestamps are never exposed.
          </p>
        </div>
      </Card>
    </div>
  );
}
