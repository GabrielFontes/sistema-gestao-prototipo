-- Rename quarter to trimestre in objectives table
ALTER TABLE public.objectives RENAME COLUMN quarter TO trimestre;

-- Add owner, target_value, current_value to projects (status already exists)
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS owner TEXT,
ADD COLUMN IF NOT EXISTS target_value NUMERIC,
ADD COLUMN IF NOT EXISTS current_value NUMERIC DEFAULT 0;

-- Change key_results to support multiple projects
ALTER TABLE public.key_results 
DROP COLUMN IF EXISTS project_id,
ADD COLUMN IF NOT EXISTS project_ids UUID[];

-- Create index for better performance on project_ids array
CREATE INDEX IF NOT EXISTS idx_key_results_project_ids ON public.key_results USING GIN(project_ids);