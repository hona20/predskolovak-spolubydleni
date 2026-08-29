-- ====================================================
-- Predskolovak Spolubydleni - Supabase Database Schema
-- Spustit v Supabase SQL Editor: https://supabase.com/dashboard
-- ====================================================

-- 1. Tabulka profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id                  TEXT        PRIMARY KEY,
  manage_code         TEXT        NOT NULL,
  name                TEXT,
  avatar              TEXT,
  turnus              TEXT        NOT NULL DEFAULT 'turnus1',
  type                TEXT        NOT NULL DEFAULT 'looking_for_room',
  faculty             TEXT,
  field_of_study      TEXT,
  bio                 TEXT,
  budget              INTEGER,
  location_preference TEXT,
  tags                TEXT[]      DEFAULT '{}',
  camp_spot           TEXT,
  contacts            JSONB       DEFAULT '{}',
  email               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Indexy
CREATE INDEX IF NOT EXISTS idx_profiles_manage_code ON public.profiles (manage_code);
CREATE INDEX IF NOT EXISTS idx_profiles_turnus ON public.profiles (turnus);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles (created_at DESC);

-- 3. Automaticke updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 4. Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public insert" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Update own ad" ON public.profiles FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Delete own ad" ON public.profiles FOR DELETE USING (true);

-- ====================================================
-- 5. Zabezpeceni manage_code (tajny PIN inzeratu)
-- Bez tohoto bloku umi kdokoliv precist cizi manage_code
-- primo z REST/realtime odpovedi (napr. pres Network tab) a pak
-- cizi inzerat upravit/smazat. Reseni: verejne cteni (select *)
-- uz manage_code nevraci vubec, update/delete/lookup jde jen pres
-- SECURITY DEFINER funkce, ktere overeni kodu delaji na serveru.
-- ====================================================

-- Uz zadny primy SELECT na sloupec manage_code pro verejnost
REVOKE SELECT (manage_code) ON public.profiles FROM anon, authenticated;

-- Primy UPDATE/DELETE z klienta uz neni povoleny - jen pres funkce niz
DROP POLICY IF EXISTS "Update own ad" ON public.profiles;
DROP POLICY IF EXISTS "Delete own ad" ON public.profiles;
CREATE POLICY "No direct update" ON public.profiles FOR UPDATE USING (false);
CREATE POLICY "No direct delete" ON public.profiles FOR DELETE USING (false);

-- Najit inzerat podle kodu (Sprava inzeratu - zadani kodu)
CREATE OR REPLACE FUNCTION public.get_profile_by_code(p_code text)
RETURNS SETOF public.profiles
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.profiles WHERE manage_code = upper(trim(p_code)) LIMIT 1;
$$;

-- Najit vsechny inzeraty, jejichz kod uz mam ulozeny v tomto zarizeni
CREATE OR REPLACE FUNCTION public.get_profiles_by_codes(p_codes text[])
RETURNS SETOF public.profiles
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.profiles
  WHERE manage_code = ANY (SELECT upper(trim(c)) FROM unnest(p_codes) AS c);
$$;

-- Upravit inzerat - funguje jen pri spravnem kodu
CREATE OR REPLACE FUNCTION public.update_profile_by_code(p_id text, p_code text, p_patch jsonb)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_updated int;
BEGIN
  UPDATE public.profiles SET
    name = CASE WHEN p_patch ? 'name' THEN p_patch->>'name' ELSE name END,
    avatar = CASE WHEN p_patch ? 'avatar' THEN p_patch->>'avatar' ELSE avatar END,
    turnus = CASE WHEN p_patch ? 'turnus' THEN p_patch->>'turnus' ELSE turnus END,
    type = CASE WHEN p_patch ? 'type' THEN p_patch->>'type' ELSE type END,
    faculty = CASE WHEN p_patch ? 'faculty' THEN p_patch->>'faculty' ELSE faculty END,
    field_of_study = CASE WHEN p_patch ? 'field_of_study' THEN p_patch->>'field_of_study' ELSE field_of_study END,
    bio = CASE WHEN p_patch ? 'bio' THEN p_patch->>'bio' ELSE bio END,
    budget = CASE WHEN p_patch ? 'budget' THEN (p_patch->>'budget')::int ELSE budget END,
    location_preference = CASE WHEN p_patch ? 'location_preference' THEN p_patch->>'location_preference' ELSE location_preference END,
    tags = CASE WHEN p_patch ? 'tags' THEN ARRAY(SELECT jsonb_array_elements_text(p_patch->'tags')) ELSE tags END,
    camp_spot = CASE WHEN p_patch ? 'camp_spot' THEN p_patch->>'camp_spot' ELSE camp_spot END,
    contacts = CASE WHEN p_patch ? 'contacts' THEN p_patch->'contacts' ELSE contacts END,
    email = CASE WHEN p_patch ? 'email' THEN p_patch->>'email' ELSE email END
  WHERE id = p_id AND manage_code = upper(trim(p_code));
  GET DIAGNOSTICS v_updated = ROW_COUNT;
  RETURN v_updated > 0;
END;
$$;

-- Smazat inzerat - funguje jen pri spravnem kodu
CREATE OR REPLACE FUNCTION public.delete_profile_by_code(p_id text, p_code text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deleted int;
BEGIN
  DELETE FROM public.profiles WHERE id = p_id AND manage_code = upper(trim(p_code));
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted > 0;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_profile_by_code(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_profiles_by_codes(text[]) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_profile_by_code(text, text, jsonb) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.delete_profile_by_code(text, text) TO anon, authenticated;
