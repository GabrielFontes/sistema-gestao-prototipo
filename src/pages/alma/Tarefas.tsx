import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Pencil, Trash2, ListTodo, Calendar, User } from "lucide-react";
import { TaskDialog } from "@/components/TaskDialog";
import { TaskEditDialog } from "@/components/TaskEditDialog";
import { useTasks } from "@/hooks/useTasks";
import { useProjects } from "@/hooks/useProjects";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useUserRoles } from "@/hooks/useUserRoles";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface Task {
  id: string;
  name: string;
  description: string | null;
  status: string;
  assigned_to: string | null;
  due_date: string | null;
  milestone_id: string;
}

export default function Tarefas() {
  const { empresaId } = useParams();
  const { projects, isLoading: loadingProjects } = useProjects(empresaId || '');
  const { canManageProjetos } = useUserRoles(empresaId || null);
  
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Load all milestones from all projects
  useEffect(() => {
    if (projects.length > 0) {
      loadAllMilestones();
    }
  }, [projects]);

  // Load tasks when milestone is selected
  useEffect(() => {
    if (selectedMilestoneId) {
      loadTasks();
    } else {
      setTasks([]);
    }
  }, [selectedMilestoneId]);

  const loadAllMilestones = async () => {
    try {
      const projectIds = projects.map(p => p.id);
      const { data, error } = await supabase
        .from('milestones')
        .select('*, projects!inner(name)')
        .in('project_id', projectIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMilestones(data || []);
      
      // Auto-select first milestone
      if (data && data.length > 0 && !selectedMilestoneId) {
        setSelectedMilestoneId(data[0].id);
      }
    } catch (error: any) {
      console.error('Error loading milestones:', error);
      toast.error('Erro ao carregar milestones');
    }
  };

  const loadTasks = async () => {
    if (!selectedMilestoneId) return;

    setLoadingTasks(true);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('milestone_id', selectedMilestoneId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error: any) {
      console.error('Error loading tasks:', error);
      toast.error('Erro ao carregar tarefas');
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleStatusToggle = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', task.id);

      if (error) throw error;

      toast.success(newStatus === 'completed' ? 'Tarefa concluída!' : 'Tarefa reaberta');
      loadTasks();
    } catch (error: any) {
      console.error('Error updating task status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskToDelete.id);

      if (error) throw error;

      toast.success('Tarefa excluída!');
      loadTasks();
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    } catch (error: any) {
      console.error('Error deleting task:', error);
      toast.error('Erro ao excluir tarefa: ' + error.message);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      pending: { variant: "outline", label: "Pendente" },
      in_progress: { variant: "default", label: "Em Andamento" },
      completed: { variant: "secondary", label: "Concluída" },
    };
    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredTasks = tasks.filter(t => 
    filterStatus === 'all' || t.status === filterStatus
  );

  const selectedMilestone = milestones.find(m => m.id === selectedMilestoneId);

  if (loadingProjects) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Tarefas</h2>
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <ListTodo className="h-16 w-16 text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold">Nenhum projeto encontrado</h3>
              <p className="text-sm text-muted-foreground">
                Crie projetos e milestones para começar a gerenciar tarefas
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tarefas</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie as tarefas dos seus projetos
          </p>
        </div>
        <div className="flex gap-2">
          {canManageProjetos && selectedMilestoneId && (
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Tarefa
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[300px_1fr]">
        {/* Sidebar with milestones */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Milestones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {milestones.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">
                Nenhum milestone encontrado
              </p>
            ) : (
              milestones.map((milestone) => (
                <button
                  key={milestone.id}
                  onClick={() => setSelectedMilestoneId(milestone.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedMilestoneId === milestone.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="text-sm font-medium">{milestone.name}</div>
                  <div className="text-xs opacity-80 mt-1">
                    {milestone.projects?.name}
                  </div>
                </button>
              ))
            )}
          </CardContent>
        </Card>

        {/* Main content - tasks */}
        <div className="space-y-4">
          {selectedMilestoneId ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{selectedMilestone?.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {filteredTasks.length} {filteredTasks.length === 1 ? 'tarefa' : 'tarefas'}
                  </p>
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                    <SelectItem value="in_progress">Em Andamento</SelectItem>
                    <SelectItem value="completed">Concluídas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {loadingTasks ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredTasks.length === 0 ? (
                <Card className="p-12">
                  <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <ListTodo className="h-12 w-12 text-muted-foreground" />
                    <div>
                      <h3 className="font-semibold">Nenhuma tarefa encontrada</h3>
                      <p className="text-sm text-muted-foreground">
                        {filterStatus === 'all'
                          ? 'Crie sua primeira tarefa para este milestone'
                          : 'Não há tarefas com este status'}
                      </p>
                    </div>
                    {canManageProjetos && filterStatus === 'all' && (
                      <Button onClick={() => setCreateDialogOpen(true)} size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Criar Primeira Tarefa
                      </Button>
                    )}
                  </div>
                </Card>
              ) : (
                <div className="space-y-3">
                  {filteredTasks.map((task) => (
                    <Card key={task.id} className="p-4">
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={task.status === 'completed'}
                          onCheckedChange={() => handleStatusToggle(task)}
                          className="mt-1"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                                {task.name}
                              </h4>
                              {task.description && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {task.description}
                                </p>
                              )}
                            </div>
                            <div className="flex gap-1 ml-4">
                              {canManageProjetos && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditingTask(task)}
                                  >
                                    <Pencil className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setTaskToDelete(task);
                                      setDeleteDialogOpen(true);
                                    }}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            {getStatusBadge(task.status)}
                            {task.assigned_to && (
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {task.assigned_to}
                              </div>
                            )}
                            {task.due_date && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(task.due_date).toLocaleDateString('pt-BR')}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </>
          ) : (
            <Card className="p-12">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <ListTodo className="h-12 w-12 text-muted-foreground" />
                <div>
                  <h3 className="font-semibold">Selecione um milestone</h3>
                  <p className="text-sm text-muted-foreground">
                    Escolha um milestone na lista ao lado para ver suas tarefas
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      <TaskDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        milestoneId={selectedMilestoneId}
        onTaskCreated={loadTasks}
      />

      <TaskEditDialog
        open={editingTask !== null}
        onOpenChange={(open) => !open && setEditingTask(null)}
        task={editingTask}
        onTaskUpdated={loadTasks}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              A tarefa "{taskToDelete?.name}" será excluída permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTask} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
