-- =============================================
-- tishiciyouhua: Initial Schema Migration
-- =============================================
-- Creates all core tables for the AI prompt optimization SaaS.
-- Tables: profiles, optimizations, usage_records, subscriptions
-- Run order: this migration (00001) -> RLS (00002) -> profile trigger (00003)

-- =============================================
-- profiles
-- =============================================
-- Extends auth.users with a 1:1 mapping.
-- The profile row is auto-created via a trigger on auth.users insert
-- (see migration 00003).

CREATE TABLE public.profiles (
  id           UUID      PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email        TEXT,
  display_name TEXT,
  plan         TEXT      NOT NULL DEFAULT 'free'
                         CHECK (plan IN ('free', 'pro', 'enterprise')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.profiles IS 'User profile, one-to-one with auth.users. Auto-created on signup.';
COMMENT ON COLUMN public.profiles.plan IS 'Subscription tier: free, pro, or enterprise.';

-- =============================================
-- optimizations
-- =============================================
-- Stores each prompt optimization request and its result.

CREATE TABLE public.optimizations (
  id               UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID    NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  original_prompt  TEXT    NOT NULL,
  optimized_prompt TEXT    NOT NULL,
  model            TEXT    NOT NULL,
  style            TEXT    NOT NULL,
  tokens_input     INTEGER NOT NULL DEFAULT 0,
  tokens_output    INTEGER NOT NULL DEFAULT 0,
  latency_ms       INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.optimizations IS 'Prompt optimization history with token and latency tracking.';
COMMENT ON COLUMN public.optimizations.model   IS 'AI model used (e.g. claude-3-5-sonnet, gpt-4o).';
COMMENT ON COLUMN public.optimizations.style   IS 'Optimization style (e.g. concise, detailed, creative).';

-- =============================================
-- usage_records
-- =============================================
-- Tracks token usage and cost for each action.

CREATE TABLE public.usage_records (
  id              UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID    NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  optimization_id UUID    REFERENCES public.optimizations(id) ON DELETE SET NULL,
  action          TEXT    NOT NULL,
  tokens_used     INTEGER NOT NULL DEFAULT 0,
  cost_cents      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.usage_records IS 'Token usage and cost tracking per user action.';
COMMENT ON COLUMN public.usage_records.action IS 'Action type, e.g. optimize.';

-- =============================================
-- subscriptions
-- =============================================
-- One row per user, managed by Stripe webhook + service role.

CREATE TABLE public.subscriptions (
  id                     UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                UUID    NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_customer_id     TEXT,
  stripe_subscription_id TEXT,
  plan                   TEXT    NOT NULL DEFAULT 'free',
  status                 TEXT    NOT NULL DEFAULT 'active',
  current_period_end     TIMESTAMPTZ,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.subscriptions IS 'Stripe subscription state, one per user.';

-- =============================================
-- Trigger: auto-update updated_at on row change
-- =============================================
-- Applies to tables that have an updated_at column.

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_optimizations_updated_at
  BEFORE UPDATE ON public.optimizations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- =============================================
-- Indexes
-- =============================================

-- optimizations: user history sorted by date
CREATE INDEX idx_optimizations_user_created
  ON public.optimizations (user_id, created_at DESC);

-- usage_records: user usage history sorted by date
CREATE INDEX idx_usage_records_user_created
  ON public.usage_records (user_id, created_at DESC);

-- subscriptions: fast lookup by Stripe customer ID
CREATE INDEX idx_subscriptions_stripe_customer
  ON public.subscriptions (stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;

-- subscriptions: fast lookup by Stripe subscription ID
CREATE INDEX idx_subscriptions_stripe_subscription
  ON public.subscriptions (stripe_subscription_id)
  WHERE stripe_subscription_id IS NOT NULL;
