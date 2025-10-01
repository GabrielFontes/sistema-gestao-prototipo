# Guia de Uso - Sistema Multi-Workspace com Supabase

## Estrutura do Banco de Dados

### Tabelas Principais

1. **workspaces** - Armazena informações dos workspaces (empresas)
2. **workspace_members** - Relaciona usuários com workspaces (muitos-para-muitos)
3. **projects** - Projetos dentro de um workspace
4. **milestones** - Marcos/etapas dentro de um projeto
5. **tasks** - Tarefas dentro de um milestone

### Hierarquia
```
workspace
  └── projects
       └── milestones
            └── tasks
```

## Hooks Disponíveis

### 1. useProjects(workspaceId)

Gerencia projetos de um workspace específico.

```typescript
import { useProjects } from '@/hooks/useProjects';

function MyComponent() {
  const { currentWorkspace } = useWorkspace();
  const { 
    projects, 
    isLoading, 
    createProject, 
    updateProject, 
    deleteProject 
  } = useProjects(currentWorkspace?.id || null);

  // Criar projeto
  const handleCreate = async () => {
    await createProject({
      name: 'Novo Projeto',
      description: 'Descrição do projeto'
    });
  };

  // Atualizar projeto
  const handleUpdate = async (projectId: string) => {
    await updateProject(projectId, {
      status: 'completed'
    });
  };

  // Deletar projeto
  const handleDelete = async (projectId: string) => {
    await deleteProject(projectId);
  };

  return (
    <div>
      {isLoading ? 'Carregando...' : projects.map(p => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  );
}
```

### 2. useMilestones(projectId)

Gerencia milestones de um projeto específico.

```typescript
import { useMilestones } from '@/hooks/useMilestones';

function ProjectView({ projectId }: { projectId: string }) {
  const { 
    milestones, 
    isLoading, 
    createMilestone, 
    updateMilestone, 
    deleteMilestone 
  } = useMilestones(projectId);

  // Criar milestone
  const handleCreate = async () => {
    await createMilestone({
      name: 'Fase 1',
      description: 'Primeira fase do projeto',
      due_date: '2025-12-31'
    });
  };

  // Atualizar milestone
  const handleUpdate = async (milestoneId: string) => {
    await updateMilestone(milestoneId, {
      status: 'in_progress'
    });
  };

  return (
    <div>
      {milestones.map(m => (
        <div key={m.id}>
          {m.name} - {m.status}
        </div>
      ))}
    </div>
  );
}
```

### 3. useTasks(milestoneId)

Gerencia tarefas de um milestone específico.

```typescript
import { useTasks } from '@/hooks/useTasks';

function MilestoneView({ milestoneId }: { milestoneId: string }) {
  const { 
    tasks, 
    isLoading, 
    createTask, 
    updateTask, 
    deleteTask 
  } = useTasks(milestoneId);

  // Criar tarefa
  const handleCreate = async () => {
    await createTask({
      name: 'Nova Tarefa',
      description: 'Descrição da tarefa',
      assigned_to: 'user-uuid',
      due_date: '2025-11-30'
    });
  };

  // Atualizar tarefa
  const handleUpdate = async (taskId: string) => {
    await updateTask(taskId, {
      status: 'completed'
    });
  };

  return (
    <div>
      {tasks.map(t => (
        <div key={t.id}>
          {t.name} - {t.status}
        </div>
      ))}
    </div>
  );
}
```

## Row-Level Security (RLS)

O sistema utiliza RLS para garantir que:
- Usuários só vejam workspaces aos quais pertencem
- Usuários só vejam projetos, milestones e tarefas de seus workspaces
- Apenas owners e admins podem deletar projetos
- Todos os membros podem criar e editar dentro de seus workspaces

### Função Auxiliar

```sql
-- Verifica se usuário é membro do workspace
public.is_workspace_member(workspace_id UUID, user_id UUID)
```

## Chamadas SQL Diretas (se necessário)

### Buscar workspaces do usuário
```typescript
const { data } = await supabase
  .from('workspace_members')
  .select('workspace_id, workspaces(*)')
  .eq('user_id', userId);
```

### Criar workspace (apenas admin/backend)
```typescript
const { data: workspace } = await supabase
  .from('workspaces')
  .insert({
    name: 'Nova Empresa',
    subtitle: 'Descrição',
    primary_color: '240 5.9% 10%'
  })
  .select()
  .single();

// Adicionar membro
await supabase
  .from('workspace_members')
  .insert({
    workspace_id: workspace.id,
    user_id: userId,
    role: 'owner'
  });
```

### Buscar projetos com contagem de milestones
```typescript
const { data } = await supabase
  .from('projects')
  .select('*, milestones(count)')
  .eq('workspace_id', workspaceId);
```

## Permissões

### Roles em workspace_members
- **owner**: Controle total do workspace
- **admin**: Pode gerenciar membros e deletar projetos
- **member**: Pode criar/editar projetos, milestones e tarefas

## Autenticação

O sistema **não permite** registro público. Usuários devem ser criados por um administrador via:

1. Dashboard do Supabase
2. Edge Function com Service Role
3. Script de administração

### Adicionar novo usuário (backend/admin)
```typescript
// Via Supabase Admin API ou Dashboard
// 1. Criar usuário em Authentication > Users
// 2. Adicionar ao workspace via workspace_members
```

## Próximos Passos

Para implementar a UI:

1. **Página de Projetos**: Use `useProjects` para listar/criar/editar projetos
2. **Página de Milestone**: Use `useMilestones` para gerenciar fases
3. **Página de Tarefas**: Use `useTasks` para gerenciar tarefas
4. **Admin Dashboard**: Para gerenciar workspaces e membros (requer service role)

## Exemplo Completo de Fluxo

```typescript
function WorkspaceProjectsPage() {
  const { currentWorkspace } = useWorkspace();
  const { projects, createProject } = useProjects(currentWorkspace?.id || null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const { milestones, createMilestone } = useMilestones(selectedProject);

  return (
    <div>
      <h1>{currentWorkspace?.name}</h1>
      
      {/* Lista de Projetos */}
      <div>
        {projects.map(project => (
          <button 
            key={project.id}
            onClick={() => setSelectedProject(project.id)}
          >
            {project.name}
          </button>
        ))}
      </div>

      {/* Milestones do projeto selecionado */}
      {selectedProject && (
        <div>
          {milestones.map(milestone => (
            <div key={milestone.id}>
              {milestone.name} - {milestone.status}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```
