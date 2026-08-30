import React from 'react';
import { Profile } from '../types';
import { useProfiles } from '../context/ProfilesContext';
import { TURNUSY } from '../data/faculties';
import { Heart, MapPin } from 'lucide-react';

interface ProfileCardProps {
  profile: Profile;
  onSelect: (profile: Profile) => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onSelect }) => {
  const { savedProfileIds, toggleSaveProfile } = useProfiles();
  const isSaved = savedProfileIds.includes(profile.id);

  const turnusInfo = TURNUSY.find(t => t.id === profile.turnus);

  const getTypeBadge = () => {
    switch (profile.type) {
      case 'have_room':
        return <span className="listing-type-badge type-have">🔑 Nabízí volný pokoj</span>;
      case 'looking_for_flatmates':
        return <span className="listing-type-badge type-squad">🤝 Hledá byt společně</span>;
      case 'looking_for_room':
      default:
        return <span className="listing-type-badge type-looking">🏠 Hledá pokoj/byt</span>;
    }
  };

  const isImageAvatar = profile.avatar && profile.avatar.startsWith('data:image');

  return (
    <div className="profile-card animate-fade-in">
      <div>
        {/* Top Header */}
        <div className="card-top">
          <div className="user-header-info">
            <div className="avatar-badge">
              {isImageAvatar ? (
                <img src={profile.avatar} alt={profile.name || 'Avatar'} />
              ) : (
                <span>{profile.avatar || '🏕️'}</span>
              )}
            </div>
            <div className="user-name-wrapper">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="user-name">{profile.name || 'Budoucí spolubydlící'}</span>
              </div>
              {profile.faculty && (
                <span className="user-faculty-badge">
                  🎓 {profile.faculty}
                </span>
              )}
              {profile.fieldOfStudy && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {profile.fieldOfStudy}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            className={`save-btn ${isSaved ? 'saved' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveProfile(profile.id);
            }}
            title={isSaved ? 'Odebrat z oblíbených' : 'Uložit do oblíbených'}
            aria-label="Uložit do oblíbených"
          >
            <Heart size={20} fill={isSaved ? '#ef4444' : 'none'} color={isSaved ? '#ef4444' : '#94a3b8'} />
          </button>
        </div>

        {/* Listing Type */}
        {getTypeBadge()}

        {/* Bio */}
        <p className="card-bio">
          {profile.bio || 'Ahoj, hledám spolubydlení a rád se seznámím s budoucími spolubydlícími osobně na Vranově!'}
        </p>

        {/* User-created Tags */}
        {profile.tags && profile.tags.length > 0 && (
          <div className="card-tags">
            {profile.tags.map((tag, idx) => (
              <span key={idx} className="tag-badge">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Camp location spot */}
        {profile.campSpot && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: '#059669', marginBottom: '12px', background: '#ecfdf5', padding: '6px 10px', borderRadius: '8px' }}>
            <MapPin size={14} />
            <span><strong>Na Vranově:</strong> {profile.campSpot}</span>
          </div>
        )}
      </div>

      <div>
        {/* Meta Row: Turnus & Price */}
        <div className="card-meta-row">
          <div className="meta-turnus">
            <span>📅</span>
            <span>{turnusInfo ? turnusInfo.shortName : 'Vranovská pláž'}</span>
          </div>

          {profile.budget ? (
            <div className="meta-price">
              do {profile.budget.toLocaleString('cs-CZ')} Kč<span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>/měs</span>
            </div>
          ) : (
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Cena dohodou</span>
          )}
        </div>

        {/* Action Button */}
        <button
          type="button"
          className="btn btn-md btn-outline"
          onClick={() => onSelect(profile)}
          style={{ width: '100%', justifyContent: 'space-between' }}
        >
          <span>Potkat se na Vranově</span>
          <svg className="btn-arrow-icon" viewBox="0 0 74.5 7.3" fill="currentColor">
            <path d="M74.3,4.1c0.2-0.2,0.2-0.5,0-0.7l-3.2-3.2c-0.2-0.2-0.5-0.2-0.7,0s-0.2,0.5,0,0.7l2.8,2.8l-2.8,2.8c-0.2,0.2-0.2,0.5,0,0.7s0.5,0.2,0.7,0L74.3,4.1z"/>
            <rect y="3.1" width="73.4" height="1.1"/>
          </svg>
        </button>
      </div>
    </div>
  );
};
