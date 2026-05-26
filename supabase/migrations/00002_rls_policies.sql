-- =============================================
-- Row Level Security Policies
-- =============================================
-- Enables RLS on all tables and defines access rules.
-- Run after 00001_initial_schema.sql.

-- =============================================
-- Enable RLS on all tables
-- =============================================

ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.optimizations   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_records   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions   ENABLE ROW LEVEL SECURITY;

-- =============================================
-- profiles
-- =============================================
-- Users can read and update only their own profile.
-- Insert is handled by the handle_new_user() trigger (SECURITY DEFINER),
-- so no INSERT policy for regular users is needed.

CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- =============================================
-- optimizations
-- =============================================
-- Users can insert, read, update, and delete their own optimizations.

CREATE POLICY "optimizations_select_own"
  ON public.optimizations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "optimizations_insert_own"
  ON public.optimizations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "optimizations_update_own"
  ON public.optimizations FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "optimizations_delete_own"
  ON public.optimizations FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- usage_records
-- =============================================
-- Users can read their own records.
-- Insert is handled server-side via the service role key (bypasses RLS).

CREATE POLICY "usage_records_select_own"
  ON public.usage_records FOR SELECT
  USING (auth.uid() = user_id);

-- No INSERT/UPDATE/DELETE policies for regular users.
-- The service role key bypasses RLS, allowing the server to
-- insert usage records on behalf of the user.

-- =============================================
-- subscriptions
-- =============================================
-- Users can read their own subscription.
-- Insert/update/delete is handled server-side via the service role key
-- (Stripe webhooks and checkout flows).

CREATE POLICY "subscriptions_select_own"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- No INSERT/UPDATE/DELETE policies for regular users.
-- The service role key bypasses RLS for Stripe webhook handlers
-- and checkout session creation.
