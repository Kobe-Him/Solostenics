
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATION ---
// 1. Go to https://supabase.com/ and create a new project.
// 2. Go to Project Settings > API.
// 3. Paste the URL and ANON KEY below.

const SUPABASE_URL = 'INSERT_YOUR_PROJECT_URL_HERE';
const SUPABASE_KEY = 'INSERT_YOUR_ANON_KEY_HERE';

// ---------------------

export const isSupabaseConfigured = SUPABASE_URL !== 'INSERT_YOUR_PROJECT_URL_HERE';

export const supabase = isSupabaseConfigured 
  ? createClient(SUPABASE_URL, SUPABASE_KEY) 
  : null;

/* 
  === DATABASE SCHEMA (SQL) ===
  Run this in your Supabase SQL Editor to set up the table:

  create table profiles (
    id uuid references auth.users not null primary key,
    updated_at timestamp with time zone,
    username text unique,
    game_data jsonb
  );

  alter table profiles enable row level security;

  create policy "Users can view own profile" on profiles
  for select using ( auth.uid() = id );

  create policy "Users can update own profile" on profiles
  for update using ( auth.uid() = id );

  create policy "Users can insert own profile" on profiles
  for insert with check ( auth.uid() = id );
*/
