import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  User,
  Footprints,
  Flame,
  Moon,
  Calendar,
  CheckCircle2,
  Check,
  TrendingUp,
  Award,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Mail,
  MapPin,
  Briefcase,
  Edit3,
  Clock,
  Target,
  Bell,
  Smartphone,
  LogOut,
  X
} from 'lucide-react';
import { VERIFIED_AVATARS, getMemberAvatar, handleAvatarError } from '../utils/avatars';

export function Profile({ me, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profileName, setProfileName] = useState(me?.name || 'Alex Morgan');
  const [profileDept, setProfileDept] = useState('Product Team');
  const [profileLocation, setProfileLocation] = useState('Indore, India');
  const [profileAvatarIdx, setProfileAvatarIdx] = useState(0);
  const [savedToast, setSavedToast] = useState(false);

  const userName = profileName;
  const userEmail = me?.email || 'alex@company.com';

  const weeklySteps = [
    { day: 'Mon', h: 60, val: '6.0K' },
    { day: 'Tue', h: 76, val: '7.6K' },
    { day: 'Wed', h: 62, val: '6.2K' },
    { day: 'Thu', h: 59, val: '5.9K' },
    { day: 'Fri', h: 78, val: '7.8K' },
    { day: 'Sat', h: 64, val: '6.4K' },
    { day: 'Sun', h: 71, val: '7.1K' },
  ];

  const recentActivity = [
    { text: "Completed today's step goal", time: '2h ago', icon: Footprints, color: '#10B981' },
    { text: 'Went for a 15-min walk', time: '5h ago', icon: Flame, color: '#3B82F6' },
    { text: 'Logged 7.5 hours of sleep', time: '1d ago', icon: Moon, color: '#8B5CF6' },
    { text: 'Joined the Weekly Team Challenge', time: '2d ago', icon: Award, color: '#F59E0B' },
  ];

  return (
    <div className="profile-screen-layout">
      {/* 1. BREADCRUMBS & TOP HEADER */}
      <div className="screen-header-block">
        <div className="screen-breadcrumb">
          <span>Profile</span>
          <span className="breadcrumb-divider">›</span>
          <span className="breadcrumb-active">My Profile</span>
        </div>

        <div className="screen-title-row">
          <div>
            <h1 className="screen-main-heading">My Profile</h1>
            <p className="screen-sub-heading">
              Your wellness journey, your way.
            </p>
            <p className="screen-description">
              Track your progress, set your preferences, and keep your information secure.
            </p>
          </div>
        </div>
      </div>

      {/* 2. TOP PROFILE HERO CARD */}
      <Card className="profile-master-hero-card">
        <div className="profile-banner-leaf-graphic">
          <span className="profile-leaf-quote">“Small changes create big progress.”</span>
        </div>

        <div className="profile-hero-split-body">
          {/* User Identity Info */}
          <div className="profile-user-left">
            <div className="profile-avatar-wrap">
              <img
                src={getMemberAvatar(profileAvatarIdx, userName)}
                alt={userName}
                className="profile-large-avatar"
                onError={(e) => handleAvatarError(e, userName)}
              />
              <button
                type="button"
                className="avatar-edit-icon"
                title="Change photo"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Edit3 size={13} />
              </button>
            </div>

            <div className="profile-user-details-col">
              <div className="profile-name-badge-line">
                <h2 className="profile-name-text">{userName}</h2>
                <span className="employee-pill">
                  <Check size={11} strokeWidth={3} /> Employee
                </span>
                {savedToast && (
                  <span style={{ fontSize: '11px', color: '#059669', background: '#ECFDF5', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                    Saved ✓
                  </span>
                )}
              </div>

              <div className="profile-meta-email">{userEmail}</div>

              <div className="profile-tags-row">
                <span className="profile-tag-item">
                  <Briefcase size={13} /> {profileDept}
                </span>
                <span className="profile-tag-item">
                  <MapPin size={13} /> {profileLocation}
                </span>
                <span className="profile-tag-item">
                  <Calendar size={13} /> Member since Oct 2026
                </span>
              </div>

              <div className="profile-edit-actions">
                <button
                  type="button"
                  className="edit-profile-btn"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Edit3 size={14} /> Edit Profile
                </button>
                <button type="button" className="signout-profile-btn" onClick={onLogout}>
                  <LogOut size={14} /> Sign out
                </button>
              </div>
            </div>
          </div>

          {/* Right: Your Wellness Streak Tile */}
          <div className="profile-streak-box">
            <div className="streak-title-line">
              <div className="streak-fire-icon-wrap">
                <Flame size={17} />
              </div>
              <div>
                <span className="streak-small-label">Your Wellness Streak</span>
                <strong className="streak-big-count">14 days</strong>
              </div>
            </div>
            <p className="streak-micro-p">
              Keep going! Consistency builds better habits.
            </p>

            <div className="streak-week-circles">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                <div key={idx} className="streak-col-unit">
                  <div className="streak-dot-circle checked">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span className="streak-day-sub">{day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* 3. FOUR KPI TELEMETRY CARDS */}
      <section className="profile-telemetry-row">
        <Card className="telemetry-stat-card">
          <div className="stat-icon-square mint">
            <Footprints size={18} />
          </div>
          <div className="stat-content-box">
            <span className="stat-meta-label">Avg. Daily Steps</span>
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

        <Card className="telemetry-stat-card">
          <div className="stat-icon-square blue">
            <Target size={18} />
          </div>
          <div className="stat-content-box">
            <span className="stat-meta-label">Personal Goal Progress</span>
            <div className="stat-big-val">80%</div>
            <div className="stat-mini-progress">
              <div className="stat-progress-fill green" style={{ width: '80%' }} />
            </div>
            <span className="stat-sub-caption">6,720 / 8,400 steps</span>
          </div>
        </Card>
      </section>

      {/* 4. PROFILE TABS NAVIGATION */}
      <div className="profile-nav-tabs-bar">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'goals', label: 'Goals' },
          { id: 'preferences', label: 'Preferences' },
          { id: 'notifications', label: 'Notifications' },
          { id: 'privacy', label: 'Privacy' },
          { id: 'connected', label: 'Connected Apps' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            className={`profile-tab-btn ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab !== 'overview' ? (
        <div style={{ marginTop: '20px' }}>
          <Card style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
              {activeTab === 'goals' && 'Personal Wellbeing Goals'}
              {activeTab === 'preferences' && 'Rhythm & Workday Preferences'}
              {activeTab === 'notifications' && 'Notification Settings'}
              {activeTab === 'privacy' && 'Your Privacy & Device Data Controls'}
              {activeTab === 'connected' && 'Connected Wearables & Bridges'}
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px' }}>
              {activeTab === 'goals' && 'Set realistic, sustainable targets that support your team without burnout.'}
              {activeTab === 'preferences' && 'Configure active work intervals, quiet hours, and daily check-in prompts.'}
              {activeTab === 'notifications' && 'Manage gentle reminders for check-ins, team challenges, and rescue mode alerts.'}
              {activeTab === 'privacy' && 'Your personal telemetry stays private. Only aggregate metrics are visible to teams with 5+ members.'}
              {activeTab === 'connected' && 'Currently syncing through Web Manual Check-in. Health Connect is available via native Android bridge.'}
            </p>

            {activeTab === 'privacy' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#F8FAFC', borderRadius: '10px' }}>
                  <div>
                    <strong style={{ fontSize: '14px', color: '#0F172A' }}>K-Anonymity Protection</strong>
                    <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>Never displays individual records in HR or team views.</p>
                  </div>
                  <span style={{ fontSize: '12px', color: '#059669', background: '#ECFDF5', padding: '4px 10px', borderRadius: '12px', fontWeight: 600 }}>Active (K ≥ 5)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#F8FAFC', borderRadius: '10px' }}>
                  <div>
                    <strong style={{ fontSize: '14px', color: '#0F172A' }}>Zero Leaderboard Guarantee</strong>
                    <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>Public employee ranking is permanently disabled.</p>
                  </div>
                  <span style={{ fontSize: '12px', color: '#059669', background: '#ECFDF5', padding: '4px 10px', borderRadius: '12px', fontWeight: 600 }}>Enforced</span>
                </div>
              </div>
            )}

            {activeTab === 'connected' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#F8FAFC', borderRadius: '10px' }}>
                  <div>
                    <strong style={{ fontSize: '14px', color: '#0F172A' }}>Manual Web Check-In</strong>
                    <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>Quick daily log for steps and sleep hours.</p>
                  </div>
                  <span style={{ fontSize: '12px', color: '#059669', background: '#ECFDF5', padding: '4px 10px', borderRadius: '12px', fontWeight: 600 }}>Connected</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#F8FAFC', borderRadius: '10px' }}>
                  <div>
                    <strong style={{ fontSize: '14px', color: '#0F172A' }}>Health Connect / Wearable Sync</strong>
                    <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>Requires native Android bridge (running in web dev environment).</p>
                  </div>
                  <span style={{ fontSize: '12px', color: '#D97706', background: '#FEF3C7', padding: '4px 10px', borderRadius: '12px', fontWeight: 600 }}>Web Simulation</span>
                </div>
              </div>
            )}

            {(activeTab === 'goals' || activeTab === 'preferences' || activeTab === 'notifications') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#F8FAFC', borderRadius: '10px' }}>
                  <div>
                    <strong style={{ fontSize: '14px', color: '#0F172A' }}>Daily Movement Target</strong>
                    <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>Adaptive goal tailored to team fatigue rhythms.</p>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#10B981' }}>8,000 steps</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#F8FAFC', borderRadius: '10px' }}>
                  <div>
                    <strong style={{ fontSize: '14px', color: '#0F172A' }}>Habit Rescue Fallback Target</strong>
                    <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>Low-pressure goal during intense workload days.</p>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#3B82F6' }}>4,000 steps (50%)</span>
                </div>
              </div>
            )}
          </Card>
        </div>
      ) : (
      /* 5. MAIN CONTENT ROW: LEFT (CHART + RECENT + ACHIEVEMENTS) | RIGHT (UPCOMING GOALS + QUOTE) */
      <section className="profile-split-grid">
        {/* LEFT COLUMN */}
        <div className="profile-col-main">
          {/* Your Activity This Week Chart */}
          <Card className="profile-activity-chart-card">
            <div className="card-top-header">
              <div className="card-title-group">
                <Footprints size={18} style={{ color: '#10B981' }} />
                <h3 className="card-main-title">Your Activity This Week</h3>
              </div>
              <div className="chart-legend-row">
                <span className="legend-item">
                  <span className="legend-dot green" /> Your Steps
                </span>
                <span className="legend-item">
                  <span className="legend-dash-blue" /> --- Target (8,400)
                </span>
              </div>
            </div>

            <div className="profile-chart-viewport">
              <div className="profile-target-line" />
              <div className="profile-chart-bars-row">
                {weeklySteps.map((b, idx) => (
                  <div key={idx} className="profile-bar-unit">
                    <span className="profile-bar-val">{b.val}</span>
                    <div className="profile-bar-pillar" style={{ height: `${b.h}%` }} />
                    <span className="profile-bar-day">{b.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Bottom Split: Recent Activity & Achievements */}
          <div className="profile-bottom-split-row">
            {/* Recent Activity */}
            <Card className="profile-recent-card">
              <div className="card-top-header">
                <div className="card-title-group">
                  <Clock size={16} style={{ color: '#3B82F6' }} />
                  <h3 className="card-main-title">Recent Activity</h3>
                </div>
                <span className="header-view-link">See All →</span>
              </div>

              <div className="profile-recent-list">
                {recentActivity.map((r, idx) => {
                  const Icon = r.icon;
                  return (
                    <div key={idx} className="profile-activity-item">
                      <div className="activity-icon-sq" style={{ background: `${r.color}15`, color: r.color }}>
                        <Icon size={14} />
                      </div>
                      <div className="activity-info-col">
                        <strong className="activity-text">{r.text}</strong>
                        <span className="activity-time">{r.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Achievements */}
            <Card className="profile-achievements-card">
              <div className="card-top-header">
                <div className="card-title-group">
                  <Award size={16} style={{ color: '#10B981' }} />
                  <h3 className="card-main-title">Achievements</h3>
                </div>
                <span className="header-view-link">View All →</span>
              </div>

              <div className="achievements-triplet-row">
                <div className="achievement-badge-item">
                  <div className="achievement-hexagon green">
                    <Award size={20} />
                  </div>
                  <strong>7-Day Streak</strong>
                  <span>Consistency Master</span>
                </div>

                <div className="achievement-badge-item">
                  <div className="achievement-hexagon blue">
                    <Footprints size={20} />
                  </div>
                  <strong>Step Goal Master</strong>
                  <span>8K+ Daily Rhythm</span>
                </div>

                <div className="achievement-badge-item">
                  <div className="achievement-hexagon purple">
                    <Moon size={20} />
                  </div>
                  <strong>Sleep Champion</strong>
                  <span>Optimal Rest Window</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="profile-col-side">
          {/* Upcoming Goals */}
          <Card className="upcoming-goals-card">
            <div className="card-top-header">
              <div className="card-title-group">
                <Target size={16} style={{ color: '#3B82F6' }} />
                <h3 className="card-main-title">Upcoming Goals</h3>
              </div>
              <span className="header-view-link">View All →</span>
            </div>

            <div className="goals-vertical-list">
              <div className="goal-row-item">
                <div className="goal-icon-circle mint">
                  <Footprints size={15} />
                </div>
                <div className="goal-details-col">
                  <strong>8,000 daily steps</strong>
                  <span>In progress • 80%</span>
                  <div className="goal-bar-track">
                    <div className="goal-bar-fill green" style={{ width: '80%' }} />
                  </div>
                </div>
                <ChevronRight size={16} className="goal-chevron" />
              </div>

              <div className="goal-row-item">
                <div className="goal-icon-circle orange">
                  <Flame size={15} />
                </div>
                <div className="goal-details-col">
                  <strong>30 min active time</strong>
                  <span>In progress • 60%</span>
                  <div className="goal-bar-track">
                    <div className="goal-bar-fill orange" style={{ width: '60%' }} />
                  </div>
                </div>
                <ChevronRight size={16} className="goal-chevron" />
              </div>

              <div className="goal-row-item">
                <div className="goal-icon-circle purple">
                  <Moon size={15} />
                </div>
                <div className="goal-details-col">
                  <strong>7–8 hours sleep</strong>
                  <span>In progress • 70%</span>
                  <div className="goal-bar-track">
                    <div className="goal-bar-fill purple" style={{ width: '70%' }} />
                  </div>
                </div>
                <ChevronRight size={16} className="goal-chevron" />
              </div>
            </div>
          </Card>

          {/* Inspirational Leaf Tile */}
          <div className="profile-inspirational-leaf-card">
            <div className="inspirational-leaf-svg">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M24 44C24 44 24 24 24 16C24 8 16 4 16 4C16 4 16 14 18 20C20 26 24 44 24 44Z" fill="#10B981" fillOpacity="0.8"/>
                <path d="M24 44C24 44 24 26 26 20C28 14 34 6 34 6C34 6 32 14 30 20C28 26 24 44 24 44Z" fill="#059669" fillOpacity="0.6"/>
              </svg>
            </div>
            <div className="inspirational-quote-text">
              “Progress, not perfection.”
            </div>
            <p className="inspirational-sub-text">
              Small steps today, a healthier tomorrow.
            </p>
          </div>
        </div>
      </section>
      )}

      {/* EDIT PROFILE MODAL */}
      {isEditModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(3px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '460px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              border: '1px solid #E2E8F0'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit3 size={18} style={{ color: '#10B981' }} />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>Edit Profile</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                  Choose Avatar
                </label>
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px' }}>
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => (
                    <img
                      key={idx}
                      src={getMemberAvatar(idx)}
                      alt={`Avatar option ${idx + 1}`}
                      onClick={() => setProfileAvatarIdx(idx)}
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        cursor: 'pointer',
                        border: profileAvatarIdx === idx ? '3px solid #10B981' : '2px solid transparent',
                        boxShadow: profileAvatarIdx === idx ? '0 0 0 2px #ECFDF5' : 'none',
                        transition: 'all 0.15s ease'
                      }}
                      onError={(e) => handleAvatarError(e, `A${idx}`)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '14px',
                    color: '#0F172A',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                  Department / Team
                </label>
                <input
                  type="text"
                  value={profileDept}
                  onChange={(e) => setProfileDept(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '14px',
                    color: '#0F172A',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                  Location
                </label>
                <input
                  type="text"
                  value={profileLocation}
                  onChange={(e) => setProfileLocation(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '14px',
                    color: '#0F172A',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSavedToast(true);
                    setTimeout(() => setSavedToast(false), 3000);
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
