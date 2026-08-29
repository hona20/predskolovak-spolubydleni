import React, { useState } from 'react';
import { Profile } from '../types';
import { useProfiles } from '../context/ProfilesContext';
import { TURNUSY } from '../data/faculties';
import { X, Copy, Check, MessageCircle, MapPin, Trash2, Heart, KeyRound, Edit } from 'lucide-react';

interface ProfileDetailModalProps {
  profile: Profile | null;
  onClose: () => void;
  onOpenManageByCode?: (code: string) => void;
}

export const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({
  profile,
  onClose,
  onOpenManageByCode,
}) => {
  const { savedProfileIds, toggleSaveProfile, deleteProfileByCode, showToast, mySavedCodes } = useProfiles();
  const [copied, setCopied] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  if (!profile) return null;

  const isSaved = savedProfileIds.includes(profile.id);
  const turnusInfo = TURNUSY.find(t => t.id === profile.turnus);
  const isMine = mySavedCodes.some(c => c.toUpperCase() === (profile.manageCode || '').toUpperCase());

  // Generate personalized icebreaker message
  const facultyText = profile.faculty ? profile.faculty : 'MUNI';
  const turnusText = turnusInfo ? turnusInfo.name : 'Vranov';
  const nameGreeting = profile.name ? profile.name.split(' ')[0] : 'ahoj';

  const icebreakerMessage = `Čauvec ${nameGreeting}! Koukám na Spolubydlení Předškolovák na tvůj profil. Jedu taky na ${turnusText} na Vranov a studuju na ${facultyText}. Dáme na akci sraz u pláže a pokecáme o spolubydlení?`;

  const handleCopyIcebreaker = () => {
    navigator.clipboard.writeText(icebreakerMessage);
    setCopied(true);
    showToast('Zpráva pro seznámení byla zkopírována do schránky! 📋');
    setTimeout(() => setCopied(false), 2500);
  };

  const isImageAvatar = profile.avatar && profile.avatar.startsWith('data:image');

  const handleDelete = () => {
    deleteProfileByCode(profile.manageCode);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card animate-scale-up" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="avatar-badge" style={{ width: '64px', height: '64px', fontSize: '2.2rem' }}>
              {isImageAvatar ? (
                <img src={profile.avatar} alt={profile.name || 'Avatar'} />
              ) : (
                <span>{profile.avatar || '🏕️'}</span>
              )}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                  {profile.name || 'Účastník Předškolováku'}
                </h2>
              </div>

              {profile.faculty && (
                <span className="user-faculty-badge" style={{ fontSize: '0.9rem' }}>
                  🎓 {profile.faculty}
                </span>
              )}
              {profile.fieldOfStudy && (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Obor: {profile.fieldOfStudy}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              className={`save-btn ${isSaved ? 'saved' : ''}`}
              onClick={() => toggleSaveProfile(profile.id)}
              title={isSaved ? 'Odebrat z oblíbených' : 'Uložit do oblíbených'}
            >
              <Heart size={22} fill={isSaved ? '#ef4444' : 'none'} color={isSaved ? '#ef4444' : '#94a3b8'} />
            </button>

            <button
              type="button"
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Zavřít okno"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* USER CODE NOTICE - only for the ad this device actually owns */}
          {isMine && (
            <div
              style={{
                background: '#FEF3C7',
                border: '1.5px solid #FCD34D',
                padding: '10px 14px',
                borderRadius: '12px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <KeyRound size={18} color="#D97706" />
                <span style={{ fontSize: '0.8125rem', color: '#92400E' }}>
                  Tvůj tajný kód inzerátu: <strong>{profile.manageCode}</strong>
                </span>
              </div>
              {onOpenManageByCode && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={() => {
                    onClose();
                    onOpenManageByCode(profile.manageCode);
                  }}
                  style={{ background: 'white', borderColor: '#FCD34D', color: '#B45309', padding: '4px 10px' }}
                >
                  <Edit size={13} />
                  <span>Upravit</span>
                </button>
              )}
            </div>
          )}

          {/* Turnus & Location Details */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
            <div style={{ background: '#eff6ff', color: '#2563E2', padding: '6px 14px', borderRadius: '12px', fontSize: '0.875rem', fontWeight: 700 }}>
              📅 {turnusInfo ? `${turnusInfo.name} (${turnusInfo.dates})` : 'Předškolovák Vranov'}
            </div>

            {profile.budget && (
              <div style={{ background: '#ecfdf5', color: '#059669', padding: '6px 14px', borderRadius: '12px', fontSize: '0.875rem', fontWeight: 700 }}>
                💰 Rozpočet: do {profile.budget.toLocaleString('cs-CZ')} Kč/měsíc
              </div>
            )}

            {profile.locationPreference && (
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#334155', padding: '6px 14px', borderRadius: '12px', fontSize: '0.875rem', fontWeight: 600 }}>
                📍 Lokality v Brně: {profile.locationPreference}
              </div>
            )}
          </div>

          {/* Description / Bio */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>
              O mně & spolubydlení:
            </h4>
            <p style={{ color: '#334155', lineHeight: 1.6, background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
              {profile.bio || 'Účastník nevyplnil delší popis. Napiš mu na Instagramu nebo WhatsAppu a zeptej se na cokoliv osobně!'}
            </p>
          </div>

          {/* User Tags */}
          {profile.tags && profile.tags.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>
                Štítky a vlastnosti:
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {profile.tags.map((t, idx) => (
                  <span key={idx} className="tag-badge" style={{ fontSize: '0.8125rem', padding: '6px 12px' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Camp spot */}
          {profile.campSpot && (
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '12px 16px', borderRadius: '14px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={20} color="#059669" />
              <div>
                <strong style={{ color: '#065f46', fontSize: '0.875rem' }}>Kde mě na Vranově potkáš:</strong>
                <div style={{ color: '#047857', fontSize: '0.9375rem' }}>{profile.campSpot}</div>
              </div>
            </div>
          )}

          {/* ICEBREAKER BOX */}
          <div className="icebreaker-box">
            <div className="icebreaker-title">
              <span>🏖️ Domluvit sraz na Vranovské pláži</span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#475569', marginBottom: '10px' }}>
              Zkopíruj si předvyplněnou zprávu a napiš budoucímu spolubydlícímu na Instagramu nebo WhatsAppu:
            </p>

            <div className="icebreaker-text">
              "{icebreakerMessage}"
            </div>

            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={handleCopyIcebreaker}
              style={{ width: '100%' }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? 'Zkopírováno do schránky!' : 'Zkopírovat zprávu pro sraz'}</span>
            </button>
          </div>

          {/* DIRECT CONTACT BUTTONS */}
          <div style={{ marginTop: '20px' }}>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-main)' }}>
              Přímé kontakty:
            </h4>

            <div className="contact-buttons-grid">
              {/* INSTAGRAM */}
              {profile.contacts?.instagram && (
                <a
                  href={`https://instagram.com/${profile.contacts.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-md btn-outline"
                  style={{ borderColor: '#e1306c', color: '#e1306c', background: '#fff1f2' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                  <span>@{profile.contacts.instagram.replace('@', '')}</span>
                </a>
              )}

              {/* WHATSAPP */}
              {(profile.contacts?.whatsapp || profile.contacts?.phone) && (
                <a
                  href={`https://wa.me/${(profile.contacts.whatsapp || profile.contacts.phone || '').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-md btn-outline"
                  style={{ borderColor: '#25D366', color: '#128C7E', background: '#f0fdf4' }}
                >
                  <MessageCircle size={18} />
                  <span>WhatsApp zpráva</span>
                </a>
              )}

              {/* MESSENGER */}
              {profile.contacts?.messenger && (
                <a
                  href={profile.contacts.messenger.startsWith('http') ? profile.contacts.messenger : `https://m.me/${profile.contacts.messenger.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-md btn-outline"
                  style={{ borderColor: '#0084FF', color: '#0084FF', background: '#eff6ff' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.914 1.455 5.518 3.735 7.207V22l3.39-1.862c.907.251 1.87.387 2.875.387 5.523 0 10-4.145 10-9.267C22 6.145 17.523 2 12 2zm1.066 12.443l-2.556-2.727-4.99 2.727 5.485-5.823 2.62 2.727 4.927-2.727-5.486 5.823z"/>
                  </svg>
                  <span>Messenger</span>
                </a>
              )}

              {/* ONLYFANS */}
              {profile.contacts?.onlyfans && (
                <a
                  href={`https://onlyfans.com/${profile.contacts.onlyfans.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-md btn-outline"
                  style={{ borderColor: '#00AFF0', color: '#008ecc', background: '#f0f9ff' }}
                >
                  <span style={{ fontSize: '1.1rem' }}>🔞</span>
                  <span>OnlyFans ({profile.contacts.onlyfans.replace('@', '')})</span>
                </a>
              )}

              {!profile.contacts?.instagram && !profile.contacts?.whatsapp && !profile.contacts?.messenger && !profile.contacts?.onlyfans && (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontStyle: 'italic', gridColumn: '1 / -1' }}>
                  Účastník nezadal přímé sociální sítě. Potkáte se na Vranově!
                </div>
              )}
            </div>
          </div>

          {/* Delete action if user's own profile */}
          {isMine && (
            <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
              {isConfirmingDelete ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.875rem', color: '#dc2626', fontWeight: 600 }}>Opravdu smazat?</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-subtle"
                    onClick={() => setIsConfirmingDelete(false)}
                  >
                    Zrušit
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm"
                    onClick={handleDelete}
                    style={{ background: '#dc2626', color: 'white' }}
                  >
                    <Trash2 size={15} />
                    <span>Ano, smazat</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn btn-sm btn-subtle"
                  onClick={() => setIsConfirmingDelete(true)}
                  style={{ color: '#dc2626' }}
                >
                  <Trash2 size={16} />
                  <span>Smazat můj inzerát</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
