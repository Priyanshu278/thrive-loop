import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CheckInModal } from '../components/domain/CheckInModal';
import { MetricAnalyticsModal } from '../components/domain/MetricAnalyticsModal';
import { HabitRescueModal } from '../components/domain/HabitRescueModal';
import { WearableSyncModal } from '../components/domain/WearableSyncModal';
import {
  Footprints,
  Flame,
  Moon,
  Users,
  CheckCircle2,
  Circle,
  ArrowRight,
  TrendingUp,
  Award,
  Calendar,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Droplets,
  Activity,
  Heart,
  Smile,
  Zap,
  Lightbulb,
  Watch,
  Radio
} from 'lucide-react';

import { getMemberAvatar, handleAvatarError } from '../utils/avatars';

// role="button" rows are focusable, so Enter and Space have to activate them
// the way a real <button> would — otherwise the keyboard path is dead.
function onRowKeyActivate(e, activate) {
  if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
    e.preventDefault();
    activate();
  }
}

export function Home({ data, onRefresh, onNavigate }) {
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [activeMetricModal, setActiveMetricModal] = useState(null); // 'steps' | 'active' | 'sleep' | null
  const [isRescueOpen, setIsRescueOpen] = useState(false);
  const [isWatchSyncOpen, setIsWatchSyncOpen] = useState(false);
  const [metricTab, setMetricTab] = useState('steps');
  const [activeDayIdx, setActiveDayIdx] = useState(3);
  const [centerView, setCenterView] = useState('rings'); // 'rings' | 'trend'

  const calendarDays = [
    { d: 'Mon', n: '28' },
    { d: 'Tue', n: '29' },
    { d: 'Wed', n: '30' },
    { d: 'Thu', n: '1' },
    { d: 'Fri', n: '2' },
    { d: 'Sat', n: '3' },
    { d: 'Sun', n: '4' }
  ];

  // Interactive daily habit checklist state
  const [habits, setHabits] = useState([
    { id: 1, title: 'Take a 10-min walk after lunch', icon: Footprints, completed: true, color: '#10B981' },
    { id: 2, title: 'Do a 2-min stretch break', icon: Activity, completed: false, color: '#3B82F6' },
    { id: 3, title: 'Stay hydrated (Drink 8 glasses)', icon: Droplets, completed: true, color: '#06B6D4' },
    { id: 4, title: 'Be in bed by 11 PM', icon: Moon, completed: false, color: '#8B5CF6' },
  ]);

  function toggleHabit(id) {
    setHabits(habits.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  }

  const completedCount = habits.filter(h => h.completed).length;
  const habitPct = Math.round((completedCount / habits.length) * 100);

  const userName = data.me?.name || 'Alex';
  const firstName = userName.split(' ')[0] || 'Alex';

  // Metrics from data or master references
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayData = data.week?.metrics?.find((m) => m.date === todayStr);

  const currentSteps = todayData?.steps || 7240;
  const stepGoal = data.week?.goal || 8000;
  const stepsPct = Math.min(100, Math.round((currentSteps / stepGoal) * 100));

  const activeMinActual = todayData?.activeMinutes || 18;
  const activeMinGoal = 30;
  const activeMinPct = Math.min(100, Math.round((activeMinActual / activeMinGoal) * 100));

  const sleepActual = todayData?.sleepHours || 7.8;
  const sleepGoal = 8;
  const sleepPct = Math.min(100, Math.round((sleepActual / sleepGoal) * 100));
  const sleepHours = todayData?.sleepHours ? `${Math.round(todayData.sleepHours * 10) / 10} h` : '7.8 h';

  const overallRingsPct = Math.round((stepsPct + activeMinPct + sleepPct) / 3);

  // Build 7-day rolling window from real metrics or fallback
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklySteps = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const ds = d.toISOString().slice(0, 10);
    const dayLabel = daysOfWeek[d.getDay()];
    const isToday = i === 6;
    const found = data.week?.metrics?.find((m) => m.date === ds);
    const stepsVal = found ? found.steps : (isToday ? currentSteps : Math.round(5500 + ((i * 730) % 2500)));
    return {
      day: dayLabel,
      val: Number((stepsVal / 1000).toFixed(1)),
      actual: stepsVal >= 1000 ? `${(stepsVal / 1000).toFixed(1)}K` : `${stepsVal}`,
      isToday,
      isReal: !!found,
    };
  });

  return (
    <div className="home-screen-layout">
      {/* 1. TOP HERO GREETING BANNER */}
      <section className="home-master-hero">
        <div className="hero-landscape-bg">
          <img
            src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1600&q=80"
            alt="Sunny morning wellness runner"
            className="hero-landscape-img"
          />
          <div className="hero-gradient-overlay" />
        </div>

        <div className="hero-landscape-content">
          <div className="hero-headline-group">
            <h1 className="hero-title">
              Good morning, {firstName} 👋
            </h1>
            <p className="hero-subtitle">
              Small steps today. A healthier tomorrow.
            </p>
            <div className="hero-highlight-phrase">
              A healthier you builds a brighter tomorrow.
            </div>
            <p className="hero-tagline-text">
              Better Habits, Brighter Days.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="hero-primary-cta"
                onClick={() => setIsCheckInOpen(true)}
              >
                Start Today →
              </button>

              <button
                type="button"
                onClick={() => setIsWatchSyncOpen(true)}
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#0F172A',
                  border: '1px solid #CBD5E1',
                  padding: '11px 18px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                  transition: 'all 0.15s ease'
                }}
              >
                <Watch size={16} style={{ color: '#10B981' }} />
                <span>⌚ Sync Smartwatch</span>
              </button>
            </div>
          </div>

          {/* Quick Floating Telemetry Cards Inside Hero */}
          <div className="hero-metrics-quad">
            <div className="hero-metric-pill" onClick={() => setActiveMetricModal('steps')}>
              <div className="hero-metric-icon-wrap" style={{ background: '#ECFDF5', color: '#10B981' }}>
                <Footprints size={18} />
              </div>
              <div className="hero-metric-info">
                <div className="hero-metric-num">{currentSteps.toLocaleString()}</div>
                <div className="hero-metric-lbl">of {stepGoal.toLocaleString()} steps</div>
                <div className="hero-metric-bar">
                  <div className="hero-bar-fill green" style={{ width: `${stepsPct}%` }} />
                </div>
              </div>
              <span className="hero-metric-pct">{stepsPct}%</span>
            </div>

            <div className="hero-metric-pill" onClick={() => setActiveMetricModal('active')}>
              <div className="hero-metric-icon-wrap" style={{ background: '#FFF7ED', color: '#F97316' }}>
                <Flame size={18} />
              </div>
              <div className="hero-metric-info">
                <div className="hero-metric-num">{activeMinActual} min</div>
                <div className="hero-metric-lbl">of {activeMinGoal} min active</div>
                <div className="hero-metric-bar">
                  <div className="hero-bar-fill orange" style={{ width: `${activeMinPct}%` }} />
                </div>
              </div>
              <span className="hero-metric-pct">{activeMinPct}%</span>
            </div>

            <div className="hero-metric-pill" onClick={() => setActiveMetricModal('sleep')}>
              <div className="hero-metric-icon-wrap" style={{ background: '#F5F3FF', color: '#8B5CF6' }}>
                <Moon size={18} />
              </div>
              <div className="hero-metric-info">
                <div className="hero-metric-num">{sleepHours}</div>
                <div className="hero-metric-lbl">of {sleepGoal} h sleep</div>
                <div className="hero-metric-bar">
                  <div className="hero-bar-fill purple" style={{ width: `${sleepPct}%` }} />
                </div>
              </div>
              <span className="hero-metric-pct">{sleepPct}%</span>
            </div>

            <div className="hero-metric-quote-pill" onClick={() => onNavigate('rescue')} style={{ cursor: 'pointer' }}>
              <div className="quote-mark-icon">“</div>
              <div className="quote-text-wrap">
                <strong>Progress, not perfection.</strong>
                <span>Open Habit Rescue</span>
              </div>
              <ArrowRight size={14} className="quote-arrow-icon" />
            </div>
          </div>
        </div>

        {/* Hero Right Widget: Calendar + Daily Plan Box */}
        <div className="hero-calendar-widget">
          <div className="calendar-widget-header">
            <div className="calendar-date-title">
              <Calendar size={15} style={{ color: '#10B981' }} />
              <span>Oct {calendarDays[activeDayIdx]?.n || '1'}, 2026</span>
            </div>
            <div className="calendar-nav-arrows">
              <button
                type="button"
                className="cal-arrow-btn"
                onClick={() => setActiveDayIdx((prev) => Math.max(0, prev - 1))}
                title="Previous day"
              >
                <ChevronLeft size={13} />
              </button>
              <button
                type="button"
                className="cal-arrow-btn"
                onClick={() => setActiveDayIdx((prev) => Math.min(calendarDays.length - 1, prev + 1))}
                title="Next day"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>

          <div className="calendar-days-row">
            {calendarDays.map((day, idx) => (
              <div
                key={idx}
                className={`calendar-day-col ${activeDayIdx === idx ? 'today-active' : ''}`}
                onClick={() => setActiveDayIdx(idx)}
                style={{ cursor: 'pointer' }}
                title={`Select ${day.d} Oct ${day.n}`}
              >
                <span className="cal-day-name">{day.d}</span>
                <span className="cal-day-num">{day.n}</span>
              </div>
            ))}
          </div>

          <div className="daily-goals-summary-box">
            <div className="goals-summary-text">
              <CheckCircle2 size={16} style={{ color: '#10B981' }} />
              <span><strong>{completedCount} of {habits.length} daily goals</strong> completed</span>
              <strong className="summary-pct-label">{habitPct}%</strong>
            </div>
            <div className="goals-summary-progress">
              <div className="goals-progress-fill" style={{ width: `${habitPct}%` }} />
            </div>
            <button
              type="button"
              className="view-plan-btn"
              onClick={() => onNavigate('challenge')}
            >
              View Today's Plan →
            </button>
          </div>
        </div>
      </section>

      {/* 2. MIDDLE 3-COLUMN MASTER ROW: TODAY'S FOCUS | WEEKLY PROGRESS | MOTIVATION & UPCOMING */}
      <section className="home-tri-column-grid">
        {/* Left Column: Today's Focus Checklist */}
        <Card className="home-focus-card">
          <div className="card-top-header">
            <div>
              <div className="card-badge-line">
                <div className="badge-dot-green" />
                <h2 className="card-main-title">Today's Focus</h2>
              </div>
              <p className="card-sub-description">
                Complete your priority habits and feel the difference.
              </p>
            </div>
          </div>

          <div className="habits-checklist-list">
            {habits.map((h) => {
              const Icon = h.icon;
              return (
                <div
                  key={h.id}
                  className={`habit-row-item ${h.completed ? 'completed' : ''}`}
                  onClick={() => toggleHabit(h.id)}
                >
                  <div className="habit-icon-box" style={{ background: `${h.color}18`, color: h.color }}>
                    <Icon size={17} />
                  </div>
                  <span className="habit-title-text">{h.title}</span>
                  <div className="habit-check-control">
                    {h.completed ? (
                      <CheckCircle2 size={20} className="check-done" />
                    ) : (
                      <Circle size={20} className="check-pending" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Center Column: Weekly Progress Chart & Apple Fitness Concentric Rings */}
        <Card className="home-weekly-chart-card">
          <div className="card-top-header">
            <div>
              <div className="card-badge-line">
                <Activity size={18} style={{ color: '#10B981' }} />
                <h2 className="card-main-title">{centerView === 'rings' ? "Today's Vitality Rings" : "Weekly Progress"}</h2>
              </div>
              <span className="chart-target-legend">
                {centerView === 'rings' ? 'Concentric daily completion' : '--- Target: 8,400'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'inline-flex', background: '#F1F5F9', padding: '2px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <button
                  type="button"
                  onClick={() => setCenterView('rings')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    background: centerView === 'rings' ? '#10B981' : 'transparent',
                    color: centerView === 'rings' ? '#FFFFFF' : '#475569',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  🎯 Rings
                </button>
                <button
                  type="button"
                  onClick={() => setCenterView('trend')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    background: centerView === 'trend' ? '#10B981' : 'transparent',
                    color: centerView === 'trend' ? '#FFFFFF' : '#475569',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  📊 7-Day
                </button>
              </div>

              {centerView === 'trend' && (
                <div className="chart-metric-select-wrap">
                  <select
                    value={metricTab}
                    onChange={(e) => setMetricTab(e.target.value)}
                    className="chart-metric-select"
                  >
                    <option value="steps">Steps</option>
                    <option value="minutes">Active Minutes</option>
                    <option value="sleep">Sleep (Hours)</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* VIEW 1: CONCENTRIC APPLE FITNESS / WHOOP STYLE RINGS */}
          {centerView === 'rings' ? (
            <div className="concentric-rings-card-wrap">
              <div className="concentric-svg-box">
                <svg width="140" height="140" viewBox="0 0 140 140">
                  {/* Background tracks */}
                  <circle cx="70" cy="70" r="56" fill="none" stroke="#E2E8F0" strokeWidth="9" />
                  <circle cx="70" cy="70" r="42" fill="none" stroke="#E2E8F0" strokeWidth="9" />
                  <circle cx="70" cy="70" r="28" fill="none" stroke="#E2E8F0" strokeWidth="9" />

                  {/* Outer Ring: Steps (Emerald) */}
                  <circle
                    cx="70"
                    cy="70"
                    r="56"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="9"
                    strokeDasharray="351.86"
                    strokeDashoffset={351.86 * (1 - Math.min(1, stepsPct / 100))}
                    strokeLinecap="round"
                    transform="rotate(-90 70 70)"
                    style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                  />

                  {/* Middle Ring: Active Energy (Coral/Amber) */}
                  <circle
                    cx="70"
                    cy="70"
                    r="42"
                    fill="none"
                    stroke="#F97316"
                    strokeWidth="9"
                    strokeDasharray="263.89"
                    strokeDashoffset={263.89 * (1 - Math.min(1, activeMinPct / 100))}
                    strokeLinecap="round"
                    transform="rotate(-90 70 70)"
                    style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                  />

                  {/* Inner Ring: Restorative Sleep (Violet) */}
                  <circle
                    cx="70"
                    cy="70"
                    r="28"
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="9"
                    strokeDasharray="175.93"
                    strokeDashoffset={175.93 * (1 - Math.min(1, sleepPct / 100))}
                    strokeLinecap="round"
                    transform="rotate(-90 70 70)"
                    style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                  />

                  {/* Center Label */}
                  <text x="70" y="66" textAnchor="middle" fontSize="15" fontWeight="800" fill="#0F172A">
                    {overallRingsPct}%
                  </text>
                  <text x="70" y="79" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#64748B" letterSpacing="0.05em">
                    SYNC
                  </text>
                </svg>
              </div>

              <div className="concentric-metrics-breakdown">
                <div className="ring-breakdown-row" onClick={() => setActiveMetricModal('steps')} style={{ cursor: 'pointer' }}>
                  <div className="ring-legend-label">
                    <span className="ring-dot-indicator" style={{ background: '#10B981' }} />
                    <span>Daily Steps</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="ring-stat-val-text">{currentSteps.toLocaleString()} / {stepGoal.toLocaleString()}</span>
                    <span className="ring-pct-badge" style={{ background: '#ECFDF5', color: '#065F46' }}>{stepsPct}%</span>
                  </div>
                </div>

                <div className="ring-breakdown-row" onClick={() => setActiveMetricModal('active')} style={{ cursor: 'pointer' }}>
                  <div className="ring-legend-label">
                    <span className="ring-dot-indicator" style={{ background: '#F97316' }} />
                    <span>Active Minutes</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="ring-stat-val-text">{activeMinActual} / {activeMinGoal} min</span>
                    <span className="ring-pct-badge" style={{ background: '#FFF7ED', color: '#9A3412' }}>{activeMinPct}%</span>
                  </div>
                </div>

                <div className="ring-breakdown-row" onClick={() => setActiveMetricModal('sleep')} style={{ cursor: 'pointer' }}>
                  <div className="ring-legend-label">
                    <span className="ring-dot-indicator" style={{ background: '#8B5CF6' }} />
                    <span>Restful Sleep</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="ring-stat-val-text">{sleepActual} / {sleepGoal} hrs</span>
                    <span className="ring-pct-badge" style={{ background: '#F5F3FF', color: '#5B21B6' }}>{sleepPct}%</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* VIEW 2: 7-DAY PROGRESSION BARS */
            <div className="weekly-bars-container">
              <div className="target-dashed-line" />
              <div className="bars-align-row">
                {weeklySteps.map((item, idx) => (
                  <div key={idx} className="weekly-bar-column">
                    <span className="bar-top-value">{item.actual}</span>
                    <div
                      className={`bar-green-pillar ${item.isToday ? 'today-pillar' : ''}`}
                      style={{ height: `${(item.val / 10) * 100}%` }}
                    />
                    <span className="bar-day-name">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3 Metric Summary Boxes under Chart */}
          <div className="weekly-sub-triplet">
            <div className="sub-stat-box">
              <div className="sub-stat-icon-wrap" style={{ background: '#FFF7ED', color: '#F97316' }}>
                <Flame size={17} />
              </div>
              <div>
                <span className="sub-stat-label">Streak</span>
                <strong className="sub-stat-val">14 days</strong>
                <span className="sub-stat-hint">Keep it going!</span>
              </div>
            </div>

            <div className="sub-stat-box">
              <div className="sub-stat-icon-wrap" style={{ background: '#ECFDF5', color: '#10B981' }}>
                <Sparkles size={17} />
              </div>
              <div>
                <span className="sub-stat-label">Wellness Score</span>
                <strong className="sub-stat-val">82/100</strong>
                <span className="sub-stat-hint text-success">↑ 12% optimal</span>
              </div>
            </div>

            <div className="sub-stat-box">
              <div className="sub-stat-icon-wrap" style={{ background: '#EFF6FF', color: '#3B82F6' }}>
                <Users size={17} />
              </div>
              <div>
                <span className="sub-stat-label">Team Rhythm</span>
                <strong className="sub-stat-val">84%</strong>
                <span className="sub-stat-hint">Active Together</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Right Column: Motivation Card + Upcoming Challenges + Your Team Snapshot */}
        <div className="home-side-widgets-column">
          {/* Motivation Tile */}
          <div className="motivation-leaf-tile">
            <div className="motivation-quote-icon">“</div>
            <div className="motivation-text-wrap">
              <span className="motivation-eyebrow">Today's Motivation</span>
              <p className="motivation-quote">
                “Small changes create big results.”
              </p>
            </div>
            <div className="motivation-leaf-svg">
              <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
                <path d="M24 44C24 44 24 24 24 16C24 8 16 4 16 4C16 4 16 14 18 20C20 26 24 44 24 44Z" fill="#10B981" fillOpacity="0.8"/>
                <path d="M24 44C24 44 24 26 26 20C28 14 34 6 34 6C34 6 32 14 30 20C28 26 24 44 24 44Z" fill="#059669" fillOpacity="0.6"/>
              </svg>
            </div>
          </div>

          {/* Upcoming Challenges Tile */}
          <Card className="upcoming-challenges-card">
            <div className="widget-header-row">
              <div className="widget-title-group">
                <Award size={16} style={{ color: '#F59E0B' }} />
                <h3 className="widget-title">Upcoming Challenges</h3>
              </div>
              <button type="button" className="widget-view-link" onClick={() => onNavigate('challenge')}>
                View All →
              </button>
            </div>

            <div className="challenges-mini-list">
              <div className="challenge-mini-item">
                <div className="mini-icon-circle green">
                  <Activity size={15} />
                </div>
                <div className="mini-challenge-info">
                  <strong>Mindful Week</strong>
                  <span>Oct 8 – Oct 14, 2026</span>
                </div>
                <button type="button" className="mini-join-btn" onClick={() => onNavigate('challenge')}>
                  Join
                </button>
              </div>

              <div className="challenge-mini-item">
                <div className="mini-icon-circle teal">
                  <Footprints size={15} />
                </div>
                <div className="mini-challenge-info">
                  <strong>Step Together</strong>
                  <span>Oct 15 – Oct 21, 2026</span>
                </div>
                <button type="button" className="mini-join-btn" onClick={() => onNavigate('challenge')}>
                  Join
                </button>
              </div>
            </div>
          </Card>

          {/* Your Team Quick Card */}
          <Card className="team-quick-card" onClick={() => onNavigate('team')}>
            <div className="widget-header-row">
              <div className="widget-title-group">
                <Users size={16} style={{ color: '#10B981' }} />
                <h3 className="widget-title">Your Team</h3>
              </div>
              <button
                type="button"
                className="widget-view-link"
                onClick={() => onNavigate('team')}
              >
                View All →
              </button>
            </div>

            <div className="team-avatars-row">
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <img
                  key={idx}
                  src={getMemberAvatar(idx)}
                  alt={`Team member ${idx + 1}`}
                  className="avatar-micro"
                  onError={(e) => handleAvatarError(e, `M${idx + 1}`)}
                />
              ))}
              <div className="avatar-overflow-badge">+3</div>
            </div>

            <div className="team-participation-bar-group">
              <div className="participation-labels">
                <span>7 of 8 members were active this week</span>
                <strong className="text-success">84%</strong>
              </div>
              <div className="participation-track">
                <div className="participation-fill" style={{ width: '84%' }} />
              </div>
            </div>

            <div
              className="team-cheer-banner"
              onClick={(e) => { e.stopPropagation(); onNavigate('team'); }}
              style={{ cursor: 'pointer' }}
              title="Click to view Team Squad"
            >
              <span className="team-cheer-quote">“A healthier team is a happier team.”</span>
            </div>
          </Card>
        </div>
      </section>

      {/* 3. BOTTOM ROW: RECOMMENDED FOR YOU & INSIGHTS FOR YOU */}
      <section className="home-bottom-recommendations-grid">
        {/* Recommended for You Cards */}
        <Card className="recommendations-card">
          <div className="widget-header-row">
            <div className="widget-title-group">
              <Sparkles size={17} style={{ color: '#F59E0B' }} />
              <h2 className="card-main-title">Recommended for You</h2>
            </div>
            <button type="button" className="widget-view-link" onClick={() => onNavigate('challenge')}>
              View All →
            </button>
          </div>

          <div className="recommendations-cards-row">
            <div className="recommendation-item-card" onClick={() => onNavigate('challenge')}>
              <div className="rec-image-wrap">
                <img
                  src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=500&q=80"
                  alt="Outdoor morning jogging trail"
                  className="rec-img"
                />
                <span className="rec-badge-tag popular">● Popular</span>
              </div>
              <div className="rec-body">
                <h4 className="rec-title">Step Up Challenge</h4>
                <p className="rec-desc">7-day team activity momentum builder</p>
                <div className="rec-footer">
                  <div className="rec-social-avatars">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80" alt="user" />
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&q=80" alt="user" />
                    <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=60&q=80" alt="user" />
                    <span>1.2K joined</span>
                  </div>
                  <div className="rec-action-arrow" aria-hidden="true">→</div>
                </div>
              </div>
            </div>

            <div className="recommendation-item-card" onClick={() => onNavigate('challenge')}>
              <div className="rec-image-wrap">
                <img
                  src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=500&q=80"
                  alt="Mindful meditation morning"
                  className="rec-img"
                />
                <span className="rec-badge-tag new">● New</span>
              </div>
              <div className="rec-body">
                <h4 className="rec-title">Mindful Mornings</h4>
                <p className="rec-desc">Build a calmer, focused start to your day</p>
                <div className="rec-footer">
                  <div className="rec-social-avatars">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=60&q=80" alt="user" />
                    <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=60&q=80" alt="user" />
                    <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=60&q=80" alt="user" />
                    <span>858 joined</span>
                  </div>
                  <div className="rec-action-arrow" aria-hidden="true">→</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Insights for You List */}
        <Card className="insights-card">
          <div className="widget-header-row">
            <div className="widget-title-group">
              <Lightbulb size={17} style={{ color: '#10B981' }} />
              <h2 className="card-main-title">Insights for You</h2>
            </div>
            <button
              type="button"
              className="widget-subtitle-pill as-button"
              onClick={() => setActiveMetricModal('steps')}
              title="Click to view weekly telemetry"
            >
              This Week ▾
            </button>
          </div>

          <div className="insights-vertical-list">
            <div
              className="insight-row-item"
              style={{ cursor: 'pointer' }}
              onClick={() => setActiveMetricModal('steps')}
              onKeyDown={(e) => onRowKeyActivate(e, () => setActiveMetricModal('steps'))}
              title="Click to view Steps analytics"
              role="button"
              tabIndex={0}
            >
              <div className="insight-icon-square green">
                <Footprints size={17} />
              </div>
              <div className="insight-text-col">
                <strong>Your step count is 18% higher</strong>
                <span>than last week across all working days.</span>
              </div>
              <ChevronRight size={16} className="insight-chevron" />
            </div>

            <div
              className="insight-row-item"
              style={{ cursor: 'pointer' }}
              onClick={() => setActiveMetricModal('sleep')}
              onKeyDown={(e) => onRowKeyActivate(e, () => setActiveMetricModal('sleep'))}
              title="Click to view Sleep analytics"
              role="button"
              tabIndex={0}
            >
              <div className="insight-icon-square purple">
                <Moon size={17} />
              </div>
              <div className="insight-text-col">
                <strong>Your sleep improved by 42 minutes</strong>
                <span>on average following the light recovery walk.</span>
              </div>
              <ChevronRight size={16} className="insight-chevron" />
            </div>

            <div
              className="insight-row-item"
              style={{ cursor: 'pointer' }}
              onClick={() => setActiveMetricModal('active')}
              onKeyDown={(e) => onRowKeyActivate(e, () => setActiveMetricModal('active'))}
              title="Click to view Activity analytics"
              role="button"
              tabIndex={0}
            >
              <div className="insight-icon-square yellow">
                <Zap size={17} />
              </div>
              <div className="insight-text-col">
                <strong>You're most active on Tuesdays</strong>
                <span>Great mid-week rhythm — keep it up!</span>
              </div>
              <ChevronRight size={16} className="insight-chevron" />
            </div>
          </div>
        </Card>
      </section>

      {/* Modals for Check-in & Habit Rescue */}
      <CheckInModal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        currentToday={todayData}
        onSaved={onRefresh}
      />

      <MetricAnalyticsModal
        isOpen={!!activeMetricModal}
        onClose={() => setActiveMetricModal(null)}
        metricType={activeMetricModal || 'steps'}
        data={{
          steps: currentSteps,
          stepGoal,
          activeMinutes: activeMinActual,
          activeMinGoal,
          sleepHours: sleepActual,
          sleepGoal,
        }}
      />

      <HabitRescueModal
        isOpen={isRescueOpen}
        onClose={() => setIsRescueOpen(false)}
        rescueData={{
          originalGoal: stepGoal,
          reducedGoal: 2000,
          id: data.rescue?.id || 'rescue-1'
        }}
        onGoalAccepted={onRefresh}
      />

      <WearableSyncModal
        isOpen={isWatchSyncOpen}
        onClose={() => setIsWatchSyncOpen(false)}
        onSyncComplete={onRefresh}
      />
    </div>
  );
}
