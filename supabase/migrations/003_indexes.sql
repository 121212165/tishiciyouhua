-- =============================================
-- Performance Indexes
-- =============================================

-- optimizations: user history sorted by date
CREATE INDEX idx_optimizations_user_created
  ON public.optimizations (user_id, created_at DESC);

-- optimizations: fast share_token lookup (only when token exists)
CREATE INDEX idx_optimizations_share_token
  ON public.optimizations (share_token)
  WHERE share_token IS NOT NULL;

-- templates: public templates by category sorted by popularity
CREATE INDEX idx_templates_category_popularity
  ON public.templates (category, use_count DESC)
  WHERE is_public = true;

-- usage_records: user usage history
CREATE INDEX idx_usage_records_user_created
  ON public.usage_records (user_id, created_at DESC);

-- subscriptions: active subscriptions per user
CREATE INDEX idx_subscriptions_active_user
  ON public.subscriptions (user_id)
  WHERE status = 'active';
