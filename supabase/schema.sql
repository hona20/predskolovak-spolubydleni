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
