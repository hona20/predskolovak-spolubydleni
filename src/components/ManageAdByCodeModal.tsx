import React, { useState, useEffect } from 'react';
import { useProfiles } from '../context/ProfilesContext';
import { Profile, TurnusId, ListingType } from '../types';
import { TURNUSY, FACULTIES } from '../data/faculties';
import { KeyRound, X, Trash2, ArrowRight, Save } from 'lucide-react';

interface ManageAdByCodeModalProps {
  initialCode?: string;
  onClose: () => void;
}

export const ManageAdByCodeModal: React.FC<ManageAdByCodeModalProps> = ({ initialCode = '', onClose }) => {
  const { getProfileByCode, updateProfileByCode, deleteProfileByCode, mySavedCodes } = useProfiles();

  const [enteredCode, setEnteredCode] = useState(initialCode);
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  // Edit form state
  const [name, setName] = useState('');
  const [turnus, setTurnus] = useState<TurnusId>('turnus1');
  const [type, setType] = useState<ListingType>('looking_for_room');
  const [faculty, setFaculty] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [budget, setBudget] = useState<string>('');
  const [locationPreference, setLocationPreference] = useState('');
  const [bio, setBio] = useState('');
  const [campSpot, setCampSpot] = useState('');
  const [instagram, setInstagram] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [messenger, setMessenger] = useState('');
  const [onlyfans, setOnlyfans] = useState('');

  const handleVerifyCode = async (codeToVerify: string) => {
    const clean = codeToVerify.trim().toUpperCase();
    if (!clean) {
      setError('Zadejte prosím kód inzerátu.');
      return;
    }

    setIsVerifying(true);
    const found = await getProfileByCode(clean);
    setIsVerifying(false);
    if (found) {
      setActiveProfile(found);
      setName(found.name || '');
      setTurnus(found.turnus || 'turnus1');
      setType(found.type || 'looking_for_room');
      setFaculty(found.faculty || '');
      setFieldOfStudy(found.fieldOfStudy || '');
      setBudget(found.budget ? String(found.budget) : '');
      setLocationPreference(found.locationPreference || '');
      setBio(found.bio || '');
      setCampSpot(found.campSpot || '');
      setInstagram(found.contacts?.instagram || '');
      setWhatsapp(found.contacts?.whatsapp || '');
      setMessenger(found.contacts?.messenger || '');
      setOnlyfans(found.contacts?.onlyfans || '');
      setError(null);
    } else {
      setError('Inzerát s tímto kódem nebyl nalezen. Zkontrolujte prosím kód.');
    }
  };

  useEffect(() => {
    if (initialCode) {
      handleVerifyCode(initialCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProfile) return;

    const updatedData: Partial<Profile> = {
      name: name.trim() || 'Účastník z Vranova',
      turnus,
      type,
      faculty: faculty.trim() || undefined,
      fieldOfStudy: fieldOfStudy.trim() || undefined,
      budget: budget ? Number(budget) : undefined,
      locationPreference: locationPreference.trim() || undefined,
      bio: bio.trim() || undefined,
      campSpot: campSpot.trim() || undefined,
      contacts: {
        instagram: instagram.trim() ? instagram.trim().replace('@', '') : undefined,
        whatsapp: whatsapp.trim() || undefined,
        messenger: messenger.trim() ? messenger.trim().replace('@', '') : undefined,
        onlyfans: onlyfans.trim() ? onlyfans.trim().replace('@', '') : undefined,
      },
    };

    const success = await updateProfileByCode(activeProfile.manageCode || '', updatedData);
    if (success) {
      onClose();
    }
  };

  const handleDelete = async () => {
    if (!activeProfile) return;
    const success = await deleteProfileByCode(activeProfile.manageCode || '');
    if (success) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card animate-scale-up"
        style={{ maxWidth: activeProfile ? '680px' : '480px', padding: 0 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: '#EFF6FF', padding: '10px', borderRadius: '12px' }}>
              <KeyRound size={24} color="var(--p-primary)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {activeProfile ? `Úprava inzerátu (${activeProfile.manageCode})` : 'Správa inzerátu'}
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                {activeProfile ? 'Změň údaje nebo inzerát trvale smaž' : 'Zadej tajný PIN kód svého inzerátu'}
              </p>
            </div>
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

        {/* STEP 1: ENTER CODE */}
        {!activeProfile ? (
          <div style={{ padding: '24px 28px 28px' }}>
            <p style={{ fontSize: '0.9375rem', color: '#334155', lineHeight: 1.5, marginBottom: '20px' }}>
              Zadej tajný kód inzerátu (např. <code>VRN-8429</code>), který se ti zobrazil při jeho vytvoření.
            </p>

            {mySavedCodes.length > 0 && (
              <div style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '20px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Kódy z tohoto zařízení:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {mySavedCodes.map(code => (
                    <button
                      key={code}
                      type="button"
                      className="btn btn-sm btn-outline"
                      disabled={isVerifying}
                      onClick={() => {
                        setEnteredCode(code);
                        handleVerifyCode(code);
                      }}
                      style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--p-primary)' }}
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form
              onSubmit={e => {
                e.preventDefault();
                handleVerifyCode(enteredCode);
              }}
            >
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label" style={{ marginBottom: '6px' }}>
                  <span>Kód inzerátu:</span>
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  className="form-input"
                  placeholder="např. VRN-8429"
                  value={enteredCode}
                  onChange={e => {
                    setEnteredCode(e.target.value.toUpperCase());
                    setError(null);
                  }}
                  style={{ fontFamily: 'monospace', fontSize: '1.25rem', fontWeight: 800, letterSpacing: '2px', textAlign: 'center' }}
                />
                {error && (
                  <div style={{ color: '#DC2626', fontSize: '0.8125rem', fontWeight: 600, marginTop: '8px' }}>
                    ⚠️ {error}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-lg btn-primary"
                disabled={isVerifying}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <span>{isVerifying ? 'Ověřuji…' : 'Ověřit kód a upravit inzerát'}</span>
                {!isVerifying && <ArrowRight size={18} />}
              </button>
            </form>
          </div>
        ) : (
          /* STEP 2: EDIT / DELETE FORM */
          <form onSubmit={handleSave} className="modal-body">
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

            {/* 2. TURNUS */}
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

            {/* 3. NAME & FACULTY */}
            <div className="form-row-2">
              <div>
                <label className="form-label">
                  <span>Jméno / Přezdívka</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">
                  <span>Fakulta / Škola</span>
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

            {/* 4. BIO */}
            <div className="form-group">
              <label className="form-label">
                <span>Popis spolubydlení</span>
              </label>
              <textarea
                className="form-textarea"
                value={bio}
                onChange={e => setBio(e.target.value)}
              />
            </div>

            {/* 5. BUDGET & VRANOV SPOT */}
            <div className="form-row-2">
              <div>
                <label className="form-label">
                  <span>Představa o nájmu (Kč/měsíc)</span>
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={budget}
                  onChange={e => setBudget(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">
                  <span>Kde tě na Vranově potkat?</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={campSpot}
                  onChange={e => setCampSpot(e.target.value)}
                />
              </div>
            </div>

            {/* 6. CONTACTS */}
            <div className="form-row-2">
              <div>
                <label className="form-label">
                  <span>Instagram</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={instagram}
                  onChange={e => setInstagram(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">
                  <span>WhatsApp / Tel</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={whatsapp}
                  onChange={e => setWhatsapp(e.target.value)}
                />
              </div>
            </div>

            {/* ACTIONS */}
            <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
              {isConfirmingDelete ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.8125rem', color: '#DC2626', fontWeight: 700 }}>Opravdu smazat?</span>
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
                    style={{ background: '#DC2626', color: 'white' }}
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
                  style={{ color: '#DC2626' }}
                >
                  <Trash2 size={16} />
                  <span>Smazat inzerát</span>
                </button>
              )}

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className="btn btn-md btn-outline"
                  onClick={onClose}
                >
                  Zavřít
                </button>

                <button
                  type="submit"
                  className="btn btn-md btn-primary"
                >
                  <Save size={18} />
                  <span>Uložit změny</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
