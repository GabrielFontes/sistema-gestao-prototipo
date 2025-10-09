import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, FolderOpen, Target, LayoutGrid, List } from "lucide-react";
import { ProjectDialog } from "@/components/ProjectDialog";
import { ProjectEditDialog } from "@/components/ProjectEditDialog";
import { MilestoneDialog } from "@/components/MilestoneDialog";
import { useProjects } from "@/hooks/useProjects";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useUserRoles } from "@/hooks/useUserRoles";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { KanbanBoard, KanbanColumn } from "@/components/KanbanBoard";

interface Milestone {
  id: string;
  name: string;
  status: string;
  due_date: string | null;
  description: string | null;
}

const columns: KanbanColumn[] = [
  { id: 'pending', title: 'A Fazer', status: 'pending' },
  { id: 'in_progress', title: 'Em Andamento', status: 'in_progress' },
  { id: 'completed', title: 'Concluídos', status: 'completed' },
];

const categories = [
  { id: 'pre_venda', label: 'Pré-venda', icon: '📦' },
  { id: 'venda', label: 'Venda', icon: '🤝' },
  { id: 'entrega', label: 'Entrega', icon: '🚚' },
  { id: 'suporte', label: 'Suporte', icon: '🛟' },
];

export default function Projetos() {
  const { empresaId } = useParams();
  const { projects, isLoading, refreshProjects } = useProjects(empresaId || '');
  const { canManageProjetos } = useUserRoles(empresaId || null);
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [milestoneDialogOpen, setMilestoneDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedProjectMilestones, setSelectedProjectMilestones] = useState<Milestone[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');

  const loadMilestones = async (projectId: string) => {
    const { data, error } = await supabase
      .from('milestones')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setSelectedProjectMilestones(data);
    }
  };

  const handleViewMilestones = (project: any) => {
    setSelectedProjectId(project.id);
    loadMilestones(project.id);
    setMilestoneDialogOpen(true);
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectToDelete.id);

      if (error) throw error;

      toast.success('Projeto excluído com sucesso!');
      refreshProjects();
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast.error('Erro ao excluir projeto: ' + error.message);
    }
  };

  const handleStatusChange = async (projectId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('id', projectId);

      if (error) throw error;

      toast.success('Status atualizado!');
      refreshProjects();
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error('Erro ao atualizar status: ' + error.message);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      pending: { variant: "default", label: "A Fazer" },
      in_progress: { variant: "secondary", label: "Em Andamento" },
      completed: { variant: "outline", label: "Concluído" },
      archived: { variant: "destructive", label: "Arquivado" },
    };
    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredProjects = projects.filter(p => 
    filterStatus === 'all' || p.status === filterStatus
  );

  const renderProjectCard = (project: any) => (
    <Card
      key={project.id}
      className="p-3 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => setEditingProject(project)}
    >
      <div className="space-y-2">
        <h4 className="font-medium text-sm line-clamp-2">{project.name}</h4>
        {project.description && (
          <p className="text-xs text-muted-foreground line-clamp-1">{project.description}</p>
        )}
        {project.owner && (
          <p className="text-xs text-muted-foreground">👤 {project.owner}</p>
        )}
        {project.target_value && (
          <div className="flex justify-between text-xs">
            <span>{project.current_value || 0}{project.unit || '%'}</span>
            <span className="text-muted-foreground">/ {project.target_value}{project.unit || '%'}</span>
          </div>
        )}
      </div>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Projetos</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie os projetos da empresa
          </p>
        </div>
        <div className="flex gap-2">
          <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as any)}>
            <ToggleGroupItem value="kanban" aria-label="Kanban">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="Lista">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">A Fazer</SelectItem>
              <SelectItem value="in_progress">Em Andamento</SelectItem>
              <SelectItem value="completed">Concluídos</SelectItem>
              <SelectItem value="archived">Arquivados</SelectItem>
            </SelectContent>
          </Select>
          {canManageProjetos && (
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Projeto
            </Button>
          )}
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <FolderOpen className="h-16 w-16 text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold">Nenhum projeto encontrado</h3>
              <p className="text-sm text-muted-foreground">
                {filterStatus === 'all' 
                  ? 'Comece criando seu primeiro projeto'
                  : 'Não há projetos com este status'}
              </p>
            </div>
            {canManageProjetos && filterStatus === 'all' && (
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeiro Projeto
              </Button>
            )}
          </div>
        </Card>
      ) : viewMode === 'kanban' ? (
        <KanbanBoard
          columns={columns}
          categories={categories}
          items={filteredProjects}
          renderItem={renderProjectCard}
          onStatusChange={handleStatusChange}
          getCategoryLabel={(catId) => categories.find(c => c.id === catId)?.label || ''}
          getCategoryIcon={(catId) => categories.find(c => c.id === catId)?.icon || ''}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      {getStatusBadge(project.status)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  {project.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  )}
                  
                  {project.owner && (
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">Responsável:</span> {project.owner}
                    </div>
                  )}

                  {project.target_value && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Progresso</span>
                        <span className="font-medium">
                          {project.current_value || 0}{project.unit || '%'} / {project.target_value}{project.unit || '%'}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{
                            width: `${Math.min(
                              ((project.current_value || 0) / project.target_value) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleViewMilestones(project)}
                  >
                    <Target className="mr-1 h-3 w-3" />
                    Milestones
                  </Button>
                  {canManageProjetos && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingProject(project)}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setProjectToDelete(project);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ProjectDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onProjectCreated={refreshProjects}
      />

      <ProjectEditDialog
        open={editingProject !== null}
        onOpenChange={(open) => !open && setEditingProject(null)}
        project={editingProject}
        onProjectUpdated={refreshProjects}
      />

      <MilestoneDialog
        open={milestoneDialogOpen}
        onOpenChange={setMilestoneDialogOpen}
        projectId={selectedProjectId}
        milestones={selectedProjectMilestones}
        onMilestonesUpdated={() => selectedProjectId && loadMilestones(selectedProjectId)}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O projeto "{projectToDelete?.name}" e todos os seus milestones e tarefas serão excluídos permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
