-- Migration v0.3.1: Add agent_name column to user_preferences
-- Run this AFTER supabase-v0.3.sql

ALTER TABLE user_preferences
ADD COLUMN agent_name text DEFAULT 'Seraphina';
