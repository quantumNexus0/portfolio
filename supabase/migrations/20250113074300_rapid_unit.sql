/*
  # Create blog posts table

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `video_url` (text, optional)
      - `created_at` (timestamp)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on `blog_posts` table
    - Add policies for:
      - Authenticated users can create posts
      - Anyone can read posts
*/

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  video_url text,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read posts
CREATE POLICY "Anyone can read blog posts"
  ON blog_posts
  FOR SELECT
  USING (true);

-- Allow authenticated users to create posts
CREATE POLICY "Authenticated users can create blog posts"
  ON blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own posts
CREATE POLICY "Users can update their own posts"
  ON blog_posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own posts
CREATE POLICY "Users can delete their own posts"
  ON blog_posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);