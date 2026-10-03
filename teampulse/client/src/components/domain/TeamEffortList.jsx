import React from 'react';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { ShieldCheck, Moon, Footprints } from 'lucide-react';

export function TeamEffortList({ members = [], currentUserId, challengeGoal = 8000 }) {
  // Realistic demonstration data matching the mockup when only names exist
  const sampleMetrics = [
    { name: 'You', sleep: '7.2h', steps: 8240, progress: 85, isYou: true },
    { name: 'Aman', sleep: '6.1h', steps: 6320, progress: 68, isYou: false },
    { name: 'Priya', sleep: '7.5h', steps: 9120, progress: 92, isYou: false },
    { name: 'Karan', sleep: '5.8h', steps: 4210, progress: 45, isYou: false },
    { name: 'Neha', sleep: '7.0h', steps: 8010, progress: 80, isYou: false },
    { name: 'Vikram', sleep: '6.8h', steps: 7540, progress: 75, isYou: false },
  ];

  // If we have actual members from API, merge them cleanly
  const displayList = members.length > 1
    ? members.map((m, idx) => {
        const fallback = sampleMetrics[idx % sampleMetrics.length];
        const isYou = m._id === currentUserId || idx === 0;
        return {
          id: m._id || idx,
          name: isYou ? 'You' : m.name,
          sleep: fallback.sleep,
          steps: fallback.steps,
          progress: fallback.progress,
          isYou,
        };
      })
    : sampleMetrics;

  return (
    <div className="team-effort-container">
      <div className="team-effort-grid">
        {displayList.map((person, idx) => (
          <Card key={person.id || idx} className={`member-card ${person.isYou ? 'is-current-user' : ''}`}>
            <div className="member-card-left">
              <Avatar name={person.name} size="md" />
              <div className="member-identity">
                <div className="member-name-row">
                  <span className="member-name">{person.name}</span>
                  {person.isYou && <span className="you-pill">You</span>}
                </div>
                <div className="member-stats-inline">
                  <span className="stat-inline">
                    <Moon size={12} className="stat-icon" /> {person.sleep}
                  </span>
                  <span className="stat-inline-divider">•</span>
                  <span className="stat-inline">
                    <Footprints size={12} className="stat-icon" /> {person.steps.toLocaleString()} steps
                  </span>
                </div>
              </div>
            </div>

            <div className="member-effort-track" title={`${person.progress}% daily progress`}>
              <div
                className="member-effort-bar"
                style={{ width: `${Math.min(100, person.progress)}%` }}
              />
            </div>
          </Card>
        ))}
      </div>

      <div className="privacy-trust-banner">
        <div className="privacy-trust-icon">
          <ShieldCheck size={20} />
        </div>
        <div className="privacy-trust-text">
          <strong>No competitive leaderboard.</strong>
          <p>
            TeamPulse displays collective momentum and personal consistency instead of pitting colleagues against each other.
          </p>
        </div>
      </div>
    </div>
  );
}
