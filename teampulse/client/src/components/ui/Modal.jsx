import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function Modal({
  isOpen,
  onClose,
  title,
  eyebrow,
  children,
  maxWidth = '520px',
  isBottomSheet = false,
}) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={`modal-backdrop ${isBottomSheet ? 'is-bottom-sheet' : ''}`} onClick={onClose}>
      <div
        className={`modal-container ${isBottomSheet ? 'bottom-sheet-container' : ''}`}
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {isBottomSheet && <div className="sheet-handle" aria-hidden="true" />}
        <div className="modal-header">
          <div>
            {eyebrow && <div className="eyebrow">{eyebrow}</div>}
            {title && <h2 className="modal-title">{title}</h2>}
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
