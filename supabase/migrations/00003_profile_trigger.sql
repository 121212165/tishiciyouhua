-- =============================================
-- Profile Auto-Creation Trigger
-- =============================================
-- Automatically inserts a row into public.profiles whenever a new
-- user signs up via Supabase Auth. The trigger function runs as
-- SECURITY DEFINER so it bypasses RLS.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'display_name'
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

COMMENT ON FUNCTION public.handle_new_user()
  IS 'Creates a profile row when a new auth.users row is inserted. Runs as SECURITY DEFINER to bypass RLS.';
