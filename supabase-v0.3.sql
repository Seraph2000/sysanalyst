-- Seraphina v0.3: User Preferences
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- 1. Create user_preferences table
create table user_preferences (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null unique,
  tone text default 'gentle' not null,
  depth text default 'intermediate' not null,
  risk_tolerance text default 'balanced' not null,
  architecture_style text default 'modular' not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 2. Enable Row Level Security
alter table user_preferences enable row level security;

-- 3. Create RLS policies
create policy "Users can read own preferences"
  on user_preferences for select
  using (auth.uid() = user_id);

create policy "Users can insert own preferences"
  on user_preferences for insert
  with check (auth.uid() = user_id);

create policy "Users can update own preferences"
  on user_preferences for update
  using (auth.uid() = user_id);
