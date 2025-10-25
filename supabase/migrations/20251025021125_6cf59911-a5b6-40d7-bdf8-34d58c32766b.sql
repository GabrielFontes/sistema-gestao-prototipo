-- Add category field to tasks for displaying badge type
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'projeto';