-- =====================================================
-- FASE 1: SISTEMA DE ROLES E PERMISSÕES
-- =====================================================

-- 1. Criar enum de roles
CREATE TYPE public.app_role AS ENUM (
  'owner',
  'admin', 
  'gerente_financeiro',
  'gerente_operacao',
  'gerente_projetos',
  'membro'
);

-- 2. Criar tabela user_roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (user_id, empresa_id, role)
);

-- Index para performance
CREATE INDEX idx_user_roles_user_empresa ON public.user_roles(user_id, empresa_id);
CREATE INDEX idx_user_roles_empresa ON public.user_roles(empresa_id);

-- 3. Habilitar RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Criar funções security definer para checar roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _empresa_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND empresa_id = _empresa_id
      AND role = _role
  );
$$;

-- 5. Função para checar múltiplos roles
CREATE OR REPLACE FUNCTION public.has_any_role(_user_id UUID, _empresa_id UUID, _roles public.app_role[])
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND empresa_id = _empresa_id
      AND role = ANY(_roles)
  );
$$;

-- 6. RLS policies para user_roles
CREATE POLICY "users_can_view_their_roles" 
ON public.user_roles
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "owners_admins_can_manage_roles" 
ON public.user_roles
FOR ALL
USING (
  public.has_any_role(auth.uid(), empresa_id, ARRAY['owner', 'admin']::public.app_role[])
);

-- 7. Criar role owner automaticamente ao criar empresa_member
CREATE OR REPLACE FUNCTION public.handle_new_empresa_member_role()
RETURNS TRIGGER AS $$
BEGIN
  -- Se é o primeiro membro, torna owner
  IF NOT EXISTS (
    SELECT 1 FROM public.empresa_members 
    WHERE empresa_id = NEW.empresa_id 
    AND id != NEW.id
  ) THEN
    INSERT INTO public.user_roles (user_id, empresa_id, role)
    VALUES (NEW.user_id, NEW.empresa_id, 'owner')
    ON CONFLICT (user_id, empresa_id, role) DO NOTHING;
  ELSE
    -- Membros subsequentes entram como 'membro'
    INSERT INTO public.user_roles (user_id, empresa_id, role)
    VALUES (NEW.user_id, NEW.empresa_id, 'membro')
    ON CONFLICT (user_id, empresa_id, role) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_empresa_member_created
  AFTER INSERT ON public.empresa_members
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_empresa_member_role();

-- 8. Trigger para updated_at em user_roles
CREATE TRIGGER update_user_roles_updated_at
  BEFORE UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- FASE 2: STORAGE PARA LOGOS
-- =====================================================

-- Criar bucket para logos de empresas
INSERT INTO storage.buckets (id, name, public)
VALUES ('empresa-logos', 'empresa-logos', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies para storage de logos
CREATE POLICY "Anyone can view empresa logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'empresa-logos');

CREATE POLICY "Authenticated users can upload logos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'empresa-logos'
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Owners and admins can update logos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'empresa-logos'
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Owners and admins can delete logos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'empresa-logos'
  AND auth.uid() IS NOT NULL
);

-- =====================================================
-- FASE 3: NOTIFICAÇÕES
-- =====================================================

-- Criar tabela de notificações
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  link TEXT,
  read BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes para performance
CREATE INDEX idx_notifications_user ON public.notifications(user_id, read, created_at DESC);
CREATE INDEX idx_notifications_empresa ON public.notifications(empresa_id);

-- Habilitar RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "users_can_view_own_notifications"
ON public.notifications FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "users_can_update_own_notifications"
ON public.notifications FOR UPDATE
USING (user_id = auth.uid());

-- =====================================================
-- FASE 4: AUDIT LOGS
-- =====================================================

-- Criar tabela de auditoria
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE,
  table_name TEXT NOT NULL,
  record_id UUID,
  action TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes para performance
CREATE INDEX idx_audit_logs_empresa ON public.audit_logs(empresa_id, created_at DESC);
CREATE INDEX idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_table ON public.audit_logs(table_name);

-- Habilitar RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies (apenas owners podem ver logs)
CREATE POLICY "owners_can_view_audit_logs"
ON public.audit_logs FOR SELECT
USING (
  public.has_role(auth.uid(), empresa_id, 'owner')
);

-- Função genérica de auditoria
CREATE OR REPLACE FUNCTION public.audit_trigger()
RETURNS TRIGGER AS $$
DECLARE
  empresa_id_val UUID;
