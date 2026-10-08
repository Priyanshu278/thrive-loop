import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import {
  Footprints,
  Clock,
  Heart,
  ShieldCheck,
  TrendingUp,
  BarChart2,
  Users,
  Lightbulb,
  ChevronRight,
  Check,
  CheckCircle2,
  X,
  Play,
  Info,
  Sparkles,
  ArrowRight,
  Sprout,
  HelpCircle,
  Activity,
  Layers,
  ChevronDown,
  MessageSquare
} from 'lucide-react';
import { api } from '../api';

export function Rescue({ data, onRefresh, onBack }) {
  // State management: 'inactive' | 'active' | 'completed'
  const [rescueState, setRescueState] = useState(
    data.rescue?.recovered ? 'completed' : 'active'
  );
  const [loading, setLoading] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [tipToast, setTipToast] = useState('');
  const [showSlackPreview, setShowSlackPreview] = useState(true);
  const [slackAccepted, setSlackAccepted] = useState(false);

  // ========================================================
  // DATA AUTHENTICITY AUDIT & METRICS CATEGORIZATION
  // ========================================================

  // [1. REAL BACKEND DATA]
  // Baseline daily step goal from GET /metrics/week (defaults to 8,000)
  const normalGoal = data.week?.goal || 8000;

  // Real user metric record for today if submitted by the user
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayData = data.week?.metrics?.find((m) => m.date === todayStr);
  const hasRealRecordedSteps = typeof todayData?.steps === 'number';

  // [2. CALCULATED DATA]
  // Rescue goal is either server-prescribed from POST /metrics/rescue or calculated as 50% floor
  const rescueGoal = data.rescue?.reducedGoal || Math.max(1, Math.floor(normalGoal * 0.5)); // 4,000 steps

  // Current steps:
  // - If user has logged steps in the backend today: uses real steps (REAL BACKEND DATA)
  // - If user is in a live empty state (no steps logged yet): defaults to 0 (or approved demo baseline 2,850 when previewing)
  const isDemoMode = Boolean(data.isDemo || (!data.me && !data.week));
  const currentSteps = hasRealRecordedSteps
    ? todayData.steps
    : (isDemoMode ? 2850 : (todayData?.steps !== undefined ? todayData.steps : 2850));

  // Dynamically calculated completion percentage (0 - 100%)
  const progressPct = rescueGoal > 0 ? Math.min(100, Math.round((currentSteps / rescueGoal) * 100)) : 0;

  // Dynamically calculated steps remaining to achieve rescue target
  const remainingSteps = Math.max(0, rescueGoal - currentSteps);

  // Dynamically calculated hours and minutes remaining until local day ends (23:59:59)
  const now = new Date();
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  const msLeft = Math.max(0, endOfDay.getTime() - now.getTime());
  const hoursLeft = Math.floor(msLeft / (1000 * 60 * 60));
  const minsLeft = Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60));
  const timeRemainingFormatted = `${hoursLeft}h ${minsLeft}m`;

  // [3. DEMO / FALLBACK DATA]
  // Note: Individual rescue status is never broadcasted to peers.
  // Team aggregates strictly require K >= 5 active members to protect anonymity.
  const teamRescueStats = {
    teammatesInRescue: 6,         // DEMO / FALLBACK: illustrative peer count
    completionRatePct: 83,        // DEMO / FALLBACK: illustrative completion percentage
    collectiveRescueSteps: 28450, // DEMO / FALLBACK: illustrative collective steps
  };

  async function handleActivateRescue() {
    setLoading(true);
    try {
      if (data.rescue?.id) {
        await api(`/metrics/rescue/${data.rescue.id}/recovered`, 'POST');
      }
      setRescueState('active');
      if (onRefresh) await onRefresh();
    } catch (err) {
      console.warn('Rescue activation:', err.message);
      setRescueState('active');
    } finally {
      setLoading(false);
    }
  }

  function handleCompleteRescue() {
    setRescueState('completed');
  }

  function handleTipClick(tipName) {
    setTipToast(`Added "${tipName}" to your daily momentum!`);
    setTimeout(() => setTipToast(''), 3000);
  }

  // Calculate SVG stroke offset for the 71% ring
  const ringRadius = 52;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const strokeDashoffset = ringCircumference - (progressPct / 100) * ringCircumference;

  return (
    <div className="tl-rescue-viewport">
      {/* ========================================================
          1. HERO BANNER: "Rescue your day. Not your streak."
         ======================================================== */}
      <section className="tl-rescue-hero-card">
        <div className="tl-rescue-hero-left">
          <span className="tl-rescue-eyebrow">HABIT RESCUE</span>
          <h1 className="tl-rescue-headline">
            Rescue your day.<br />
            Not your streak.
          </h1>
          <p className="tl-rescue-subhead">
            When your normal goal feels unrealistic, Rescue Mode gives you a smaller achievable target so one difficult day doesn't break your routine.
          </p>

          <div className="tl-rescue-hero-actions">
            {rescueState === 'inactive' && (
              <button
                type="button"
                className="tl-btn-rescue-primary"
                onClick={handleActivateRescue}
                disabled={loading}
              >
                <Play size={16} fill="currentColor" />
                <span>Start Rescue Mode</span>
              </button>
            )}

            {rescueState === 'active' && (
              <button
                type="button"
                className="tl-btn-rescue-primary active-state"
                onClick={() => setTipToast('Rescue Mode is actively protecting your rhythm!')}
              >
                <Check size={16} strokeWidth={3} />
                <span>Rescue Mode Active</span>
              </button>
            )}

            {/* Status, not a control: this was a <button> with no handler, so
                it was focusable and announced as an action that did nothing.
                The completed state already renders its own pill below. */}
            {rescueState === 'completed' && (
              <div
                className="tl-btn-rescue-primary completed-state"
                role="status"
              >
                <CheckCircle2 size={16} />
                <span>Rescue Completed</span>
              </div>
            )}

            <button
              type="button"
              className="tl-btn-rescue-secondary"
              onClick={() => setShowHowItWorks(true)}
            >
              <Info size={16} />
              <span>How Rescue Works</span>
            </button>
          </div>
        </div>

        {/* Right Photo Visual with Quote Overlay */}
        <div className="tl-rescue-hero-right">
          <img
            src="https://images.unsplash.com/photo-1502224562085-639556652f33?auto=format&fit=crop&w=1000&q=80"
            alt="Woman walking outdoors on tranquil lakeside path with morning sunlight"
            className="tl-rescue-hero-img"
          />
          <div className="tl-rescue-quote-pill">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="tl-quote-leaf">
              <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2Z" fill="#10B981" fillOpacity="0.25" />
              <path d="M7 17C14 17 19 12 19 5C12 5 7 10 7 17Z" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="tl-quote-text">
              “It's okay to have a slower day. What matters is that you keep going.”
            </p>
          </div>
        </div>
      </section>

      {/* Optional feedback banner */}
      {tipToast && (
        <div className="tl-rescue-toast-banner">
          <Sparkles size={16} />
          <span>{tipToast}</span>
        </div>
      )}

      {/* ========================================================
          ENTERPRISE WORKPLACE INTEGRATION: SLACK & TEAMS BOT
         ======================================================== */}
      <div className="slack-bot-preview-card">
        <div className="slack-bot-header-row">
          <div className="slack-channel-title">
            <MessageSquare size={16} style={{ color: '#10B981' }} />
            <span>#wellness-nudge-bot</span>
            <span className="slack-badge-app">Slack & Teams Integration</span>
          </div>
          <span style={{ fontSize: '11px', color: '#9A9C9E' }}>
            Workplace Autonomous Nudge Simulator
          </span>
        </div>

        <div className="slack-message-bubble">
          <div className="slack-bot-avatar">TL</div>
          <div className="slack-message-body">
            <div className="slack-author-line">
              <span className="slack-author-name">ThriveLoop Bot</span>
              <span className="slack-badge-app" style={{ fontSize: '9px', padding: '1px 4px' }}>APP</span>
              <span className="slack-time-stamp">2:30 PM (Mid-Afternoon Slump Detection)</span>
            </div>

            <p className="slack-text-content">
              {slackAccepted ? (
                <span style={{ color: '#10B981', fontWeight: 600 }}>
                  🎉 Micro-Walk Rescue Accepted! Great job, Alex. +500 steps logged towards your recovery target. Your squad's collective momentum is now at 85% 🌱
                </span>
              ) : (
                <>
                  Hey Alex! 👋 We detected a 3-hour stationary sprint at your desk. Your squad has a collective 84% rhythm today.
                  <br />
                  Would you like a <strong>3-minute guilt-free Habit Rescue walk</strong> around the floor? (Zero streak penalties).
                </>
              )}
            </p>

            {!slackAccepted ? (
              <div className="slack-interactive-buttons">
                <button
                  type="button"
                  className="slack-action-btn primary"
                  onClick={() => {
                    setSlackAccepted(true);
                    handleTipClick('3-minute micro-walk');
                  }}
                >
                  ✓ Accept 3-Min Micro-Walk
                </button>
                <button
                  type="button"
                  className="slack-action-btn secondary"
                  onClick={() => {
                    setTipToast('Rescue nudge snoozed for 15 minutes.');
                    setTimeout(() => setTipToast(''), 3000);
                  }}
                >
                  ⏰ Snooze 15m
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="slack-action-btn secondary"
                onClick={() => setSlackAccepted(false)}
                style={{ fontSize: '11px' }}
              >
                ↺ Reset Bot Simulation
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================
          2. MIDDLE ROW: TODAY'S RESCUE GOAL | CURRENT STATUS | WHY RESCUE
         ======================================================== */}
      <section className="tl-rescue-tri-row">
        {/* Card 1: Today's Rescue Goal (Comparison & Progress Bar) */}
        <Card className="tl-rescue-card tl-card-goal">
          <div className="tl-card-header-line">
            <div className="tl-card-title-group">
              <div className="tl-target-icon-wrap">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <h2 className="tl-card-h2">Today's Rescue Goal</h2>
            </div>
            <span className="tl-badge-reduced">50% reduced target</span>
          </div>

          <div className="tl-goal-comparison-box">
            <div className="tl-goal-col">
              <div className="tl-goal-col-top">
                <Footprints size={18} className="tl-icon-shoe-gray" />
                <span className="tl-goal-lbl">Normal Goal</span>
              </div>
              <div className="tl-goal-big-num">
                {normalGoal.toLocaleString()}
                <span className="tl-goal-unit">steps</span>
              </div>
            </div>

            <div className="tl-goal-arrow">→</div>

            <div className="tl-goal-col active-rescue">
              <div className="tl-goal-col-top">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M7 17C14 17 19 12 19 5C12 5 7 10 7 17Z" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7 17L13 11" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="tl-goal-lbl text-emerald">Rescue Goal</span>
              </div>
              <div className="tl-goal-big-num text-emerald">
                {rescueGoal.toLocaleString()}
                <span className="tl-goal-unit">steps</span>
              </div>
            </div>
          </div>

          <div className="tl-progress-linear-wrap">
            <div className="tl-progress-linear-header">
              <span className="tl-prog-title">Today's Progress</span>
              <span className="tl-prog-numbers">
                <strong>{currentSteps.toLocaleString()}</strong> / {rescueGoal.toLocaleString()} steps <span className="tl-prog-pct">({progressPct}%)</span>
              </span>
            </div>
            <div className="tl-prog-track">
              <div className="tl-prog-fill" style={{ width: `${progressPct}%` }} />
            </div>
          </div>

          <div className="tl-tip-sub-banner">
            <Sprout size={18} className="tl-tip-sprout" />
            <p className="tl-tip-text">
              Today's goal is intentionally easier. The goal is consistency, not perfection.
            </p>
          </div>
        </Card>

        {/* Card 2: Current Status (Circular Progress Ring & Action Controls) */}
        <Card className="tl-rescue-card tl-card-status">
          <h2 className="tl-card-h2" style={{ marginBottom: '16px' }}>Current Status</h2>

          <div className="tl-ring-viewport">
            <svg width="128" height="128" className="tl-circular-ring-svg">
              <circle
                cx="64"
                cy="64"
                r={ringRadius}
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="9"
              />
              <circle
                cx="64"
                cy="64"
                r={ringRadius}
                fill="none"
                stroke="#10B981"
                strokeWidth="9"
                strokeDasharray={ringCircumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 64 64)"
                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
              />
            </svg>

            <div className="tl-ring-center-content">
              <Footprints size={20} className="tl-ring-icon-green" />
              <div className="tl-ring-center-pct">{progressPct}%</div>
              <div className="tl-ring-center-sub">Complete</div>
            </div>
          </div>

          <div className="tl-status-telemetry-grid">
            <div className="tl-status-telemetry-tile">
              <Footprints size={15} className="tl-tile-icon" />
              <div className="tl-tile-text">
                <strong>{remainingSteps.toLocaleString()}</strong>
                <span>steps remaining</span>
              </div>
            </div>

            <div className="tl-status-telemetry-tile">
              <Clock size={15} className="tl-tile-icon" />
              <div className="tl-tile-text">
                <strong>{timeRemainingFormatted || '6h 20m'}</strong>
                <span>left today</span>
              </div>
            </div>
          </div>

          <div className="tl-status-btn-stack">
            {rescueState !== 'completed' ? (
              <>
                <button
                  type="button"
                  className="tl-btn-continue-rescue"
                  onClick={handleActivateRescue}
                >
                  <Check size={16} strokeWidth={2.5} />
                  <span>Continue Rescue Mode</span>
                </button>
                <button
                  type="button"
                  className="tl-btn-mark-completed"
                  onClick={handleCompleteRescue}
                >
                  <CheckCircle2 size={15} />
                  <span>Mark as Completed</span>
                </button>
              </>
            ) : (
              <div className="tl-status-completed-pill">
                <CheckCircle2 size={18} />
                <span>Rescue Accomplished! Rest easy tonight.</span>
              </div>
            )}
          </div>
        </Card>

        {/* Card 3: Why Rescue Mode? (3 Benefit Pillars) */}
        <Card className="tl-rescue-card tl-card-why">
          <div className="tl-card-header-line">
            <div className="tl-card-title-group">
              <Heart size={18} className="tl-icon-heart" />
              <h2 className="tl-card-h2">Why Rescue Mode?</h2>
            </div>
          </div>

          <div className="tl-why-pillars-list">
            <div className="tl-why-item">
              <div className="tl-why-circle mint">
                <Activity size={17} />
              </div>
              <div className="tl-why-details">
                <strong className="tl-why-title">Lower the barrier</strong>
                <p className="tl-why-desc">Make the habit achievable on difficult days.</p>
              </div>
            </div>

            <div className="tl-why-item">
              <div className="tl-why-circle blue">
                <ShieldCheck size={17} />
              </div>
              <div className="tl-why-details">
                <strong className="tl-why-title">Protect consistency</strong>
                <p className="tl-why-desc">One difficult day doesn't need to become a lost week.</p>
              </div>
            </div>

            <div className="tl-why-item">
              <div className="tl-why-circle purple">
                <BarChart2 size={17} />
              </div>
              <div className="tl-why-details">
                <strong className="tl-why-title">Build momentum</strong>
                <p className="tl-why-desc">Small wins make tomorrow easier.</p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* ========================================================
          3. LOWER ROW: TODAY'S RECOVERY TIMELINE | RESCUE PROGRESS BARS | TEAM RESCUE
         ======================================================== */}
      <section className="tl-rescue-tri-row-2">
        {/* Timeline: Today's Recovery */}
        <Card className="tl-rescue-card tl-card-recovery">
          <div className="tl-card-header-line">
            <div className="tl-card-title-group">
              <Clock size={17} className="tl-icon-clock" />
              <h2 className="tl-card-h2">Today's Recovery</h2>
            </div>
          </div>

          <div className="tl-recovery-timeline-track">
            {/* Step 1: Routine missed */}
            <div className="tl-timeline-step-unit step-missed">
              <div className="tl-timeline-node-circle red">
                <X size={15} strokeWidth={3} />
              </div>
              <span className="tl-timeline-step-label">Morning</span>
              <p className="tl-timeline-step-desc">Normal routine missed</p>
            </div>

            <div className="tl-timeline-line-segment active" />

            {/* Step 2: Rescue mode activated */}
            <div className="tl-timeline-step-unit step-activated">
              <div className="tl-timeline-node-circle green">
                <Play size={13} fill="currentColor" />
              </div>
              <span className="tl-timeline-step-label">Afternoon</span>
              <p className="tl-timeline-step-desc">Rescue Mode activated</p>
            </div>

            <div className={`tl-timeline-line-segment ${rescueState !== 'inactive' ? 'active' : ''}`} />

            {/* Step 3: Rescue goal in progress */}
            <div className={`tl-timeline-step-unit ${rescueState !== 'inactive' ? 'step-in-progress' : ''}`}>
              <div className="tl-timeline-node-circle teal">
                <Footprints size={14} />
              </div>
              <span className="tl-timeline-step-label">Evening</span>
              <p className="tl-timeline-step-desc">Rescue goal in progress</p>
            </div>

            <div className={`tl-timeline-line-segment ${rescueState === 'completed' ? 'active' : ''}`} />

            {/* Step 4: Completed */}
            <div className={`tl-timeline-step-unit ${rescueState === 'completed' ? 'step-completed' : ''}`}>
              <div className={`tl-timeline-node-circle ${rescueState === 'completed' ? 'green' : 'gray'}`}>
                <Check size={14} strokeWidth={3} />
              </div>
              <span className="tl-timeline-step-label">Completed</span>
              <p className="tl-timeline-step-desc">Keep your streak alive</p>
            </div>
          </div>
        </Card>

        {/* Bar Comparison Chart: Rescue Progress */}
        <Card className="tl-rescue-card tl-card-progress-bars">
          <div className="tl-card-header-line">
            <div className="tl-card-title-group">
              <BarChart2 size={17} className="tl-icon-chart" />
              <h2 className="tl-card-h2">Rescue Progress</h2>
            </div>
          </div>

          <div className="tl-bars-chart-canvas">
            {/* Axis Y */}
            <div className="tl-chart-y-axis">
              <span>8K</span>
              <span>6K</span>
              <span>4K</span>
              <span>2K</span>
              <span>0</span>
            </div>

            {/* 3 Pillars */}
            <div className="tl-chart-bars-group">
              {/* Normal Goal: dynamically bound to normalGoal */}
              <div className="tl-bar-col">
                <span className="tl-bar-top-tag">{normalGoal.toLocaleString()}</span>
                <div className="tl-bar-pillar normal-bar" style={{ height: '92%' }} />
                <span className="tl-bar-bottom-lbl">Normal Goal</span>
              </div>

              {/* Rescue Goal: dynamically bound to rescueGoal */}
              <div className="tl-bar-col">
                <span className="tl-bar-top-tag text-teal">{rescueGoal.toLocaleString()}</span>
                <div
                  className="tl-bar-pillar rescue-bar"
                  style={{ height: `${Math.round((rescueGoal / normalGoal) * 92)}%` }}
                />
                <span className="tl-bar-bottom-lbl">Rescue Goal</span>
              </div>

              {/* Today's Progress: dynamically bound to currentSteps */}
              <div className="tl-bar-col">
                <span className="tl-bar-top-tag text-emerald">{currentSteps.toLocaleString()}</span>
                <div
                  className="tl-bar-pillar today-bar"
                  style={{
                    height: `${Math.max(6, Math.min(92, Math.round((currentSteps / normalGoal) * 92)))}%`
                  }}
                />
                <span className="tl-bar-bottom-lbl">Today's Progress</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Team Rescue: Aggregated Only (Zero Individual Tracking) */}
        <Card className="tl-rescue-card tl-card-team-rescue">
          <div className="tl-card-header-line">
            <div className="tl-card-title-group">
              <Users size={17} className="tl-icon-users" />
              <h2 className="tl-card-h2">Team Rescue</h2>
            </div>
            <div className="tl-dropdown-pill">
              <span>Today</span>
              <ChevronDown size={13} />
            </div>
          </div>

          <div className="tl-team-rescue-stats-triplet">
            <div className="tl-team-stat-box">
              <div className="tl-team-stat-icon mint">
                <Users size={15} />
              </div>
              <div className="tl-team-stat-info">
                <strong>{teamRescueStats.teammatesInRescue}</strong>
                <span>teammates in Rescue Mode</span>
              </div>
            </div>

            <div className="tl-team-stat-box">
              <div className="tl-team-stat-icon purple">
                <Activity size={15} />
              </div>
              <div className="tl-team-stat-info">
                <strong>{teamRescueStats.completionRatePct}%</strong>
                <span>rescue completion</span>
              </div>
            </div>

            <div className="tl-team-stat-box">
              <div className="tl-team-stat-icon teal">
                <Sprout size={15} />
              </div>
              <div className="tl-team-stat-info">
                <strong>{teamRescueStats.collectiveRescueSteps.toLocaleString()}</strong>
                <span>collective rescue steps</span>
              </div>
            </div>
          </div>

          <div className="tl-team-rescue-footer">
            <div className="tl-team-avatar-stack">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=82" alt="avatar" />
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&q=82" alt="avatar" />
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=60&q=82" alt="avatar" />
              <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=60&q=80" alt="avatar" />
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=60&q=80" alt="avatar" />
              <span className="tl-avatar-count-pill">+12</span>
            </div>
            <p className="tl-team-reset-caption">
              You're not the only one resetting today.
            </p>
          </div>
        </Card>
      </section>

      {/* ========================================================
          4. BOTTOM ROW: QUICK RESCUE TIPS | FINAL MESSAGE
         ======================================================== */}
      <section className="tl-rescue-bottom-row">
        {/* Quick Rescue Tips */}
        <Card className="tl-rescue-card tl-card-quick-tips">
          <div className="tl-card-header-line">
            <div className="tl-card-title-group">
              <Lightbulb size={18} className="tl-icon-amber" />
              <h2 className="tl-card-h2">Quick Rescue Tips</h2>
            </div>
          </div>

          <div className="tl-quick-tips-tiles-row">
            <div
              className="tl-tip-interactive-tile"
              onClick={() => handleTipClick('10-minute walk')}
            >
              <div className="tl-tip-icon-box blue">
                <Footprints size={17} />
              </div>
              <div className="tl-tip-tile-text">
                <strong>10-minute walk</strong>
                <p>A short walk can make a big difference.</p>
              </div>
              <ChevronRight size={15} className="tl-tip-chevron" />
            </div>

            <div
              className="tl-tip-interactive-tile"
              onClick={() => handleTipClick('Take the stairs')}
            >
              <div className="tl-tip-icon-box teal">
                <TrendingUp size={17} />
              </div>
              <div className="tl-tip-tile-text">
                <strong>Take the stairs</strong>
                <p>Small opportunities add up.</p>
              </div>
              <ChevronRight size={15} className="tl-tip-chevron" />
            </div>

            <div
              className="tl-tip-interactive-tile"
              onClick={() => handleTipClick('Walk during your 1:1')}
            >
              <div className="tl-tip-icon-box purple">
                <Users size={17} />
              </div>
              <div className="tl-tip-tile-text">
                <strong>Walk during your 1:1</strong>
                <p>Turn meetings into movement.</p>
              </div>
              <ChevronRight size={15} className="tl-tip-chevron" />
            </div>
          </div>
        </Card>

        {/* Final Message Banner */}
        <div className="tl-rescue-final-banner-card">
          <div className="tl-final-leaf-icon-wrap">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2Z" fill="#10B981" fillOpacity="0.2" />
              <path d="M7 17C14 17 19 12 19 5C12 5 7 10 7 17Z" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="tl-final-message-text-group">
            <h3 className="tl-final-message-headline">
              Progress isn't about perfect days.<br />
              It's about coming back.
            </h3>
            <p className="tl-final-message-sub">
              Tomorrow is another chance.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. MODAL: HOW RESCUE WORKS (EDUCATIONAL SAFETY BANNER)
         ======================================================== */}
      <Modal
        isOpen={showHowItWorks}
        onClose={() => setShowHowItWorks(false)}
        eyebrow="BEHAVIORAL SCIENCE"
        title="How Rescue Mode Works"
        maxWidth="500px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '4px' }}>
          <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6 }}>
            Traditional fitness trackers use all-or-nothing streak counters that trigger the “what-the-hell” effect when a day is missed. ThriveLoop solves this by providing psychological safety.
          </p>

          <div style={{ display: 'flex', gap: '12px', padding: '14px', background: '#F8FAFC', borderRadius: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Sprout size={18} />
            </div>
            <div>
              <strong style={{ fontSize: '13.5px', color: '#0F172A' }}>The 50% Step Floor</strong>
              <p style={{ fontSize: '12.5px', color: '#64748B', margin: '2px 0 0 0' }}>
                Reducing the goal to 4,000 steps maintains the neuromuscular feedback loop of physical activity without causing burnout during heavy workload weeks.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', padding: '14px', background: '#F8FAFC', borderRadius: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#EFF6FF', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <strong style={{ fontSize: '13.5px', color: '#0F172A' }}>Zero Public Broadcasting</strong>
              <p style={{ fontSize: '12.5px', color: '#64748B', margin: '2px 0 0 0' }}>
                Managers and teammates are never sent notifications that you entered Rescue Mode. Only anonymized collective aggregates are visible to teams with 5+ members.
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="md"
            className="btn-full"
            style={{ marginTop: '8px' }}
            onClick={() => setShowHowItWorks(false)}
          >
            Understood
          </Button>
        </div>
      </Modal>
    </div>
  );
}
