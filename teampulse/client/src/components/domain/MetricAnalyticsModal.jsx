import React, { useState, useEffect } from 'react';
import {
  X,
  Footprints,
  Flame,
  Moon,
  Target,
  Flag,
  Trophy,
  Zap,
  Bed,
  Lightbulb,
  Activity,
  Sparkles,
  TrendingUp,
  Award
} from 'lucide-react';

export function MetricAnalyticsModal({
  isOpen,
  onClose,
  metricType = 'steps', // 'steps' | 'active' | 'sleep'
  data = {},
}) {
  const [activeTab, setActiveTab] = useState('today');

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    // Reset to first tab when metric changes or opens
    if (isOpen) {
      setActiveTab('today');
    }
  }, [isOpen, metricType]);

  if (!isOpen) return null;

  // Derived values so the alert copy and "Remaining" row always match the
  // live numbers instead of contradicting them (e.g. goal already exceeded).
  const stepsVal = data.steps || 7240;
  const stepsGoal = data.stepGoal || 8000;
  const stepsRemaining = Math.max(0, stepsGoal - stepsVal);
  const activeVal = data.activeMinutes || 18;
  const activeGoal = data.activeMinGoal || 30;
  const activeRemaining = Math.max(0, activeGoal - activeVal);
  const sleepVal = data.sleepHours || 7.8;
  const sleepGoal = data.sleepGoal || 8;
  const sleepRemainingMin = Math.max(0, Math.round((sleepGoal - sleepVal) * 60));

  // Configurations for each metric
  const configs = {
    steps: {
      title: 'Steps',
      subtitle: 'Your daily movement',
      icon: Footprints,
      color: '#10B981',
      bgLight: '#ECFDF5',
      borderLight: '#A7F3D0',
      badgeColor: '#059669',
      unit: 'steps',
      tabTodayLabel: 'Today',
      currentValue: data.steps || 7240,
      formattedCurrent: (data.steps || 7240).toLocaleString(),
      goal: data.stepGoal || 8000,
      formattedGoal: (data.stepGoal || 8000).toLocaleString() + ' steps',
      pct: Math.min(100, Math.round(((data.steps || 7240) / (data.stepGoal || 8000)) * 100)),
      remaining: stepsRemaining === 0 ? 'Goal met' : stepsRemaining.toLocaleString() + ' steps',
      alertIcon: Trophy,
      alertTitle: stepsRemaining === 0 ? 'Goal smashed!' : 'Great progress!',
      alertDesc: stepsRemaining === 0
        ? "You've hit your daily step goal. Keep the momentum going!"
        : `You're just ${stepsRemaining.toLocaleString()} steps away from your daily goal. Keep going!`,
      trendTitle: 'Step Trend (Last 7 Days)',
      trendData: [
        { day: 'Mon', val: '6.2k', height: 42 },
        { day: 'Tue', val: '7.1k', height: 48 },
        { day: 'Wed', val: '8.0k', height: 56 },
        { day: 'Thu', val: '5.6k', height: 38 },
        { day: 'Fri', val: '7.2k', height: 49 },
        { day: 'Sat', val: '8.1k', height: 58 },
        { day: 'Sun', val: '7.2k', height: 49, isToday: true }
      ],
      tipIcon: Footprints,
      tipBadgeBg: '#E0F2FE',
      tipBadgeColor: '#0284C7',
      tipText: 'Walking regularly can improve heart health, mood and energy levels.'
    },
    active: {
      title: 'Active Minutes',
      subtitle: 'Keep moving, stay energized',
      icon: Flame,
      color: '#F97316',
      bgLight: '#FFF7ED',
      borderLight: '#FED7AA',
      badgeColor: '#EA580C',
      unit: 'minutes',
      tabTodayLabel: 'Today',
      currentValue: data.activeMinutes || 18,
      formattedCurrent: `${data.activeMinutes || 18}`,
      goal: data.activeMinGoal || 30,
      formattedGoal: `${data.activeMinGoal || 30} minutes`,
      pct: Math.min(100, Math.round(((data.activeMinutes || 18) / (data.activeMinGoal || 30)) * 100)),
      remaining: activeRemaining === 0 ? 'Goal met' : `${activeRemaining} minutes`,
      alertIcon: Zap,
      alertTitle: activeRemaining === 0 ? 'Goal hit!' : 'Nice effort!',
      alertDesc: activeRemaining === 0
        ? 'You hit your active minutes goal. A short walk keeps the streak alive.'
        : `You're ${activeRemaining} minutes away from your daily goal. A short walk can help.`,
      trendTitle: 'Active Minutes Trend (Last 7 Days)',
      trendData: [
        { day: 'Mon', val: '12', height: 26 },
        { day: 'Tue', val: '20', height: 40 },
        { day: 'Wed', val: '25', height: 50 },
        { day: 'Thu', val: '18', height: 36 },
        { day: 'Fri', val: '22', height: 44 },
        { day: 'Sat', val: '28', height: 56 },
        { day: 'Sun', val: '18', height: 36, isToday: true }
      ],
      tipIcon: Activity,
      tipBadgeBg: '#FFEDD5',
      tipBadgeColor: '#EA580C',
      tipText: 'Even short bursts of activity can boost focus, mood and overall health.'
    },
    sleep: {
      title: 'Sleep',
      subtitle: 'Better sleep, brighter days',
      icon: Moon,
      color: '#8B5CF6',
      bgLight: '#F5F3FF',
      borderLight: '#DDD6FE',
      badgeColor: '#7C3AED',
      unit: 'hours',
      tabTodayLabel: 'Last Night',
      currentValue: data.sleepHours || 7.8,
      // Round to one decimal: the API returns float32 sleepHours, whose raw
      // String() form (7.800000190734863) would leak into the modal.
      formattedCurrent: `${Math.round((data.sleepHours || 7.8) * 10) / 10}`,
      goal: data.sleepGoal || 8,
      formattedGoal: `${data.sleepGoal || 8} hours`,
      pct: Math.min(100, Math.round(((data.sleepHours || 7.8) / (data.sleepGoal || 8)) * 100)),
      remaining: sleepRemainingMin === 0 ? 'Goal met' : `${sleepRemainingMin} min`,
      alertIcon: Bed,
      alertTitle: 'Great sleep!',
      alertDesc: sleepRemainingMin === 0
        ? 'You hit your sleep goal. A consistent sleep routine helps recovery.'
        : `You're ${sleepRemainingMin} min away from your goal. A consistent sleep routine helps recovery.`,
      trendTitle: 'Sleep Trend (Last 7 Nights)',
      trendData: [
        { day: 'Mon', val: '6.5', height: 44 },
        { day: 'Tue', val: '7.2', height: 49 },
        { day: 'Wed', val: '7.8', height: 53 },
        { day: 'Thu', val: '6.9', height: 47 },
        { day: 'Fri', val: '8.0', height: 56 },
        { day: 'Sat', val: '7.6', height: 51 },
        { day: 'Sun', val: '7.8', height: 53, isToday: true }
      ],
      tipIcon: Lightbulb,
      tipBadgeBg: '#FEF3C7',
      tipBadgeColor: '#D97706',
      tipText: 'Good sleep improves memory, focus and overall well-being.'
    }
  };

  const cfg = configs[metricType] || configs.steps;
  const MetricIcon = cfg.icon;
  const AlertIcon = cfg.alertIcon;
  const TipIcon = cfg.tipIcon;

  // Circular ring calculations
  const radius = 68;
  const strokeWidth = 13;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (cfg.pct / 100) * circumference;

  return (
    <div className="metric-modal-backdrop" onClick={onClose}>
      <div
        className="metric-modal-sheet"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="metric-modal-title"
      >
        {/* Top Handle Bar */}
        <div className="metric-modal-handle" />

        {/* Close 'X' Button */}
        <button
          className="metric-modal-close-btn"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={17} />
        </button>

        {/* Modal Header */}
        <div className="metric-modal-header">
          <div className="metric-modal-icon-badge" style={{ background: cfg.bgLight, color: cfg.color }}>
            <MetricIcon size={24} />
          </div>
          <div className="metric-modal-title-col">
            <h2 id="metric-modal-title" className="metric-modal-title">{cfg.title}</h2>
            <p className="metric-modal-subtitle">{cfg.subtitle}</p>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="metric-modal-tabs-row">
          <button
            type="button"
            className={`metric-tab-item ${activeTab === 'today' ? 'active' : ''}`}
            onClick={() => setActiveTab('today')}
          >
            {cfg.tabTodayLabel}
            {activeTab === 'today' && <span className="tab-active-indicator" />}
          </button>
          <button
            type="button"
            className={`metric-tab-item ${activeTab === 'week' ? 'active' : ''}`}
            onClick={() => setActiveTab('week')}
          >
            This Week
            {activeTab === 'week' && <span className="tab-active-indicator" />}
          </button>
          <button
            type="button"
            className={`metric-tab-item ${activeTab === 'insights' ? 'active' : ''}`}
            onClick={() => setActiveTab('insights')}
          >
            Insights
            {activeTab === 'insights' && <span className="tab-active-indicator" />}
          </button>
        </div>

        {/* TAB 1: TODAY / LAST NIGHT */}
        {activeTab === 'today' && (
          <div className="metric-tab-content">
            {/* Circular Progress Ring */}
            <div className="metric-ring-wrapper">
              <svg className="metric-ring-svg" width="160" height="160" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="none"
                  stroke="#F1F5F9"
                  strokeWidth={strokeWidth}
                />
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="none"
                  stroke={cfg.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transform="rotate(-90 80 80)"
                  style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                />
              </svg>

              <div className="metric-ring-center-info">
                <div className="metric-center-num">{cfg.formattedCurrent}</div>
                <div className="metric-center-sub">of {cfg.goal.toLocaleString()} {cfg.unit}</div>
                <div className="metric-center-pct" style={{ color: cfg.color }}>{cfg.pct}%</div>
              </div>
            </div>

            {/* Goal and Remaining Dual Cards */}
            <div className="metric-dual-stat-cards">
              <div className="metric-stat-box">
                <div className="metric-stat-icon-wrap" style={{ background: '#EFF6FF', color: '#2563EB' }}>
                  <Target size={16} />
                </div>
                <div className="metric-stat-box-content">
                  <span className="metric-stat-lbl">Goal</span>
                  <strong className="metric-stat-val">{cfg.formattedGoal}</strong>
                </div>
              </div>

              <div className="metric-stat-box">
                <div className="metric-stat-icon-wrap" style={{ background: '#FFF1F2', color: '#E11D48' }}>
                  <Flag size={16} />
                </div>
                <div className="metric-stat-box-content">
                  <span className="metric-stat-lbl">Remaining</span>
                  <strong className="metric-stat-val">{cfg.remaining}</strong>
                </div>
              </div>
            </div>

            {/* Alert Banner / Progress Cheer */}
            <div
              className="metric-cheer-banner"
              style={{
                background: cfg.bgLight,
                borderColor: cfg.borderLight
              }}
            >
              <div className="metric-cheer-icon" style={{ color: cfg.color }}>
                <AlertIcon size={20} />
              </div>
              <div className="metric-cheer-text">
                <h4 className="metric-cheer-title" style={{ color: cfg.badgeColor }}>{cfg.alertTitle}</h4>
                <p className="metric-cheer-desc">{cfg.alertDesc}</p>
              </div>
            </div>

            {/* 7-Day Trend Section */}
            <div className="metric-trend-section">
              <h3 className="metric-trend-title">{cfg.trendTitle}</h3>
              <div className="metric-trend-bars-row">
                {cfg.trendData.map((bar, idx) => (
                  <div key={idx} className="metric-trend-col">
                    <span className="metric-bar-top-val">{bar.val}</span>
                    <div className="metric-bar-track">
                      <div
                        className="metric-bar-fill"
                        style={{
                          height: `${bar.height}px`,
                          background: bar.isToday ? cfg.color : `${cfg.color}90`,
                          boxShadow: bar.isToday ? `0 2px 8px ${cfg.color}40` : 'none'
                        }}
                      />
                    </div>
                    <span className={`metric-bar-day-lbl ${bar.isToday ? 'today' : ''}`}>{bar.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Educational Tip Box */}
            <div className="metric-education-card">
              <div className="metric-edu-icon-wrap" style={{ background: cfg.tipBadgeBg, color: cfg.tipBadgeColor }}>
                <TipIcon size={17} />
              </div>
              <p className="metric-edu-text">{cfg.tipText}</p>
            </div>
          </div>
        )}

        {/* TAB 2: THIS WEEK */}
        {activeTab === 'week' && (
          <div className="metric-tab-content">
            <div className="metric-summary-card">
              <div className="metric-summary-header">
                <TrendingUp size={18} style={{ color: cfg.color }} />
                <h4>Weekly Performance Summary</h4>
              </div>
              <div className="metric-summary-metrics-grid">
                <div className="summary-stat-item">
                  <span className="summary-stat-label">Daily Average</span>
                  <strong className="summary-stat-num" style={{ color: cfg.color }}>
                    {metricType === 'steps' ? '7,140' : metricType === 'active' ? '21 min' : '7.4 hrs'}
                  </strong>
                </div>
                <div className="summary-stat-item">
                  <span className="summary-stat-label">Best Day</span>
                  <strong className="summary-stat-num">
                    {metricType === 'steps' ? 'Saturday (8.1k)' : metricType === 'active' ? 'Saturday (28m)' : 'Friday (8.0h)'}
                  </strong>
                </div>
                <div className="summary-stat-item">
                  <span className="summary-stat-label">Goal Hit Rate</span>
                  <strong className="summary-stat-num">5 of 7 Days (71%)</strong>
                </div>
                <div className="summary-stat-item">
                  <span className="summary-stat-label">Weekly Total</span>
                  <strong className="summary-stat-num">
                    {metricType === 'steps' ? '49,980 steps' : metricType === 'active' ? '146 minutes' : '51.8 hours'}
                  </strong>
                </div>
              </div>
            </div>

            <div className="metric-education-card" style={{ marginTop: '16px' }}>
              <div className="metric-edu-icon-wrap" style={{ background: cfg.bgLight, color: cfg.color }}>
                <Award size={17} />
              </div>
              <p className="metric-edu-text">
                {metricType === 'steps'
                  ? 'Consistent daily movement keeps steady baseline metabolism and improves cognitive focus.'
                  : metricType === 'active'
                  ? '150 minutes of weekly moderate activity is the clinical standard for cardio vitality.'
                  : 'Consistent sleep and wake times calibrate your circadian rhythm and deep sleep REM cycles.'}
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: INSIGHTS */}
        {activeTab === 'insights' && (
          <div className="metric-tab-content">
            <div className="metric-insights-list">
              <div className="metric-insight-card">
                <div className="metric-insight-card-icon" style={{ background: '#ECFDF5', color: '#10B981' }}>
                  <Sparkles size={16} />
                </div>
                <div className="metric-insight-card-body">
                  <h5>Peak Performance Window</h5>
                  <p>
                    {metricType === 'steps'
                      ? 'Your highest activity occurs between 11:30 AM and 1:00 PM. A short post-lunch stroll helps avoid the afternoon slump.'
                      : metricType === 'active'
                      ? 'Tuesdays and Saturdays drive your peak heart-rate activity sessions. Great balance across workdays!'
                      : 'You sleep 42 minutes longer following days with 20+ active minutes. Activity directly compounds rest quality.'}
                  </p>
                </div>
              </div>

              <div className="metric-insight-card">
                <div className="metric-insight-card-icon" style={{ background: '#FFF7ED', color: '#F97316' }}>
                  <Activity size={16} />
                </div>
                <div className="metric-insight-card-body">
                  <h5>Squad Momentum Synergy</h5>
                  <p>
                    Your team is currently 84% active this week. Logging your daily rhythms contributes directly to the Acme team challenge badge.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
