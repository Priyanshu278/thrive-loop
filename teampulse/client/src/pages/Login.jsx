import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ThriveLoopLogo } from '../components/ui/ThriveLoopLogo';
import { ArrowRight, ShieldCheck, Users, HeartHandshake } from 'lucide-react';
import { api } from '../api';

export function Login({ onDone }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    name: 'Alex Morgan',
    email: 'alex@acme.com',
    password: 'password123',
    company: 'Acme Corp',
    hrCode: '',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const data = await api(`/auth/${mode}`, 'POST', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      onDone(data);
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setBusy(false);
    }
  }

  async function quickLogin(role = 'employee') {
    setError('');
    setBusy(true);
    const email = role === 'hr' ? 'hr@acme.com' : 'alex@acme.com';
    try {
      const data = await api('/auth/login', 'POST', { email, password: 'password123' });
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      onDone(data);
    } catch (err) {
      // Never fabricate a token here. A made-up session makes every later API
      // call return 401 while the UI quietly renders fallback data, so the
      // failure has to stay visible instead.
      setError(err.message || 'Demo login failed - please try again');
    } finally {
      setBusy(false);
    }
  }

  // Demo shortcut that still performs a real login, so the preview session is
  // authenticated and the dashboard shows live data rather than fallbacks.
  function guestPreview() {
    quickLogin('hr');
  }

  return (
    <div className="auth-shell" style={{ maxWidth: '440px', margin: '8vh auto', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <ThriveLoopLogo size={32} showText={true} />
        <p style={{ fontSize: '14px', color: '#64748B', marginTop: '6px' }}>
          Workplace wellbeing, built for human momentum.
        </p>
      </div>

      <Card style={{ padding: '28px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.4px', color: '#0F172A' }}>
            {mode === 'login' ? 'Sign in to your workspace' : 'Create your ThriveLoop account'}
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
            {mode === 'login'
              ? 'Enter your work credentials to access your daily rhythm.'
              : 'Start building sustainable workplace habits with your team.'}
          </p>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {mode === 'register' && (
            <>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Full name</label>
                <input
                  value={form.name}
                  onChange={update('name')}
                  placeholder="Alex Morgan"
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Company name</label>
                <input
                  value={form.company}
                  onChange={update('company')}
                  placeholder="Acme Corp"
                  required
                  className="form-input"
                />
              </div>
            </>
          )}

          <div className="form-group" style={{ margin: 0 }}>
            <label>Work email</label>
            <input
              value={form.email}
              onChange={update('email')}
              type="email"
              placeholder="alex@acme.com"
              required
              className="form-input"
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label>Password</label>
            <input
              value={form.password}
              onChange={update('password')}
              type="password"
              placeholder="6+ characters"
              required
              className="form-input"
            />
          </div>

          {mode === 'register' && (
            <div className="form-group" style={{ margin: 0 }}>
              <label>
                HR Access Code <span style={{ color: '#94A3B8', fontWeight: 400 }}>(optional for HR admin)</span>
              </label>
              <input
                value={form.hrCode}
                onChange={update('hrCode')}
                placeholder="e.g. TEAM-PULSE-HR"
                className="form-input"
              />
            </div>
          )}

          {error && (
            <div style={{ backgroundColor: '#FEE2E2', color: '#DC2626', padding: '10px', borderRadius: '8px', fontSize: '12.5px' }}>
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', height: '42px', marginTop: '6px' }}
            loading={busy}
          >
            {mode === 'login' ? 'Sign in' : 'Create account'} <ArrowRight size={15} />
          </Button>
        </form>

        {/* 1-CLICK INSTANT DEMO ACCESS FOR JUDGES / PREVIEWS */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '10px', textAlign: 'center' }}>
            ⚡ Instant 1-Click Demo Login
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => quickLogin('employee')}
              disabled={busy}
              style={{
                padding: '9px 10px',
                borderRadius: '8px',
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                color: '#065F46',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              👤 Alex (Employee)
            </button>
            <button
              type="button"
              onClick={() => quickLogin('hr')}
              disabled={busy}
              style={{
                padding: '9px 10px',
                borderRadius: '8px',
                background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                color: '#1E40AF',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              👑 HR Admin Portal
            </button>
          </div>

          <button
            type="button"
            onClick={guestPreview}
            style={{
              width: '100%',
              marginTop: '10px',
              padding: '9px',
              borderRadius: '8px',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              color: '#334155',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            🚀 One-Click Demo Preview →
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px dashed #E2E8F0' }}>
          <button
            type="button"
            style={{ fontSize: '12.5px', color: '#2563EB', fontWeight: 600 }}
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError('');
            }}
          >
            {mode === 'login'
              ? 'New to ThriveLoop? Create an account'
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '20px', fontSize: '12px', color: '#64748B' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <ShieldCheck size={14} style={{ color: '#16A34A' }} /> Privacy protected
        </span>
        <span>•</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <Users size={14} style={{ color: '#2563EB' }} /> No leaderboards
        </span>
      </div>
    </div>
  );
}
