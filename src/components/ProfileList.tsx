import React from 'react';
import { Profile } from '../types';
import { ProfileCard } from './ProfileCard';
import { useProfiles } from '../context/ProfilesContext';
import { SearchX, Plus } from 'lucide-react';

interface ProfileListProps {
  onSelectProfile: (profile: Profile) => void;
  onOpenCreateModal: () => void;
}

export const ProfileList: React.FC<ProfileListProps> = ({ onSelectProfile, onOpenCreateModal }) => {
  const { filteredProfiles, profiles, setFilters } = useProfiles();

  if (filteredProfiles.length === 0) {
    const noAdsAtAll = profiles.length === 0;

    return (
      <div
        style={{
          background: 'white',
          border: '1.5px dashed var(--border-light)',
          borderRadius: 'var(--radius-2xl)',
          padding: '60px 20px',
          textAlign: 'center',
          margin: '30px 0 60px',
        }}
      >
        <SearchX size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
        <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
          {noAdsAtAll ? 'Zatím tu není žádný inzerát' : 'Žádný inzerát neodpovídá zadaným filtrům'}
        </h3>
        <p style={{ color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 24px' }}>
          {noAdsAtAll
            ? 'Buď první, kdo si tu najde spolubydlení – přidej svůj inzerát a uvidí ho i ostatní účastníci Předškolováku.'
            : 'Zkus upravit nebo zrušit nastavené filtry, nebo buď první, kdo v této kategorii přidá svůj inzerát!'}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {!noAdsAtAll && (
            <button
              type="button"
              className="btn btn-md btn-outline"
              onClick={() =>
                setFilters({
                  searchQuery: '',
                  turnus: 'all',
                  onlySaved: false,
                })
              }
            >
              Zobrazit všechny ({profiles.length}) inzerátů
            </button>
          )}

          <button
            type="button"
            className="btn btn-md btn-primary"
            onClick={onOpenCreateModal}
          >
            <Plus size={18} />
            <span>Přidat můj inzerát</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '60px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
          Účastníci Předškolováku ({filteredProfiles.length})
        </h2>
      </div>

      <div className="profiles-grid">
        {filteredProfiles.map(profile => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            onSelect={onSelectProfile}
          />
        ))}
      </div>
    </div>
  );
};
