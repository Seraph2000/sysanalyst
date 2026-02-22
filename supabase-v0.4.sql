-- Seraphina v0.4 Migration — Google Drive token storage
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS google_drive_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE google_drive_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own drive tokens"
  ON google_drive_tokens FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