BEGIN
  -- Tentar extrair empresa_id do registro
  IF TG_OP = 'DELETE' THEN
    empresa_id_val := OLD.empresa_id;
  ELSE
    empresa_id_val := NEW.empresa_id;
  END IF;
  
  INSERT INTO public.audit_logs (
    user_id,
    empresa_id,
    table_name,
    record_id,
    action,
    old_data,
    new_data
  ) VALUES (
    auth.uid(),
    empresa_id_val,
    TG_TABLE_NAME,
    CASE 
      WHEN TG_OP = 'DELETE' THEN OLD.id
      ELSE NEW.id
    END,
    TG_OP,
    CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Aplicar audit triggers em tabelas críticas
CREATE TRIGGER audit_empresas
  AFTER INSERT OR UPDATE OR DELETE ON public.empresas
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();

CREATE TRIGGER audit_projects
  AFTER INSERT OR UPDATE OR DELETE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();

CREATE TRIGGER audit_tasks
  AFTER INSERT OR UPDATE OR DELETE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();

CREATE TRIGGER audit_objectives
  AFTER INSERT OR UPDATE OR DELETE ON public.objectives
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();

CREATE TRIGGER audit_key_results
  AFTER INSERT OR UPDATE OR DELETE ON public.key_results
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();

-- =====================================================
-- FASE 5: TRIGGERS DE NOTIFICAÇÃO
-- =====================================================

-- Notificar quando tarefa é atribuída
CREATE OR REPLACE FUNCTION public.notify_task_assigned()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.assigned_to IS NOT NULL AND 
     (TG_OP = 'INSERT' OR OLD.assigned_to IS NULL OR NEW.assigned_to != OLD.assigned_to) THEN
    INSERT INTO public.notifications (user_id, empresa_id, title, message, type, link)
    SELECT 
      NEW.assigned_to,
      p.empresa_id,
      'Nova tarefa atribuída',
      'Você foi atribuído à tarefa: ' || NEW.name,
      'task',
      '/empresa/' || p.empresa_id || '/alma/tarefas'
    FROM public.milestones m
    JOIN public.projects p ON p.id = m.project_id
    WHERE m.id = NEW.milestone_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_task_assigned
  AFTER INSERT OR UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_task_assigned();

-- Notificar quando projeto é criado
CREATE OR REPLACE FUNCTION public.notify_project_created()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.owner_id IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, empresa_id, title, message, type, link)
    VALUES (
      NEW.owner_id,
      NEW.empresa_id,
      'Novo projeto criado',
      'Projeto "' || NEW.name || '" foi criado com sucesso',
      'project',
      '/empresa/' || NEW.empresa_id || '/alma/projetos'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_project_created
  AFTER INSERT ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_project_created();

-- =====================================================
-- FASE 6: ATUALIZAR RLS POLICIES EXISTENTES
-- =====================================================

-- Atualizar policies de projects para usar sistema de roles
DROP POLICY IF EXISTS "members_can_view_projects" ON public.projects;
CREATE POLICY "members_can_view_projects"
ON public.projects FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.empresa_members em
    WHERE em.empresa_id = projects.empresa_id
    AND em.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "members_can_create_projects" ON public.projects;
CREATE POLICY "members_can_create_projects"
ON public.projects FOR INSERT
WITH CHECK (
  public.has_any_role(auth.uid(), empresa_id, ARRAY['owner', 'admin', 'gerente_operacao', 'gerente_projetos']::public.app_role[])
);

DROP POLICY IF EXISTS "members_can_update_projects" ON public.projects;
CREATE POLICY "members_can_update_projects"
ON public.projects FOR UPDATE
USING (
  public.has_any_role(auth.uid(), empresa_id, ARRAY['owner', 'admin', 'gerente_operacao', 'gerente_projetos']::public.app_role[])
);

DROP POLICY IF EXISTS "members_can_delete_projects" ON public.projects;
CREATE POLICY "members_can_delete_projects"
ON public.projects FOR DELETE
USING (
  public.has_any_role(auth.uid(), empresa_id, ARRAY['owner', 'admin']::public.app_role[])
);

-- Atualizar policies de objectives para usar sistema de roles
DROP POLICY IF EXISTS "members_can_view_objectives" ON public.objectives;
CREATE POLICY "members_can_view_objectives"
ON public.objectives FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.empresa_members em
    WHERE em.empresa_id = objectives.empresa_id
    AND em.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "managers_can_create_objectives" ON public.objectives;
CREATE POLICY "managers_can_create_objectives"
ON public.objectives FOR INSERT
WITH CHECK (
  public.has_any_role(auth.uid(), empresa_id, ARRAY['owner', 'admin', 'gerente_operacao', 'gerente_projetos']::public.app_role[])
);

DROP POLICY IF EXISTS "managers_can_update_objectives" ON public.objectives;
CREATE POLICY "managers_can_update_objectives"
ON public.objectives FOR UPDATE
USING (
  public.has_any_role(auth.uid(), empresa_id, ARRAY['owner', 'admin', 'gerente_operacao', 'gerente_projetos']::public.app_role[])
);

DROP POLICY IF EXISTS "owners_can_delete_objectives" ON public.objectives;
CREATE POLICY "owners_can_delete_objectives"
ON public.objectives FOR DELETE
USING (
  public.has_any_role(auth.uid(), empresa_id, ARRAY['owner', 'admin']::public.app_role[])
);

-- Atualizar policies de key_results
DROP POLICY IF EXISTS "members_can_view_key_results" ON public.key_results;
CREATE POLICY "members_can_view_key_results"
ON public.key_results FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.objectives o
    JOIN public.empresa_members em ON em.empresa_id = o.empresa_id
    WHERE o.id = key_results.objective_id
    AND em.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "managers_can_create_key_results" ON public.key_results;
CREATE POLICY "managers_can_create_key_results"
ON public.key_results FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.objectives o
    WHERE o.id = key_results.objective_id
    AND public.has_any_role(auth.uid(), o.empresa_id, ARRAY['owner', 'admin', 'gerente_operacao', 'gerente_projetos']::public.app_role[])
  )
);

DROP POLICY IF EXISTS "managers_can_update_key_results" ON public.key_results;
CREATE POLICY "managers_can_update_key_results"
ON public.key_results FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.objectives o
    WHERE o.id = key_results.objective_id
    AND public.has_any_role(auth.uid(), o.empresa_id, ARRAY['owner', 'admin', 'gerente_operacao', 'gerente_projetos']::public.app_role[])
  )
);

DROP POLICY IF EXISTS "owners_can_delete_key_results" ON public.key_results;
CREATE POLICY "owners_can_delete_key_results"
ON public.key_results FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.objectives o
    WHERE o.id = key_results.objective_id
    AND public.has_any_role(auth.uid(), o.empresa_id, ARRAY['owner', 'admin']::public.app_role[])
  )
);