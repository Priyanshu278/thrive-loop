import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Sprout, Heart, ArrowRight } from 'lucide-react';
import { api } from '../../api';

export function HabitRescueModal({ isOpen, onClose, rescueData, onGoalAccepted }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (!rescueData) return null;

  const originalGoal = rescueData.originalGoal || 8000;
  const reducedGoal = rescueData.reducedGoal || 4000;

  async function handleAccept() {
    setLoading(true);
    try {
      if (rescueData.id) {
        await api(`/metrics/rescue/${rescueData.id}/recovered`, 'POST');
      }
      setDone(true);
      setTimeout(() => {
        setDone(false);
        if (onGoalAccepted) onGoalAccepted(reducedGoal);
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Error recovering rescue:', err);
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="460px"
      isBottomSheet={true}
    >
      <div className="rescue-modal-content">
        <div className="rescue-sprout-icon" aria-hidden="true">
          <Sprout size={32} />
        </div>

        <h3 className="rescue-modal-title">Let's make today lighter.</h3>
        <p className="rescue-modal-subtitle">
          Your streak is at risk, but that's completely okay. Here's a smaller, easier goal.
        </p>

        <div className="rescue-goal-box">
          <div className="rescue-goal-col">
            <span className="rescue-goal-tag">Original goal</span>
            <span className="rescue-goal-value strikethrough">
              {originalGoal.toLocaleString()} <small>steps</small>
            </span>
          </div>
          <div className="rescue-goal-arrow" aria-hidden="true">
            <ArrowRight size={20} />
          </div>
          <div className="rescue-goal-col new-goal">
            <span className="rescue-goal-tag highlight">New goal</span>
            <span className="rescue-goal-value active">
              {reducedGoal.toLocaleString()} <small>steps</small>
            </span>
          </div>
        </div>

        <div className="rescue-microcopy">
          <Heart size={14} className="rescue-heart" />
          <span>You don't need to catch up. Just take one small step today.</span>
        </div>

        {done ? (
          <div className="rescue-success-feedback">
            ✓ Goal adjusted to {reducedGoal.toLocaleString()} steps. You've got this!
          </div>
        ) : (
          <div className="rescue-actions">
            <Button
              variant="primary"
              size="lg"
              className="btn-full"
              loading={loading}
              onClick={handleAccept}
            >
              Do the small goal
            </Button>
            <Button
              variant="ghost"
              size="md"
              className="btn-full rescue-secondary-btn"
              onClick={onClose}
            >
              Not today
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
