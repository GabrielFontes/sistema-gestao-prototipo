-- 1. Remover constraint antiga primeiro
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_status_check;

-- 2. Agora podemos atualizar os dados sem violar constraints
UPDATE public.projects SET status = 'pending' WHERE status = 'active';

-- 3. Adicionar nova constraint com os valores corretos
ALTER TABLE public.projects 
ADD CONSTRAINT projects_status_check 
CHECK (status IN ('pending', 'in_progress', 'completed', 'archived'));

-- 4. Adicionar coluna 'category' na tabela projects
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS category TEXT
CHECK (category IS NULL OR category IN ('pre_venda', 'venda', 'entrega', 'suporte'));

-- 5. Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);

-- 6. Criar tabela 'processes'
CREATE TABLE IF NOT EXISTS public.processes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  category TEXT NOT NULL CHECK (category IN ('pre_venda', 'venda', 'entrega', 'suporte')),
  owner TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. Habilitar RLS para processes
ALTER TABLE public.processes ENABLE ROW LEVEL SECURITY;

-- 8. RLS policies para processes
CREATE POLICY "members_can_view_processes" ON public.processes
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.empresa_members em
    WHERE em.empresa_id = processes.empresa_id
    AND em.user_id = auth.uid()
  )
);

CREATE POLICY "managers_can_create_processes" ON public.processes
FOR INSERT
WITH CHECK (
  has_any_role(auth.uid(), empresa_id, ARRAY['owner', 'admin', 'gerente_operacao']::app_role[])
);

CREATE POLICY "managers_can_update_processes" ON public.processes
FOR UPDATE
USING (
  has_any_role(auth.uid(), empresa_id, ARRAY['owner', 'admin', 'gerente_operacao']::app_role[])
);

CREATE POLICY "managers_can_delete_processes" ON public.processes
FOR DELETE
USING (
  has_any_role(auth.uid(), empresa_id, ARRAY['owner', 'admin', 'gerente_operacao']::app_role[])
);

-- 9. Trigger para updated_at em processes
CREATE TRIGGER handle_processes_updated_at
  BEFORE UPDATE ON public.processes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 10. Trigger de auditoria para processes
CREATE TRIGGER audit_processes 
  AFTER INSERT OR UPDATE OR DELETE ON public.processes
  FOR EACH ROW 
  EXECUTE FUNCTION public.audit_trigger();