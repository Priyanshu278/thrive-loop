import React from 'react';
import { Card } from '../ui/Card';
import { Check, X, ShieldCheck, Lock } from 'lucide-react';

export function PrivacyTrustBanner({ className = '' }) {
  return (
    <Card className={`privacy-trust-card ${className}`}>
      <div className="privacy-trust-header">
        <div className="privacy-badge">
          <ShieldCheck size={18} className="text-success" />
          <span>PRIVACY BY DESIGN</span>
        </div>
        <h3 className="privacy-trust-title">What HR can and cannot see</h3>
        <p className="privacy-trust-sub">
          TeamPulse protects psychological safety. Collective trends are enabled without exposing individual habits.
        </p>
      </div>

      <div className="privacy-columns-grid">
        <div className="privacy-col allowed">
          <div className="privacy-col-title text-success">
            <Check size={16} />
            <span>Visible to HR</span>
          </div>
          <ul className="privacy-feature-list">
            <li>
              <strong>Team-level averages</strong>
              <span>Combined statistics for teams with 5 or more members only.</span>
            </li>
            <li>
              <strong>Participation patterns</strong>
              <span>Anonymous team consistency signals (e.g. 76% active).</span>
            </li>
            <li>
              <strong>Differential privacy noise</strong>
              <span>Slight noise added so numbers can never be reverse-engineered.</span>
            </li>
          </ul>
        </div>

        <div className="privacy-col forbidden">
          <div className="privacy-col-title text-danger">
            <X size={16} />
            <span>Never visible to HR</span>
          </div>
          <ul className="privacy-feature-list">
            <li>
              <strong>Individual steps & sleep records</strong>
              <span>Your personal logs never leave your private employee view.</span>
            </li>
            <li>
              <strong>Teams under 5 members</strong>
              <span>Locked with <Lock size={12} className="inline-lock" /> to prevent re-identification.</span>
            </li>
            <li>
              <strong>Leaderboards or rankings</strong>
              <span>No competitive hierarchy or colleague comparison lists.</span>
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
