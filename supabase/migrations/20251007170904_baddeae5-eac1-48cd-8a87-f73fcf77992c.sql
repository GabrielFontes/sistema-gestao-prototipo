-- Adicionar campo de unidade aos key_results
ALTER TABLE public.key_results 
ADD COLUMN unit TEXT DEFAULT '%';

-- Adicionar campo de unidade aos projetos
ALTER TABLE public.projects 
ADD COLUMN unit TEXT DEFAULT '%';