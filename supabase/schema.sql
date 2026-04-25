-- ============================================================
-- UPLIFT — Supabase Schema
-- Run this in your Supabase SQL editor (in order)
-- ============================================================

-- 1. Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role        TEXT NOT NULL CHECK (role IN ('creator', 'earner')),
  full_name   TEXT NOT NULL,
  phone       TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 2. Campaigns
CREATE TABLE IF NOT EXISTS public.campaigns (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id          UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  youtube_url         TEXT NOT NULL,
  youtube_video_id    TEXT NOT NULL,
  title               TEXT NOT NULL,
  description         TEXT,
  target_views        INTEGER NOT NULL CHECK (target_views >= 100),
  current_views       INTEGER NOT NULL DEFAULT 0,
  budget_rwf          INTEGER NOT NULL,
  cost_per_view_rwf   INTEGER NOT NULL CHECK (cost_per_view_rwf >= 5),
  status              TEXT NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'active', 'completed', 'paused')),
  created_at          TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Creators can manage their own campaigns
CREATE POLICY "Creators can manage own campaigns"
  ON public.campaigns FOR ALL
  USING (auth.uid() = creator_id);

-- Earners can read active campaigns
CREATE POLICY "Earners can read active campaigns"
  ON public.campaigns FOR SELECT
  USING (status = 'active');

-- 3. Watch Sessions
CREATE TABLE IF NOT EXISTS public.watch_sessions (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  earner_id                 UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  campaign_id               UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  watch_duration_seconds    INTEGER DEFAULT 0,
  completed                 BOOLEAN DEFAULT false,
  earned_rwf                INTEGER DEFAULT 0,
  created_at                TIMESTAMPTZ DEFAULT now(),
  UNIQUE (earner_id, campaign_id)
);

ALTER TABLE public.watch_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Earners can manage own watch sessions"
  ON public.watch_sessions FOR ALL
  USING (auth.uid() = earner_id);

-- 4. Wallets
CREATE TABLE IF NOT EXISTS public.wallets (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  balance_rwf           INTEGER NOT NULL DEFAULT 0,
  total_earned_rwf      INTEGER NOT NULL DEFAULT 0,
  total_withdrawn_rwf   INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own wallet"
  ON public.wallets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wallet"
  ON public.wallets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 5. Transactions
CREATE TABLE IF NOT EXISTS public.transactions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('earn', 'deposit', 'withdrawal')),
  amount_rwf  INTEGER NOT NULL CHECK (amount_rwf > 0),
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- Helper Functions (called from client via supabase.rpc)
-- ============================================================

-- Atomically increment wallet balance
CREATE OR REPLACE FUNCTION public.increment_wallet(p_user_id UUID, p_amount INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.wallets
  SET
    balance_rwf       = balance_rwf + p_amount,
    total_earned_rwf  = total_earned_rwf + p_amount
  WHERE user_id = p_user_id;
END;
$$;

-- Atomically increment campaign view count
CREATE OR REPLACE FUNCTION public.increment_campaign_views(p_campaign_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.campaigns
  SET current_views = current_views + 1
  WHERE id = p_campaign_id;

  -- Auto-complete campaign if target reached
  UPDATE public.campaigns
  SET status = 'completed'
  WHERE id = p_campaign_id
    AND current_views >= target_views
    AND status = 'active';
END;
$$;
