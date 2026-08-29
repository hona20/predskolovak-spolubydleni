import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Profile, FilterState } from '../types';
import { INITIAL_PROFILES } from '../data/initialProfiles';

interface ProfilesContextType {
  profiles: Profile[];
  savedProfileIds: string[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  createProfile: (profileData: Partial<Profile>) => { success: boolean; profile?: Profile; code?: string; error?: string };
  updateProfileByCode: (code: string, updatedData: Partial<Profile>) => boolean;
  deleteProfileByCode: (code: string) => boolean;
  getProfileByCode: (code: string) => Profile | null;
  toggleSaveProfile: (id: string) => void;
  filteredProfiles: Profile[];
  userCreatedProfile: Profile | null;
  mySavedCodes: string[];
  toastMessage: string | null;
  showToast: (msg: string) => void;
  // Anti-spam info
  getSpamCooldownRemaining: () => number; // in seconds, 0 if ok
}

const STORAGE_PROFILES_KEY = 'predskolovak_spolubydleni_user_profiles';
const STORAGE_SAVED_KEY = 'predskolovak_spolubydleni_saved_ids';
const STORAGE_CODES_KEY = 'predskolovak_spolubydleni_my_codes';
const STORAGE_LAST_CREATED_KEY = 'predskolovak_last_created_timestamp';

const SPAM_COOLDOWN_MS = 60 * 1000; // 60 seconds anti-spam cooldown between creations
const MAX_ADS_PER_BROWSER = 3;

const defaultFilters: FilterState = {
  searchQuery: '',
  turnus: 'all',
  onlySaved: false,
};

const ProfilesContext = createContext<ProfilesContextType | undefined>(undefined);

export const ProfilesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfiles, setUserProfiles] = useState<Profile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROFILES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [mySavedCodes, setMySavedCodes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CODES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [savedProfileIds, setSavedProfileIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SAVED_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify(userProfiles));
    } catch (e) {
      console.error('Failed to save user profiles to localStorage', e);
    }
  }, [userProfiles]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CODES_KEY, JSON.stringify(mySavedCodes));
    } catch (e) {
      console.error('Failed to save mySavedCodes to localStorage', e);
    }
  }, [mySavedCodes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(savedProfileIds));
    } catch (e) {
      console.error('Failed to save savedProfileIds to localStorage', e);
    }
  }, [savedProfileIds]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Combine initial profiles and user-created profiles
  const allProfiles = useMemo(() => {
    return [...userProfiles, ...INITIAL_PROFILES];
  }, [userProfiles]);

  // Find most recent user-created profile on this browser
  const userCreatedProfile = useMemo(() => {
    return userProfiles.length > 0 ? userProfiles[0] : null;
  }, [userProfiles]);

  // Anti-spam cooldown checker
  const getSpamCooldownRemaining = (): number => {
    try {
      const lastCreated = localStorage.getItem(STORAGE_LAST_CREATED_KEY);
      if (!lastCreated) return 0;
      const elapsed = Date.now() - Number(lastCreated);
      if (elapsed < SPAM_COOLDOWN_MS) {
        return Math.ceil((SPAM_COOLDOWN_MS - elapsed) / 1000);
      }
      return 0;
    } catch {
      return 0;
    }
  };

  // Generate unique clean code like VRN-4892
  const generateManageCode = (): string => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000).toString();
    return `VRN-${randomDigits}`;
  };

  // Create Profile with secret PIN and anti-spam check
  const createProfile = (
    profileData: Partial<Profile>
  ): { success: boolean; profile?: Profile; code?: string; error?: string } => {
    // 1. Anti-spam check: Cooldown
    const cooldown = getSpamCooldownRemaining();
    if (cooldown > 0) {
      const errorMsg = `⏱️ Ochrana proti spamu: další inzerát můžeš vytvořit za ${cooldown} sekund.`;
      showToast(errorMsg);
      return { success: false, error: errorMsg };
    }

    // 2. Anti-spam check: Maximum active ads per browser
    if (userProfiles.length >= MAX_ADS_PER_BROWSER) {
      const errorMsg = `Máš již vytvořeno ${MAX_ADS_PER_BROWSER} inzerátů. Před vytvořením nového nejprve smaž svůj starší inzerát.`;
      showToast(errorMsg);
      return { success: false, error: errorMsg };
    }

    // Generate unique code
    const manageCode = generateManageCode();

    const newProfile: Profile = {
      id: 'user-' + Date.now(),
      name: profileData.name?.trim() || 'Účastník z Vranova',
      avatar: profileData.avatar || '🏕️',
      turnus: profileData.turnus || 'turnus1',
      type: profileData.type || 'looking_for_room',
      faculty: profileData.faculty || undefined,
      fieldOfStudy: profileData.fieldOfStudy || undefined,
      budget: profileData.budget ? Number(profileData.budget) : undefined,
      locationPreference: profileData.locationPreference || undefined,
      bio: profileData.bio || undefined,
      tags: profileData.tags || [],
      campSpot: profileData.campSpot || undefined,
      contacts: profileData.contacts || {},
      email: profileData.email?.trim() || undefined,
      manageCode,
      createdAt: new Date().toISOString(),
      isUserCreated: true,
    };

    // Update state
    setUserProfiles(prev => [newProfile, ...prev]);
    setMySavedCodes(prev => [manageCode, ...prev]);

    // Save anti-spam timestamp
    try {
      localStorage.setItem(STORAGE_LAST_CREATED_KEY, Date.now().toString());
    } catch {}

    showToast(`🎉 Inzerát byl úspěšně vytvořen! Tvůj kód: ${manageCode}`);
    return { success: true, profile: newProfile, code: manageCode };
  };

  // Find profile by secret manageCode (case-insensitive)
  const getProfileByCode = (code: string): Profile | null => {
    if (!code) return null;
    const cleanCode = code.trim().toUpperCase();
    const found = allProfiles.find(
      p => (p.manageCode || '').toUpperCase() === cleanCode
    );
    return found || null;
  };

  // Update profile by secret manageCode
  const updateProfileByCode = (code: string, updatedData: Partial<Profile>): boolean => {
    if (!code) return false;
    const cleanCode = code.trim().toUpperCase();
    let updated = false;

    setUserProfiles(prev =>
      prev.map(p => {
        if ((p.manageCode || '').toUpperCase() === cleanCode) {
          updated = true;
          return {
            ...p,
            ...updatedData,
            manageCode: p.manageCode || cleanCode, // keep code locked
          };
        }
        return p;
      })
    );

    if (updated) {
      showToast('Inzerát byl úspěšně upraven! ✅');
      return true;
    } else {
      showToast('Inzerát s tímto kódem nebyl nalezen.');
      return false;
    }
  };

  // Delete profile by secret manageCode
  const deleteProfileByCode = (code: string): boolean => {
    if (!code) return false;
    const cleanCode = code.trim().toUpperCase();
    const initialCount = userProfiles.length;
    const nextProfiles = userProfiles.filter(p => (p.manageCode || '').toUpperCase() !== cleanCode);

    if (nextProfiles.length < initialCount) {
      setUserProfiles(nextProfiles);
      setMySavedCodes(prev => prev.filter(c => (c || '').toUpperCase() !== cleanCode));
      showToast('Inzerát byl trvale smazán. 🗑️');
      return true;
    } else {
      showToast('Inzerát s tímto kódem nebyl nalezen.');
      return false;
    }
  };

  const toggleSaveProfile = (id: string) => {
    setSavedProfileIds(prev => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Odebráno z oblíbených.');
        return prev.filter(pId => pId !== id);
      } else {
        showToast('Uloženo do oblíbených! ⭐');
        return [...prev, id];
      }
    });
  };

  // Filter computation: ONLY TURNUS + SEARCH QUERY + SAVED
  const filteredProfiles = useMemo(() => {
    return allProfiles.filter(profile => {
      // Saved filter
      if (filters.onlySaved && !savedProfileIds.includes(profile.id)) {
        return false;
      }

      // Turnus filter (EXCLUSIVE FILTER)
      if (filters.turnus !== 'all' && profile.turnus !== filters.turnus) {
        return false;
      }

      // Search Query
      if (filters.searchQuery.trim() !== '') {
        const query = filters.searchQuery.toLowerCase();
        const nameMatch = (profile.name || '').toLowerCase().includes(query);
        const bioMatch = (profile.bio || '').toLowerCase().includes(query);
        const facultyMatch = (profile.faculty || '').toLowerCase().includes(query);
        const fieldMatch = (profile.fieldOfStudy || '').toLowerCase().includes(query);
        const locMatch = (profile.locationPreference || '').toLowerCase().includes(query);
        const tagMatch = (profile.tags || []).some(t => t.toLowerCase().includes(query));

        if (!nameMatch && !bioMatch && !facultyMatch && !fieldMatch && !locMatch && !tagMatch) {
          return false;
        }
      }

      return true;
    });
  }, [allProfiles, filters, savedProfileIds]);

  return (
    <ProfilesContext.Provider
      value={{
        profiles: allProfiles,
        savedProfileIds,
        filters,
        setFilters,
        createProfile,
        updateProfileByCode,
        deleteProfileByCode,
        getProfileByCode,
        toggleSaveProfile,
        filteredProfiles,
        userCreatedProfile,
        mySavedCodes,
        toastMessage,
        showToast,
        getSpamCooldownRemaining,
      }}
    >
      {children}
    </ProfilesContext.Provider>
  );
};

export const useProfiles = () => {
  const context = useContext(ProfilesContext);
  if (!context) {
    throw new Error('useProfiles must be used within a ProfilesProvider');
  }
  return context;
};
