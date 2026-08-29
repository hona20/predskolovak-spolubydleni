import React, { useState, useRef } from 'react';
import { useProfiles } from '../context/ProfilesContext';
import { TurnusId, ListingType, Profile } from '../types';
import { TURNUSY, DEFAULT_AVATARS, FACULTIES } from '../data/faculties';
import { X, UploadCloud, Trash2, Camera, Plus, ShieldAlert } from 'lucide-react';

interface CreateProfileModalProps {
  onClose: () => void;
  onSuccess: (code: string) => void;
}

export const CreateProfileModal: React.FC<CreateProfileModalProps> = ({ onClose, onSuccess }) => {
  const { createProfile, getSpamCooldownRemaining } = useProfiles();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('🏕️');
  const [customPhoto, setCustomPhoto] = useState<string | null>(null);
  const [turnus, setTurnus] = useState<TurnusId>('turnus1');
  const [type, setType] = useState<ListingType>('looking_for_room');
  const [faculty, setFaculty] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [budget, setBudget] = useState<string>('');
  const [locationPreference, setLocationPreference] = useState('');
  const [bio, setBio] = useState('');
  
  // Custom user-defined tags
  const [tags, setTags] = useState<string[]>(['Nekuřák', 'Klidný režim']);
  const [newTagInput, setNewTagInput] = useState('');

  const [campSpot, setCampSpot] = useState('');
  const [instagram, setInstagram] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [messenger, setMessenger] = useState('');
  const [onlyfans, setOnlyfans] = useState('');
  const [spamError, setSpamError] = useState<string | null>(null);

  const handleAddTag = () => {
    const trimmed = newTagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      if (tags.length >= 8) {
        alert('Můžete přidat maximálně 8 vlastních štítků.');
        return;
      }
      setTags(prev => [...prev, trimmed]);
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(t => t !== tagToRemove));
  };

  const handleKeyDownTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        alert('Fotografie je příliš velká (maximum je 4 MB).');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomPhoto(reader.result as string);
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setCustomPhoto(null);
    setAvatar('🏕️');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cooldown = getSpamCooldownRemaining();
    if (cooldown > 0) {
      setSpamError(`⏱️ Ochrana proti spamu: další inzerát můžeš vytvořit za ${cooldown} sekund.`);
      return;
    }

    const profileData: Partial<Profile> = {
      name: name.trim() || 'Účastník z Vranova',
      avatar: customPhoto || avatar || '🏕️',
      turnus: turnus || 'turnus1',
      type: type || 'looking_for_room',
      faculty: faculty.trim() || undefined,
      fieldOfStudy: fieldOfStudy.trim() || undefined,
      budget: budget ? Number(budget) : undefined,
      locationPreference: locationPreference.trim() || undefined,
      bio: bio.trim() || undefined,
      tags: tags,
      campSpot: campSpot.trim() || undefined,
      email: email.trim() || undefined,
      contacts: {
        instagram: instagram.trim() ? instagram.trim().replace('@', '') : undefined,
        whatsapp: whatsapp.trim() || undefined,
        messenger: messenger.trim() ? messenger.trim().replace('@', '') : undefined,
        onlyfans: onlyfans.trim() ? onlyfans.trim().replace('@', '') : undefined,
      },
    };

    const res = await createProfile(profileData);
    if (res.success && res.code) {
      onClose();
      onSuccess(res.code);
    } else if (res.error) {
      setSpamError(res.error);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card animate-scale-up"
        style={{ maxWidth: '680px' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
              Nový inzerát spolubydlení
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Vyplňte jen to, co chcete sdílet s ostatními na Vranově
            </p>
          </div>

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Zavřít"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="modal-body">
          {/* ANTI-SPAM ALERT IF TRIGGERED */}
          {spamError && (
            <div
              style={{
                background: '#FEF2F2',
                border: '1.5px solid #F87171',
                borderRadius: '14px',
                padding: '14px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#B91C1C',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              <ShieldAlert size={20} style={{ flexShrink: 0 }} />
              <span>{spamError}</span>
            </div>
          )}

          {/* 1. TYP INZERÁTU */}
          <div className="form-group">
            <label className="form-label">
              <span>Typ inzerátu</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px' }}>
              <button
                type="button"
                className={`chip-btn ${type === 'looking_for_room' ? 'active' : ''}`}
                style={{ justifyContent: 'center', textAlign: 'center', padding: '10px' }}
                onClick={() => setType('looking_for_room')}
              >
                🏠 Hledám pokoj/byt
              </button>
              <button
                type="button"
                className={`chip-btn ${type === 'have_room' ? 'active' : ''}`}
                style={{ justifyContent: 'center', textAlign: 'center', padding: '10px' }}
                onClick={() => setType('have_room')}
              >
                🔑 Nabízím pokoj
              </button>
              <button
                type="button"
                className={`chip-btn ${type === 'looking_for_flatmates' ? 'active' : ''}`}
                style={{ justifyContent: 'center', textAlign: 'center', padding: '10px' }}
                onClick={() => setType('looking_for_flatmates')}
              >
                🤝 Hledejme byt společně
              </button>
            </div>
          </div>

          {/* 2. TURNUS NA VRANOVĚ */}
          <div className="form-group">
            <label className="form-label">
              <span>Turnus na Vranově</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
              {TURNUSY.map(t => (
                <button
                  key={t.id}
                  type="button"
                  className={`chip-btn ${turnus === t.id ? 'active' : ''}`}
                  style={{ justifyContent: 'center', fontSize: '0.8125rem' }}
                  onClick={() => setTurnus(t.id)}
                >
                  {t.shortName}
                </button>
              ))}
            </div>
          </div>

          {/* 3. JMÉNO & FAKULTA */}
          <div className="form-row-2">
            <div>
              <label className="form-label">
                <span>Jméno / Přezdívka</span>
                <span className="form-optional-tag">dobrovolné</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="např. Eliška K., Vojta..."
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">
                <span>Fakulta / Škola</span>
                <span className="form-optional-tag">dobrovolné</span>
              </label>
              <select
                className="form-input"
                value={faculty}
                onChange={e => setFaculty(e.target.value)}
              >
                <option value="">Vyber fakultu</option>
                <optgroup label="MUNI">
                  {FACULTIES.filter(f => f.university === 'MUNI').map(f => (
                    <option key={f.code} value={f.name}>{f.name}</option>
                  ))}
                </optgroup>
                <optgroup label="VUT">
                  {FACULTIES.filter(f => f.university === 'VUT').map(f => (
                    <option key={f.code} value={f.name}>{f.name}</option>
                  ))}
                </optgroup>
                <optgroup label="MENDELU">
                  {FACULTIES.filter(f => f.university === 'MENDELU').map(f => (
                    <option key={f.code} value={f.name}>{f.name}</option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          <div className="form-row-2">
            <div>
              <label className="form-label">
                <span>Obor / Program</span>
                <span className="form-optional-tag">dobrovolné</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="např. Aplikovaná informatika"
                value={fieldOfStudy}
                onChange={e => setFieldOfStudy(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">
                <span>Lokalita v Brně</span>
                <span className="form-optional-tag">dobrovolné</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="např. Veveří, Královo Pole..."
                value={locationPreference}
                onChange={e => setLocationPreference(e.target.value)}
              />
            </div>
          </div>

          {/* 4. VLASTNÍ ŠTÍTKY */}
          <div className="form-group" style={{ background: '#F8FAFC', padding: '16px', borderRadius: '16px', border: '1.5px solid #E2E8F0' }}>
            <label className="form-label">
              <span>Vlastní štítky a vlastnosti (vytvoř si vlastní)</span>
              <span className="form-optional-tag">až 8 štítků</span>
            </label>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Napiš štítek (např. Peču bábovky, Mám kávovar...)"
                value={newTagInput}
                onChange={e => setNewTagInput(e.target.value)}
                onKeyDown={handleKeyDownTag}
                style={{ background: 'white' }}
              />
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={handleAddTag}
              >
                <Plus size={16} />
                <span>Přidat</span>
              </button>
            </div>

            {/* List of user tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  style={{
                    background: 'white',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: 'var(--radius-full)',
                    padding: '6px 12px',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', display: 'flex', padding: 0 }}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* 5. AVATAR / VOLITELNÁ FOTOGRAFIE */}
          <div className="form-group" style={{ background: '#F8FAFC', padding: '16px', borderRadius: '16px', border: '1.5px solid #E2E8F0' }}>
            <label className="form-label" style={{ marginBottom: '10px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Camera size={18} color="var(--p-primary)" />
                Fotografie nebo avatar
              </span>
              <span className="form-optional-tag">dobrovolné</span>
            </label>

            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handlePhotoUpload}
            />

            {customPhoto ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'white', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #A7F3D0', marginBottom: '12px' }}>
                <img
                  src={customPhoto}
                  alt="Nahraná fotografie"
                  style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--p-mint)' }}
                />
                <div style={{ flex: 1 }}>
                  <strong style={{ display: 'block', fontSize: '0.875rem', color: '#065F46' }}>Fotografie nahrána</strong>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Zobrazí se na tvém inzerátu</span>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-subtle"
                  onClick={handleRemovePhoto}
                  style={{ color: '#DC2626' }}
                >
                  <Trash2 size={15} />
                  <span>Odebrat</span>
                </button>
              </div>
            ) : (
              <div style={{ marginBottom: '12px' }}>
                <button
                  type="button"
                  className="btn btn-md btn-outline"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ width: '100%', borderStyle: 'dashed', background: 'white', justifyContent: 'center' }}
                >
                  <UploadCloud size={18} color="var(--p-primary)" />
                  <span>Nahrát fotku (volitelné)</span>
                </button>
              </div>
            )}

            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '6px' }}>
              Nebo zvolit rychlý studentský avatar:
            </div>

            <div className="avatar-selector">
              {DEFAULT_AVATARS.slice(0, 12).map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  className={`avatar-choice ${avatar === emoji && !customPhoto ? 'selected' : ''}`}
                  onClick={() => {
                    setCustomPhoto(null);
                    setAvatar(emoji);
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* 6. BIO / O MNĚ */}
          <div className="form-group">
            <label className="form-label">
              <span>Popis spolubydlení & o mně</span>
              <span className="form-optional-tag">dobrovolné</span>
            </label>
            <textarea
              className="form-textarea"
              placeholder="Napiš cokoliv o sobě, svých návycích, co rád děláš ve volném čase..."
              value={bio}
              onChange={e => setBio(e.target.value)}
            />
          </div>

          {/* 7. BUDGET & VRANOV SPOT */}
          <div className="form-row-2">
            <div>
              <label className="form-label">
                <span>Představa o nájmu (Kč/měsíc)</span>
                <span className="form-optional-tag">dobrovolné</span>
              </label>
              <input
                type="number"
                className="form-input"
                placeholder="např. 8500"
                value={budget}
                onChange={e => setBudget(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">
                <span>Kde tě na Vranově potkat?</span>
                <span className="form-optional-tag">dobrovolné</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="např. U volejbalu, Na pláži..."
                value={campSpot}
                onChange={e => setCampSpot(e.target.value)}
              />
            </div>
          </div>

          {/* 8. CONTACTS (Instagram / WhatsApp / Messenger / OnlyFans) */}
          <div className="form-row-2">
            <div>
              <label className="form-label">
                <span>Instagram @handle</span>
                <span className="form-optional-tag">dobrovolné</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="např. jmeno_muni"
                value={instagram}
                onChange={e => setInstagram(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">
                <span>WhatsApp / Tel</span>
                <span className="form-optional-tag">dobrovolné</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="např. +420 777 123 456"
                value={whatsapp}
                onChange={e => setWhatsapp(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row-2">
            <div>
              <label className="form-label">
                <span>Messenger</span>
                <span className="form-optional-tag">FB jméno</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="např. jan.novak nebo odkaz"
                value={messenger}
                onChange={e => setMessenger(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">
                <span>OnlyFans 🔞</span>
                <span className="form-optional-tag">dobrovolné</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="např. username"
                value={onlyfans}
                onChange={e => setOnlyfans(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label className="form-label">
              <span>Email kontakt</span>
              <span className="form-optional-tag">dobrovolné</span>
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="např. jmeno@mail.muni.cz"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          {/* SUBMIT BUTTON */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-md btn-outline"
              onClick={onClose}
            >
              Zrušit
            </button>

            <button
              type="submit"
              className="btn btn-md btn-primary"
            >
              <span>🏕️</span>
              <span>Vytvořit inzerát a získat kód</span>
              <svg className="btn-arrow-icon" viewBox="0 0 74.5 7.3" fill="currentColor">
                <path d="M74.3,4.1c0.2-0.2,0.2-0.5,0-0.7l-3.2-3.2c-0.2-0.2-0.5-0.2-0.7,0s-0.2,0.5,0,0.7l2.8,2.8l-2.8,2.8c-0.2,0.2-0.2,0.5,0,0.7s0.5,0.2,0.7,0L74.3,4.1z"/>
                <rect y="3.1" width="73.4" height="1.1"/>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
