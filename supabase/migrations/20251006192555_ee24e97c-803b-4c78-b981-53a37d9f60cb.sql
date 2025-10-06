-- Create objectives table for OKR management
CREATE TABLE public.objectives (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  quarter INTEGER NOT NULL CHECK (quarter >= 1 AND quarter <= 4),
  year INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create key_results table
CREATE TABLE public.key_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  objective_id UUID NOT NULL REFERENCES public.objectives(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  target_value NUMERIC,
  current_value NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on objectives
ALTER TABLE public.objectives ENABLE ROW LEVEL SECURITY;

-- RLS policies for objectives
CREATE POLICY "users_can_view_objectives"
ON public.objectives
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM empresa_members
    WHERE empresa_members.empresa_id = objectives.empresa_id
      AND empresa_members.user_id = auth.uid()
  )
);

CREATE POLICY "members_can_create_objectives"
ON public.objectives
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM empresa_members
    WHERE empresa_members.empresa_id = objectives.empresa_id
      AND empresa_members.user_id = auth.uid()
  )
);

CREATE POLICY "members_can_update_objectives"
ON public.objectives
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM empresa_members
    WHERE empresa_members.empresa_id = objectives.empresa_id
      AND empresa_members.user_id = auth.uid()
  )
);

CREATE POLICY "owners_and_admins_can_delete_objectives"
ON public.objectives
FOR DELETE
USING (is_owner_or_admin(auth.uid(), empresa_id));

-- Enable RLS on key_results
ALTER TABLE public.key_results ENABLE ROW LEVEL SECURITY;

-- RLS policies for key_results
CREATE POLICY "users_can_view_key_results"
ON public.key_results
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM objectives
    JOIN empresa_members ON empresa_members.empresa_id = objectives.empresa_id
    WHERE objectives.id = key_results.objective_id
      AND empresa_members.user_id = auth.uid()
  )
);

CREATE POLICY "members_can_manage_key_results"
ON public.key_results
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM objectives
    JOIN empresa_members ON empresa_members.empresa_id = objectives.empresa_id
    WHERE objectives.id = key_results.objective_id
      AND empresa_members.user_id = auth.uid()
  )
);

-- Add triggers for updated_at
CREATE TRIGGER update_objectives_updated_at
BEFORE UPDATE ON public.objectives
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_key_results_updated_at
BEFORE UPDATE ON public.key_results
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();