import React, { useState, useEffect } from 'react';
import { Shield, Cookie } from 'lucide-react';

interface CookieBannerProps {
  onOpenPrivacyPolicy: () => void;
}

const COOKIE_STORAGE_KEY = 'predskolovak_cookie_consent_v1';

export const CookieBanner: React.FC<CookieBannerProps> = ({ onOpenPrivacyPolicy }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(COOKIE_STORAGE_KEY);
      if (!consent) {
        // Small delay for smooth entry
        const timer = setTimeout(() => setIsVisible(true), 800);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify({ analytics: true, functional: true, date: new Date().toISOString() }));
    } catch {}
    setIsVisible(false);
  };

  const handleAcceptEssential = () => {
    try {
      localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify({ analytics: false, functional: true, date: new Date().toISOString() }));
    } catch {}
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside aria-label="Informace o cookies" className="cookie-banner-overlay">
      <div className="cookie-banner-card animate-scale-up">
        <div className="cookie-content">
          <div className="cookie-icon-wrapper">
            <Cookie size={24} color="var(--p-primary)" />
          </div>

          <div className="cookie-text">
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
              🍪 Používání cookies a ukládání dat
            </h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Tento web využívá nezbytné lokální úložiště (localStorage) k ukládání tvých inzerátů a oblíbených profilů. Žádná data neprodáváme třetím stranám.{' '}
              <button
                type="button"
                onClick={onOpenPrivacyPolicy}
                style={{ background: 'none', border: 'none', color: 'var(--p-primary)', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
              >
                Více o ochraně osobních údajů (GDPR)
              </button>
            </p>
          </div>
        </div>

        <div className="cookie-actions">
          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={handleAcceptEssential}
          >
            Jen nezbytné
          </button>

          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={handleAcceptAll}
          >
            <Shield size={16} />
            <span>Přijmout vše</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
