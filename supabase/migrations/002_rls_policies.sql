-- =============================================
-- Row Level Security Policies
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.optimizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_records ENABLE ROW LEVEL SECURITY;

-- =============================================
-- profiles
-- =============================================

-- Users can read their own profile
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Insert is handled by the handle_new_user() trigger (SECURITY DEFINER)
-- No INSERT policy needed for users; the trigger bypasses RLS.

-- =============================================
-- optimizations
-- =============================================

-- Users can read their own optimizations
CREATE POLICY "optimizations_select_own"
  ON public.optimizations FOR SELECT
  USING (auth.uid() = user_id);

-- Anyone can read public optimizations (shared via share_token)
CREATE POLICY "optimizations_select_public"
  ON public.optimizations FOR SELECT
  USING (is_public = true);

-- Users can insert their own optimizations
CREATE POLICY "optimizations_insert_own"
  ON public.optimizations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own optimizations (e.g., rating)
CREATE POLICY "optimizations_update_own"
  ON public.optimizations FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own optimizations
CREATE POLICY "optimizations_delete_own"
  ON public.optimizations FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- templates
-- =============================================

-- Users can read their own templates
CREATE POLICY "templates_select_own"
  ON public.templates FOR SELECT
  USING (auth.uid() = user_id);

-- Anyone can read public templates
CREATE POLICY "templates_select_public"
  ON public.templates FOR SELECT
  USING (is_public = true);

-- Users can insert their own templates
CREATE POLICY "templates_insert_own"
  ON public.templates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own templates
CREATE POLICY "templates_update_own"
  ON public.templates FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own templates
CREATE POLICY "templates_delete_own"
  ON public.templates FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- subscriptions
-- =============================================

-- Users can read their own subscription
CREATE POLICY "subscriptions_select_own"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Insert/update/delete handled by server-side (service_role key)
-- No user-facing INSERT/UPDATE/DELETE policies.

-- =============================================
-- usage_records
-- =============================================

-- Users can read their own usage records
CREATE POLICY "usage_records_select_own"
  ON public.usage_records FOR SELECT
  USING (auth.uid() = user_id);

-- Insert handled by server-side (service_role key or SECURITY DEFINER function)
-- No user-facing INSERT policy.
