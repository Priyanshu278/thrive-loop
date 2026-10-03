import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import {
  Users,
  Footprints,
  Flame,
  Moon,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Award,
  ArrowRight,
  Clock,
  Sparkles,
  ChevronDown,
  Target,
  Smile,
  ShieldCheck,
  Zap,
  Activity,
  Copy,
  Check,
  Sprout
} from 'lucide-react';
import { getMemberAvatar, handleAvatarError } from '../utils/avatars';

export function Team({ data, onNavigate }) {
  const [copied, setCopied] = useState(false);
  const teamName = data.team?.team?.name || 'Product & Design Squad';
  const inviteCode = data.team?.team?.inviteCode || 'K3F9QZ';
  const realMembers = data.team?.members || [];

  function copyCode() {
    navigator.clipboard?.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const teamMembers = realMembers.length > 0
    ? realMembers.map((m, idx) => ({
        name: m.name,
        status: idx === 0 ? 'Active in Squad' : (idx === 1 ? 'In Rhythm' : 'Synced'),
        avatar: getMemberAvatar(idx, m.name),
      }))
    : [
        { name: 'You (Alex)', status: 'Active in Squad', avatar: getMemberAvatar(0, 'You (Alex)') },
        { name: 'Priya S.', status: 'In Rhythm', avatar: getMemberAvatar(1, 'Priya S.') },
        { name: 'Rahul K.', status: 'Synced', avatar: getMemberAvatar(2, 'Rahul K.') },
        { name: 'Neha M.', status: 'Active Today', avatar: getMemberAvatar(3, 'Neha M.') },
        { name: 'Karan V.', status: 'Consistent', avatar: getMemberAvatar(4, 'Karan V.') },
        { name: 'Ananya T.', status: 'Synced', avatar: getMemberAvatar(5, 'Ananya T.') },
      ];

  const recentFeed = [
    { name: 'Priya S.', action: "completed today's goal", time: '2h ago', icon: Footprints, color: '#10B981' },
    { name: 'Rahul K.', action: 'joined a 10-min walk', time: '4h ago', icon: Activity, color: '#3B82F6' },
    { name: 'Neha M.', action: 'improved sleep by 45 min', time: '6h ago', icon: Moon, color: '#8B5CF6' },
    { name: 'Karan V.', action: 'completed 5-day streak', time: '1d ago', icon: Flame, color: '#F97316' },
    { name: 'Ananya T.', action: 'joined the team', time: '1d ago', icon: Users, color: '#F59E0B' },
    { name: 'Team', action: 'reached 80% of weekly goal', time: '1d ago', icon: Award, color: '#10B981' },
  ];

  return (
    <div className="team-screen-layout">
      {/* 1. BREADCRUMBS & TOP HEADER */}
      <div className="screen-header-block">
        <div className="screen-breadcrumb">
          <span>Team</span>
          <span className="breadcrumb-divider">›</span>
          <span className="breadcrumb-active">Team Overview</span>
        </div>

        <div className="screen-title-row">
          <div>
            <h1 className="screen-main-heading">Team</h1>
            <p className="screen-sub-heading">
              Move together, grow together.
            </p>
            <p className="screen-description">
              Team activity creates accountability, support and better daily rhythms for everyone.
            </p>
          </div>

          <div className="screen-header-badges">
            <div className="header-date-badge">
              <Calendar size={14} className="icon-emerald" />
              <span>Oct 1 – Oct 7, 2026</span>
            </div>
            <div className="header-filter-pill">
              <span>This Week</span>
              <ChevronDown size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* 2. TEAM MOMENTUM HERO BANNER (BALANCED 58/42 DESKTOP SPLIT) */}
      <Card className="team-momentum-hero-card">
        <div className="team-hero-left">
          <div className="team-momentum-badge-row">
            <div className="team-round-icon-box">
              <Users size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h2 className="team-momentum-title">{teamName}</h2>
                {inviteCode && (
                  <button
                    type="button"
                    onClick={copyCode}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      padding: '3px 10px',
                      borderRadius: '12px',
                      background: '#ECFDF5',
                      color: '#059669',
                      border: '1px solid #A7F3D0',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    title="Click to copy team invite code"
                  >
                    {copied ? <Check size={12} strokeWidth={2.5} /> : <Copy size={12} />}
                    <span>Invite: {inviteCode}</span>
                  </button>
                )}
              </div>
              <p className="team-momentum-desc">
                {realMembers.length > 0 ? realMembers.length : 8} active teammates building healthy daily momentum together.
              </p>
            </div>
          </div>

          <div className="team-momentum-progress-wrap">
            <div className="momentum-stats-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={14} style={{ color: '#10B981' }} />
                <span>Team Participation (Privacy Safe K ≥ 5)</span>
              </div>
              <strong className="text-success">84%</strong>
            </div>
            <div className="momentum-progress-track">
              <div className="momentum-progress-fill" style={{ width: '84%' }} />
            </div>
          </div>
        </div>

        {/* Hero Right Visual: Authentic Collaborative Photography */}
        <div className="team-hero-right-visual">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
            alt="Collaborative teammates in modern daylight workspace"
            className="team-hero-img"
          />
          <div className="team-hero-quote-pill">
            <Sprout size={16} className="text-success" />
            <span>“Together we build sustainable rhythms.”</span>
          </div>
        </div>
      </Card>

      {/* 3. FOUR KPI TELEMETRY CARDS (CLEAR METRIC HIERARCHY) */}
      <section className="team-telemetry-row">
        {/* Primary Metric Card: Team Avg Steps */}
        <Card className="telemetry-stat-card primary-stat-highlight">
          <div className="stat-icon-square mint">
            <Footprints size={18} />
          </div>
          <div className="stat-content-box">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <span className="stat-meta-label">Team Avg. Steps</span>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '1px 6px', borderRadius: '8px' }}>
                PRIMARY
              </span>
            </div>
            <div className="stat-big-val">
              6,480 <span className="stat-delta-green">↑ 12%</span>
            </div>
            <span className="stat-sub-caption">vs last week (Goal: 8,400)</span>
          </div>
        </Card>

        {/* Supporting Metric: Active Minutes */}
        <Card className="telemetry-stat-card">
          <div className="stat-icon-square orange">
            <Flame size={18} />
          </div>
          <div className="stat-content-box">
            <span className="stat-meta-label">Avg. Active Minutes</span>
            <div className="stat-big-val">
              32 min <span className="stat-delta-green">↑ 18%</span>
            </div>
            <span className="stat-sub-caption">vs 27 min baseline</span>
          </div>
        </Card>

        {/* Supporting Metric: Sleep Hours */}
        <Card className="telemetry-stat-card">
          <div className="stat-icon-square purple">
            <Moon size={18} />
          </div>
          <div className="stat-content-box">
            <span className="stat-meta-label">Avg. Sleep Duration</span>
            <div className="stat-big-val">
              7.2 h <span className="stat-delta-green">↑ 8%</span>
            </div>
            <span className="stat-sub-caption">balanced team recovery</span>
          </div>
        </Card>

        {/* Supporting Metric: Active Members */}
        <Card className="telemetry-stat-card">
          <div className="stat-icon-square blue">
            <Users size={18} />
          </div>
          <div className="stat-content-box">
            <span className="stat-meta-label">Active Members</span>
            <div className="stat-big-val">
              7 <span className="stat-target-divider">/ 8</span>
            </div>
            <span className="stat-sub-caption">87.5% weekly sync rate</span>
          </div>
        </Card>
      </section>

      {/* 4. MAIN SPLIT GRID: LEFT (ACTIVITY TREND + MEMBERS + FEED) | RIGHT (INSIGHTS, CHALLENGES, GOALS) */}
      <section className="team-split-grid">
        {/* LEFT COLUMN: ACTIVITY TREND (VISUALLY DOMINANT) & BOTTOM SPLIT */}
        <div className="team-col-main">
          {/* Team Activity Trend Chart (Expanded & Visually Dominant) */}
          <Card className="team-activity-trend-card">
            <div className="card-top-header">
              <div className="card-title-group">
                <TrendingUp size={18} style={{ color: '#10B981' }} />
                <div>
                  <h3 className="card-main-title">Team Activity Trend</h3>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
                    Daily step distribution across the squad (Target: 8,400 steps)
                  </p>
                </div>
              </div>
              <div className="chart-legend-row">
                <span className="legend-item">
                  <span className="legend-dot green" /> Squad Average
                </span>
                <span className="legend-item">
                  <span className="legend-dash-blue" /> Target Line (8.4K)
                </span>
              </div>
            </div>

            {/* Top Summary Chip Bar */}
            <div style={{ display: 'flex', gap: '12px', margin: '14px 0 8px', padding: '10px 14px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #F1F5F9' }}>
              <div style={{ fontSize: '12px', color: '#475569' }}>
                Weekly Daily Average: <strong style={{ color: '#0F172A' }}>7,014 steps</strong>
              </div>
              <div style={{ color: '#CBD5E1' }}>•</div>
              <div style={{ fontSize: '12px', color: '#475569' }}>
                Peak Day: <strong style={{ color: '#059669' }}>Friday (8,400 steps)</strong>
              </div>
              <div style={{ color: '#CBD5E1' }}>•</div>
              <div style={{ fontSize: '12px', color: '#475569' }}>
                Goal Attainment: <strong style={{ color: '#2563EB' }}>83.5%</strong>
              </div>
            </div>

            <div className="trend-bars-viewport">
              <div className="trend-target-line" />
              <div className="trend-bars-row">
                {[
                  { d: 'Mon', h: 65, v: '6.5K', isPeak: false },
                  { d: 'Tue', h: 80, v: '8.0K', isPeak: false },
                  { d: 'Wed', h: 68, v: '6.8K', isPeak: false },
                  { d: 'Thu', h: 62, v: '6.2K', isPeak: false },
                  { d: 'Fri', h: 92, v: '8.4K', isPeak: true },
                  { d: 'Sat', h: 58, v: '5.8K', isPeak: false },
                  { d: 'Sun', h: 72, v: '7.2K', isPeak: false },
                ].map((b, idx) => (
                  <div key={idx} className="trend-bar-column">
                    <span className={`trend-bar-val ${b.isPeak ? 'text-emerald' : ''}`}>{b.v}</span>
                    <div
                      className={`trend-bar-pillar ${b.isPeak ? 'peak-pillar' : ''}`}
                      style={{ height: `${b.h}%` }}
                    />
                    <span className="trend-bar-day">{b.d}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Bottom Split: Team Members & Recent Team Activity */}
          <div className="team-bottom-split-row">
            {/* Team Members List */}
            <Card className="team-members-card">
              <div className="card-top-header">
                <div className="card-title-group">
                  <Users size={16} style={{ color: '#10B981' }} />
                  <h3 className="card-main-title">Squad Roster</h3>
                </div>
                <span className="header-badge-count">{teamMembers.length} Active</span>
              </div>

              <div className="team-members-scroll-list">
                {teamMembers.map((m, idx) => (
                  <div key={idx} className="team-member-item">
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="member-avatar-img"
                      onError={(e) => handleAvatarError(e, m.name)}
                    />
                    <span className="member-display-name">{m.name}</span>
                    <span style={{ marginLeft: 'auto', fontSize: '11.5px', background: '#ECFDF5', color: '#059669', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
                      {m.status || 'Active in Squad'}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Team Activity Feed */}
            <Card className="team-recent-activity-card">
              <div className="card-top-header">
                <div className="card-title-group">
                  <Activity size={16} style={{ color: '#3B82F6' }} />
                  <h3 className="card-main-title">Recent Squad Activity</h3>
                </div>
                <span className="header-badge-count">Live</span>
              </div>

              <div className="team-feed-list">
                {recentFeed.map((f, idx) => {
                  const Icon = f.icon;
                  return (
                    <div key={idx} className="team-feed-item">
                      <div className="feed-icon-circle" style={{ background: `${f.color}15`, color: f.color }}>
                        <Icon size={14} />
                      </div>
                      <div className="feed-text-col">
                        <span className="feed-text-line">
                          <strong>{f.name}</strong> {f.action}
                        </span>
                        <span className="feed-time-label">{f.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>

        {/* RIGHT COLUMN: MEANINGFUL TEAM INSIGHTS & GOALS */}
        <div className="team-col-side">
          {/* Team Insights (Rich, Meaningful Secondary Panel) */}
          <Card className="team-insights-card">
            <div className="card-top-header">
              <div className="card-title-group">
                <Sparkles size={16} style={{ color: '#10B981' }} />
                <h3 className="card-main-title">Team Insights</h3>
              </div>
              <span className="header-sub-tag">AI Analysis</span>
            </div>

            <div className="insights-vertical-stack">
              <div className="insight-stat-item">
                <div className="insight-icon-square green">
                  <Footprints size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <strong className="insight-big-highlight">+12% Step Momentum</strong>
                    <span style={{ fontSize: '11px', color: '#059669', fontWeight: 600 }}>Optimal</span>
                  </div>
                  <p className="insight-text">
                    Lunchtime walking syncs between 12:00 PM – 2:00 PM contributed to 42% of this week's progress.
                  </p>
                </div>
              </div>

              <div className="insight-stat-item">
                <div className="insight-icon-square purple">
                  <Moon size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <strong className="insight-big-highlight">7.2h Sleep Baseline</strong>
                    <span style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: 600 }}>Restored</span>
                  </div>
                  <p className="insight-text">
                    Consistent sleep cycles across the squad reduced estimated fatigue indicators by 18%.
                  </p>
                </div>
              </div>

              <div className="insight-stat-item">
                <div className="insight-icon-square mint">
                  <Target size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <strong className="insight-big-highlight">84% Squad Participation</strong>
                    <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 600 }}>High Sync</span>
                  </div>
                  <p className="insight-text">
                    7 of 8 members reached their individual consistency milestones 4+ days this week.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Active Squad Challenge */}
          <Card className="team-challenges-side-card">
            <div className="card-top-header">
              <div className="card-title-group">
                <Award size={16} style={{ color: '#F59E0B' }} />
                <h3 className="card-main-title">Squad Challenge</h3>
              </div>
              <span className="side-chal-badge">Active</span>
            </div>

            <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', marginTop: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Footprints size={16} />
                </div>
                <div>
                  <strong style={{ fontSize: '13px', color: '#0F172A', display: 'block' }}>Walk Together This Week</strong>
                  <span style={{ fontSize: '11.5px', color: '#64748B' }}>Target: 50,000 Collective Steps</span>
                </div>
              </div>
              <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: '80%', height: '100%', background: '#10B981', borderRadius: '6px' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '11px', color: '#64748B' }}>
                <span>40,320 completed</span>
                <strong style={{ color: '#059669' }}>80% reached</strong>
              </div>
            </div>
          </Card>

          {/* Privacy & Psychological Safety Pill */}
          <div style={{ padding: '14px 16px', background: '#F0FDF4', border: '1px solid #DCFCE7', borderRadius: '14px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <ShieldCheck size={18} style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ fontSize: '12.5px', color: '#065F46', display: 'block' }}>Zero Public Leaderboards</strong>
              <p style={{ fontSize: '11.5px', color: '#047857', margin: '2px 0 0 0', lineHeight: 1.4 }}>
                Squad activity focuses on mutual momentum. Individual rankings are never displayed to peers or managers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
