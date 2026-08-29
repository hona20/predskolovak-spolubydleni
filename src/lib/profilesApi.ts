import { supabase, isSupabaseConfigured } from './supabase';
import { Profile } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToProfile(row: any): Profile {
  return {
    id: row.id,
    manageCode: row.manage_code,
    name: row.name ?? undefined,
    avatar: row.avatar ?? undefined,
    turnus: row.turnus,
    type: row.type,
    faculty: row.faculty ?? undefined,
    fieldOfStudy: row.field_of_study ?? undefined,
    bio: row.bio ?? undefined,
    budget: row.budget ?? undefined,
    locationPreference: row.location_preference ?? undefined,
    tags: row.tags ?? [],
    campSpot: row.camp_spot ?? undefined,
    contacts: row.contacts ?? {},
    email: row.email ?? undefined,
    createdAt: row.created_at,
    isUserCreated: true,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function profileToRow(profile: Partial<Profile> & { manageCode: string }): Record<string, any> {
  return {
    id: profile.id,
    manage_code: profile.manageCode,
    name: profile.name ?? null,
    avatar: profile.avatar ?? null,
    turnus: profile.turnus ?? 'turnus1',
    type: profile.type ?? 'looking_for_room',
    faculty: profile.faculty ?? null,
    field_of_study: profile.fieldOfStudy ?? null,
    bio: profile.bio ?? null,
    budget: profile.budget ?? null,
    location_preference: profile.locationPreference ?? null,
    tags: profile.tags ?? [],
    camp_spot: profile.campSpot ?? null,
    contacts: profile.contacts ?? {},
    email: profile.email ?? null,
  };
}

export async function fetchAllProfiles(): Promise<Profile[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
  if (error) { console.error('[profilesApi] fetchAllProfiles:', error.message); return []; }
  return (data ?? []).map(rowToProfile);
}

export async function insertProfile(profile: Profile): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  const { error } = await supabase.from('profiles').insert(profileToRow(profile));
  if (error) { console.error('[profilesApi] insertProfile:', error.message); return false; }
  return true;
}

export async function updateProfile(id: string, manageCode: string, data: Partial<Profile>): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: Record<string, any> = {};
  if (data.name !== undefined) payload.name = data.name;
  if (data.avatar !== undefined) payload.avatar = data.avatar;
  if (data.turnus !== undefined) payload.turnus = data.turnus;
  if (data.type !== undefined) payload.type = data.type;
  if (data.faculty !== undefined) payload.faculty = data.faculty;
  if (data.fieldOfStudy !== undefined) payload.field_of_study = data.fieldOfStudy;
  if (data.bio !== undefined) payload.bio = data.bio;
  if (data.budget !== undefined) payload.budget = data.budget;
  if (data.locationPreference !== undefined) payload.location_preference = data.locationPreference;
  if (data.tags !== undefined) payload.tags = data.tags;
  if (data.campSpot !== undefined) payload.camp_spot = data.campSpot;
  if (data.contacts !== undefined) payload.contacts = data.contacts;
  if (data.email !== undefined) payload.email = data.email;
  const { error } = await supabase.from('profiles').update(payload).eq('id', id).eq('manage_code', manageCode.toUpperCase());
  if (error) { console.error('[profilesApi] updateProfile:', error.message); return false; }
  return true;
}

export async function deleteProfile(id: string, manageCode: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  const { error } = await supabase.from('profiles').delete().eq('id', id).eq('manage_code', manageCode.toUpperCase());
  if (error) { console.error('[profilesApi] deleteProfile:', error.message); return false; }
  return true;
}

export async function fetchProfileByCode(code: string): Promise<Profile | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase.from('profiles').select('*').eq('manage_code', code.trim().toUpperCase()).maybeSingle();
  if (error) { console.error('[profilesApi] fetchProfileByCode:', error.message); return null; }
  return data ? rowToProfile(data) : null;
}