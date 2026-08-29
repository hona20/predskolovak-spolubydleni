import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Profile, FilterState } from '../types';
import { INITIAL_PROFILES } from '../data/initialProfiles';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import {
  fetchAllProfiles,
  fetchProfilesByCodes,
  insertProfile,
  updateProfile as apiUpdateProfile,
  deleteProfile as apiDeleteProfile,
  fetchProfileByCode,
} from '../lib/profilesApi';

interface ProfilesContextType {
  profiles: Profile[];
  savedProfileIds: string[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  createProfile: (profileData: Partial<Profile>) => Promise<{ success: boolean; profile?: Profile; code?: string; error?: string }>;
  updateProfileByCode: (code: string, updatedData: Partial<Profile>) => Promise<boolean>;
  deleteProfileByCode: (code: string) => Promise<boolean>;
  getProfileByCode: (code: string) => Promise<Profile | null>;
  toggleSaveProfile: (id: string) => void;
  filteredProfiles: Profile[];
  userCreatedProfile: Profile | null;
  mySavedCodes: string[];
  toastMessage: string | null;
  showToast: (msg: string) => void;
  getSpamCooldownRemaining: () => number;
  isLoading: boolean;
}

const STORAGE_SAVED_KEY = 'predskolovak_spolubydleni_saved_ids';
const STORAGE_CODES_KEY = 'predskolovak_spolubydleni_my_codes';
const STORAGE_LAST_CREATED_KEY = 'predskolovak_last_created_timestamp';
const STORAGE_PROFILES_KEY = 'predskolovak_spolubydleni_user_profiles';
const SPAM_COOLDOWN_MS = 60 * 1000;
const MAX_ADS_PER_BROWSER = 3;

const defaultFilters: FilterState = { searchQuery: '', turnus: 'all', onlySaved: false };
const ProfilesContext = createContext<ProfilesContextType | undefined>(undefined);

export const ProfilesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [remoteProfiles, setRemoteProfiles] = useState<Profile[]>([]);
  // Profiles matched by a code this device actually holds - these come back WITH manageCode.
  const [myProfiles, setMyProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [offlineProfiles, setOfflineProfiles] = useState<Profile[]>(() => {
    try { const s = localStorage.getItem(STORAGE_PROFILES_KEY); return s ? JSON.parse(s) : []; } catch { return []; }
  });
  const [mySavedCodes, setMySavedCodes] = useState<string[]>(() => {
    try { const s = localStorage.getItem(STORAGE_CODES_KEY); return s ? JSON.parse(s) : []; } catch { return []; }
  });
  const [savedProfileIds, setSavedProfileIds] = useState<string[]>(() => {
    try { const s = localStorage.getItem(STORAGE_SAVED_KEY); return s ? JSON.parse(s) : []; } catch { return []; }
  });
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const channelRef = useRef<any>(null);

  useEffect(() => { try { localStorage.setItem(STORAGE_CODES_KEY, JSON.stringify(mySavedCodes)); } catch {} }, [mySavedCodes]);
  useEffect(() => { try { localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(savedProfileIds)); } catch {} }, [savedProfileIds]);
  useEffect(() => { if (!isSupabaseConfigured) { try { localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify(offlineProfiles)); } catch {} } }, [offlineProfiles]);

  // Public browse list. Never carries manage_code for anyone's ad.
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) { setIsLoading(false); return; }
    let cancelled = false;
    const reload = () => fetchAllProfiles().then(profiles => { if (!cancelled) setRemoteProfiles(profiles); });
    fetchAllProfiles().then(profiles => { if (!cancelled) { setRemoteProfiles(profiles); setIsLoading(false); } });
    // Any change just triggers a safe re-fetch - we never read field values out of the
    // realtime payload itself, so a leaked manage_code can never end up in client state.
    const channel = supabase.channel('profiles-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => reload())
      .subscribe();
    channelRef.current = channel;
    return () => { cancelled = true; if (supabase && channelRef.current) supabase.removeChannel(channelRef.current); };
  }, []);

  // Re-resolve "my" ads (with manage_code) whenever the set of codes this device holds changes.
  useEffect(() => {
    if (!isSupabaseConfigured) { setMyProfiles([]); return; }
    if (mySavedCodes.length === 0) { setMyProfiles([]); return; }
    let cancelled = false;
    fetchProfilesByCodes(mySavedCodes).then(profiles => { if (!cancelled) setMyProfiles(profiles); });
    return () => { cancelled = true; };
  }, [mySavedCodes]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  }, []);

  // Merge manage_code back in only for the ads this device actually owns.
  const userProfiles = useMemo(() => {
    if (!isSupabaseConfigured) return offlineProfiles;
    if (myProfiles.length === 0) return remoteProfiles;
    const mineById = new Map(myProfiles.map(p => [p.id, p]));
    const merged = remoteProfiles.map(p => mineById.get(p.id) ?? p);
    const knownIds = new Set(remoteProfiles.map(p => p.id));
    const notYetListed = myProfiles.filter(p => !knownIds.has(p.id));
    return [...notYetListed, ...merged];
  }, [remoteProfiles, offlineProfiles, myProfiles]);

  const allProfiles = useMemo(() => {
    const remoteIds = new Set(userProfiles.map(p => p.id));
    return [...userProfiles, ...INITIAL_PROFILES.filter(p => !remoteIds.has(p.id))];
  }, [userProfiles]);

  const userCreatedProfile = useMemo(() => {
    if (!mySavedCodes.length) return null;
    for (const code of mySavedCodes) {
      const found = userProfiles.find(p => (p.manageCode || '').toUpperCase() === code.toUpperCase());
      if (found) return found;
    }
    return null;
  }, [userProfiles, mySavedCodes]);

  const getSpamCooldownRemaining = (): number => {
    try {
      const last = localStorage.getItem(STORAGE_LAST_CREATED_KEY);
      if (!last) return 0;
      const elapsed = Date.now() - Number(last);
      return elapsed < SPAM_COOLDOWN_MS ? Math.ceil((SPAM_COOLDOWN_MS - elapsed) / 1000) : 0;
    } catch { return 0; }
  };

  const generateManageCode = () => 'VRN-' + Math.floor(1000 + Math.random() * 9000);

  const createProfile = async (profileData: Partial<Profile>): Promise<{ success: boolean; profile?: Profile; code?: string; error?: string }> => {
    const cooldown = getSpamCooldownRemaining();
    if (cooldown > 0) { const m = `Ochrana proti spamu: dalsi inzerat muzete vytvorit za ${cooldown} sekund.`; showToast(m); return { success: false, error: m }; }
    if (mySavedCodes.length >= MAX_ADS_PER_BROWSER) { const m = `Mas jiz vytvoreno ${MAX_ADS_PER_BROWSER} inzeratu.`; showToast(m); return { success: false, error: m }; }

    const manageCode = generateManageCode();
    const newProfile: Profile & { manageCode: string } = {
      id: 'user-' + Date.now(), name: profileData.name?.trim() || 'Ucastnik z Vranova',
      avatar: profileData.avatar || '🏕️', turnus: profileData.turnus || 'turnus1',
      type: profileData.type || 'looking_for_room', faculty: profileData.faculty || undefined,
      fieldOfStudy: profileData.fieldOfStudy || undefined, budget: profileData.budget ? Number(profileData.budget) : undefined,
      locationPreference: profileData.locationPreference || undefined, bio: profileData.bio || undefined,
      tags: profileData.tags || [], campSpot: profileData.campSpot || undefined,
      contacts: profileData.contacts || {}, email: profileData.email?.trim() || undefined,
      manageCode, createdAt: new Date().toISOString(), isUserCreated: true,
    };

    if (isSupabaseConfigured) {
      const ok = await insertProfile(newProfile);
      if (!ok) { const m = '❌ Inzerat se nepodarilo ulozit. Zkus to znovu.'; showToast(m); return { success: false, error: m }; }
      fetchAllProfiles().then(setRemoteProfiles);
    } else {
      setOfflineProfiles(prev => [newProfile, ...prev]);
    }

    setMySavedCodes(prev => [manageCode, ...prev]);
    try { localStorage.setItem(STORAGE_LAST_CREATED_KEY, Date.now().toString()); } catch {}
    showToast('🎉 Inzerat byl uspesne vytvoreni! Tvuj kod: ' + manageCode);
    return { success: true, profile: newProfile, code: manageCode };
  };

  const getProfileByCode = async (code: string): Promise<Profile | null> => {
    if (!code) return null;
    const c = code.trim().toUpperCase();
    const local = allProfiles.find(p => (p.manageCode || '').toUpperCase() === c);
    if (local) return local;
    if (isSupabaseConfigured) return await fetchProfileByCode(c);
    return null;
  };

  const updateProfileByCode = async (code: string, updatedData: Partial<Profile>): Promise<boolean> => {
    if (!code) return false;
    const clean = code.trim().toUpperCase();
    if (isSupabaseConfigured) {
      const profile = await getProfileByCode(clean);
      if (!profile) { showToast('Inzerat s timto kodem nebyl nalezen.'); return false; }
      const ok = await apiUpdateProfile(profile.id, clean, updatedData);
      if (ok) {
        fetchAllProfiles().then(setRemoteProfiles);
        fetchProfilesByCodes(mySavedCodes).then(setMyProfiles);
      }
      showToast(ok ? 'Inzerat byl uspesne upraven! ✅' : '❌ Nepodarilo se aktualizovat inzerat.');
      return ok;
    } else {
      let updated = false;
      setOfflineProfiles(prev => prev.map(p => {
        if ((p.manageCode || '').toUpperCase() === clean) { updated = true; return { ...p, ...updatedData, manageCode: p.manageCode }; }
        return p;
      }));
      showToast(updated ? 'Inzerat byl uspesne upraven! ✅' : 'Inzerat s timto kodem nebyl nalezen.');
      return updated;
    }
  };

  const deleteProfileByCode = async (code: string): Promise<boolean> => {
    if (!code) return false;
    const clean = code.trim().toUpperCase();
    if (isSupabaseConfigured) {
      const profile = await getProfileByCode(clean);
      if (!profile) { showToast('Inzerat s timto kodem nebyl nalezen.'); return false; }
      const ok = await apiDeleteProfile(profile.id, clean);
      if (ok) {
        setMySavedCodes(prev => prev.filter(c => c.toUpperCase() !== clean));
        fetchAllProfiles().then(setRemoteProfiles);
        showToast('Inzerat byl trvale smazan. 🗑️');
      } else {
        showToast('❌ Nepodarilo se smazat inzerat.');
      }
      return ok;
    } else {
      const before = offlineProfiles.length;
      const next = offlineProfiles.filter(p => (p.manageCode || '').toUpperCase() !== clean);
      if (next.length < before) {
        setOfflineProfiles(next);
        setMySavedCodes(prev => prev.filter(c => c.toUpperCase() !== clean));
        showToast('Inzerat byl trvale smazan. 🗑️');
        return true;
      }
      showToast('Inzerat s timto kodem nebyl nalezen.');
      return false;
    }
  };

  const toggleSaveProfile = (id: string) => {
    setSavedProfileIds(prev => {
      if (prev.includes(id)) { showToast('Odebrano z oblibenych.'); return prev.filter(pId => pId !== id); }
      showToast('Ulozeno do oblibenych! ⭐'); return [...prev, id];
    });
  };

  const filteredProfiles = useMemo(() => {
    return allProfiles.filter(p => {
      if (filters.onlySaved && !savedProfileIds.includes(p.id)) return false;
      if (filters.turnus !== 'all' && p.turnus !== filters.turnus) return false;
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        if (!(p.name||'').toLowerCase().includes(q) && !(p.bio||'').toLowerCase().includes(q) &&
            !(p.faculty||'').toLowerCase().includes(q) && !(p.fieldOfStudy||'').toLowerCase().includes(q) &&
            !(p.locationPreference||'').toLowerCase().includes(q) && !(p.tags||[]).some(t => t.toLowerCase().includes(q)))
          return false;
      }
      return true;
    });
  }, [allProfiles, filters, savedProfileIds]);

  return (
    <ProfilesContext.Provider value={{
      profiles: allProfiles, savedProfileIds, filters, setFilters,
      createProfile, updateProfileByCode, deleteProfileByCode, getProfileByCode,
      toggleSaveProfile, filteredProfiles, userCreatedProfile, mySavedCodes,
      toastMessage, showToast, getSpamCooldownRemaining, isLoading,
    }}>
      {children}
    </ProfilesContext.Provider>
  );
};

export const useProfiles = () => {
  const ctx = useContext(ProfilesContext);
  if (!ctx) throw new Error('useProfiles must be used within a ProfilesProvider');
  return ctx;
};
