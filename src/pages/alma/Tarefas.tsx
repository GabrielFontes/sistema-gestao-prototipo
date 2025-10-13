import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Plus, MessageSquare } from "lucide-react";

const ItemTypes = {
  TASK: 'TASK',
};

const DraggableTask = ({ task, moveTask, setSelectedTask }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const tagStyles = {
    'Ouro': 'bg-yellow-300 text-white',
    'Prata': 'bg-gray-300 text-white',
    'Bronze': 'bg-orange-200 text-white',
  };

  return (
    <Card
      ref={drag}
      className={`p-3 cursor-grab transition-all duration-150 hover:shadow-sm bg-white ${
        isDragging ? 'opacity-60 scale-102 rotate-1 shadow-md' : 'opacity-100'
      }`}
      onClick={() => setSelectedTask(task)}
    >
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          {task.comments.length > 0 && (
            <MessageSquare className="h-3.5 w-3.5 text-gray-400" />
          )}
          <Badge className={`${tagStyles[task.tag]} text-xs`}>{task.tag}</Badge>
          <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1">{task.description}</p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <User className="h-3.5 w-3.5" />
          <span>{task.responsible}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          Prazo: {task.deadline}
        </div>
      </div>
    </Card>
  );
};

const DroppableColumn = ({ column, tasks, moveTask, setSelectedTask }) => {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.TASK,
    drop: (item: { id: string }) => moveTask(item.id, column.status),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const tagOrder = ['Ouro', 'Prata', 'Bronze'];

  const sortedTasks = [...tasks].sort((a, b) => {
    return tagOrder.indexOf(a.tag) - tagOrder.indexOf(b.tag);
  });

  return (
<Card ref={drop} className={`h-fit bg-white transition-colors duration-150 ${isOver ? 'bg-gray-50' : ''}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <span>{column.title}</span>
          <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
            {tasks.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {sortedTasks.map(task => (
          <DraggableTask
            key={task.id}
            task={task}
            moveTask={moveTask}
            setSelectedTask={setSelectedTask}
          />
        ))}
      </CardContent>
    </Card>
  );
};

const TaskEditDialog = ({ task, open, onOpenChange, onTaskUpdated }) => {
  const [editedTitle, setEditedTitle] = useState(task?.title || '');
  const [editedDescription, setEditedDescription] = useState(task?.description || '');
  const [editedStatus, setEditedStatus] = useState(task?.status || 'todo');
  const [editedMilestone, setEditedMilestone] = useState(task?.milestone || 'Início');
  const [newComment, setNewComment] = useState('');
  const [tempComments, setTempComments] = useState(task?.comments || []);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const newCommentObj = {
      id: Date.now().toString(),
      text: newComment,
      username: 'Usuário Atual',
      timestamp: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
    };
    const updatedTask = {
      ...task,
      comments: [newCommentObj, ...tempComments]
    };
    setTempComments(updatedTask.comments);
    onTaskUpdated(updatedTask);
    setNewComment('');
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!editedTitle.trim()) return;
    const updatedTask = {
      ...task,
      title: editedTitle,
      description: editedDescription,
      status: editedStatus,
      milestone: editedMilestone,
      comments: tempComments
    };
    onTaskUpdated(updatedTask);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0">
        <div className="flex h-[80vh]">
          {/* Left Section: Task Details */}
          <div className="w-1/2 p-6 flex flex-col gap-5 bg-white overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Editar Tarefa</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">Edite os detalhes da tarefa.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-5 flex-1">
              <div>
                <label className="text-sm font-medium text-gray-700">Título</label>
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="h-10 text-sm border-gray-200 focus:ring-primary focus:border-primary"
                  placeholder="Título da tarefa"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Descrição</label>
                <Textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  placeholder="Descrição da tarefa..."
                  className="h-28 text-sm border-gray-200 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <Select value={editedStatus} onValueChange={setEditedStatus}>
                  <SelectTrigger className="h-10 text-sm border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">A fazer</SelectItem>
                    <SelectItem value="in_progress">Em andamento</SelectItem>
                    <SelectItem value="done">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Etapa</label>
                <Select value={editedMilestone} onValueChange={setEditedMilestone}>
                  <SelectTrigger className="h-10 text-sm border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Início">Início</SelectItem>
                    <SelectItem value="Meio">Meio</SelectItem>
                    <SelectItem value="Finalização">Finalização</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end">
                <Button type="submit" size="sm" className="h-10 text-sm bg-primary hover:bg-primary/90">
                  Salvar
                </Button>
              </div>
            </form>
          </div>
          {/* Right Section: Comments */}
          <div className="w-1/2 p-6 bg-gray-50 flex flex-col gap-5 overflow-y-auto">
            <div>
              <label className="text-sm font-medium text-gray-700">Novo Comentário</label>
              <form onSubmit={handleAddComment} className="space-y-3">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Adicionar comentário..."
                  className="h-28 text-sm border-gray-200 focus:ring-primary focus:border-primary"
                />
                <Button type="submit" size="sm" className="h-10 text-sm bg-gray-600 text-white hover:bg-gray-700">
                  Adicionar Comentário
                </Button>
              </form>
            </div>
            {tempComments.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Comentários</h4>
                {tempComments.map(comment => (
                  <div key={comment.id} className="text-sm text-muted-foreground p-3 bg-white rounded-md shadow-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-700">{comment.username}</span>
                      <span className="text-xs text-gray-500">{comment.timestamp}</span>
                    </div>
                    <p>{comment.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Tarefas = () => {
  const [tasks, setTasks] = useState([
    {
      id: '1',
      title: 'Criar wireframe',
      description: 'Desenhar o layout inicial do site',
      responsible: 'João Silva',
      tag: 'Ouro',
      status: 'todo',
      deadline: '15/10/2025',
      milestone: 'Início',
      comments: [{ id: 'c1', text: 'Wireframe inicial em progresso', username: 'Usuário Atual', timestamp: '09/10/2025 15:44' }]
    },
    {
      id: '2',
      title: 'Reunião com cliente',
      description: 'Discutir requisitos do projeto',
      responsible: 'Maria Oliveira',
      tag: 'Prata',
      status: 'in_progress',
      deadline: '12/10/2025',
      milestone: 'Início',
      comments: []
    },
    {
      id: '3',
      title: 'Configurar API',
      description: 'Integrar com serviços externos',
      responsible: 'Carlos Souza',
      tag: 'Ouro',
      status: 'in_progress',
      deadline: '20/10/2025',
      milestone: 'Meio',
      comments: [{ id: 'c2', text: 'API configurada parcialmente', username: 'Usuário Atual', timestamp: '09/10/2025 15:50' }]
    },
    {
      id: '4',
      title: 'Testar protótipo',
      description: 'Validar com equipe',
      responsible: 'Ana Costa',
      tag: 'Prata',
      status: 'done',
      deadline: '10/10/2025',
      milestone: 'Finalização',
      comments: []
    },
    {
      id: '5',
      title: 'Corrigir bug de login',
      description: 'Resolver problema de autenticação',
      responsible: 'João Silva',
      tag: 'Bronze',
      status: 'todo',
      deadline: '18/10/2025',
      milestone: 'Finalização',
      comments: [{ id: 'c3', text: 'Bug identificado', username: 'Usuário Atual', timestamp: '09/10/2025 15:55' }]
    },
    {
      id: '6',
      title: 'Documentar API',
      description: 'Escrever documentação técnica',
      responsible: 'Maria Oliveira',
      tag: 'Bronze',
      status: 'in_progress',
      deadline: '22/10/2025',
      milestone: 'Meio',
      comments: []
    }
  ]);
  const [selectedTask, setSelectedTask] = useState(null);

  const columns = [
    { id: 'todo', title: 'A fazer', status: 'todo' },
    { id: 'in_progress', title: 'Em andamento', status: 'in_progress' },
    { id: 'done', title: 'Concluídas', status: 'done' }
  ];

  const moveTask = (taskId, newStatus) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const updateTask = (updatedTask) => {
    setTasks(tasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
                        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Tarefas</h1>
          </div>
        <div className="grid gap-4 md:grid-cols-3">
          {columns.map(column => (
            <DroppableColumn
              key={column.id}
              column={column}
              tasks={tasks.filter(task => task.status === column.status)}
              moveTask={moveTask}
              setSelectedTask={setSelectedTask}
            />
          ))}
        </div>
      </div>
      {selectedTask && (
        <TaskEditDialog
          task={selectedTask}
          open={!!selectedTask}
          onOpenChange={() => setSelectedTask(null)}
          onTaskUpdated={updateTask}
        />
      )}
    </DndProvider>
  );
};

export default Tarefas;


{/*
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
import { KanbanBoard, KanbanColumn } from "@/components/KanbanBoard";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface Task {
  id: string;
  name: string;
  description: string | null;
  status: string;
  assigned_to: string | null;
  due_date: string | null;
  milestone_id: string;
}

const columns: KanbanColumn[] = [
  { id: 'pending', title: 'A Fazer', status: 'pending' },
  { id: 'in_progress', title: 'Em Andamento', status: 'in_progress' },
  { id: 'completed', title: 'Concluídas', status: 'completed' },
];

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
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');

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

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId);

      if (error) throw error;

      toast.success('Status atualizado!');
      loadTasks();
    } catch (error: any) {
      console.error('Error updating status:', error);
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
          <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as any)}>
            <ToggleGroupItem value="kanban">Kanban</ToggleGroupItem>
            <ToggleGroupItem value="list">Lista</ToggleGroupItem>
          </ToggleGroup>
          {canManageProjetos && selectedMilestoneId && (
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Tarefa
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[300px_1fr]">

        // Sidebar with milestones
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

        // Main content - tasks
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
                {viewMode === 'list' && (
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
                )}
              </div>

              {loadingTasks ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : tasks.length === 0 ? (
                <Card className="p-12">
                  <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <ListTodo className="h-12 w-12 text-muted-foreground" />
                    <div>
                      <h3 className="font-semibold">Nenhuma tarefa encontrada</h3>
                      <p className="text-sm text-muted-foreground">
                        Crie sua primeira tarefa para este milestone
                      </p>
                    </div>
                    {canManageProjetos && (
                      <Button onClick={() => setCreateDialogOpen(true)} size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Criar Primeira Tarefa
                      </Button>
                    )}
                  </div>
                </Card>
              ) : viewMode === 'kanban' ? (
                <KanbanBoard
                  columns={columns}
                  items={tasks.map(t => ({
                    ...t,
                    title: t.name,
                  }))}
                  onItemClick={(item) => setEditingTask(tasks.find(t => t.id === item.id) || null)}
                  onStatusChange={handleStatusChange}
                  onAddClick={() => setCreateDialogOpen(true)}
                  renderItem={(item) => (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">{item.title}</h4>
                      {item.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        {item.assigned_to && (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {item.assigned_to}
                          </div>
                        )}
                        {item.due_date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(item.due_date).toLocaleDateString('pt-BR')}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                />
              ) : filteredTasks.length === 0 ? (
                <Card className="p-12">
                  <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <ListTodo className="h-12 w-12 text-muted-foreground" />
                    <div>
                      <h3 className="font-semibold">Nenhuma tarefa encontrada</h3>
                      <p className="text-sm text-muted-foreground">
                        Não há tarefas com este status
                      </p>
                    </div>
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

*/
}