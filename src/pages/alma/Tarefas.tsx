import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, List, Grid3x3, Search, Filter } from 'lucide-react';
import { TaskDialog } from '@/components/TaskDialog';
import { TaskEditDialog } from '@/components/TaskEditDialog';
import { KanbanBoard } from '@/components/KanbanBoard';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { isAfter, isBefore, isToday, isTomorrow, isThisWeek, isThisMonth, startOfWeek, endOfWeek, addWeeks } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function Tarefas() {
  const { empresaId } = useParams();
  const [tasks, setTasks] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);
  
  // Filters
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [setorFilter, setSetorFilter] = useState<string>('all');
  const [dueDateFilter, setDueDateFilter] = useState<string>('all');
  const [creationDateFilter, setCreationDateFilter] = useState<string>('all');
  const [assignedToFilter, setAssignedToFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'rotinas', label: 'Rotinas' },
    { id: 'processos', label: 'Processos' },
    { id: 'projetos', label: 'Projetos' },
    { id: 'avulsas', label: 'Avulsas' },
  ];

  const statuses = [
    { id: 'pending', title: 'Pendente', status: 'pending' },
    { id: 'in_progress', title: 'Em Progresso', status: 'in_progress' },
    { id: 'completed', title: 'Concluído', status: 'completed' },
  ];

  // Load projects and milestones
  useEffect(() => {
    if (empresaId) {
      loadProjects();
    }
  }, [empresaId]);

  useEffect(() => {
    if (projects.length > 0) {
      loadMilestones();
    }
  }, [projects]);

  useEffect(() => {
    if (selectedMilestoneId) {
      loadTasks();
    }
  }, [selectedMilestoneId]);

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('empresa_id', empresaId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar projetos:', error);
      toast.error('Erro ao carregar projetos');
    }
  };

  const loadMilestones = async () => {
    try {
      const projectIds = projects.map(p => p.id);
      const { data, error } = await supabase
        .from('milestones')
        .select('*, projects!inner(name, setor)')
        .in('project_id', projectIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMilestones(data || []);
      
      if (data && data.length > 0 && !selectedMilestoneId) {
        setSelectedMilestoneId(data[0].id);
      }
    } catch (error: any) {
      console.error('Erro ao carregar milestones:', error);
      toast.error('Erro ao carregar milestones');
    }
  };

  const loadTasks = async () => {
    if (!selectedMilestoneId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('milestone_id', selectedMilestoneId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar tarefas:', error);
      toast.error('Erro ao carregar tarefas');
    } finally {
      setIsLoading(false);
    }
  };

  // Get unique setores and assigned users
  const uniqueSetores = Array.from(new Set(milestones.map(m => m.projects?.setor).filter(Boolean)));
  const uniqueAssigned = Array.from(new Set(tasks.map(t => t.assigned_to).filter(Boolean)));

  const filterByDueDate = (task: any) => {
    if (dueDateFilter === 'all') return true;
    if (dueDateFilter === 'no_date') return !task.due_date;
    if (!task.due_date) return false;
    
    const dueDate = new Date(task.due_date);
    const today = new Date();
    
    if (dueDateFilter === 'overdue') return isBefore(dueDate, today) && !isToday(dueDate);
    if (dueDateFilter === 'today') return isToday(dueDate);
    if (dueDateFilter === 'tomorrow') return isTomorrow(dueDate);
    if (dueDateFilter === 'this_week') return isThisWeek(dueDate, { weekStartsOn: 0 });
    if (dueDateFilter === 'next_week') {
      const nextWeekStart = addWeeks(startOfWeek(today, { weekStartsOn: 0 }), 1);
      const nextWeekEnd = endOfWeek(nextWeekStart, { weekStartsOn: 0 });
      return isAfter(dueDate, nextWeekStart) && isBefore(dueDate, nextWeekEnd);
    }
    if (dueDateFilter === 'this_month') return isThisMonth(dueDate);
    
    return true;
  };

  const filterByCreationDate = (task: any) => {
    if (creationDateFilter === 'all') return true;
    
    const createdDate = new Date(task.created_at);
    
    if (creationDateFilter === 'today') return isToday(createdDate);
    if (creationDateFilter === 'this_week') return isThisWeek(createdDate, { weekStartsOn: 0 });
    if (creationDateFilter === 'this_month') return isThisMonth(createdDate);
    
    return true;
  };

  const getTaskCategory = (task: any) => {
    const milestone = milestones.find(m => m.id === task.milestone_id);
    if (!milestone) return 'avulsas';
    // For now, all tasks linked to milestones are considered "projetos"
    return 'projetos';
  };

  const filteredTasks = tasks.filter(task => {
    const taskCategory = getTaskCategory(task);
    const matchesCategory = categoryFilter === 'all' || taskCategory === categoryFilter;
    
    const milestone = milestones.find(m => m.id === task.milestone_id);
    const taskSetor = milestone?.projects?.setor;
    const matchesSetor = setorFilter === 'all' || 
                        (setorFilter === 'no_setor' ? !taskSetor : taskSetor === setorFilter);
    
    const matchesAssigned = assignedToFilter === 'all' || 
                           (assignedToFilter === 'no_assigned' ? !task.assigned_to : task.assigned_to === assignedToFilter);
    
    const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (task.description?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDueDate = filterByDueDate(task);
    const matchesCreationDate = filterByCreationDate(task);
    
    return matchesCategory && matchesSetor && matchesAssigned && matchesSearch && matchesDueDate && matchesCreationDate;
  });

  const handleMove = async (taskId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId);

      if (error) throw error;
      
      toast.success('Tarefa atualizada');
      loadTasks();
    } catch (error: any) {
      console.error('Erro ao atualizar tarefa:', error);
      toast.error('Erro ao atualizar tarefa');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">✅ Tarefas</h1>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'kanban' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('kanban')}
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Tarefa
          </Button>
        </div>
      </div>

      {/* Milestone Selector */}
      <Select value={selectedMilestoneId || ''} onValueChange={setSelectedMilestoneId}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione um milestone" />
        </SelectTrigger>
        <SelectContent>
          {milestones.map(milestone => (
            <SelectItem key={milestone.id} value={milestone.id}>
              {milestone.projects?.name} - {milestone.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Category Tabs */}
      <Tabs value={categoryFilter} onValueChange={setCategoryFilter}>
        <TabsList>
          {categories.map(cat => (
            <TabsTrigger key={cat.id} value={cat.id}>
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Filters and Search */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar tarefas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Select value={setorFilter} onValueChange={setSetorFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Setor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos setores</SelectItem>
            <SelectItem value="no_setor">Sem setor</SelectItem>
            {uniqueSetores.map(setor => (
              <SelectItem key={setor} value={setor as string}>{setor}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={dueDateFilter} onValueChange={setDueDateFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Data de entrega" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as datas</SelectItem>
            <SelectItem value="no_date">Sem data</SelectItem>
            <SelectItem value="overdue">Atrasadas</SelectItem>
            <SelectItem value="today">Hoje</SelectItem>
            <SelectItem value="tomorrow">Amanhã</SelectItem>
            <SelectItem value="this_week">Essa semana</SelectItem>
            <SelectItem value="next_week">Próxima semana</SelectItem>
            <SelectItem value="this_month">Esse mês</SelectItem>
          </SelectContent>
        </Select>

        <Select value={creationDateFilter} onValueChange={setCreationDateFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Data de criação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="today">Criados hoje</SelectItem>
            <SelectItem value="this_week">Criados essa semana</SelectItem>
            <SelectItem value="this_month">Criados esse mês</SelectItem>
          </SelectContent>
        </Select>

        <Select value={assignedToFilter} onValueChange={setAssignedToFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Responsável" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="no_assigned">Sem responsável</SelectItem>
            {uniqueAssigned.map(assigned => (
              <SelectItem key={assigned} value={assigned as string}>{assigned}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {viewMode === 'kanban' ? (
        <KanbanBoard
          columns={statuses}
          items={filteredTasks}
          onItemClick={setEditingTask}
          onStatusChange={handleMove}
        />
      ) : (
        <div className="grid gap-4">
          {filteredTasks.map(task => (
            <Card
              key={task.id}
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setEditingTask(task)}
            >
              <h3 className="font-semibold">{task.name}</h3>
              {task.description && (
                <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
              )}
              <div className="flex gap-2 mt-2">
                {task.assigned_to && (
                  <span className="text-xs px-2 py-1 rounded-full bg-accent">
                    {task.assigned_to}
                  </span>
                )}
                {task.due_date && (
                  <span className="text-xs px-2 py-1 rounded-full bg-secondary">
                    {new Date(task.due_date).toLocaleDateString('pt-BR')}
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {selectedMilestoneId && (
        <TaskDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          milestoneId={selectedMilestoneId}
          onTaskCreated={() => {
            setShowCreateDialog(false);
            loadTasks();
          }}
        />
      )}

      <TaskEditDialog
        open={!!editingTask}
        onOpenChange={(open) => !open && setEditingTask(null)}
        task={editingTask}
        onTaskUpdated={() => {
          setEditingTask(null);
          loadTasks();
        }}
      />
    </div>
  );
}
