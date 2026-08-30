import React from 'react';
import { useProfiles } from '../context/ProfilesContext';
import { Plus, Users, ShieldCheck, MapPin } from 'lucide-react';

interface HeroBannerProps {
  onOpenCreateModal: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onOpenCreateModal }) => {
  const { profiles, userCreatedProfile } = useProfiles();

  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-card">
          <div className="hero-pill">
            <MapPin size={16} />
            <span>Vranovská přehrada • Spolubydlení pro studenty v Brně</span>
          </div>

          <h1 className="hero-title" style={{ maxWidth: '800px' }}>
            Najdi si spolubydlu <span>bezpečně</span> mezi účastníky akce
          </h1>

          <p className="hero-description" style={{ maxWidth: '720px' }}>
            Žádné cizí pochybné skupiny. Napiš pár slov o sobě, domluvte si nezávazné setkání přímo na Vranově a najděte si bydlení v Brně s předstihem.
          </p>

          <div className="hero-actions">
            {!userCreatedProfile ? (
              <button
                type="button"
                className="btn btn-lg btn-mint"
                onClick={onOpenCreateModal}
              >
                <Plus size={20} />
                <span>Přidat inzerát</span>
                <svg className="btn-arrow-icon" viewBox="0 0 74.5 7.3" fill="currentColor">
                  <path d="M74.3,4.1c0.2-0.2,0.2-0.5,0-0.7l-3.2-3.2c-0.2-0.2-0.5-0.2-0.7,0s-0.2,0.5,0,0.7l2.8,2.8l-2.8,2.8c-0.2,0.2-0.2,0.5,0,0.7s0.5,0.2,0.7,0L74.3,4.1z"/>
                  <rect y="3.1" width="73.4" height="1.1"/>
                </svg>
              </button>
            ) : (
              <a href="#inzeraty" className="btn btn-lg btn-mint">
                <span>Procházet inzeráty</span>
                <svg className="btn-arrow-icon" viewBox="0 0 74.5 7.3" fill="currentColor">
                  <path d="M74.3,4.1c0.2-0.2,0.2-0.5,0-0.7l-3.2-3.2c-0.2-0.2-0.5-0.2-0.7,0s-0.2,0.5,0,0.7l2.8,2.8l-2.8,2.8c-0.2,0.2-0.2,0.5,0,0.7s0.5,0.2,0.7,0L74.3,4.1z"/>
                  <rect y="3.1" width="73.4" height="1.1"/>
                </svg>
              </a>
            )}
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-value">{profiles.length}</span>
              <span className="stat-label">Aktivních inzerátů</span>
            </div>

            <div className="stat-item">
              <span className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={22} color="#5AC8AF" />
                PIN kód
              </span>
              <span className="stat-label">Spravuj inzerát kdykoliv</span>
            </div>

            <div className="stat-item">
              <span className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={22} color="#E42D21" />
                Vranov
              </span>
              <span className="stat-label">Osobní setkání na kurzu</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
