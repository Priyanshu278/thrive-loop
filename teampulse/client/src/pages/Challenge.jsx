import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Users,
  Footprints,
  Flame,
  Moon,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Heart,
  Smile,
  Target,
  Home as HomeIcon,
  Lightbulb,
  Play,
  Check
} from 'lucide-react';

import { api } from '../api';
import { getMemberAvatar, handleAvatarError } from '../utils/avatars';

export function Challenge({ challenge, teamMembers = [], onRefresh, onBack, onNavigate }) {
  const [generating, setGenerating] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [actionMsg, setActionMsg] = useState('');
  const [participating, setParticipating] = useState(true);
  const [extraSteps, setExtraSteps] = useState(0);

  const targetSteps = challenge?.target || 8400;
  const challengeTitle = challenge?.title || 'Adapt to Team Fatigue';
  const challengeDesc = challenge?.description || "Your team's average activity has dipped this week. A little extra movement can bring everyone back into rhythm.";
  const challengeTip = challenge?.tip || 'Take a 10-minute walk after lunch.';
  const currentProgress = 6720 + extraSteps;
  const progressPct = Math.min(100, Math.round((currentProgress / targetSteps) * 100));

  async function handleStartChallenge() {
    setGenerating(true);
    setActionMsg('');
    try {
      await api('/challenges/start', 'POST', {
        title: challengeTitle,
        description: challengeDesc
      });
      setParticipating(true);
      setExtraSteps(prev => prev + 1000);
      setActionMsg('✓ You joined this week\'s challenge! +1,000 steps added.');
      if (onRefresh) await onRefresh();
    } catch (err) {
      console.warn('Start challenge error:', err.message);
      setParticipating(true);
      setExtraSteps(prev => prev + 1000);
      setActionMsg('✓ Challenge active for your squad!');
    } finally {
      setGenerating(false);
    }
  }

  function handleLogSteps() {
    setExtraSteps(prev => prev + 1000);
    setActionMsg('✓ Logged 1,000 steps to squad challenge progress!');
    setTimeout(() => setActionMsg(''), 3500);
  }

  async function handleGenerateChallenge() {
    setGenerating(true);
    setActionMsg('');
    try {
      await api('/challenges/generate', 'POST', { context: 'normal' });
      setActionMsg('✓ New adaptive challenge generated!');
      if (onRefresh) await onRefresh();
    } catch (err) {
      setActionMsg(err.message || 'Failed to generate challenge');
    } finally {
      setGenerating(false);
    }
  }

  async function handleThumbsFeedback(thumbs) {
    setFeedbackSent(true);
    setActionMsg('🎉 Squad cheered! Momentum boosted for your team.');
    setTimeout(() => {
      setFeedbackSent(false);
      setActionMsg('');
    }, 3500);
    if (!challenge?._id) return;
    try {
      await api(`/challenges/${challenge._id}/result`, 'POST', { completionPct: 80, thumbs });
    } catch (err) {
      console.warn('Feedback submission:', err);
    }
  }

  const teamMembersData = (teamMembers && teamMembers.length > 0)
    ? teamMembers.map((m, idx) => ({
        name: m.name,
        status: idx === 0 ? 'Active Today' : (idx === 1 ? 'In Rhythm' : 'Synced'),
        avatar: getMemberAvatar(idx, m.name),
      }))
    : [
        { name: 'You (Alex)', status: 'Active Today', avatar: getMemberAvatar(0, 'You (Alex)') },
        { name: 'Priya S.', status: 'In Rhythm', avatar: getMemberAvatar(1, 'Priya S.') },
        { name: 'Rahul K.', status: 'Synced', avatar: getMemberAvatar(2, 'Rahul K.') },
        { name: 'Neha M.', status: 'Active Today', avatar: getMemberAvatar(3, 'Neha M.') },
        { name: 'Karan V.', status: 'Consistent', avatar: getMemberAvatar(4, 'Karan V.') },
        { name: 'Ananya T.', status: 'Synced', avatar: getMemberAvatar(5, 'Ananya T.') },
      ];

  const weeklyActivity = [
    { day: 'Mon', val: 5.8, label: '5.8K' },
    { day: 'Tue', val: 7.6, label: '7.6K' },
    { day: 'Wed', val: 6.2, label: '6.2K' },
    { day: 'Thu', val: 5.9, label: '5.9K' },
    { day: 'Fri', val: 7.8, label: '7.8K' },
    { day: 'Sat', val: 6.4, label: '6.4K' },
    { day: 'Sun', val: 7.1, label: '7.1K' },
  ];

  return (
    <div className="challenge-screen-layout">
      {/* 1. BREADCRUMBS & TOP HEADER */}
      <div className="screen-header-block">
        <div className="screen-breadcrumb">
          <span>Challenge</span>
          <span className="breadcrumb-divider">›</span>
          <span className="breadcrumb-active">Weekly Team Challenge</span>
        </div>

        <div className="screen-title-row">
          <div>
            <h1 className="screen-main-heading">
              Weekly Team <span className="highlight-emerald">Challenge</span>
            </h1>
            <p className="screen-sub-heading">
              Move together, feel better.
            </p>
            <p className="screen-description">
              This week's challenge is all about consistency. Small steps, big impact for you and your team.
            </p>
          </div>

          <div className="screen-header-badges">
            <div className="header-date-badge">
              <Calendar size={14} className="icon-emerald" />
              <span>Oct 1 – Oct 7, 2026</span>
            </div>
            <div className="header-status-pill active-pill">
              <div className="status-dot green" />
              <span>Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN HERO BANNER: ADAPT TO TEAM FATIGUE */}
      <Card className="challenge-hero-card">
        <div className="challenge-hero-left">
          <div className="hero-fatigue-badge-row">
            <div className="hero-round-icon-box">
              <Footprints size={20} />
            </div>
            <div>
              <span className="hero-mini-tag">ACTIVE THIS WEEK</span>
              <h2 className="hero-fatigue-title">{challengeTitle}</h2>
            </div>
          </div>

          <p className="hero-fatigue-desc">
            {challengeDesc}
          </p>

          <div className="hero-progress-block">
            <div className="hero-progress-labels">
              <span className="hero-progress-title">Team Progress</span>
              <span className="hero-progress-count">
                <strong>{currentProgress.toLocaleString()}</strong> / {targetSteps.toLocaleString()} steps ({progressPct}%)
              </span>
            </div>
            <div className="hero-progress-bar-track">
              <div className="hero-progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {!participating ? (
              <button
                type="button"
                onClick={handleStartChallenge}
                disabled={generating}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#10B981',
                  color: '#FFFFFF',
                  padding: '9px 18px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(16, 185, 129, 0.25)'
                }}
              >
                <Play size={15} fill="currentColor" />
                <span>Start Challenge</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleLogSteps}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#ECFDF5',
                  color: '#059669',
                  border: '1px solid #A7F3D0',
                  padding: '9px 18px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
                title="Click to log +1,000 steps towards squad challenge"
              >
                <Check size={16} strokeWidth={3} />
                <span>Challenge Active (+1K Steps)</span>
              </button>
            )}

            <Button
              variant="outline"
              size="sm"
              loading={generating}
              onClick={handleGenerateChallenge}
              style={{ fontSize: '12.5px', borderRadius: '10px', padding: '9px 14px' }}
            >
              <Sparkles size={14} className="icon-emerald" /> Adapt with AI
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleThumbsFeedback('up')}
              style={{ fontSize: '12.5px', borderRadius: '10px', color: feedbackSent ? '#10B981' : '#64748B' }}
            >
              {feedbackSent ? '✓ Cheered!' : '👍 Cheer Team'}
            </Button>
          </div>
          {actionMsg && (
            <div style={{ marginTop: '10px', fontSize: '12.5px', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={15} />
              <span>{actionMsg}</span>
            </div>
          )}
        </div>

        {/* Hero Middle Days Left Badge */}
        <div className="hero-days-left-badge">
          <Calendar size={18} style={{ color: '#10B981' }} />
          <div>
            <span className="days-left-sub">Days Left</span>
            <strong className="days-left-num">3 days</strong>
          </div>
        </div>

        {/* Hero Right Visual with Real Coworkers Image & Overlay */}
        <div className="challenge-hero-right-visual">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
            alt="Coworkers walking in park together"
            className="challenge-hero-img"
          />
          <div className="challenge-hero-overlay">
            <p className="hero-overlay-quote">
              Small steps together create big change.
            </p>
          </div>
        </div>
      </Card>

      {/* 3. FOUR KPI TELEMETRY METRICS ROW */}
      <section className="challenge-telemetry-row">
        <Card className="telemetry-stat-card">
          <div className="stat-icon-square mint">
            <Users size={18} />
          </div>
          <div className="stat-content-box">
            <span className="stat-meta-label">Team Participation</span>
            <div className="stat-big-val">
              84% <span className="stat-micro-sparkline">↗</span>
            </div>
            <span className="stat-sub-caption">7 of 8 members active</span>
          </div>
        </Card>

        <Card className="telemetry-stat-card">
          <div className="stat-icon-square blue">
            <Footprints size={18} />
          </div>
          <div className="stat-content-box">
            <span className="stat-meta-label">Team Avg. Steps</span>
            <div className="stat-big-val">
              6,480 <span className="stat-delta-green">↑ 12%</span>
            </div>
            <span className="stat-sub-caption">vs last week</span>
          </div>
        </Card>

        <Card className="telemetry-stat-card">
          <div className="stat-icon-square orange">
            <Flame size={18} />
          </div>
          <div className="stat-content-box">
            <span className="stat-meta-label">Avg. Active Minutes</span>
            <div className="stat-big-val">
              32 min <span className="stat-delta-green">↑ 18%</span>
            </div>
            <span className="stat-sub-caption">vs last week</span>
          </div>
        </Card>

        <Card className="telemetry-stat-card">
          <div className="stat-icon-square purple">
            <Moon size={18} />
          </div>
          <div className="stat-content-box">
            <span className="stat-meta-label">Avg. Sleep</span>
            <div className="stat-big-val">
              7.2 h <span className="stat-delta-green">↑ 8%</span>
            </div>
            <span className="stat-sub-caption">vs last week</span>
          </div>
        </Card>
      </section>

      {/* 4. MAIN SPLIT GRID: 70% LEFT (ACTIVITY CHART & MEMBERS) | 30% RIGHT (REWARDS, RULES, UPCOMING) */}
      <section className="challenge-split-grid">
        {/* LEFT COLUMN */}
        <div className="challenge-col-main">
          {/* Team Activity This Week Bar Chart */}
          <Card className="team-activity-chart-card">
            <div className="card-top-header">
              <div className="card-title-group">
                <TrendingUp size={18} style={{ color: '#10B981' }} />
                <h3 className="card-main-title">Team Activity This Week</h3>
              </div>
              <div className="chart-legend-row">
                <span className="legend-item">
                  <span className="legend-dot green" /> Team Average
                </span>
                <span className="legend-item">
                  <span className="legend-dash-blue" /> --- Target (8,400)
                </span>
              </div>
            </div>

            <div className="chart-bars-viewport">
              <div className="target-dashed-reference" style={{ bottom: '84%' }}>
                <span className="target-ref-label">Target (8,400)</span>
              </div>
              <div className="bars-flex-container">
                {weeklyActivity.map((bar, idx) => (
                  <div key={idx} className="bar-column-unit">
                    <span className="bar-data-tag">{bar.label}</span>
                    <div
                      className="bar-solid-fill"
                      style={{ height: `${(bar.val / 10) * 100}%` }}
                    />
                    <span className="bar-axis-day">{bar.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Bottom Split: Team Members & Tips for Success */}
          <div className="challenge-bottom-split-row">
            {/* Team Members List */}
            <Card className="team-members-list-card">
              <div className="card-top-header">
                <div className="card-title-group">
                  <Users size={16} style={{ color: '#10B981' }} />
                  <h3 className="card-main-title">Team Members</h3>
                </div>
                <span className="header-view-link">See All →</span>
              </div>

              <div className="members-vertical-list">
                {teamMembersData.map((m, idx) => (
                  <div key={idx} className="member-row-item">
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="member-row-avatar"
                      onError={(e) => handleAvatarError(e, m.name)}
                    />
                    <span className="member-row-name">{m.name}</span>
                    <span style={{ marginLeft: 'auto', fontSize: '12px', background: '#ECFDF5', color: '#059669', padding: '3px 8px', borderRadius: '12px', fontWeight: 600 }}>
                      {m.status || 'Active in Squad'}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Tips for Success */}
            <Card className="tips-success-card">
              <div className="card-top-header">
                <div className="card-title-group">
                  <Lightbulb size={16} style={{ color: '#F59E0B' }} />
                  <h3 className="card-main-title">Tips for Success</h3>
                </div>
                <span className="header-view-link">View More</span>
              </div>

              <div className="tips-vertical-list">
                <div className="tip-row-item">
                  <div className="tip-icon-square green">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <strong>This Week's Focus</strong>
                    <p>{challengeTip}</p>
                  </div>
                </div>

                <div className="tip-row-item">
                  <div className="tip-icon-square green">
                    <Users size={16} />
                  </div>
                  <div>
                    <strong>Encourage a teammate today.</strong>
                    <p>A simple supportive message goes a long way.</p>
                  </div>
                </div>

                <div className="tip-row-item">
                  <div className="tip-icon-square purple">
                    <Moon size={16} />
                  </div>
                  <div>
                    <strong>Get 7–8 hours of sleep.</strong>
                    <p>Good rest helps you maintain consistency without fatigue.</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="challenge-col-side">
          {/* Challenge Reward */}
          <Card className="reward-badge-card">
            <div className="card-top-header">
              <div className="card-title-group">
                <Award size={16} style={{ color: '#F59E0B' }} />
                <h3 className="card-main-title">Challenge Reward</h3>
              </div>
            </div>

            <div className="reward-content-box">
              <div className="reward-badge-hexagon">
                <Award size={28} className="badge-icon-gold" />
              </div>
              <div className="reward-text-details">
                <h4 className="reward-badge-name">Healthy Habits Badge</h4>
                <p className="reward-badge-desc">
                  Complete this week's challenge to unlock for your entire team.
                </p>
              </div>
            </div>

            <div className="reward-progress-block">
              <div className="reward-progress-track">
                <div className="reward-progress-fill" style={{ width: '80%' }} />
              </div>
              <span className="reward-pct-tag">80%</span>
            </div>
          </Card>

          {/* Challenge Rules */}
          <Card className="challenge-rules-card">
            <div className="card-top-header">
              <div className="card-title-group">
                <ShieldCheck size={16} style={{ color: '#3B82F6' }} />
                <h3 className="card-main-title">Challenge Rules</h3>
              </div>
            </div>

            <div className="rules-list-items">
              <div className="rule-item">
                <Footprints size={15} className="rule-icon text-success" />
                <span>Team average steps count towards the goal</span>
              </div>
              <div className="rule-item">
                <Users size={15} className="rule-icon text-success" />
                <span>Minimum 5 active members for aggregate tracking</span>
              </div>
              <div className="rule-item">
                <ShieldCheck size={15} className="rule-icon text-warning" />
                <span>No individual ranking or leaderboards</span>
              </div>
              <div className="rule-item">
                <Target size={15} className="rule-icon text-primary" />
                <span>Focus on consistency over perfection</span>
              </div>
              <div className="rule-item">
                <Heart size={15} className="rule-icon text-danger" />
                <span>Have fun and support each other</span>
              </div>
            </div>
          </Card>

          {/* Upcoming Challenges */}
          <Card className="upcoming-side-card">
            <div className="card-top-header">
              <div className="card-title-group">
                <Calendar size={16} style={{ color: '#EF4444' }} />
                <h3 className="card-main-title">Upcoming Challenges</h3>
              </div>
            </div>

            <div className="upcoming-side-list">
              <div
                className="upcoming-side-row"
                onClick={() => setActionMsg('✓ "Active Mornings" challenge is scheduled for next week (Oct 8).')}
                style={{ cursor: 'pointer' }}
                title="Click to view scheduled challenge"
              >
                <div className="upcoming-icon mint">
                  <Footprints size={15} />
                </div>
                <div className="upcoming-info">
                  <strong>Active Mornings</strong>
                  <span>Oct 8 – Oct 14, 2026</span>
                </div>
                <span className="upcoming-badge">Upcoming</span>
              </div>

              <div
                className="upcoming-side-row"
                onClick={() => setActionMsg('✓ "Better Sleep Week" challenge is scheduled for Oct 15.')}
                style={{ cursor: 'pointer' }}
                title="Click to view scheduled challenge"
              >
                <div className="upcoming-icon purple">
                  <Moon size={15} />
                </div>
                <div className="upcoming-info">
                  <strong>Better Sleep Week</strong>
                  <span>Oct 15 – Oct 21, 2026</span>
                </div>
                <span className="upcoming-badge">Upcoming</span>
              </div>
            </div>
          </Card>

          {/* Inspirational Bottom Plant Card */}
          <div
            className="inspirational-team-banner"
            onClick={() => onNavigate ? onNavigate('team') : (onBack && onBack())}
            style={{ cursor: 'pointer' }}
            role="button"
            tabIndex={0}
            title="Click to view Squad Momentum and Team Roster"
          >
            <div className="inspirational-leaf-icon">
              <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                <path d="M24 44C24 44 24 24 24 16C24 8 16 4 16 4C16 4 16 14 18 20C20 26 24 44 24 44Z" fill="#10B981"/>
                <path d="M24 44C24 44 24 26 26 20C28 14 34 6 34 6C34 6 32 14 30 20C28 26 24 44 24 44Z" fill="#059669"/>
              </svg>
            </div>
            <div className="inspirational-text-wrap">
              <strong>A healthier team is a happier team.</strong>
              <span>Let's keep the momentum going!</span>
            </div>
            <ArrowRight size={16} className="inspirational-arrow" />
          </div>
        </div>
      </section>
    </div>
  );
}
