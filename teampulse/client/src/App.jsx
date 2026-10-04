import React, { useEffect, useState } from 'react';
import { api } from './api';
import { Login } from './pages/Login';
import { SetupTeam } from './pages/SetupTeam';
import { Home } from './pages/Home';
import { Challenge } from './pages/Challenge';
import { Rescue } from './pages/Rescue';
import { Team } from './pages/Team';
import { Privacy } from './pages/Privacy';
import { Profile } from './pages/Profile';
import { HR } from './pages/HR';
import { ThriveLoopLogo } from './components/ui/ThriveLoopLogo';
import { getMemberAvatar, handleAvatarError } from './utils/avatars';
import {
  Home as HomeIcon,
  Trophy,
  Heart,
  Users,
  User,
  BarChart2,
  TrendingUp,
  ShieldCheck,
  Calculator,
  Bell,
  Search,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Sprout,
  X,
  LogOut
} from 'lucide-react';
import './styles.css';

export default function App() {
  const [auth, setAuth] = useState(!!localStorage.getItem('token'));
  const [data, setData] = useState({});
  const [page, setPage] = useState('home');
  const [setup, setSetup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotif, setShowNotif] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [hash, setHash] = useState(window.location.hash);

  function handleSearchKeyDown(e) {
    if (e.key === 'Enter' && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      if (q.includes('chall') || q.includes('step')) setPage('challenge');
      else if (q.includes('rescu') || q.includes('habit')) setPage('rescue');
      else if (q.includes('team') || q.includes('squad')) setPage('team');
      else if (q.includes('prof') || q.includes('user') || q.includes('set')) setPage('profile');
      else if (q.includes('priv') || q.includes('sec')) setPage('privacy');
      else if (q.includes('roi') || q.includes('calc')) setPage('roi');
      else if (q.includes('imp') || q.includes('metric')) setPage('impact');
      else if (q.includes('over') || q.includes('dash')) setPage('overview');
      else setPage('home');
    }
  }

  useEffect(() => {
    const handleHash = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    const knownIds = [
      "home",
      "challenge",
      "rescue",
      "team",
      "profile",
      "overview",
      "teams",
      "impact",
      "privacy",
      "roi",
    ];
    const id = window.location.hash.replace(/^#/, "");
    if (id && page !== id && knownIds.includes(id)) {
      setPage(id);
    }
  }, [window.location.hash]);

  async function loadData() {
    try {
      const [me, week, challenge, rescue, team] = await Promise.all([
        api('/auth/me').catch(() => null),
        api('/metrics/week').catch(() => ({ metrics: [], streak: 14, goal: 8000 })),
        api('/challenges/active').catch(() => null),
        api('/metrics/rescue', 'POST').catch(() => ({ atRisk: false })),
        api('/teams/mine').catch(() => null),
      ]);

      const activeUser = me || {
        _id: 'demo-user-1',
        name: 'Alex Morgan',
        email: 'alex@acme.com',
        role: localStorage.getItem('role') || 'hr',
        company: 'Acme Corp',
        team: { name: 'Product Engineering' }
      };

      setData({
        me: activeUser,
        week: week || { metrics: [], streak: 14, goal: 8000 },
        challenge,
        rescue,
        team: team || { name: 'Product Engineering' }
      });
      const currentRole = activeUser?.role || localStorage.getItem('role') || 'employee';
      if (currentRole === 'hr' && (page === 'home' || !page) && !window.location.hash) {
        setPage('overview');
      }
      setSetup(false);
    } catch (err) {
      console.warn('Session or data issue:', err.message);
      const fallbackRole = localStorage.getItem('role') || 'employee';
      setData({
        me: {
          _id: 'demo-user-1',
          name: fallbackRole === 'hr' ? 'Sarah Jenkins' : 'Alex Morgan',
          email: fallbackRole === 'hr' ? 'hr@acme.com' : 'alex@acme.com',
          role: fallbackRole,
          company: 'Acme Corp',
          team: { name: 'Product Engineering' }
        },
        week: { metrics: [], streak: 14, goal: 8000 },
        team: { name: 'Product Engineering' }
      });
      if (fallbackRole === 'hr' && (page === 'home' || !page) && !window.location.hash) {
        setPage('overview');
      }
      setSetup(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (auth) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [auth]);

  function handleLogout() {
    localStorage.clear();
    setAuth(false);
    setData({});
    setPage('home');
    setShowProfileMenu(false);
    setShowNotif(false);
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px', background: '#F7FAF9' }}>
        <ThriveLoopLogo size={36} showText={true} />
        <span style={{ fontSize: '13px', color: '#64748B' }}>Loading your wellness workspace…</span>
      </div>
    );
  }

  if (hash === '#setup' || (auth && setup)) {
    return (
      <SetupTeam
        onDone={() => {
          if (window.location.hash === '#setup') {
            window.location.hash = '';
          }
          loadData();
        }}
      />
    );
  }

  if (!auth) {
    return (
      <Login
        onDone={(res) => {
          setAuth(true);
          setLoading(true);
          if (res?.role === 'hr') {
            setPage('overview');
          }
        }}
      />
    );
  }

  const role = data.me?.role || localStorage.getItem('role') || 'employee';
  const userName = data.me?.name || (role === 'hr' ? 'Sarah Jenkins' : 'Alex Morgan');
  const firstName = userName.split(' ')[0] || (role === 'hr' ? 'Sarah' : 'Alex');
  const userRole = role === 'hr' ? 'HR Admin' : 'Employee';

  const employeeNav = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'challenge', label: 'Challenge', icon: Trophy },
    { id: 'rescue', label: 'Rescue', icon: Heart },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const hrNav = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'impact', label: 'Impact', icon: TrendingUp },
    { id: 'privacy', label: 'Privacy', icon: ShieldCheck },
    { id: 'roi', label: 'ROI', icon: Calculator },
  ];

  return (
    <div className="tl-app-layout">
      {/* SIDEBAR NAVIGATION */}
      <aside className="tl-sidebar">
        <div className="tl-sidebar-brand" onClick={() => setPage(role === 'hr' ? 'overview' : 'home')} style={{ cursor: 'pointer' }}>
          <ThriveLoopLogo size={28} showText={true} />
        </div>

        {/* Role-based navigation */}
        {role === 'hr' ? (
          <div className="tl-nav-section">
            <span className="tl-nav-header">HR (Admin)</span>
            <div className="tl-nav-list">
              {hrNav.map((item) => {
                const Icon = item.icon;
                const isActive = page === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`tl-nav-link ${isActive ? 'active' : ''}`}
                    onClick={() => setPage(item.id)}
                  >
                    <Icon size={18} className="tl-nav-icon" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="tl-nav-section">
            <span className="tl-nav-header">My Wellness</span>
            <div className="tl-nav-list">
              {employeeNav.map((item) => {
                const Icon = item.icon;
                const isActive = page === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`tl-nav-link ${isActive ? 'active' : ''}`}
                    onClick={() => setPage(item.id)}
                  >
                    <Icon size={18} className="tl-nav-icon" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Sidebar Tile: Botanical Card */}
        <div className="tl-sidebar-card">
          <div className="tl-sidebar-card-plant">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path d="M24 44C24 44 24 24 24 16C24 8 16 4 16 4C16 4 16 14 18 20C20 26 24 44 24 44Z" fill="#10B981" fillOpacity="0.8"/>
              <path d="M24 44C24 44 24 26 26 20C28 14 34 6 34 6C34 6 32 14 30 20C28 26 24 44 24 44Z" fill="#059669" fillOpacity="0.6"/>
              <path d="M24 30C20 26 10 24 10 24C10 24 16 30 20 34C22 36 24 44 24 44" fill="#34D399" fillOpacity="0.5"/>
              <path d="M24 30C28 26 38 24 38 24C38 24 32 30 28 34C26 36 24 44 24 44" fill="#059669" fillOpacity="0.4"/>
            </svg>
          </div>
          {role === 'hr' ? (
            <>
              <div className="tl-sidebar-card-title">Collective Wellbeing</div>
              <p className="tl-sidebar-card-desc">Healthy cultures drive sustainable performance.</p>
              <button
                type="button"
                className="tl-sidebar-card-btn"
                onClick={() => setPage('impact')}
              >
                View Impact →
              </button>
            </>
          ) : (
            <>
              <div className="tl-sidebar-card-title">Small Changes Big Impact</div>
              <p className="tl-sidebar-card-desc">Healthier people. Stronger teams. Brighter tomorrows.</p>
              <button
                type="button"
                className="tl-sidebar-card-btn"
                onClick={() => setPage('challenge')}
              >
                Start a Challenge →
              </button>
            </>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="tl-main-area">
        {/* GLOBAL TOPBAR: Mobile Logo + Search + Notifications + Profile */}
        <header className="tl-topbar">
          <div
            className="tl-mobile-brand"
            onClick={() => setPage(role === 'hr' ? 'overview' : 'home')}
            style={{ cursor: 'pointer' }}
            title="ThriveLoop"
            role="button"
            tabIndex={0}
          >
            <ThriveLoopLogo size={24} showText={false} />
          </div>

          <div className="tl-topbar-search">
            <Search size={16} className="tl-search-icon" />
            <input
              type="text"
              placeholder="Search habits, challenges, teams... (Press Enter)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="tl-search-input"
            />
          </div>

          <div className="tl-topbar-actions" style={{ position: 'relative' }}>
            <button
              type="button"
              className="tl-notif-btn"
              title="Notifications"
              onClick={() => {
                setShowNotif((prev) => !prev);
                setShowProfileMenu(false);
              }}
            >
              <Bell size={18} />
              <span className="tl-notif-dot">2</span>
            </button>

            {/* Notification Flyout Menu */}
            {showNotif && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '10px',
                  width: '320px',
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
                  padding: '16px',
                  zIndex: 999
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={16} style={{ color: '#10B981' }} />
                    <strong style={{ fontSize: '14px', color: '#0F172A' }}>Notifications</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowNotif(false)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '2px' }}
                  >
                    <X size={15} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div
                    style={{
                      padding: '10px',
                      background: '#ECFDF5',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      border: '1px solid #D1FAE5'
                    }}
                    onClick={() => { setPage('challenge'); setShowNotif(false); }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '13px', color: '#065F46' }}>Squad Challenge Active</strong>
                      <span style={{ fontSize: '11px', color: '#059669' }}>2h ago</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#047857', margin: '4px 0 0' }}>
                      Your team reached 80% completion! Tap to view progress.
                    </p>
                  </div>

                  <div
                    style={{
                      padding: '10px',
                      background: '#EFF6FF',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      border: '1px solid #DBEAFE'
                    }}
                    onClick={() => { setPage('rescue'); setShowNotif(false); }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '13px', color: '#1E40AF' }}>Habit Rescue Ready</strong>
                      <span style={{ fontSize: '11px', color: '#3B82F6' }}>5h ago</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#1D4ED8', margin: '4px 0 0' }}>
                      Difficult day? Switch to 50% target to protect your streak.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Profile User Pill */}
            <div
              className="tl-user-pill"
              onClick={() => {
                setShowProfileMenu((prev) => !prev);
                setShowNotif(false);
              }}
              role="button"
              tabIndex={0}
              aria-label="User Profile Menu"
            >
              <img
                src={getMemberAvatar(0, userName)}
                alt={userName}
                className="tl-user-avatar"
                onError={(e) => handleAvatarError(e, userName)}
              />
              <div className="tl-user-meta">
                <span className="tl-user-name">{firstName}</span>
                <span className="tl-user-role">{userRole} <ChevronDown size={12} className="inline-chevron" /></span>
              </div>
            </div>

            {/* Profile Dropdown Menu Flyout */}
            {showProfileMenu && (
              <div
                className="tl-profile-menu-dropdown"
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '10px',
                  width: '260px',
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
                  padding: '16px',
                  zIndex: 1001,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '12px', borderBottom: '1px solid #F1F5F9' }}>
                  <img
                    src={getMemberAvatar(0, userName)}
                    alt={userName}
                    style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                    onError={(e) => handleAvatarError(e, userName)}
                  />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {userName}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: role === 'hr' ? '#7C3AED' : '#059669', background: role === 'hr' ? '#F5F3FF' : '#ECFDF5', padding: '1px 7px', borderRadius: '10px' }}>
                        {userRole}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <button
                    type="button"
                    className="tl-menu-action-btn"
                    onClick={() => {
                      setPage('profile');
                      setShowProfileMenu(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '9px 12px',
                      background: 'none',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#1E293B',
                      textAlign: 'left',
                      width: '100%'
                    }}
                  >
                    <User size={16} style={{ color: '#64748B' }} />
                    <span>My Profile</span>
                  </button>

                  <button
                    type="button"
                    className="tl-menu-action-btn"
                    onClick={() => {
                      const newRole = role === 'hr' ? 'employee' : 'hr';
                      localStorage.setItem('role', newRole);
                      setData((prev) => ({
                        ...prev,
                        me: {
                          ...prev.me,
                          role: newRole,
                          name: newRole === 'hr' ? 'Sarah Jenkins' : 'Alex Morgan',
                          email: newRole === 'hr' ? 'hr@acme.com' : 'alex@acme.com'
                        }
                      }));
                      setPage(newRole === 'hr' ? 'overview' : 'home');
                      setShowProfileMenu(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '9px 12px',
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: '#0F172A',
                      textAlign: 'left',
                      width: '100%',
                      margin: '4px 0'
                    }}
                  >
                    {role === 'hr' ? <Users size={16} style={{ color: '#10B981' }} /> : <BarChart2 size={16} style={{ color: '#7C3AED' }} />}
                    <span>Switch to {role === 'hr' ? 'Employee (Alex)' : 'HR Admin (Sarah)'}</span>
                  </button>

                  <button
                    type="button"
                    className="tl-menu-action-btn"
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleLogout();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '9px 12px',
                      background: 'none',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#EF4444',
                      textAlign: 'left',
                      width: '100%'
                    }}
                  >
                    <LogOut size={16} style={{ color: '#EF4444' }} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <div className="tl-page-body">
          {page === 'home' && (
            <Home data={data} onRefresh={loadData} onNavigate={setPage} />
          )}
          {page === 'challenge' && (
            <Challenge
              challenge={data.challenge}
              teamMembers={data.team?.members || []}
              onRefresh={loadData}
              onBack={() => setPage(role === 'hr' ? 'overview' : 'home')}
              onNavigate={setPage}
            />
          )}
          {page === 'rescue' && (
            <Rescue
              data={data}
              onRefresh={loadData}
              onBack={() => setPage(role === 'hr' ? 'overview' : 'home')}
            />
          )}
          {page === 'team' && (
            <Team data={data} onNavigate={setPage} />
          )}
          {page === 'profile' && (
            <Profile me={data.me} onLogout={handleLogout} />
          )}
          {page === 'privacy' && (
            <Privacy onBack={() => setPage(role === 'hr' ? 'overview' : 'home')} />
          )}
          {['overview', 'teams', 'impact', 'roi'].includes(page) && (
            <HR defaultTab={page} onNavigate={setPage} />
          )}
        </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="tl-mobile-bottom-nav" aria-label="Mobile Navigation">
        {(role === 'hr' ? hrNav : employeeNav).map((item) => {
          const Icon = item.icon;
          const isActive = page === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`tl-mobile-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => {
                setPage(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <Icon size={20} className="tl-mobile-nav-icon" />
              <span className="tl-mobile-nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
