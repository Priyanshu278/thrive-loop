import React, { useState } from 'react';
import { BookOpen, X } from 'lucide-react';
import { HelpGuideContent } from './HelpGuideContent';

/**
 * HelpModal
 *
 * A beginner-friendly first-time user guide for ThriveLoop.
 * Opens as a fixed backdrop overlay so it never touches or changes the
 * underlying page state, and closes with Esc / backdrop click / X.
 *
 * Kept intentionally small and quiet: it is a reference card, not a
 * redesigned onboarding flow. It reuses the existing ThriveLoop color
 * tokens and card primitives so it looks like part of the product.
 */

export function HelpModal({ isOpen, onClose, currentRole = 'employee', initialView = 'home' }) {
  const [view, setView] = useState(initialView);

  if (!isOpen) return null;

  return (
    <div
      className="tl-help-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="How to use ThriveLoop"
    >
      <div
        className="tl-help-sheet"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="tl-help-head">
          <div className="tl-help-head-left">
            <BookOpen size={18} className="tl-help-icon" />
            <div>
              <h2 className="tl-help-title">How to use ThriveLoop</h2>
              <p className="tl-help-subtitle">A quick guide for first-time users</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {view !== 'home' && (
              <button
                type="button"
                className="tl-help-close"
                onClick={() => setView('home')}
                aria-label="Back to guide overview"
                title="Back to guide overview"
              >
                ←
              </button>
            )}
            <button
              type="button"
              className="tl-help-close"
              onClick={onClose}
              aria-label="Close help guide"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="tl-help-body">
          {view !== 'home' ? (
            <HelpGuideContent
              view={view}
              onClose={onClose}
              onViewEmployee={() => setView('employee')}
              onViewHR={() => setView('hr')}
              onViewQuick={() => setView('quick')}
              onViewButtons={() => setView('buttons')}
              currentRole={currentRole}
            />
          ) : (
          <>
          {/* Intro card */}
          <section className="tl-help-intro-card">
            <h3 className="tl-help-intro-title">Welcome to ThriveLoop</h3>
            <p className="tl-help-intro-text">
              ThriveLoop helps you understand and improve your everyday workplace wellness.
            </p>
            <p className="tl-help-intro-text">
              There are two main experiences in ThriveLoop:
            </p>
            <div className="tl-help-role-row">
              <div className="tl-help-role-chip">
                <span className="tl-help-role-name">Employee</span>
                <span className="tl-help-role-desc">Your daily wellness</span>
              </div>
              <div className="tl-help-role-chip">
                <span className="tl-help-role-name">HR Admin</span>
                <span className="tl-help-role-desc">Team and program insights</span>
              </div>
            </div>
            <p className="tl-help-intro-note">
              If you are already signed in, open the guide for your role first.
              You can switch between the Employee guide and the HR guide at any time.
            </p>
          </section>

          {/* Two guide columns */}
          <div className="tl-help-guide-grid">
            <div className="tl-help-guide-col">
              <h4 className="tl-help-guide-col-title">For Employees</h4>
              <p className="tl-help-guide-col-sub">Your daily wellness, team, and profile</p>
              <ul className="tl-help-guide-list">
                <li>
                  <button
                    type="button"
                    className="tl-help-guide-item"
                    onClick={() => setView('employee')}
                  >
                    <span>Employee First-Time Guide</span>
                    <span className="tl-help-guide-arrow">→</span>
                  </button>
                </li>
              </ul>
            </div>

            <div className="tl-help-guide-col">
              <h4 className="tl-help-guide-col-title">For HR Admins</h4>
              <p className="tl-help-guide-col-sub">Overview, teams, impact, privacy, ROI</p>
              <ul className="tl-help-guide-list">
                <li>
                  <button
                    type="button"
                    className="tl-help-guide-item"
                    onClick={() => setView('hr')}
                  >
                    <span>HR First-Time Guide</span>
                    <span className="tl-help-guide-arrow">→</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Quick link strip */}
          <div className="tl-help-quick-row">
            <span className="tl-help-quick-label">Also available:</span>
            <button type="button" className="tl-help-quick-link" onClick={() => setView('quick')}>
              Quick Start Guide
            </button>
            <span className="tl-help-sep">·</span>
            <button type="button" className="tl-help-quick-link" onClick={() => setView('buttons')}>
              Button Dictionary
            </button>
          </div>

          {/* Footer note */}
          <p className="tl-help-footer-note">
            This guide describes the current ThriveLoop experience. It does not change
            any account, data, or settings.
          </p>
          </>
          )}
        </div>
      </div>
    </div>
  );
}
