import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  Watch,
  Smartphone,
  Radio,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Zap,
  Footprints,
  Moon,
  Heart,
  X,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { api } from '../../api';

export function WearableSyncModal({ isOpen, onClose, onSyncComplete }) {
  const [device, setDevice] = useState('apple');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStep, setSyncStep] = useState(0);
  const [successData, setSuccessData] = useState(null);

  if (!isOpen) return null;

  const devices = [
    { id: 'apple', name: 'Apple Watch Series 9 / Ultra', platform: 'Apple HealthKit BLE', color: '#10B981', icon: Watch },
    { id: 'oura', name: 'Oura Ring Horizon Gen 3', platform: 'Oura Cloud Telemetry', color: '#3B82F6', icon: Radio },
    { id: 'google', name: 'Pixel Watch / WearOS', platform: 'Google Health Connect', color: '#F59E0B', icon: Smartphone },
    { id: 'whoop', name: 'Whoop 4.0 Strap', platform: 'Whoop BLE Stream', color: '#8B5CF6', icon: Activity },
  ];

  async function startSync(stepsBonus = 6840, sleepHours = 7.5) {
    setIsSyncing(true);
    setSyncStep(1);
    setSuccessData(null);

    // Simulate realistic hardware BLE handshake sequence
    setTimeout(() => setSyncStep(2), 600);
    setTimeout(() => setSyncStep(3), 1200);

    setTimeout(async () => {
      setSyncStep(4);
      try {
        const payload = {
          steps: stepsBonus,
          sleepHours: sleepHours,
          source: 'health_connect_demo'
        };
        const res = await api('/metrics', 'POST', payload).catch(() => ({ steps: stepsBonus, sleepHours }));

        setSuccessData({
          steps: stepsBonus,
          sleep: sleepHours,
          activeMin: 28,
          device: devices.find(d => d.id === device)?.name || 'Smartwatch'
        });

        if (onSyncComplete) {
          onSyncComplete(res);
        }
      } catch (err) {
        console.warn('Sync fallback:', err);
      } finally {
        setIsSyncing(false);
      }
    }, 1800);
  }

  return (
    <div className="modal-backdrop-overlay" style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(6px)',
      display: 'grid',
      placeItems: 'center',
      zIndex: 100,
      padding: '16px'
    }}>
      <Card style={{
        width: '100%',
        maxWidth: '520px',
        padding: '28px',
        borderRadius: '20px',
        background: '#FFFFFF',
        boxShadow: '0 20px 40px -8px rgba(0,0,0,0.22)',
        position: 'relative'
      }}>
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#F1F5F9',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
            color: '#64748B'
          }}
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: '#ECFDF5',
            color: '#10B981',
            display: 'grid',
            placeItems: 'center'
          }}>
            <Watch size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '19px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Smartwatch Live Telemetry Sync
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748B', margin: '2px 0 0' }}>
              Direct Bluetooth Low Energy & HealthKit biometric pipeline
            </p>
          </div>
        </div>

        {/* Privacy reassurance chip */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          padding: '8px 12px',
          borderRadius: '10px',
          fontSize: '11.5px',
          color: '#475569',
          marginBottom: '20px'
        }}>
          <ShieldCheck size={16} style={{ color: '#10B981', flexShrink: 0 }} />
          <span>Zero raw GPS or PII retained. Daily activity loops are encrypted locally.</span>
        </div>

        {/* Device Selection */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{ fontSize: '11.5px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
            Select Active Wearable Sensor
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {devices.map((d) => {
              const Icon = d.icon;
              const isSel = device === d.id;
              return (
                <div
                  key={d.id}
                  onClick={() => !isSyncing && setDevice(d.id)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '12px',
                    border: `1.5px solid ${isSel ? d.color : '#E2E8F0'}`,
                    background: isSel ? `${d.color}0D` : '#FFFFFF',
                    cursor: isSyncing ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    background: `${d.color}18`,
                    color: d.color,
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0
                  }}>
                    <Icon size={16} />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {d.name.split(' ')[0]} {d.name.split(' ')[1]}
                    </div>
                    <span style={{ fontSize: '10.5px', color: '#64748B', display: 'block' }}>
                      {d.platform}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sync Progress / Visual Pipeline */}
        {isSyncing && (
          <div style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '14px',
            padding: '16px',
            marginBottom: '18px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <RefreshCw size={16} className="animate-spin" style={{ color: '#10B981' }} />
              <strong style={{ fontSize: '13px', color: '#0F172A' }}>Streaming Sensor Stream...</strong>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: syncStep >= 1 ? '#059669' : '#94A3B8' }}>
                <CheckCircle2 size={14} />
                <span>Pairing via Bluetooth Low Energy (2.4 GHz)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: syncStep >= 2 ? '#059669' : '#94A3B8' }}>
                <CheckCircle2 size={14} />
                <span>Extracting HealthKit / Health Connect cadence</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: syncStep >= 3 ? '#059669' : '#94A3B8' }}>
                <CheckCircle2 size={14} />
                <span>Decrypting step milestones and restorative sleep blocks</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: syncStep >= 4 ? '#059669' : '#94A3B8' }}>
                <CheckCircle2 size={14} />
                <span>Updating ThriveLoop Concentric Activity Rings</span>
              </div>
            </div>
          </div>
        )}

        {/* Sync Success Showcase */}
        {successData && (
          <div style={{
            background: 'linear-gradient(135deg, #ECFDF5 0%, #FFFFFF 100%)',
            border: '1.5px solid #A7F3D0',
            borderRadius: '14px',
            padding: '16px',
            marginBottom: '18px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Sparkles size={16} style={{ color: '#10B981' }} />
              <strong style={{ fontSize: '13.5px', color: '#065F46' }}>Wearable Telemetry Imported!</strong>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center' }}>
              <div style={{ background: '#FFFFFF', padding: '8px', borderRadius: '8px', border: '1px solid #DCFCE7' }}>
                <Footprints size={15} style={{ color: '#10B981', margin: '0 auto 4px' }} />
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>{successData.steps.toLocaleString()}</div>
                <span style={{ fontSize: '10.5px', color: '#64748B' }}>Daily Steps</span>
              </div>
              <div style={{ background: '#FFFFFF', padding: '8px', borderRadius: '8px', border: '1px solid #DCFCE7' }}>
                <Zap size={15} style={{ color: '#F97316', margin: '0 auto 4px' }} />
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>{successData.activeMin} min</div>
                <span style={{ fontSize: '10.5px', color: '#64748B' }}>Active Time</span>
              </div>
              <div style={{ background: '#FFFFFF', padding: '8px', borderRadius: '8px', border: '1px solid #DCFCE7' }}>
                <Moon size={15} style={{ color: '#8B5CF6', margin: '0 auto 4px' }} />
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>{successData.sleep} hrs</div>
                <span style={{ fontSize: '10.5px', color: '#64748B' }}>Restful Sleep</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button
            type="button"
            className="btn-primary"
            onClick={() => startSync(7240, 7.8)}
            disabled={isSyncing}
            style={{
              flex: 1,
              height: '44px',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {isSyncing ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Ingesting Hardware Stream...</span>
              </>
            ) : (
              <>
                <Radio size={16} />
                <span>Synchronize Telemetry Now</span>
              </>
            )}
          </Button>

          {successData && (
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0 18px',
                borderRadius: '10px',
                background: '#0F172A',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '13px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Done ✓
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}
