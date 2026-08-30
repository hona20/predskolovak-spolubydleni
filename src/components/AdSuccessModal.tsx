import React, { useState } from 'react';
import { Camera, Copy, Check, ShieldCheck, X } from 'lucide-react';

interface AdSuccessModalProps {
  code: string;
  onClose: () => void;
}

export const AdSuccessModal: React.FC<AdSuccessModalProps> = ({ code, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card animate-scale-up"
        style={{ maxWidth: '540px', padding: 0, overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0D9488 0%, #0B7A70 100%)',
            color: 'white',
            padding: '24px 28px',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.2)', color: 'white' }}
            aria-label="Zavřít"
          >
            <X size={20} />
          </button>

          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
            }}
          >
            <span style={{ fontSize: '2rem' }}>🎉</span>
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '6px', color: 'white' }}>
            Inzerát byl zveřejněn!
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#CCFBF1', margin: 0 }}>
            Ostatní účastníci tě už vidí v seznamu inzerátů na Vranově.
          </p>
        </div>

        {/* Body Content */}
        <div style={{ padding: '24px 28px 28px' }}>
          {/* CAMERA / SCREENSHOT CALLOUT BOX */}
          <div
            style={{
              background: '#FEF3C7',
              border: '2px dashed #F59E0B',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px',
            }}
          >
            <div
              style={{
                background: '#F59E0B',
                color: 'white',
                padding: '10px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Camera size={24} />
            </div>
            <div>
              <strong style={{ display: 'block', color: '#92400E', fontSize: '0.95rem', marginBottom: '2px' }}>
                📸 Vyfoť si obrazovku nebo si kód ulož!
              </strong>
              <p style={{ fontSize: '0.8125rem', color: '#B45309', margin: 0, lineHeight: 1.4 }}>
                Pomocí tohoto kódu můžeš svůj inzerát <strong>kdykoliv upravit nebo smazat</strong> z mobilu i počítače.
              </p>
            </div>
          </div>

          {/* CODE DISPLAY BOX */}
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
              Tvůj tajný kód inzerátu:
            </div>

            <div
              style={{
                background: '#F8FAFC',
                border: '2px solid var(--p-primary)',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                boxShadow: '0 4px 12px rgba(13, 148, 136, 0.1)',
              }}
            >
              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: '1.75rem',
                  fontWeight: 900,
                  letterSpacing: '4px',
                  color: 'var(--p-primary)',
                  flex: 1,
                  textAlign: 'center',
                }}
              >
                {code}
              </div>

              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={handleCopy}
                style={{ flexShrink: 0 }}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? 'Zkopírováno!' : 'Kopírovat'}</span>
              </button>
            </div>
          </div>

          {/* Security explanation */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              padding: '10px 14px',
              borderRadius: '12px',
              fontSize: '0.8125rem',
              color: '#166534',
              marginBottom: '24px',
            }}
          >
            <ShieldCheck size={18} color="#16A34A" style={{ flexShrink: 0 }} />
            <span>Kód nikomu neposílej, slouží k ověření, že jsi autorem inzerátu.</span>
          </div>

          {/* Close button */}
          <button
            type="button"
            className="btn btn-lg btn-mint"
            onClick={onClose}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <span>Rozumím, kód mám uložený</span>
            <svg className="btn-arrow-icon" viewBox="0 0 74.5 7.3" fill="currentColor">
              <path d="M74.3,4.1c0.2-0.2,0.2-0.5,0-0.7l-3.2-3.2c-0.2-0.2-0.5-0.2-0.7,0s-0.2,0.5,0,0.7l2.8,2.8l-2.8,2.8c-0.2,0.2-0.2,0.5,0,0.7s0.5,0.2,0.7,0L74.3,4.1z"/>
              <rect y="3.1" width="73.4" height="1.1"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
