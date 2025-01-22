/*
  # Create profiles table and storage

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `avatar_url` (text)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `profiles` table
    - Add policies for authenticated users to manage their own profiles
    - Add policy for public read access to profiles
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users,
  avatar_url text,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create storage bucket for avatars if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'avatars'
  ) THEN
    INSERT INTO storage.buckets (id, name)
    VALUES ('avatars', 'avatars');
  END IF;
END $$;

-- Policies for profiles table
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policies for avatars storage
INSERT INTO storage.policies (name, definition, bucket_id)
VALUES
  ('Avatar images are publicly accessible',
   jsonb_build_object(
     'name', 'Avatar images are publicly accessible',
     'owner', null,
     'resource', 'object',
     'action', 'select',
     'operation', 'read',
     'condition', 'true'
   ),
   'avatars'
  ),
  ('Users can upload avatar images',
   jsonb_build_object(
     'name', 'Users can upload avatar images',
     'owner', null,
     'resource', 'object',
     'action', 'insert',
     'operation', 'create',
     'condition', 'true'
   ),
   'avatars'
  )
ON CONFLICT (name, bucket_id) DO NOTHING;

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();