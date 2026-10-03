import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { Sparkles, Users, Lightbulb, RefreshCw, Database } from 'lucide-react';
import { api } from '../../api';

export function ChallengeCard({ challenge, teamMembers = [], onRefresh }) {
  const [generating, setGenerating] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [context, setContext] = useState('normal');
  const [showOptions, setShowOptions] = useState(false);

  async function handleGenerate() {
    setGenerating(true);
    try {
      await api('/challenges/generate', 'POST', { context });
      if (onRefresh) await onRefresh();
    } catch (err) {
      console.error('Failed to generate challenge:', err);
    } finally {
      setGenerating(false);
    }
  }

  async function handleSeedDemo() {
    setSeeding(true);
    try {
      await api('/demo/seed', 'POST');
      if (onRefresh) await onRefresh();
    } catch (err) {
      console.error('Failed to seed demo data:', err);
    } finally {
      setSeeding(false);
    }
  }

  // Calculate estimated completion based on active members
  const memberCount = Math.max(teamMembers.length, 6);
  const activeCount = Math.min(memberCount, 3);
  const progressPct = 68;

  return (
    <Card className="challenge-card">
      <div className="challenge-card-top">
        <div className="challenge-title-group">
          <div className="challenge-meta-row">
            <span className="eyebrow">THIS WEEK · TEAM CHALLENGE</span>
            <Badge variant="primary" className="metric-badge">
              {challenge?.metric === 'sleep' ? 'SLEEP TARGET' : 'STEP TARGET'}
            </Badge>
          </div>
          <h2 className="challenge-heading">
            {challenge?.title || 'Sleep Better This Week'}
          </h2>
          <p className="challenge-desc">
            {challenge?.description || "Let's build better sleep habits together."}
          </p>
        </div>
      </div>

      {challenge?.tip && (
        <div className="challenge-tip-box">
          <Lightbulb size={16} className="tip-icon" />
          <span>{challenge.tip}</span>
        </div>
      )}

      <div className="challenge-progress-section">
        <div className="challenge-progress-header">
          <div className="members-indicator">
            <div className="avatar-stack">
              {teamMembers.slice(0, 3).map((m, i) => (
                <div key={m._id || i} className="stacked-avatar">
                  {(m.name || 'M')[0]}
                </div>
              ))}
            </div>
            <span className="members-active-text">
              <Users size={14} className="inline-icon" />
              <b>{activeCount} of {memberCount}</b> members active
            </span>
          </div>
          <span className="challenge-pct-text">{progressPct}%</span>
        </div>

        <ProgressBar value={progressPct} max={100} color="primary" size="md" />

        <div className="challenge-target-row">
          <span className="target-label">Weekly target:</span>
          <span className="target-value">
            {challenge?.target ? challenge.target.toLocaleString() : '8,470'}{' '}
            {challenge?.metric === 'sleep' ? 'hours' : 'steps/day avg'}
          </span>
        </div>
      </div>

      <div className="challenge-card-actions">
        <div className="challenge-actions-left">
          <button
            type="button"
            className="context-toggle-btn"
            onClick={() => setShowOptions(!showOptions)}
          >
            Context: <span className="context-name">{context.replace('_', ' ')}</span> ▾
          </button>
          {showOptions && (
            <div className="context-menu">
              {['normal', 'deadline_week', 'rain', 'heat'].map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`context-item ${context === c ? 'selected' : ''}`}
                  onClick={() => {
                    setContext(c);
                    setShowOptions(false);
                  }}
                >
                  {c.replace('_', ' ')}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="challenge-actions-right">
          <Button
            variant="outline"
            size="sm"
            icon={Database}
            loading={seeding}
            onClick={handleSeedDemo}
            title="Populate 14 days of realistic team metrics"
          >
            Seed demo data
          </Button>
          <Button
            variant="dark"
            size="sm"
            icon={Sparkles}
            loading={generating}
            onClick={handleGenerate}
          >
            ✦ Generate challenge
          </Button>
        </div>
      </div>
    </Card>
  );
}
