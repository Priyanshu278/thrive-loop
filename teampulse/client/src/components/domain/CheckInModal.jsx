import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ShieldCheck, Footprints, Moon, Check } from 'lucide-react';
import { api } from '../../api';

export function CheckInModal({ isOpen, onClose, currentToday, onSaved }) {
  const [steps, setSteps] = useState(currentToday?.steps ? String(currentToday.steps) : '6000');
  const [sleep, setSleep] = useState(currentToday?.sleepHours ? String(currentToday.sleepHours) : '7.5');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState('');

  const stepPresets = [4000, 6000, 8000, 10000];
  const sleepPresets = [6.0, 7.0, 7.5, 8.0];

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const parsedSteps = Number(steps);
    const parsedSleep = Number(sleep);

    if (isNaN(parsedSteps) || parsedSteps < 0 || parsedSteps > 100000) {
      setError('Please enter a realistic step count (0 - 100,000)');
      return;
    }
    if (isNaN(parsedSleep) || parsedSleep < 0 || parsedSleep > 24) {
      setError('Please enter sleep hours between 0 and 24');
      return;
    }

    setSaving(true);
    try {
      await api('/metrics', 'POST', {
        steps: parsedSteps,
        sleepHours: parsedSleep,
        source: 'manual',
      });
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        if (onSaved) onSaved();
        onClose();
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to save check-in');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      eyebrow="DAILY LOG"
      title="Today's Check-in"
      maxWidth="480px"
    >
      <form onSubmit={handleSubmit} className="checkin-form">
        {error && <div className="form-error-banner">{error}</div>}

        <div className="checkin-field-group">
          <label className="checkin-label">
            <Footprints size={16} className="text-primary" />
            <span>Steps walked today</span>
          </label>
          <div className="checkin-input-wrapper">
            <input
              type="number"
              min="0"
              max="100000"
              step="100"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              placeholder="e.g. 8420"
              className="checkin-input"
              required
            />
            <span className="checkin-input-unit">steps</span>
          </div>
          <div className="preset-chips">
            {stepPresets.map((val) => (
              <button
                type="button"
                key={val}
                className={`chip ${Number(steps) === val ? 'active' : ''}`}
                onClick={() => setSteps(String(val))}
              >
                {val.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        <div className="checkin-field-group">
          <label className="checkin-label">
            <Moon size={16} className="text-primary" />
            <span>Hours slept last night</span>
          </label>
          <div className="checkin-input-wrapper">
            <input
              type="number"
              min="0"
              max="24"
              step="0.1"
              value={sleep}
              onChange={(e) => setSleep(e.target.value)}
              placeholder="e.g. 7.2"
              className="checkin-input"
              required
            />
            <span className="checkin-input-unit">hours</span>
          </div>
          <div className="preset-chips">
            {sleepPresets.map((val) => (
              <button
                type="button"
                key={val}
                className={`chip ${Number(sleep) === val ? 'active' : ''}`}
                onClick={() => setSleep(String(val))}
              >
                {val}h
              </button>
            ))}
          </div>
        </div>

        <div className="privacy-reassurance">
          <ShieldCheck size={16} className="text-success" />
          <span>
            Your data is strictly personal. Team views only show anonymous collective averages, and HR never sees individual rows.
          </span>
        </div>

        <div className="modal-actions-row">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={saving}
            icon={savedSuccess ? Check : null}
          >
            {savedSuccess ? 'Saved!' : 'Save check-in'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
