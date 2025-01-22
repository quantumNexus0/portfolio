/*
  # Add Projects and About Sections Tables

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `link` (text)
      - `image` (text)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamptz)
    
    - `about_sections`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `icon` (text)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
    - Add policies for authenticated user CRUD operations
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  link text NOT NULL,
  image text NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "Anyone can read projects"
  ON projects
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON projects
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create about_sections table
CREATE TABLE IF NOT EXISTS about_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE about_sections ENABLE ROW LEVEL SECURITY;

-- About sections policies
CREATE POLICY "Anyone can read about sections"
  ON about_sections
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create about sections"
  ON about_sections
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own about sections"
  ON about_sections
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own about sections"
  ON about_sections
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);