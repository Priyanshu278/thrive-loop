import React, { useState } from 'react';
import {
  Users,
  PlusCircle,
  ArrowRight,
  Lock,
  Tag,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { api } from '../api';

export function SetupTeam({ onDone }) {
  const [mode, setMode] = useState('join'); // 'join' | 'create'
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setError(
        mode === 'join'
          ? 'Please enter your team invite code.'
          : 'Please enter a team name for your department.'
      );
      return;
    }

    setBusy(true);
    setError('');
    try {
      await api(
        mode === 'join' ? '/teams/join' : '/teams',
        'POST',
        mode === 'join' ? { inviteCode: trimmed } : { name: trimmed }
      );
      onDone();
    } catch (err) {
      setError(err.message || 'Failed to connect team. Please verify the code.');
    } finally {
      setBusy(false);
    }
  }

  function handleModeChange(newMode) {
    setMode(newMode);
    setValue('');
    setError('');
  }

  return (
    <div className="tl-find-viewport">
      {/* Decorative organic leaf accent in the background */}
      <svg
        className="tl-bg-leaf-accent"
        width="150"
        height="170"
        viewBox="0 0 150 170"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M0 170C40 145 70 100 85 55C100 10 135 0 150 0C120 45 105 95 80 135C55 165 20 170 0 170Z"
          fill="url(#tl-leaf-grad)"
          opacity="0.25"
        />
        <defs>
          <linearGradient id="tl-leaf-grad" x1="0" y1="170" x2="150" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38BDF8" />
            <stop offset="1" stopColor="#34D399" />
          </linearGradient>
        </defs>
      </svg>

      {/* Main Two-Column Card */}
      <div className="tl-find-card">
        {/* ========================================================
            LEFT COLUMN (≈ 45%): Editorial Visual & Human Wellbeing
           ======================================================== */}
        <div className="tl-hero-column">
          {/* Background image & gradient overlay */}
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
            alt="Workplace team collaborating with laptops"
            className="tl-hero-img"
          />
          <div className="tl-hero-overlay" />

          {/* Left panel overlay content: 100% visible, never cropped */}
          <div className="tl-hero-content">
            {/* Top Logo */}
            <div className="tl-hero-top">
              <div className="tl-brand-row">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                  <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2Z" fill="#38BDF8" fillOpacity="0.25" />
                  <path d="M7 17C14 17 19 12 19 5C12 5 7 10 7 17Z" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7 17L13 11" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <span className="tl-brand-name">ThriveLoop</span>
                  <div className="tl-brand-sub">Workplace Wellbeing</div>
                </div>
              </div>

              <div className="tl-hero-eyebrow">WORKPLACE WELLBEING</div>
              <h2 className="tl-hero-headline">
                Wellbeing works better <span className="tl-accent-word">together.</span>
              </h2>
              <p className="tl-hero-desc">
                Build healthier daily rhythms with the people you work with.
              </p>
            </div>

            {/* 3 Concise Benefits */}
            <div className="tl-benefits-list">
              <div className="tl-benefit-item">
                <div className="tl-benefit-icon green">
                  <Users size={16} />
                </div>
                <div>
                  <div className="tl-benefit-title">Team challenges</div>
                  <div className="tl-benefit-sub">Stay motivated together</div>
                </div>
              </div>

              <div className="tl-benefit-item">
                <div className="tl-benefit-icon blue">
                  <TrendingUp size={16} />
                </div>
                <div>
                  <div className="tl-benefit-title">Collective progress</div>
                  <div className="tl-benefit-sub">Celebrate small wins</div>
                </div>
              </div>

              <div className="tl-benefit-item">
                <div className="tl-benefit-icon purple">
                  <Lock size={15} />
                </div>
                <div>
                  <div className="tl-benefit-title">Your data stays private</div>
                  <div className="tl-benefit-sub">Only aggregate insights for your team</div>
                </div>
              </div>
            </div>

            {/* Bottom Quote Pill */}
            <div className="tl-quote-card">
              <div className="tl-quote-text">
                <span className="tl-quote-mark">“</span>
                Healthier people build happier, more productive teams.
                <span className="tl-quote-mark">”</span>
              </div>
              <div className="tl-quote-bar" />
            </div>
          </div>
        </div>

        {/* ========================================================
            RIGHT COLUMN (≈ 55%): High-Contrast Crisp Setup Form
           ======================================================== */}
        <div className="tl-form-column">
          {/* Top Progress Indicator */}
          <div className="tl-steps-indicator" aria-label="Onboarding Progress">
            <div className="tl-step-item active">
              <span className="tl-step-badge active">1</span>
              <span className="tl-step-name active">Find Team</span>
            </div>
            <div className="tl-step-connector" />
            <div className="tl-step-item">
              <span className="tl-step-badge">2</span>
              <span className="tl-step-name">Set Up</span>
            </div>
            <div className="tl-step-connector" />
            <div className="tl-step-item">
              <span className="tl-step-badge">3</span>
              <span className="tl-step-name">Get Started</span>
            </div>
          </div>

          {/* Eyebrow & Title */}
          <div className="tl-heading-group">
            <span className="tl-eyebrow-pill">ONE LAST STEP</span>
            <h1 className="tl-heading">Find your team.</h1>
            <p className="tl-subheading">
              Join an existing team with an invite code, or create a new team for your department.
            </p>
          </div>

          {/* Segmented Control [ Join with code ] [ Create new team ] */}
          <div className="tl-segmented-control" role="tablist" aria-label="Team Options">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'join'}
              className={`tl-seg-btn ${mode === 'join' ? 'active' : ''}`}
              onClick={() => handleModeChange('join')}
            >
              <Users size={16} />
              <span>Join with code</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'create'}
              className={`tl-seg-btn ${mode === 'create' ? 'active' : ''}`}
              onClick={() => handleModeChange('create')}
            >
              <PlusCircle size={16} />
              <span>Create new team</span>
            </button>
          </div>

          {/* Form Card Container */}
          <div className="tl-form-box">
            <form onSubmit={submit} noValidate>
              <div className="tl-input-group">
                <div className="tl-input-header">
                  <label htmlFor="team-input" className="tl-input-label">
                    {mode === 'join' ? 'Team invite code' : 'Team name'}
                  </label>
                  <span className="tl-input-helper">
                    {mode === 'join' ? 'From your manager or peer' : 'Department or squad'}
                  </span>
                </div>

                <div className="tl-input-wrapper">
                  {mode === 'join' ? (
                    <Tag size={17} className="tl-input-icon" />
                  ) : (
                    <Users size={17} className="tl-input-icon" />
                  )}
                  <input
                    id="team-input"
                    value={value}
                    onChange={(e) => {
                      setValue(mode === 'join' ? e.target.value.toUpperCase() : e.target.value);
                      if (error) setError('');
                    }}
                    placeholder={mode === 'join' ? 'Enter your invite code' : 'e.g. Product & Design'}
                    className={`tl-input ${error ? 'has-error' : ''} ${mode === 'join' ? 'code-mode' : ''}`}
                    disabled={busy}
                    autoFocus
                  />
                </div>
              </div>

              {/* Validation / Server Error Banner */}
              {error && (
                <div className="tl-error-banner" role="alert">
                  <AlertCircle size={15} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              {/* Primary Action Button */}
              <button
                type="submit"
                disabled={busy}
                className="tl-primary-btn"
              >
                {busy ? (
                  <span>{mode === 'join' ? 'Joining…' : 'Creating…'}</span>
                ) : (
                  <>
                    <span>{mode === 'join' ? 'Join team' : 'Create team'}</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            {/* OR Divider */}
            <div className="tl-or-divider" aria-hidden="true">
              <span>OR</span>
            </div>

            {/* Secondary Action Box */}
            <div className="tl-secondary-card">
              <div className="tl-sec-left">
                <div className="tl-sec-icon-circle">
                  {mode === 'join' ? <Users size={16} /> : <Tag size={16} />}
                </div>
                <div>
                  <div className="tl-sec-title">
                    {mode === 'join' ? "Don't have a code?" : 'Already have a code?'}
                  </div>
                  <div className="tl-sec-sub">
                    {mode === 'join'
                      ? 'Create a new team for your department.'
                      : 'Join an existing team with an invite code.'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="tl-sec-action-btn"
                onClick={() => handleModeChange(mode === 'join' ? 'create' : 'join')}
              >
                {mode === 'join' ? 'Create a team' : 'Join a team'}
              </button>
            </div>
          </div>

          {/* Refined Privacy Panel at the Bottom */}
          <div className="tl-privacy-panel">
            <div className="tl-privacy-icon-circle">
              <Lock size={16} />
            </div>
            <div className="tl-privacy-text-wrap">
              <div className="tl-privacy-title">
                Your personal wellbeing data stays private.
              </div>
              <div className="tl-privacy-sub">
                Your team only sees collective progress, never individual data.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
