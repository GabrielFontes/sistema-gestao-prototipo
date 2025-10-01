-- Criar tabela de empresas
CREATE TABLE public.empresas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subtitle TEXT,
  logo TEXT,
  primary_color TEXT NOT NULL DEFAULT '240 5.9% 10%',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Criar tabela de membros de empresa (usuário pode estar em múltiplos empresas)
CREATE TABLE public.empresa_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(empresa_id, user_id)
);

-- Criar tabela de projetos
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Criar tabela de milestones
CREATE TABLE public.milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Criar tabela de tarefas
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_id UUID NOT NULL REFERENCES public.milestones(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.empresa_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Função auxiliar para verificar se usuário é membro de um empresa
CREATE OR REPLACE FUNCTION public.is_empresa_member(empresa_id UUID, user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.empresa_members
    WHERE empresa_members.empresa_id = $1
    AND empresa_members.user_id = $2
  );
$$;

-- RLS Policies para empresas
CREATE POLICY "Users can view empresas they are members of"
  ON public.empresas FOR SELECT
  USING (public.is_empresa_member(id, auth.uid()));

CREATE POLICY "Empresa owners and admins can update empresa"
  ON public.empresas FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.empresa_members
      WHERE empresa_members.empresa_id = empresas.id
      AND empresa_members.user_id = auth.uid()
      AND empresa_members.role IN ('owner', 'admin')
    )
  );

-- RLS Policies para empresa_members
CREATE POLICY "Users can view members of their empresas"
  ON public.empresa_members FOR SELECT
  USING (public.is_empresa_member(empresa_id, auth.uid()));

CREATE POLICY "Empresa owners and admins can manage members"
  ON public.empresa_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.empresa_members wm
      WHERE wm.empresa_id = empresa_members.empresa_id
      AND wm.user_id = auth.uid()
      AND wm.role IN ('owner', 'admin')
    )
  );

-- RLS Policies para projects
CREATE POLICY "Users can view projects in their empresas"
  ON public.projects FOR SELECT
  USING (public.is_empresa_member(empresa_id, auth.uid()));

CREATE POLICY "Empresa members can create projects"
  ON public.projects FOR INSERT
  WITH CHECK (public.is_empresa_member(empresa_id, auth.uid()));

CREATE POLICY "Empresa members can update projects"
  ON public.projects FOR UPDATE
  USING (public.is_empresa_member(empresa_id, auth.uid()));

CREATE POLICY "Empresa owners and admins can delete projects"
  ON public.projects FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.empresa_members
      WHERE empresa_members.empresa_id = projects.empresa_id
      AND empresa_members.user_id = auth.uid()
      AND empresa_members.role IN ('owner', 'admin')
    )
  );

-- RLS Policies para milestones
CREATE POLICY "Users can view milestones in their empresa projects"
  ON public.milestones FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = milestones.project_id
      AND public.is_empresa_member(projects.empresa_id, auth.uid())
    )
  );

CREATE POLICY "Empresa members can manage milestones"
  ON public.milestones FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = milestones.project_id
      AND public.is_empresa_member(projects.empresa_id, auth.uid())
    )
  );

-- RLS Policies para tasks
CREATE POLICY "Users can view tasks in their empresa milestones"
  ON public.tasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.milestones
      JOIN public.projects ON projects.id = milestones.project_id
      WHERE milestones.id = tasks.milestone_id
      AND public.is_empresa_member(projects.empresa_id, auth.uid())
    )
  );

CREATE POLICY "Empresa members can manage tasks"
  ON public.tasks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.milestones
      JOIN public.projects ON projects.id = milestones.project_id
      WHERE milestones.id = tasks.milestone_id
      AND public.is_empresa_member(projects.empresa_id, auth.uid())
    )
  );

-- Triggers para atualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_empresas_updated_at
  BEFORE UPDATE ON public.empresas
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_milestones_updated_at
  BEFORE UPDATE ON public.milestones
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();