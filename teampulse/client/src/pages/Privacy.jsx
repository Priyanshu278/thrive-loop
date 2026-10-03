import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  ShieldCheck,
  Lock,
  Eye,
  Download,
  Trash2,
  Edit,
  ArrowLeft,
  Check,
  Key,
  Database,
  ArrowRight,
  XCircle,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  Info,
  Server,
  Smartphone,
  BarChart2
} from 'lucide-react';

export function Privacy({ onBack }) {
  const [downloadToast, setDownloadToast] = useState('');

  function triggerDownload() {
    setDownloadToast('Downloading your verified data archive (JSON)...');
    setTimeout(() => setDownloadToast(''), 3500);
  }

  return (
    <div className="privacy-screen-layout">
      {/* 1. HEADER */}
      <div className="screen-header-block">
        <div className="screen-breadcrumb">
          <span>Governance</span>
          <span className="breadcrumb-divider">›</span>
          <span className="breadcrumb-active">Privacy & Security</span>
        </div>

        <div className="screen-title-row">
          <div>
            <h1 className="screen-main-heading">
              Privacy & Data <span className="highlight-emerald">Trust</span>
            </h1>
            <p className="screen-sub-heading">
              Mathematical privacy guarantees. Zero individual surveillance.
            </p>
            <p className="screen-description">
              ThriveLoop separates personal wellness habits from institutional reporting. Your employer cannot view your private daily habits.
            </p>
          </div>

          {onBack && (
            <button type="button" onClick={onBack} className="btn-back-clean">
              <ArrowLeft size={16} /> Back
            </button>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {downloadToast && (
        <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', padding: '10px 16px', borderRadius: '12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Sparkles size={16} />
          <span>{downloadToast}</span>
        </div>
      )}

      {/* ========================================================
          2. DATA FLOW PIPELINE ARCHITECTURE (VISUAL STORYTELLING)
         ======================================================== */}
      <Card className="privacy-pipeline-card" style={{ padding: '28px', background: '#FFFFFF', borderRadius: '18px', border: '1px solid #E2E8F0', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: '#10B981', textTransform: 'uppercase' }}>
              HOW YOUR DATA FLOWS
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '4px 0 0 0' }}>
              Cryptographic Segregation & Aggregation Pipeline
            </h2>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', color: '#059669', fontWeight: 700 }}>
            <ShieldCheck size={14} />
            <span>K-Anonymity Verified (K ≥ 5)</span>
          </div>
        </div>

        {/* 3-Step Connected Flow Grid */}
        <div className="privacy-flow-steps-grid">
          {/* Step 1: Employee Device */}
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '18px 16px', textAlign: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#EFF6FF', color: '#2563EB', display: 'grid', placeItems: 'center', margin: '0 auto 12px' }}>
              <Smartphone size={20} />
            </div>
            <strong style={{ fontSize: '14px', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
              1. Your Device
            </strong>
            <p style={{ fontSize: '11.5px', color: '#64748B', margin: 0, lineHeight: 1.45 }}>
              Steps, active time, & sleep logged privately. Encrypted in transit.
            </p>
          </div>

          {/* Arrow Connector 1 */}
          <div className="privacy-flow-arrow" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#94A3B8' }}>
            <ArrowRight size={20} />
          </div>

          {/* Step 2: Anonymization Vault */}
          <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '14px', padding: '18px 16px', textAlign: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#DCFCE7', color: '#059669', display: 'grid', placeItems: 'center', margin: '0 auto 12px' }}>
              <Cpu size={20} />
            </div>
            <strong style={{ fontSize: '14px', color: '#065F46', display: 'block', marginBottom: '4px' }}>
              2. K ≥ 5 Privacy Engine
            </strong>
            <p style={{ fontSize: '11.5px', color: '#047857', margin: 0, lineHeight: 1.45 }}>
              Aggregates cohorts. Cohorts &lt; 5 members are mathematically redacted.
            </p>
          </div>

          {/* Arrow Connector 2 */}
          <div className="privacy-flow-arrow" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#94A3B8' }}>
            <ArrowRight size={20} />
          </div>

          {/* Step 3: Company Insights */}
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '18px 16px', textAlign: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#F5F3FF', color: '#7C3AED', display: 'grid', placeItems: 'center', margin: '0 auto 12px' }}>
              <BarChart2 size={20} />
            </div>
            <strong style={{ fontSize: '14px', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
              3. Organization View
            </strong>
            <p style={{ fontSize: '11.5px', color: '#64748B', margin: 0, lineHeight: 1.45 }}>
              Anonymous department trends only. Zero names or individual ranks.
            </p>
          </div>
        </div>
      </Card>

      {/* ========================================================
          3. THE 3 CORE TRUST PILLARS
         ======================================================== */}
      <section className="privacy-pillars-grid">
        <Card style={{ padding: '22px', borderRadius: '16px', border: '1px solid #E2E8F0', background: '#FFFFFF' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#ECFDF5', color: '#059669', display: 'grid', placeItems: 'center', marginBottom: '14px' }}>
            <Key size={19} />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
            Your Data is Yours
          </h3>
          <p style={{ fontSize: '12.5px', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
            You maintain explicit data sovereignty. You can view, export, or permanently purge your daily wellness records at any time.
          </p>
        </Card>

        <Card style={{ padding: '22px', borderRadius: '16px', border: '1px solid #E2E8F0', background: '#FFFFFF' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#EFF6FF', color: '#2563EB', display: 'grid', placeItems: 'center', marginBottom: '14px' }}>
            <Lock size={19} />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
            The K ≥ 5 Anonymity Floor
          </h3>
          <p style={{ fontSize: '12.5px', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
            Any department, team, or challenge cohort with fewer than 5 participants is locked and hidden from all management dashboards.
          </p>
        </Card>

        <Card style={{ padding: '22px', borderRadius: '16px', border: '1px solid #E2E8F0', background: '#FFFFFF' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#FFF7ED', color: '#EA580C', display: 'grid', placeItems: 'center', marginBottom: '14px' }}>
            <ShieldCheck size={19} />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
            Zero Surveillance
          </h3>
          <p style={{ fontSize: '12.5px', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
            No leaderboards, shame notifications, or boss pings. Habit Rescue and fatigue mitigations are private between you and your daily rhythm.
          </p>
        </Card>
      </section>

      {/* ========================================================
          4. WHAT WE COLLECT vs. WHAT WE DON'T COLLECT vs. YOUR CONTROLS
         ======================================================== */}
      <section className="privacy-details-grid">
        {/* Column 1: What We Collect */}
        <Card style={{ padding: '22px', borderRadius: '16px', border: '1px solid #E2E8F0', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <CheckCircle2 size={18} style={{ color: '#10B981' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>What We Collect</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', marginTop: '6px', flexShrink: 0 }} />
              <div>
                <strong style={{ fontSize: '13px', color: '#0F172A' }}>Activity Rhythm Metrics</strong>
                <p style={{ fontSize: '11.5px', color: '#64748B', margin: '2px 0 0 0' }}>Daily steps, active minutes, and sleep hours entered or synced.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', marginTop: '6px', flexShrink: 0 }} />
              <div>
                <strong style={{ fontSize: '13px', color: '#0F172A' }}>Cohort Association</strong>
                <p style={{ fontSize: '11.5px', color: '#64748B', margin: '2px 0 0 0' }}>Company department name to allow collective team grouping.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', marginTop: '6px', flexShrink: 0 }} />
              <div>
                <strong style={{ fontSize: '13px', color: '#0F172A' }}>Opt-in Challenge Status</strong>
                <p style={{ fontSize: '11.5px', color: '#64748B', margin: '2px 0 0 0' }}>Collective milestone completions for group encouragement.</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Column 2: What We Never Collect */}
        <Card style={{ padding: '22px', borderRadius: '16px', border: '1px solid #E2E8F0', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <XCircle size={18} style={{ color: '#EF4444' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>What We Never Collect</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EF4444', marginTop: '6px', flexShrink: 0 }} />
              <div>
                <strong style={{ fontSize: '13px', color: '#0F172A' }}>No Geolocation or GPS</strong>
                <p style={{ fontSize: '11.5px', color: '#64748B', margin: '2px 0 0 0' }}>We never record where you walk, live, or commute.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EF4444', marginTop: '6px', flexShrink: 0 }} />
              <div>
                <strong style={{ fontSize: '13px', color: '#0F172A' }}>No Medical Diagnostic Files</strong>
                <p style={{ fontSize: '11.5px', color: '#64748B', margin: '2px 0 0 0' }}>Zero clinical records, prescriptions, or doctor consultations.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EF4444', marginTop: '6px', flexShrink: 0 }} />
              <div>
                <strong style={{ fontSize: '13px', color: '#0F172A' }}>No Keystroke or Screen Telemetry</strong>
                <p style={{ fontSize: '11.5px', color: '#64748B', margin: '2px 0 0 0' }}>No desktop surveillance or productivity tracking.</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Column 3: Your Direct Controls */}
        <Card style={{ padding: '22px', borderRadius: '16px', border: '1px solid #E2E8F0', background: '#FFFFFF' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>Your Controls</h3>
          <p style={{ fontSize: '11.5px', color: '#64748B', margin: '0 0 14px 0' }}>Manage or export your records:</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              type="button"
              onClick={triggerDownload}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 12px',
                borderRadius: '10px',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                fontSize: '12px',
                fontWeight: 600,
                color: '#0F172A',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <Download size={14} style={{ color: '#2563EB' }} />
              <span>Download JSON Export</span>
            </button>

            <button
              type="button"
              onClick={() => alert('Preferences saved. External sensor syncing is currently set to manual.')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 12px',
                borderRadius: '10px',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                fontSize: '12px',
                fontWeight: 600,
                color: '#0F172A',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <Edit size={14} style={{ color: '#059669' }} />
              <span>Update Sync Preferences</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (confirm('Permanently delete all your personal metrics? This cannot be undone.')) {
                  alert('Data deletion request scheduled. Account data will purge in 24 hours.');
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 12px',
                borderRadius: '10px',
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                fontSize: '12px',
                fontWeight: 600,
                color: '#DC2626',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <Trash2 size={14} style={{ color: '#DC2626' }} />
              <span>Delete My Data (GDPR Art. 17)</span>
            </button>
          </div>
        </Card>
      </section>

      {/* ========================================================
          5. INSTITUTIONAL COMMITMENT BANNER
         ======================================================== */}
      <div style={{ background: 'linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 65%, #ECFDF5 100%)', border: '1px solid #DCFCE7', borderRadius: '16px', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#ECFDF5', color: '#10B981', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <ShieldCheck size={22} />
        </div>
        <div>
          <strong style={{ fontSize: '14.5px', color: '#0F172A', display: 'block', marginBottom: '2px' }}>
            We Never Sell or Broker Personal Wellness Data
          </strong>
          <p style={{ fontSize: '12px', color: '#047857', margin: 0, lineHeight: 1.45 }}>
            ThriveLoop operates on direct B2B subscription licenses. We do not sell data to insurers, advertising brokers, or third parties.
          </p>
        </div>
      </div>
    </div>
  );
}
