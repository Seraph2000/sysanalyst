-- Seraphina v0.2: Database Setup
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- 1. Create analyses table
create table analyses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  mode text not null,
  raw_markdown text not null,
  created_at timestamptz default now() not null
);

-- 2. Create directory_analyses table
create table directory_analyses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  tree jsonb not null,
  raw_markdown text not null,
  created_at timestamptz default now() not null
);

-- 3. Enable Row Level Security
alter table analyses enable row level security;
alter table directory_analyses enable row level security;

-- 4. Create RLS policies (users can only access their own data)
create policy "Users can read own analyses"
  on analyses for select
  using (auth.uid() = user_id);

create policy "Users can insert own analyses"
  on analyses for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own analyses"
  on analyses for delete
  using (auth.uid() = user_id);

create policy "Users can read own directory analyses"
  on directory_analyses for select
  using (auth.uid() = user_id);

create policy "Users can insert own directory analyses"
  on directory_analyses for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own directory analyses"
  on directory_analyses for delete
  using (auth.uid() = user_id);
