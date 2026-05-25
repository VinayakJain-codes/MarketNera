-- Create the customer_profiles table
CREATE TABLE IF NOT EXISTS public.customer_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;

-- Allow anyone (specifically shopkeepers) to read customer profiles
CREATE POLICY "Anyone can read customer profiles"
  ON public.customer_profiles
  FOR SELECT
  USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.customer_profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Trigger to automatically create a profile when auth.users is created
CREATE OR REPLACE FUNCTION public.handle_new_customer_user()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.raw_user_meta_data->>'full_name' IS NOT NULL THEN
    INSERT INTO public.customer_profiles (id, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name')
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add trigger
DROP TRIGGER IF EXISTS on_auth_user_created_customer ON auth.users;
CREATE TRIGGER on_auth_user_created_customer
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_customer_user();

-- Backfill existing users (e.g. users who are already registered)
INSERT INTO public.customer_profiles (id, full_name)
SELECT id, raw_user_meta_data->>'full_name'
FROM auth.users
WHERE raw_user_meta_data->>'full_name' IS NOT NULL
ON CONFLICT (id) DO NOTHING;
