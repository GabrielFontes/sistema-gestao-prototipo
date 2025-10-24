-- Create routines table
CREATE TABLE IF NOT EXISTS public.routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'archived')),
  category TEXT CHECK (category IS NULL OR category IN ('pre_venda', 'venda', 'entrega', 'suporte')),
  setor TEXT,
  owner TEXT,
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;

-- RLS Policies for routines
CREATE POLICY "members_can_view_routines"
ON public.routines
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.empresa_members em
    WHERE em.empresa_id = routines.empresa_id
      AND em.user_id = auth.uid()
  )
);

CREATE POLICY "managers_can_create_routines"
ON public.routines
FOR INSERT
TO authenticated
WITH CHECK (
  has_any_role(auth.uid(), empresa_id, ARRAY['owner'::app_role, 'admin'::app_role, 'gerente_operacao'::app_role, 'gerente_projetos'::app_role])
);

CREATE POLICY "managers_can_update_routines"
ON public.routines
FOR UPDATE
TO authenticated
USING (
  has_any_role(auth.uid(), empresa_id, ARRAY['owner'::app_role, 'admin'::app_role, 'gerente_operacao'::app_role, 'gerente_projetos'::app_role])
);

CREATE POLICY "managers_can_delete_routines"
ON public.routines
FOR DELETE
TO authenticated
USING (
  has_any_role(auth.uid(), empresa_id, ARRAY['owner'::app_role, 'admin'::app_role, 'gerente_operacao'::app_role])
);

-- Add setor column to projects and processes
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS setor TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS due_date TIMESTAMPTZ;

ALTER TABLE public.processes ADD COLUMN IF NOT EXISTS setor TEXT;
ALTER TABLE public.processes ADD COLUMN IF NOT EXISTS due_date TIMESTAMPTZ;

-- Trigger for updated_at
CREATE TRIGGER update_routines_updated_at
BEFORE UPDATE ON public.routines
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();