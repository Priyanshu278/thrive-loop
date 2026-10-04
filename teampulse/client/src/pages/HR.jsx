import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
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
  Sparkles,
  ChevronDown,
  Activity,
  Heart,
  Smile,
  Zap,
  ShieldCheck,
  Lock,
  Search,
  Filter,
  BarChart2,
  DollarSign,
  Briefcase,
  Layers,
  Clock,
  Check,
  Info,
  Sliders,
  PieChart,
  ArrowUpRight,
  FileText,
  Download
} from 'lucide-react';
import { api } from '../api';
import { getMemberAvatar, handleAvatarError } from '../utils/avatars';

export function HR({ defaultTab = 'overview', onNavigate }) {
  const [tab, setTab] = useState(defaultTab);

  useEffect(() => {
    setTab(defaultTab);
  }, [defaultTab]);

  const [teamCategory, setTeamCategory] = useState('all');
  const [teamSearch, setTeamSearch] = useState('');
  const [impactMode, setImpactMode] = useState('post'); // 'baseline' | 'post'
  const [hoveredHeatmapCell, setHoveredHeatmapCell] = useState(null);

  // Backend state
  const [hrOverview, setHrOverview] = useState(null);
  const [hrImpact, setHrImpact] = useState(null);
  const [isHrAdmin, setIsHrAdmin] = useState(true);
  const [loadingBackend, setLoadingBackend] = useState(false);
  const [roiServerVerified, setRoiServerVerified] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadHrData() {
      setLoadingBackend(true);
      try {
        const [overviewRes, impactRes] = await Promise.all([
          api('/hr/overview').catch((err) => {
            if (err.message && (err.message.includes('403') || err.message.includes('HR only'))) {
              if (isMounted) setIsHrAdmin(false);
            }
            return null;
          }),
          api('/hr/impact').catch(() => null),
        ]);
        if (isMounted && overviewRes) {
          setHrOverview(overviewRes);
          setIsHrAdmin(true);
        }
        if (isMounted && impactRes) {
          setHrImpact(impactRes);
        }
      } catch (e) {
        console.warn('HR data load:', e);
      } finally {
        if (isMounted) setLoadingBackend(false);
      }
    }
    loadHrData();
    return () => { isMounted = false; };
  }, []);

  // ROI Calculator state
  const [roiEmployees, setRoiEmployees] = useState(150);
  const [roiPrice, setRoiPrice] = useState(5);
  const [roiCostPerResignation, setRoiCostPerResignation] = useState(15000);
  const [roiCurrency, setRoiCurrency] = useState('USD');
  const [roiPreset, setRoiPreset] = useState('mid');
  const INR_RATE = 83;

  function applyRoiPreset(preset) {
    setRoiPreset(preset);
    if (preset === 'startup') {
      setRoiEmployees(50);
      setRoiPrice(5);
      setRoiCostPerResignation(12000);
    } else if (preset === 'mid') {
      setRoiEmployees(150);
      setRoiPrice(5);
      setRoiCostPerResignation(15000);
    } else if (preset === 'enterprise') {
      setRoiEmployees(500);
      setRoiPrice(4);
      setRoiCostPerResignation(22000);
    }
  }

  function fmtMoney(usdVal) {
    if (roiCurrency === 'INR') {
      const inr = Math.round(usdVal * INR_RATE);
      return `₹${inr.toLocaleString('en-IN')}`;
    }
    return `$${usdVal.toLocaleString('en-US')}`;
  }

  const annualInvestment = roiEmployees * roiPrice * 12;
  const breakEvenTurnover = Math.max(1, Math.ceil(annualInvestment / roiCostPerResignation));
  const healthcareSavings = Math.round(annualInvestment * 0.95);
  const turnoverSavings = Math.round(annualInvestment * 1.45);
  const productivityLiftSavings = Math.round(annualInvestment * 0.80);
  const estimatedSavings = healthcareSavings + turnoverSavings + productivityLiftSavings;
  const netBenefit = estimatedSavings - annualInvestment;

  async function verifyRoiWithServer() {
    try {
      const res = await api('/hr/roi', 'POST', {
        employees: roiEmployees,
        price: roiPrice,
        cost: roiCostPerResignation,
      });
      setRoiServerVerified(res);
    } catch (err) {
      console.warn('Server ROI check:', err.message);
    }
  }

  const heatmapHours = ['9 AM', '11 AM', '1 PM', '3 PM', '5 PM'];
  const heatmapData = [
    { day: 'Mon', baseline: [74, 68, 52, 45, 50], post: [88, 86, 79, 83, 81], desc: 'Micro-walk habit rescue active' },
    { day: 'Tue', baseline: [78, 72, 55, 42, 48], post: [91, 89, 83, 86, 84], desc: 'Hydration prompt boosted focus' },
    { day: 'Wed', baseline: [76, 67, 49, 39, 44], post: [87, 85, 81, 85, 82], desc: 'Mid-week slump completely flattened' },
    { day: 'Thu', baseline: [72, 64, 47, 38, 43], post: [86, 84, 78, 82, 80], desc: 'Team step sync ongoing' },
    { day: 'Fri', baseline: [70, 60, 44, 35, 41], post: [84, 82, 76, 80, 78], desc: 'Weekend ramp with high energy' },
  ];

  function getHeatmapBg(score) {
    if (score >= 85) return '#10B981';
    if (score >= 75) return '#34D399';
    if (score >= 60) return '#A7F3D0';
    if (score >= 48) return '#FCD34D';
    return '#FCA5A5';
  }

  function getHeatmapColor(score) {
    if (score >= 75) return '#FFFFFF';
    return '#0F172A';
  }

  function renderSparkline(values, color) {
    if (!values || values.length < 2) return null;
    const min = Math.min(...values) - 5;
    const max = Math.max(...values) + 5;
    const width = 140;
    const height = 24;
    const points = values.map((val, idx) => {
      const x = (idx / (values.length - 1)) * width;
      const y = height - ((val - min) / (max - min)) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    const pointsStr = points.join(' ');
    const areaPoints = `0,${height} ${pointsStr} ${width},${height}`;
    const gradId = `spark-${color.replace('#', '')}`;
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible', width: '100%', height: '24px' }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill={`url(#${gradId})`} />
        <polyline points={pointsStr} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  const defaultTeamsData = [
    { id: 'prod', name: 'Product Team', category: 'product', members: 25, activePct: 88, steps: 8420, sleep: 7.2, status: 'Leading this week!', badge: '🔥 High Rhythm', sparkline: [72, 75, 78, 82, 85, 87, 88], color: '#10B981' },
    { id: 'dev', name: 'Development', category: 'development', members: 32, activePct: 87, steps: 8290, sleep: 7.0, status: 'Great momentum!', badge: '⚡ In Sync', sparkline: [70, 74, 76, 80, 83, 85, 87], color: '#3B82F6' },
    { id: 'des', name: 'Design Team', category: 'design', members: 22, activePct: 82, steps: 7650, sleep: 7.1, status: 'Consistent loop', badge: '🌱 Rescue Active', sparkline: [65, 68, 72, 75, 77, 80, 82], color: '#8B5CF6' },
    { id: 'mkt', name: 'Marketing', category: 'marketing', members: 20, activePct: 80, steps: 7800, sleep: 6.9, status: 'Active rhythm', badge: '⚡ In Sync', sparkline: [60, 65, 70, 74, 76, 78, 80], color: '#F59E0B' },
    { id: 'ops', name: 'Operations', category: 'operations', members: 26, activePct: 77, steps: 7420, sleep: 6.8, status: 'Steady participation', badge: '🌱 Steady Pace', sparkline: [62, 66, 68, 70, 72, 75, 77], color: '#06B6D4' },
    { id: 'hr', name: 'HR Team', category: 'hr', members: 18, activePct: 67, steps: 7100, sleep: 7.3, status: 'Building habit', badge: '🌱 Building Rhythm', sparkline: [50, 52, 55, 58, 60, 63, 67], color: '#EC4899' },
    { id: 'strat', name: 'Executive Strategy', category: 'strategy', members: 3, activePct: null, steps: null, sleep: null, hidden: true, status: 'Privacy Protected (< 5 members)', badge: '🛡️ Protected', sparkline: null, color: '#64748B' },
  ];

  const teamsData = defaultTeamsData.map((team) => {
    const live = Array.isArray(hrOverview)
      ? hrOverview.find((item) =>
          item.team?.toLowerCase()?.includes(team.name?.toLowerCase()) ||
          team.name?.toLowerCase()?.includes(item.team?.toLowerCase())
        )
      : null;
    if (live) {
      return {
        ...team,
        members: live.members || team.members,
        hidden: live.hidden !== undefined ? live.hidden : team.hidden,
        status: live.hidden ? 'Privacy Protected (< 5 members)' : 'Live Team Metric',
        badge: live.hidden ? '🛡️ Protected' : '🔥 High Rhythm',
        isReal: true,
      };
    }
    return team;
  });

  const filteredTeams = teamsData.filter((t) => {
    const matchesCat = teamCategory === 'all' || t.category === teamCategory;
    const matchesSearch = t.name.toLowerCase().includes(teamSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="hr-master-layout">
      {/* 1. BREADCRUMBS & TOP HEADER */}
      <div className="screen-header-block">
        <div className="screen-breadcrumb">
          <span>HR (Admin)</span>
          <span className="breadcrumb-divider">›</span>
          <span className="breadcrumb-active">
            {tab === 'overview' && 'Overview'}
            {tab === 'teams' && 'Teams Directory'}
            {tab === 'impact' && 'Program Impact'}
            {tab === 'privacy' && 'Privacy & Governance'}
            {tab === 'roi' && 'Program ROI'}
          </span>
        </div>

        <div className="screen-title-row">
          <div>
            <h1 className="screen-main-heading">
              {tab === 'overview' && <>HR <span className="highlight-emerald">Overview</span></>}
              {tab === 'teams' && <>Teams <span className="highlight-emerald">Directory</span></>}
              {tab === 'impact' && <>Program <span className="highlight-emerald">Impact</span></>}
              {tab === 'privacy' && <>Privacy & <span className="highlight-emerald">Governance</span></>}
              {tab === 'roi' && <>Program <span className="highlight-emerald">ROI</span></>}
            </h1>
            <p className="screen-sub-heading">
              {tab === 'overview' && 'Real insights for a healthier, more productive workplace.'}
              {tab === 'teams' && 'Meet the people behind a healthier workplace.'}
              {tab === 'impact' && 'Real people. Real progress. Real change.'}
              {tab === 'privacy' && 'Your data, your trust. Cryptographically guarded by design.'}
              {tab === 'roi' && 'Healthier people drive real business value.'}
            </p>
            <p className="screen-description">
              {tab === 'overview' && 'Track team wellness, engagement and program impact — all in one place.'}
              {tab === 'teams' && 'Explore teams, connect with colleagues and see how everyone is progressing.'}
              {tab === 'impact' && 'See how ThriveLoop is creating a healthier, happier and more collaborative culture.'}
              {tab === 'privacy' && 'K-anonymity guarantee ensures teams with fewer than 5 members are never de-anonymized.'}
              {tab === 'roi' && 'See the measurable return on productivity, retention and healthcare cost mitigation.'}
            </p>
          </div>

          <div className="screen-header-badges">
            <button
              type="button"
              onClick={() => window.print()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '9px 16px',
                borderRadius: '10px',
                background: '#0F172A',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.18)',
                transition: 'all 0.15s ease'
              }}
              title="Print or Save as Executive PDF Report"
            >
              <Download size={14} style={{ color: '#10B981' }} />
              <span>📄 Export Boardroom PDF</span>
            </button>

            <div className="header-date-badge">
              <Calendar size={14} className="icon-emerald" />
              <span>Oct 1 – Oct 7, 2026</span>
            </div>
            <div className="header-filter-pill">
              <span>This Week</span>
              <ChevronDown size={14} />
            </div>
            <div className="header-drive-banner">
              <div className="drive-text">Healthier teams drive better results.</div>
              <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
                <path d="M24 44C24 44 24 24 24 16C24 8 16 4 16 4C16 4 16 14 18 20C20 26 24 44 24 44Z" fill="#10B981"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {!isHrAdmin && (
        <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1E40AF', padding: '10px 16px', borderRadius: '10px', fontSize: '13px', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={16} />
          <span>
            <strong>HR Administrator Notice:</strong> Currently in preview mode. Live company database queries require HR credentials (K ≥ 5 privacy threshold active). Displaying illustrative model preview.
          </span>
        </div>
      )}

      {/* ====================================================================
          TAB 1: HR OVERVIEW (Master Reference Image 6 & 7)
          ==================================================================== */}
      {tab === 'overview' && (
        <div className="hr-tab-container">
          {/* 5 KPI TELEMETRY CARDS */}
          <section className="hr-5-kpis-grid">
            <Card className="telemetry-stat-card">
              <div className="stat-icon-square mint">
                <Users size={18} />
              </div>
              <div className="stat-content-box">
                <span className="stat-meta-label">Total Employees</span>
                <div className="stat-big-val">
                  248 <span className="stat-delta-green">↑ 12%</span>
                </div>
                <span className="stat-sub-caption">vs last month</span>
              </div>
            </Card>

            <Card className="telemetry-stat-card">
              <div className="stat-icon-square teal">
                <CheckCircle2 size={18} />
              </div>
              <div className="stat-content-box">
                <span className="stat-meta-label">Active Participation</span>
                <div className="stat-big-val">
                  82% <span className="stat-delta-green">↑ 8%</span>
                </div>
                <span className="stat-sub-caption">vs last week</span>
              </div>
            </Card>

            <Card className="telemetry-stat-card">
              <div className="stat-icon-square blue">
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
                <span className="stat-meta-label">Avg. Sleep Duration</span>
                <div className="stat-big-val">
                  7.2 h <span className="stat-delta-green">↑ 8%</span>
                </div>
                <span className="stat-sub-caption">vs last week</span>
              </div>
            </Card>
          </section>

          {/* TWO CHARTS ROW: TEAM ENGAGEMENT TREND | WELLNESS METRICS TREND */}
          <section className="hr-dual-charts-grid">
            <Card className="hr-trend-chart-card">
              <div className="card-top-header">
                <div>
                  <h3 className="card-main-title">Team Engagement Trend</h3>
                  <p className="card-sub-description">Weekly participation across all cohorts</p>
                </div>
                <div className="chart-filter-tag">Last 5 Weeks ▾</div>
              </div>

              <div className="engagement-chart-viewport">
                <svg viewBox="0 0 500 160" className="chart-svg-line">
                  <path
                    d="M 20,130 Q 120,110 240,70 T 480,45"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <circle cx="480" cy="45" r="5" fill="#FFFFFF" stroke="#10B981" strokeWidth="3" />
                </svg>
                <div className="chart-tooltip-bubble" style={{ right: '20px', top: '15px' }}>
                  <strong>82%</strong>
                  <span>Oct 5, 2026</span>
                </div>
                <div className="chart-axis-x">
                  <span>Sep 7</span>
                  <span>Sep 14</span>
                  <span>Sep 21</span>
                  <span>Sep 28</span>
                  <span className="active-x">Oct 5</span>
                </div>
              </div>
            </Card>

            <Card className="hr-trend-chart-card">
              <div className="card-top-header">
                <div>
                  <h3 className="card-main-title">Wellness Metrics Trend</h3>
                  <p className="card-sub-description">Rolling daily average telemetry</p>
                </div>
                <div className="chart-legend-row">
                  <span className="legend-item"><span className="legend-dot green" /> Steps</span>
                  <span className="legend-item"><span className="legend-dot orange" /> Active Minutes</span>
                  <span className="legend-item"><span className="legend-dot blue" /> Sleep (Hours)</span>
                </div>
              </div>

              <div className="metrics-chart-viewport">
                <svg viewBox="0 0 500 160" className="chart-svg-multi">
                  <path d="M 20,100 L 90,80 L 170,70 L 250,90 L 330,65 L 410,85 L 480,75" fill="none" stroke="#10B981" strokeWidth="2.5" />
                  <path d="M 20,120 L 90,110 L 170,105 L 250,115 L 330,100 L 410,110 L 480,108" fill="none" stroke="#F59E0B" strokeWidth="2.5" />
                  <path d="M 20,140 L 90,135 L 170,130 L 250,138 L 330,128 L 410,134 L 480,130" fill="none" stroke="#3B82F6" strokeWidth="2.5" />
                </svg>
                <div className="chart-axis-x">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>
            </Card>
          </section>

          {/* THREE-COLUMN ROW: TEAM PARTICIPATION | KEY INSIGHTS | DEPARTMENT PARTICIPATION RHYTHMS */}
          <section className="hr-tri-columns-grid">
            {/* Team Participation */}
            <Card className="hr-tri-card">
              <div className="card-top-header">
                <h3 className="card-main-title">Team Participation</h3>
                <span className="header-view-link" onClick={() => setTab('teams')}>View All →</span>
              </div>
              <p className="card-sub-description" style={{ marginBottom: '12px' }}>Active members by cohort</p>

              <div className="participation-stacked-list">
                {[
                  { name: 'Product Team', ratio: '22 / 25', pct: 88, color: '#10B981' },
                  { name: 'Development', ratio: '28 / 32', pct: 87, color: '#3B82F6' },
                  { name: 'Design Team', ratio: '18 / 22', pct: 82, color: '#8B5CF6' },
                  { name: 'Marketing', ratio: '16 / 20', pct: 80, color: '#F59E0B' },
                  { name: 'Operations', ratio: '20 / 26', pct: 77, color: '#06B6D4' },
                  { name: 'HR Team', ratio: '12 / 18', pct: 67, color: '#EC4899' },
                ].map((item, idx) => (
                  <div key={idx} className="part-cohort-row">
                    <span className="part-cohort-name">{item.name}</span>
                    <div className="part-cohort-bar">
                      <div className="part-fill" style={{ width: `${item.pct}%`, background: item.color }} />
                    </div>
                    <span className="part-cohort-ratio">{item.ratio}</span>
                    <strong className="part-cohort-pct">{item.pct}%</strong>
                  </div>
                ))}
              </div>
            </Card>

            {/* Key Insights */}
            <Card className="hr-tri-card">
              <div className="card-top-header">
                <h3 className="card-main-title">Key Insights</h3>
                <span className="header-view-link" onClick={() => setTab('impact')} style={{ cursor: 'pointer' }}>View Report →</span>
              </div>

              <div className="key-insights-stack">
                <div className="key-insight-box">
                  <div className="insight-badge-num text-success">+12%</div>
                  <p className="insight-desc-p">
                    Average daily steps increased compared to last month.
                  </p>
                </div>

                <div className="key-insight-box">
                  <div className="insight-badge-num text-primary">82%</div>
                  <p className="insight-desc-p">
                    Employee participation is consistently strong and growing.
                  </p>
                </div>

                <div className="key-insight-box">
                  <div className="insight-badge-num text-purple">7.2 h</div>
                  <p className="insight-desc-p">
                    Average sleep duration improved by 8% this week across engineering.
                  </p>
                </div>
              </div>
            </Card>

            {/* Department Participation Rhythms (No competitive rank) */}
            <Card className="hr-tri-card">
              <div className="card-top-header">
                <h3 className="card-main-title">Department Participation Rhythms</h3>
                <span className="header-sub-filter">This Week ▾</span>
              </div>

              <div className="top-teams-rank-list">
                {[
                  { dot: '#10B981', name: 'Product Team', pct: 88 },
                  { dot: '#3B82F6', name: 'Development', pct: 87 },
                  { dot: '#8B5CF6', name: 'Design Team', pct: 82 },
                  { dot: '#F59E0B', name: 'Marketing', pct: 80 },
                  { dot: '#06B6D4', name: 'Operations', pct: 77 },
                ].map((t, idx) => (
                  <div key={idx} className="top-rank-row">
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.dot, flexShrink: 0 }} />
                    <span className="rank-name">{t.name}</span>
                    <div className="rank-bar-wrap">
                      <div className="rank-bar-fill" style={{ width: `${t.pct}%`, background: t.dot }} />
                    </div>
                    <span className="rank-pct">{t.pct}%</span>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          {/* BOTTOM ROW: PROGRAM IMPACT SNAPSHOT | RECENT ACTIVITY | EXECUTIVE QUOTE */}
          <section className="hr-bottom-master-grid">
            <Card className="impact-snapshot-card">
              <div className="card-top-header">
                <h3 className="card-main-title">Program Impact Snapshot</h3>
              </div>
              <div className="snapshot-triplet">
                <div className="snapshot-item">
                  <div className="snapshot-icon-circle mint">
                    <Footprints size={16} />
                  </div>
                  <strong className="snapshot-big-pct">78%</strong>
                  <span className="snapshot-lbl">Report better focus</span>
                  <span className="snapshot-delta text-success">↑ 10%</span>
                </div>

                <div className="snapshot-item">
                  <div className="snapshot-icon-circle blue">
                    <Zap size={16} />
                  </div>
                  <strong className="snapshot-big-pct">72%</strong>
                  <span className="snapshot-lbl">Report higher energy</span>
                  <span className="snapshot-delta text-success">↑ 8%</span>
                </div>

                <div className="snapshot-item">
                  <div className="snapshot-icon-circle purple">
                    <Heart size={16} />
                  </div>
                  <strong className="snapshot-big-pct">69%</strong>
                  <span className="snapshot-lbl">Report reduced stress</span>
                  <span className="snapshot-delta text-success">↑ 11%</span>
                </div>
              </div>
            </Card>

            <Card className="hr-activity-feed-card">
              <div className="card-top-header">
                <h3 className="card-main-title">Recent Activity</h3>
                <span className="header-view-link" onClick={() => setTab('teams')} style={{ cursor: 'pointer' }}>View All →</span>
              </div>
              <div className="hr-feed-items">
                <div className="hr-feed-row">
                  <span className="feed-dot green" />
                  <span className="feed-txt"><strong>Development team</strong> reached 80% participation</span>
                  <span className="feed-time">2h ago</span>
                </div>
                <div className="hr-feed-row">
                  <span className="feed-dot orange" />
                  <span className="feed-txt"><strong>Marketing team</strong> started a new challenge</span>
                  <span className="feed-time">5h ago</span>
                </div>
                <div className="hr-feed-row">
                  <span className="feed-dot purple" />
                  <span className="feed-txt"><strong>HR team</strong> improved average sleep by 12%</span>
                  <span className="feed-time">1d ago</span>
                </div>
                <div className="hr-feed-row">
                  <span className="feed-dot yellow" />
                  <span className="feed-txt"><strong>Product team</strong> completed the weekly goal</span>
                  <span className="feed-time">1d ago</span>
                </div>
              </div>
            </Card>

            <div className="hr-executive-nature-tile">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
                alt="Colleagues in executive meeting room"
                className="executive-bg-img"
              />
              <div className="executive-quote-overlay">
                <strong>Invest in employee well-being.</strong>
                <span>Build a stronger tomorrow.</span>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ====================================================================
          TAB 2: TEAMS DIRECTORY (Master Reference Image 9 in overview)
          ==================================================================== */}
      {tab === 'teams' && (
        <div className="hr-tab-container">
          <div className="teams-directory-top-controls">
            <div className="teams-category-pills">
              {[
                { id: 'all', label: 'All Teams (248)' },
                { id: 'product', label: 'Product (25)' },
                { id: 'development', label: 'Development (32)' },
                { id: 'design', label: 'Design (22)' },
                { id: 'marketing', label: 'Marketing (20)' },
                { id: 'operations', label: 'Operations (26)' },
                { id: 'hr', label: 'HR (18)' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`category-pill-btn ${teamCategory === c.id ? 'active' : ''}`}
                  onClick={() => setTeamCategory(c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="teams-search-wrap">
              <Search size={15} />
              <input
                type="text"
                placeholder="Search team or department..."
                value={teamSearch}
                onChange={(e) => setTeamSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="teams-directory-grid">
            {filteredTeams.map((t, idx) => (
              <Card
                key={t.id}
                className={`team-directory-item-card ${t.hidden ? 'locked-cohort' : ''}`}
                style={{
                  borderTop: `3px solid ${t.color}`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '230px'
                }}
              >
                <div>
                  <div className="team-item-header">
                    <div className="team-avatar-icon" style={{ background: `${t.color}15`, color: t.color }}>
                      <Users size={18} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 className="team-item-name" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</h3>
                      <span className="team-item-members-count">{t.members} active members</span>
                    </div>
                    <span
                      className="team-momentum-badge-pill"
                      style={{
                        color: t.color,
                        background: `${t.color}14`,
                        border: `1px solid ${t.color}30`,
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {t.badge || t.status}
                    </span>
                  </div>

                  {t.hidden ? (
                    <div className="team-locked-privacy-box" style={{ marginTop: '16px' }}>
                      <ShieldCheck size={18} style={{ color: '#F59E0B', flexShrink: 0 }} />
                      <span style={{ fontSize: '12px', color: '#92400E' }}>
                        Cohort metrics redacted to protect individual privacy (&lt; 5 members)
                      </span>
                    </div>
                  ) : (
                    <>
                      {t.sparkline && (
                        <div className="team-sparkline-box">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 700, letterSpacing: '0.04em' }}>7-DAY MOMENTUM</span>
                            <span style={{ fontSize: '10.5px', color: t.color, fontWeight: 700 }}>
                              {t.sparkline[t.sparkline.length - 1] >= t.sparkline[0] ? '↑ Positive Rhythm' : '→ Steady'}
                            </span>
                          </div>
                          {renderSparkline(t.sparkline, t.color)}
                        </div>
                      )}

                      <div className="team-item-stats-triplet" style={{ marginTop: t.sparkline ? '6px' : '16px' }}>
                        <div className="stat-unit">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <span className="lbl">Participation</span>
                            <strong className="val text-success">{t.activePct}%</strong>
                          </div>
                          <div style={{ width: '100%', height: '5px', background: '#E2E8F0', borderRadius: '4px', marginTop: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${t.activePct}%`, height: '100%', background: 'linear-gradient(90deg, #10B981, #059669)', borderRadius: '4px' }} />
                          </div>
                        </div>
                        <div className="stat-unit">
                          <span className="lbl">Avg. Steps</span>
                          <strong className="val">{t.steps?.toLocaleString()}</strong>
                        </div>
                        <div className="stat-unit">
                          <span className="lbl">Avg. Sleep</span>
                          <strong className="val">{t.sleep} h</strong>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="team-item-footer" style={{ marginTop: 'auto', paddingTop: '14px' }}>
                  <div className="team-avatars-row" style={{ marginBottom: 0 }}>
                    <img
                      src={getMemberAvatar(idx * 3, 'Alex')}
                      alt="member"
                      className="avatar-micro"
                      onError={(e) => handleAvatarError(e, 'Alex')}
                    />
                    <img
                      src={getMemberAvatar(idx * 3 + 1, 'Priya')}
                      alt="member"
                      className="avatar-micro"
                      onError={(e) => handleAvatarError(e, 'Priya')}
                    />
                    <img
                      src={getMemberAvatar(idx * 3 + 2, 'Rahul')}
                      alt="member"
                      className="avatar-micro"
                      onError={(e) => handleAvatarError(e, 'Rahul')}
                    />
                    {t.members > 3 && (
                      <span className="avatar-overflow-badge">+{t.members - 3}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    className="team-view-btn"
                    onClick={() => onNavigate && onNavigate('team')}
                  >
                    View Team →
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ====================================================================
          TAB 3: PROGRAM IMPACT (Master Reference Image 6 in overview)
          ==================================================================== */}
      {tab === 'impact' && (
        <div className="hr-tab-container">
          {/* 1. EXECUTIVE HERO BANNER WITH REALISTIC WORKPLACE IMAGE */}
          <Card className="impact-executive-hero-card" style={{ marginBottom: '22px', overflow: 'hidden', padding: 0, border: '1px solid #E2E8F0', borderRadius: '16px', background: '#FFFFFF' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 0.95fr', alignItems: 'stretch' }}>
              <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '4px 10px', borderRadius: '20px', color: '#065F46', fontSize: '11.5px', fontWeight: 700, marginBottom: '14px' }}>
                    <Sparkles size={13} style={{ color: '#10B981' }} />
                    <span>ENTERPRISE PILOT VALIDATION REPORT</span>
                  </div>
                  <h2 style={{ fontSize: '23px', fontWeight: 800, color: '#0F172A', lineHeight: 1.25, margin: '0 0 10px 0' }}>
                    Measurable Well-Being Impact Across 248 Knowledge Workers
                  </h2>
                  <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.55, margin: 0 }}>
                    Comprehensive before-and-after assessment across 7 engineering and product cohorts. Verifying physical movement, sustained afternoon alertness, and collective resilience with zero privacy compromise.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F8FAFC', padding: '7px 12px', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '12px', fontWeight: 600, color: '#0F172A' }}>
                    <ShieldCheck size={15} style={{ color: '#10B981' }} />
                    <span>K ≥ 5 Anonymity Enforced</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F8FAFC', padding: '7px 12px', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '12px', fontWeight: 600, color: '#0F172A' }}>
                    <Activity size={15} style={{ color: '#3B82F6' }} />
                    <span>+42% Afternoon Focus</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F8FAFC', padding: '7px 12px', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '12px', fontWeight: 600, color: '#0F172A' }}>
                    <DollarSign size={15} style={{ color: '#F59E0B' }} />
                    <span>3.2x Attrition ROI</span>
                  </div>
                </div>
              </div>

              <div style={{ position: 'relative', minHeight: '220px' }}>
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
                  alt="Engineering team collaboration and wellness"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 25%, rgba(15,23,42,0.4) 100%)' }} />
                <div style={{ position: 'absolute', bottom: '16px', right: '16px', background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', padding: '6px 12px', borderRadius: '8px', color: '#FFFFFF', fontSize: '11px', fontWeight: 600 }}>
                  7 Squads • 6-Week Pilot
                </div>
              </div>
            </div>
          </Card>

          {/* 2. INTERACTIVE BEFORE VS AFTER COMPARISON SWITCHER */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px', background: '#FFFFFF', padding: '14px 20px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ECFDF5', color: '#10B981', display: 'grid', placeItems: 'center' }}>
                <Sliders size={16} />
              </div>
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>
                  Interactive Cohort Comparison Mode
                </div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>
                  {impactMode === 'post'
                    ? 'Showing 6-week post-pilot outcomes with Habit Rescue active'
                    : 'Showing pre-program baseline measurements (Week 0)'}
                </div>
              </div>
            </div>

            <div style={{ display: 'inline-flex', background: '#F1F5F9', padding: '4px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <button
                type="button"
                onClick={() => setImpactMode('baseline')}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  background: impactMode === 'baseline' ? '#0F172A' : 'transparent',
                  color: impactMode === 'baseline' ? '#FFFFFF' : '#475569',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                Baseline (Pre-Pilot Week 0)
              </button>
              <button
                type="button"
                onClick={() => setImpactMode('post')}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  background: impactMode === 'post' ? '#10B981' : 'transparent',
                  color: impactMode === 'post' ? '#FFFFFF' : '#475569',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: impactMode === 'post' ? '0 2px 6px rgba(16, 185, 129, 0.3)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                Post-Pilot (Week 6 Outcomes) ✓
              </button>
            </div>
          </div>

          {/* 3. DYNAMIC 4 HERO METRICS */}
          <section className="impact-4-kpis-grid">
            <Card className="telemetry-stat-card">
              <div className="stat-icon-square mint">
                <Users size={18} />
              </div>
              <div className="stat-content-box">
                <span className="stat-meta-label">Active Participation</span>
                <div className="stat-big-val">
                  {impactMode === 'post' ? '82%' : '48%'}
                  <span className={impactMode === 'post' ? 'stat-delta-green' : 'stat-delta-subtle'}>
                    {impactMode === 'post' ? '↑ +34% Uplift' : 'Baseline'}
                  </span>
                </div>
                <span className="stat-sub-caption">
                  {impactMode === 'post' ? 'sustained cohort retention' : 'pre-pilot engagement'}
                </span>
              </div>
            </Card>

            <Card className="telemetry-stat-card">
              <div className="stat-icon-square blue">
                <Footprints size={18} />
              </div>
              <div className="stat-content-box">
                <span className="stat-meta-label">Average Daily Steps {hrImpact?.records ? '(Live DB)' : ''}</span>
                <div className="stat-big-val">
                  {impactMode === 'post'
                    ? (hrImpact?.records ? `${((hrImpact.duringAvgSteps || hrImpact.beforeAvgSteps) / 1000).toFixed(1)}K` : '7.8K')
                    : '5.4K'}{' '}
                  <span className={impactMode === 'post' ? 'stat-delta-green' : 'stat-delta-subtle'}>
                    {impactMode === 'post' ? '↑ +45% Uplift' : 'Sedentary'}
                  </span>
                </div>
                <span className="stat-sub-caption">
                  {impactMode === 'post'
                    ? (hrImpact?.records ? `${hrImpact.records} records computed` : 'vs 5.4K baseline')
                    : 'sedentary desk posture'}
                </span>
              </div>
            </Card>

            <Card className="telemetry-stat-card">
              <div className="stat-icon-square orange">
                <Sparkles size={18} />
              </div>
              <div className="stat-content-box">
                <span className="stat-meta-label">Well-Being Pulse</span>
                <div className="stat-big-val">
                  {impactMode === 'post' ? '+25%' : '52 / 100'}
                  <span className={impactMode === 'post' ? 'stat-delta-green' : 'stat-delta-subtle'}>
                    {impactMode === 'post' ? '↑ Optimal' : 'High Strain'}
                  </span>
                </div>
                <span className="stat-sub-caption">
                  {impactMode === 'post' ? 'quarterly pulse benchmark' : 'burnout warning indicator'}
                </span>
              </div>
            </Card>

            <Card className="telemetry-stat-card">
              <div className="stat-icon-square teal">
                <Zap size={18} />
              </div>
              <div className="stat-content-box">
                <span className="stat-meta-label">Afternoon Focus Retention</span>
                <div className="stat-big-val">
                  {impactMode === 'post' ? '72%' : '41%'}
                  <span className={impactMode === 'post' ? 'stat-delta-green' : 'stat-delta-subtle'}>
                    {impactMode === 'post' ? '↑ +31% Focus' : '2-4 PM Slump'}
                  </span>
                </div>
                <span className="stat-sub-caption">
                  {impactMode === 'post' ? 'slump eliminated by rescues' : 'mid-day fatigue crashes'}
                </span>
              </div>
            </Card>
          </section>

          {/* 4. COHORT ENERGY & WORKDAY RHYTHM HEATMAP MATRIX */}
          <Card className="impact-heatmap-card" style={{ marginBottom: '22px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={18} style={{ color: '#10B981' }} />
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Cohort Energy & Workday Rhythm Heatmap (Hourly Analysis)
                  </h3>
                </div>
                <p style={{ fontSize: '12.5px', color: '#64748B', margin: '4px 0 0 0' }}>
                  {impactMode === 'post'
                    ? 'Post-Pilot: Micro-habit rescue routines eliminate the classic 2:00 PM - 4:00 PM afternoon energy slump.'
                    : 'Baseline: Severe alertness drops observed after 1:00 PM lunch across engineering cohorts.'}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '11.5px', color: '#475569', fontWeight: 600 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#FCA5A5' }} />
                  <span>Slump (&lt;50%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#FCD34D' }} />
                  <span>Moderate (50-74%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#34D399' }} />
                  <span>Active (75-84%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#10B981' }} />
                  <span>Optimal Flow (85%+)</span>
                </div>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '8px 8px' }}>
                <thead>
                  <tr>
                    <th style={{ width: '70px', textAlign: 'left', fontSize: '12px', color: '#64748B', fontWeight: 700, padding: '4px 8px' }}>Day</th>
                    {heatmapHours.map((h, i) => (
                      <th key={i} style={{ textAlign: 'center', fontSize: '12px', color: '#0F172A', fontWeight: 700, padding: '4px 8px' }}>
                        {h}
                      </th>
                    ))}
                    <th style={{ textAlign: 'left', fontSize: '12px', color: '#64748B', fontWeight: 700, padding: '4px 8px' }}>Cohort Observation</th>
                  </tr>
                </thead>
                <tbody>
                  {heatmapData.map((row, rIdx) => {
                    const scores = impactMode === 'post' ? row.post : row.baseline;
                    return (
                      <tr key={rIdx}>
                        <td style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', padding: '6px 8px' }}>{row.day}</td>
                        {scores.map((score, cIdx) => (
                          <td
                            key={cIdx}
                            onMouseEnter={() => setHoveredHeatmapCell({ day: row.day, hour: heatmapHours[cIdx], score, desc: row.desc })}
                            onMouseLeave={() => setHoveredHeatmapCell(null)}
                            style={{
                              background: getHeatmapBg(score),
                              color: getHeatmapColor(score),
                              textAlign: 'center',
                              padding: '12px 10px',
                              borderRadius: '10px',
                              fontWeight: 800,
                              fontSize: '13px',
                              cursor: 'pointer',
                              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                              boxShadow: hoveredHeatmapCell?.day === row.day && hoveredHeatmapCell?.hour === heatmapHours[cIdx] ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                              transform: hoveredHeatmapCell?.day === row.day && hoveredHeatmapCell?.hour === heatmapHours[cIdx] ? 'scale(1.06)' : 'scale(1)'
                            }}
                            title={`${row.day} at ${heatmapHours[cIdx]}: ${score}% alertness`}
                          >
                            {score}%
                          </td>
                        ))}
                        <td style={{ fontSize: '12px', color: '#475569', padding: '6px 12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #F1F5F9' }}>
                          {impactMode === 'post' ? row.desc : 'Observed mid-day dip between 1-3 PM'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {hoveredHeatmapCell && (
              <div style={{ marginTop: '12px', padding: '8px 14px', background: '#ECFDF5', borderRadius: '8px', border: '1px solid #A7F3D0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#065F46' }}>
                <Info size={14} style={{ color: '#10B981' }} />
                <span><strong>{hoveredHeatmapCell.day} at {hoveredHeatmapCell.hour} ({hoveredHeatmapCell.score}% Energy):</strong> {hoveredHeatmapCell.desc}</span>
              </div>
            )}
          </Card>

          {/* 5. KEY IMPACT AREAS (4 CARDS) */}
          <section className="impact-areas-grid">
            <Card className="impact-area-card">
              <div className="impact-area-icon mint"><Activity size={20} /></div>
              <h3 className="impact-area-title">Physical Health</h3>
              <p className="impact-area-desc">Increased activity loops and restorative sleep patterns across working cohorts.</p>
            </Card>

            <Card className="impact-area-card">
              <div className="impact-area-icon purple"><Heart size={20} /></div>
              <h3 className="impact-area-title">Mental Well-being</h3>
              <p className="impact-area-desc">Reduced stress through guilt-free Habit Rescue and psychological safety.</p>
            </Card>

            <Card className="impact-area-card">
              <div className="impact-area-icon blue"><Zap size={20} /></div>
              <h3 className="impact-area-title">Productivity</h3>
              <p className="impact-area-desc">Sustained afternoon focus without burnout or mid-day energy crashes.</p>
            </Card>

            <Card className="impact-area-card">
              <div className="impact-area-icon orange"><Users size={20} /></div>
              <h3 className="impact-area-title">Team Connection</h3>
              <p className="impact-area-desc">Stronger collaboration and mutual encouragement without competitive rank.</p>
            </Card>
          </section>

          {/* 6. IMPACT TREND CHART & EMPLOYEE FEEDBACK */}
          <section className="impact-trend-feedback-grid">
            <Card className="impact-trend-card">
              <div className="card-top-header">
                <div>
                  <h3 className="card-main-title">Impact Trend</h3>
                  <p className="card-sub-description">Telemetry progression across pilot stages</p>
                </div>
                <div className="chart-legend-row">
                  <span className="legend-item"><span className="legend-dot green" /> Steps</span>
                  <span className="legend-item"><span className="legend-dot orange" /> Active Minutes</span>
                  <span className="legend-item"><span className="legend-dot blue" /> Sleep</span>
                  <span className="legend-item"><span className="legend-dot purple" /> Participation</span>
                </div>
              </div>

              <div className="impact-chart-viewport">
                <svg viewBox="0 0 500 160" className="chart-svg-multi">
                  <path d="M 20,130 Q 140,110 260,80 T 480,50" fill="none" stroke="#10B981" strokeWidth="2.5" />
                  <path d="M 20,140 Q 140,125 260,100 T 480,75" fill="none" stroke="#F59E0B" strokeWidth="2.5" />
                  <path d="M 20,150 Q 140,135 260,120 T 480,95" fill="none" stroke="#3B82F6" strokeWidth="2.5" />
                </svg>
                <div className="chart-axis-x">
                  <span>Jul</span>
                  <span>Aug</span>
                  <span>Sep</span>
                  <span>Oct</span>
                </div>
              </div>
            </Card>

            <Card className="impact-feedback-quotes-card">
              <div className="card-top-header">
                <h3 className="card-main-title">Employee Feedback</h3>
                <span className="header-view-link">See All →</span>
              </div>

              <div className="feedback-quotes-stack">
                <div className="feedback-quote-row">
                  <p className="quote-text">“I feel more energetic and focused throughout the day.”</p>
                  <span className="quote-author">— Priya S., Product Team</span>
                </div>
                <div className="feedback-quote-row">
                  <p className="quote-text">“Habit Rescue has helped our team stay connected even on busy days.”</p>
                  <span className="quote-author">— Rahul K., Development</span>
                </div>
                <div className="feedback-quote-row">
                  <p className="quote-text">“It's a simple but effective way to build healthier habits together.”</p>
                  <span className="quote-author">— Neha M., Design Team</span>
                </div>
              </div>
            </Card>
          </section>
        </div>
      )}

      {/* ====================================================================
          TAB 4: PROGRAM ROI (Master Reference Image 8 in overview)
          ==================================================================== */}
      {tab === 'roi' && (
        <div className="hr-tab-container">
          {/* 1. EXECUTIVE BOARDROOM HERO BANNER */}
          <Card className="roi-executive-hero-card" style={{ marginBottom: '22px', overflow: 'hidden', padding: 0, border: '1px solid #E2E8F0', borderRadius: '16px', background: '#FFFFFF' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 0.95fr', alignItems: 'stretch' }}>
              <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '4px 10px', borderRadius: '20px', color: '#065F46', fontSize: '11.5px', fontWeight: 700, marginBottom: '14px' }}>
                    <DollarSign size={13} style={{ color: '#10B981' }} />
                    <span>CAPITAL EFFICIENCY & BUSINESS IMPACT</span>
                  </div>
                  <h2 style={{ fontSize: '23px', fontWeight: 800, color: '#0F172A', lineHeight: 1.25, margin: '0 0 10px 0' }}>
                    Executive ROI & Retention Cost Simulator
                  </h2>
                  <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.55, margin: 0 }}>
                    Quantifying measurable enterprise return on well-being investments. Model turnover prevention, health claim mitigation, and sustained workday productivity across knowledge cohorts.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F8FAFC', padding: '7px 12px', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '12px', fontWeight: 600, color: '#0F172A' }}>
                    <CheckCircle2 size={15} style={{ color: '#10B981' }} />
                    <span>Payback: 3.8 Months</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F8FAFC', padding: '7px 12px', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '12px', fontWeight: 600, color: '#0F172A' }}>
                    <TrendingUp size={15} style={{ color: '#3B82F6' }} />
                    <span>Breakeven: {breakEvenTurnover} Resignation{breakEvenTurnover > 1 ? 's' : ''}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F8FAFC', padding: '7px 12px', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '12px', fontWeight: 600, color: '#0F172A' }}>
                    <Sparkles size={15} style={{ color: '#F59E0B' }} />
                    <span>Net Gain: +{fmtMoney(netBenefit)}</span>
                  </div>
                </div>
              </div>

              <div style={{ position: 'relative', minHeight: '220px' }}>
                <img
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80"
                  alt="Executive boardroom corporate finance and planning"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 25%, rgba(15,23,42,0.4) 100%)' }} />
                <div style={{ position: 'absolute', bottom: '16px', right: '16px', background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', padding: '6px 12px', borderRadius: '8px', color: '#FFFFFF', fontSize: '11px', fontWeight: 600 }}>
                  3.2x Industry Multiple
                </div>
              </div>
            </div>
          </Card>

          {/* 2. TOP CONTROLS: PRESET SCENARIOS & DUAL CURRENCY TOGGLE */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px', background: '#FFFFFF', padding: '14px 20px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 700, color: '#0F172A' }}>
                <Sliders size={16} style={{ color: '#10B981' }} />
                <span>Scenario Presets:</span>
              </div>
              <div className="roi-preset-pills-row">
                <button
                  type="button"
                  className={`roi-preset-btn ${roiPreset === 'startup' ? 'active' : ''}`}
                  onClick={() => applyRoiPreset('startup')}
                >
                  🏢 Startup (50 staff)
                </button>
                <button
                  type="button"
                  className={`roi-preset-btn ${roiPreset === 'mid' ? 'active' : ''}`}
                  onClick={() => applyRoiPreset('mid')}
                >
                  🏢 Mid-Market (150 staff)
                </button>
                <button
                  type="button"
                  className={`roi-preset-btn ${roiPreset === 'enterprise' ? 'active' : ''}`}
                  onClick={() => applyRoiPreset('enterprise')}
                >
                  🏛️ Enterprise (500 staff)
                </button>
              </div>
            </div>

            <div style={{ display: 'inline-flex', background: '#F1F5F9', padding: '3px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <button
                type="button"
                onClick={() => setRoiCurrency('USD')}
                style={{
                  padding: '7px 14px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 700,
                  background: roiCurrency === 'USD' ? '#10B981' : 'transparent',
                  color: roiCurrency === 'USD' ? '#FFFFFF' : '#475569',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                $ USD (Dollar)
              </button>
              <button
                type="button"
                onClick={() => setRoiCurrency('INR')}
                style={{
                  padding: '7px 14px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 700,
                  background: roiCurrency === 'INR' ? '#10B981' : 'transparent',
                  color: roiCurrency === 'INR' ? '#FFFFFF' : '#475569',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                ₹ INR (Rupees @ 83)
              </button>
            </div>
          </div>

          {/* 3. 4 VALUE CARDS WITH DELTA BADGES & CITATIONS */}
          <section className="roi-4-cards-grid">
            <Card className="telemetry-stat-card">
              <div className="stat-icon-square mint"><TrendingUp size={18} /></div>
              <div className="stat-content-box">
                <span className="stat-meta-label">Productivity Increase</span>
                <div className="stat-big-val">+18% <span className="stat-delta-green">↑ 2.4 h/wk</span></div>
                <span className="stat-sub-caption">Harvard Business Review benchmark</span>
              </div>
            </Card>

            <Card className="telemetry-stat-card">
              <div className="stat-icon-square teal"><Heart size={18} /></div>
              <div className="stat-content-box">
                <span className="stat-meta-label">Reported Stress Levels</span>
                <div className="stat-big-val">-24% <span className="stat-delta-green">↓ Exit Risk</span></div>
                <span className="stat-sub-caption">burnout prevention rate</span>
              </div>
            </Card>

            <Card className="telemetry-stat-card">
              <div className="stat-icon-square orange"><Users size={18} /></div>
              <div className="stat-content-box">
                <span className="stat-meta-label">Employee Engagement</span>
                <div className="stat-big-val">+27% <span className="stat-delta-green">↑ In Sync</span></div>
                <span className="stat-sub-caption">weekly habit participation</span>
              </div>
            </Card>

            <Card className="telemetry-stat-card">
              <div className="stat-icon-square purple"><DollarSign size={18} /></div>
              <div className="stat-content-box">
                <span className="stat-meta-label">Projected Net ROI</span>
                <div className="stat-big-val">3.2x <span className="stat-delta-green">↑ +220%</span></div>
                <span className="stat-sub-caption">net capital efficiency</span>
              </div>
            </Card>
          </section>

          {/* 4. SPLIT: FINANCIAL WATERFALL LEDGER (LEFT) vs INTERACTIVE MODELER SLIDERS (RIGHT) */}
          <section className="roi-breakdown-calculator-grid" style={{ marginBottom: '22px' }}>
            {/* LEFT: THE FINANCIAL WATERFALL CARD */}
            <Card className="roi-results-card">
              <div className="card-top-header" style={{ marginBottom: '14px' }}>
                <div>
                  <h3 className="card-main-title">Financial Value Waterfall</h3>
                  <p className="card-sub-description">Transparent ledger breakdown of investment vs capital returns</p>
                </div>
                <span className="roi-chart-crossover-badge">
                  Payback: Month 3.8
                </span>
              </div>

              <div className="roi-waterfall-list">
                <div className="roi-waterfall-item">
                  <div className="roi-waterfall-left">
                    <div className="roi-waterfall-icon negative">−</div>
                    <div className="roi-waterfall-label-wrap">
                      <span className="roi-waterfall-title">Annual Program Investment</span>
                      <span className="roi-waterfall-desc">{roiEmployees} staff × {fmtMoney(roiPrice)}/mo × 12 months</span>
                    </div>
                  </div>
                  <strong className="roi-waterfall-val red">−{fmtMoney(annualInvestment)}</strong>
                </div>

                <div className="roi-waterfall-item">
                  <div className="roi-waterfall-left">
                    <div className="roi-waterfall-icon positive">+</div>
                    <div className="roi-waterfall-label-wrap">
                      <span className="roi-waterfall-title">Healthcare & Sick Leave Mitigation</span>
                      <span className="roi-waterfall-desc">Reduced claim volume & prevented absenteeism (0.95x)</span>
                    </div>
                  </div>
                  <strong className="roi-waterfall-val green">+{fmtMoney(healthcareSavings)}</strong>
                </div>

                <div className="roi-waterfall-item">
                  <div className="roi-waterfall-left">
                    <div className="roi-waterfall-icon positive">+</div>
                    <div className="roi-waterfall-label-wrap">
                      <span className="roi-waterfall-title">Voluntary Turnover Replacement Saved</span>
                      <span className="roi-waterfall-desc">Recruiting, agency & onboarding costs avoided (1.45x)</span>
                    </div>
                  </div>
                  <strong className="roi-waterfall-val green">+{fmtMoney(turnoverSavings)}</strong>
                </div>

                <div className="roi-waterfall-item">
                  <div className="roi-waterfall-left">
                    <div className="roi-waterfall-icon positive">+</div>
                    <div className="roi-waterfall-label-wrap">
                      <span className="roi-waterfall-title">Afternoon Alertness & Focus Lift</span>
                      <span className="roi-waterfall-desc">Eliminated 2–4 PM slump via Micro-Habit Rescues (0.80x)</span>
                    </div>
                  </div>
                  <strong className="roi-waterfall-val green">+{fmtMoney(productivityLiftSavings)}</strong>
                </div>

                <div className="roi-waterfall-item highlight-net">
                  <div className="roi-waterfall-left">
                    <div className="roi-waterfall-icon net">★</div>
                    <div className="roi-waterfall-label-wrap">
                      <span className="roi-waterfall-title" style={{ color: '#065F46', fontSize: '14px' }}>Net Enterprise Gain (Value Created)</span>
                      <span className="roi-waterfall-desc" style={{ color: '#047857' }}>Total savings minus annual program investment</span>
                    </div>
                  </div>
                  <strong className="roi-waterfall-val net">+{fmtMoney(netBenefit)}</strong>
                </div>
              </div>
            </Card>

            {/* RIGHT: INTERACTIVE SLIDERS MODELER */}
            <Card className="roi-calc-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                <h3 className="card-main-title">Interactive Modeler Assumptions</h3>
                <button
                  type="button"
                  onClick={verifyRoiWithServer}
                  style={{
                    fontSize: '11.5px',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    border: '1px solid #10B981',
                    background: '#ECFDF5',
                    color: '#059669',
                    cursor: 'pointer',
                    fontWeight: 700,
                  }}
                >
                  Verify Formula with Server (/api/hr/roi)
                </button>
              </div>

              {roiServerVerified && (
                <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#166534', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', marginBottom: '14px' }}>
                  ✓ Server Calculated: Cost = {fmtMoney(roiServerVerified.annualProgramCost || 0)} · Breakeven = {roiServerVerified.breakEvenPreventedResignations} employees
                </div>
              )}

              <div className="roi-sliders-list">
                <div className="slider-group">
                  <div className="slider-labels">
                    <span>Participating Employees:</span>
                    <strong style={{ color: '#0F172A', fontSize: '13.5px' }}>{roiEmployees} staff</strong>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="1000"
                    step="10"
                    value={roiEmployees}
                    onChange={(e) => setRoiEmployees(Number(e.target.value))}
                    className="green-slider"
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                    <span>20 staff</span>
                    <span>500 staff</span>
                    <span>1,000 staff</span>
                  </div>
                </div>

                <div className="slider-group">
                  <div className="slider-labels">
                    <span>Monthly Investment / Employee:</span>
                    <strong style={{ color: '#0F172A', fontSize: '13.5px' }}>{fmtMoney(roiPrice)} / mo</strong>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="20"
                    step="1"
                    value={roiPrice}
                    onChange={(e) => setRoiPrice(Number(e.target.value))}
                    className="green-slider"
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                    <span>{fmtMoney(2)}/mo</span>
                    <span>{fmtMoney(10)}/mo</span>
                    <span>{fmtMoney(20)}/mo</span>
                  </div>
                </div>

                <div className="slider-group">
                  <div className="slider-labels">
                    <span>Replacement Cost per Resignation:</span>
                    <strong style={{ color: '#0F172A', fontSize: '13.5px' }}>{fmtMoney(roiCostPerResignation)}</strong>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="40000"
                    step="2500"
                    value={roiCostPerResignation}
                    onChange={(e) => setRoiCostPerResignation(Number(e.target.value))}
                    className="green-slider"
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                    <span>{fmtMoney(5000)}</span>
                    <span>{fmtMoney(20000)}</span>
                    <span>{fmtMoney(40000)}</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '18px', padding: '12px 14px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '11.5px', color: '#64748B', display: 'block' }}>Breakeven Threshold</span>
                  <strong style={{ fontSize: '14px', color: '#0F172A' }}>
                    Preventing {breakEvenTurnover} resignation{breakEvenTurnover > 1 ? 's' : ''} / year
                  </strong>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#10B981', background: '#ECFDF5', padding: '4px 10px', borderRadius: '8px', border: '1px solid #A7F3D0' }}>
                  100% Cost Recovered
                </span>
              </div>
            </Card>
          </section>

          {/* 5. ROI CHART + KEY BUSINESS OUTCOMES */}
          <section className="roi-chart-outcomes-grid">
            <Card className="roi-trend-chart-card">
              <div className="card-top-header">
                <div>
                  <h3 className="card-main-title">Cumulative Financial Trajectory</h3>
                  <p className="card-sub-description">Simulated monthly compounding value creation ({roiCurrency})</p>
                </div>
                <span className="roi-chart-crossover-badge">
                  Crossover Point: Month 3.8
                </span>
              </div>

              <div className="roi-bars-simulation-wrap">
                {[
                  { m: 'Month 1', h: 32, v: fmtMoney(Math.round(annualInvestment * 0.28)) },
                  { m: 'Month 2', h: 48, v: fmtMoney(Math.round(annualInvestment * 0.65)) },
                  { m: 'Month 3', h: 64, v: fmtMoney(Math.round(annualInvestment * 1.05)) },
                  { m: 'Month 4', h: 78, v: fmtMoney(Math.round(annualInvestment * 1.55)) },
                  { m: 'Month 5', h: 90, v: fmtMoney(Math.round(annualInvestment * 2.25)) },
                  { m: 'Month 6', h: 100, v: fmtMoney(Math.round(annualInvestment * 3.20)) },
                ].map((b, idx) => (
                  <div key={idx} className="roi-sim-col">
                    <span className="roi-sim-val" style={{ fontSize: '11px' }}>{b.v}</span>
                    <div className="roi-sim-pillar" style={{ height: `${b.h}%` }} />
                    <span className="roi-sim-lbl">{b.m}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="roi-outcomes-card">
              <div className="card-top-header">
                <h3 className="card-main-title">Key Business Drivers</h3>
              </div>
              <div className="roi-outcomes-list">
                <div className="outcome-item">
                  <CheckCircle2 size={16} className="text-success" />
                  <div>
                    <strong>Lower Healthcare & Sick Costs</strong>
                    <p>Preventative micro-walks and rest loops reduce claims and absenteeism.</p>
                  </div>
                </div>

                <div className="outcome-item">
                  <CheckCircle2 size={16} className="text-success" />
                  <div>
                    <strong>Sustained Afternoon Productivity</strong>
                    <p>Eliminating post-lunch energy crashes yields 2.4+ productive hours per employee weekly.</p>
                  </div>
                </div>

                <div className="outcome-item">
                  <CheckCircle2 size={16} className="text-success" />
                  <div>
                    <strong>Mitigated Voluntary Resignations</strong>
                    <p>Psychological safety and guilt-free rescues keep core engineers engaged.</p>
                  </div>
                </div>

                <div className="outcome-item">
                  <CheckCircle2 size={16} className="text-success" />
                  <div>
                    <strong>Collaborative Team Culture</strong>
                    <p>Non-competitive rhythm loops foster psychological safety and high squad retention.</p>
                  </div>
                </div>
              </div>
            </Card>
          </section>
        </div>
      )}

      {/* ====================================================================
          TAB 5: PRIVACY & DATA SECURITY
          ==================================================================== */}
      {tab === 'privacy' && (
        <div className="hr-tab-container">
          <Card className="privacy-trust-hero-card">
            <div className="privacy-center-shield-badge">
              <ShieldCheck size={36} className="text-success" />
            </div>
            <h2 className="privacy-hero-h2">Privacy & Data Security</h2>
            <p className="privacy-hero-p">
              We are committed to protecting your information and giving you complete control over your data.
            </p>

            <div className="privacy-3-pillars-row">
              <div className="pillar-tile">
                <CheckCircle2 size={18} className="text-success" />
                <div>
                  <strong>Your Data is Yours</strong>
                  <p>You control what to share and what to keep strictly private.</p>
                </div>
              </div>

              <div className="pillar-tile">
                <Lock size={18} className="text-primary" />
                <div>
                  <strong>Secure by Design</strong>
                  <p>We use industry-standard encryption and isolated storage vaults.</p>
                </div>
              </div>

              <div className="pillar-tile">
                <ShieldCheck size={18} className="text-warning" />
                <div>
                  <strong>No Individual Ranking</strong>
                  <p>ThriveLoop focuses on collective wellness, not competitive pressure.</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
