import React from 'react';
import { useProfiles } from '../context/ProfilesContext';
import { Plus, User, Heart, KeyRound } from 'lucide-react';

interface HeaderProps {
  onOpenCreateModal: () => void;
  onOpenMyProfile?: () => void;
  onOpenManageByCodeModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCreateModal,
  onOpenMyProfile,
  onOpenManageByCodeModal,
}) => {
  const { userCreatedProfile, savedProfileIds, filters, setFilters } = useProfiles();

  return (
    <>
      {/* Top subtle BETA strip */}
      <div className="beta-top-bar">
        <span className="beta-top-pill">BETA</span>
        <span>
          Aplikace je v pilotním provozu pro účastníky Předškolováku 2026 na Vranově
        </span>
      </div>

      <header className="app-header">
        <div className="container header-inner">
          <a href="/" className="brand-logo">
            <div className="brand-badge">
              <span>PŘEDŠKOLOVÁK</span>
            </div>
            <div className="brand-tagline">
              <div className="brand-title-row">
                <span className="brand-title">Spolubydlení</span>
              </div>
              <span className="brand-sub">MUNI • Vranovská pláž</span>
            </div>
          </a>

          <div className="header-actions">
            {/* SAVED PROFILES BUTTON */}
            <button
              type="button"
              className={`btn btn-sm ${filters.onlySaved ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilters(prev => ({ ...prev, onlySaved: !prev.onlySaved }))}
              title="Zobrazit uložené inzeráty"
              aria-label="Uložené inzeráty"
            >
              <Heart size={16} fill={filters.onlySaved ? 'currentColor' : 'none'} />
              <span className="d-none d-md-inline">Oblíbené</span>
              {savedProfileIds.length > 0 && (
                <span style={{ background: filters.onlySaved ? 'white' : 'var(--p-primary)', color: filters.onlySaved ? 'var(--p-primary)' : 'white', borderRadius: '10px', padding: '1px 6px', fontSize: '0.75rem', fontWeight: 800 }}>
                  {savedProfileIds.length}
                </span>
              )}
            </button>

            {/* MY PROFILE OR MANAGE BY CODE */}
            {userCreatedProfile ? (
              <button
                type="button"
                className="btn btn-sm btn-subtle"
                onClick={onOpenMyProfile}
                title={`Tvůj kód: ${userCreatedProfile.manageCode}`}
                style={{ background: '#ECFDF5', borderColor: '#A7F3D0', color: '#065F46' }}
              >
                <User size={16} />
                <span>Můj inzerát ({userCreatedProfile.manageCode})</span>
              </button>
            ) : null}

            {/* MANAGE AD BY CODE */}
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={onOpenManageByCodeModal}
              title="Upravit nebo smazat inzerát pomocí tajného kódu"
            >
              <KeyRound size={15} color="var(--p-primary)" />
              <span className="d-none d-sm-inline">Správa inzerátu</span>
            </button>

            {/* Desktop CTA (hidden on mobile, replaced by Mobile FAB) */}
            <button
              type="button"
              className="btn btn-sm btn-primary d-none d-sm-inline-flex"
              onClick={onOpenCreateModal}
            >
              <Plus size={16} />
              <span>Přidat inzerát</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
