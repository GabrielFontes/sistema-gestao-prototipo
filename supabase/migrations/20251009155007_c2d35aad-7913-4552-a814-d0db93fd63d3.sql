-- Adicionar campo unit à tabela projects
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS unit TEXT DEFAULT '%';