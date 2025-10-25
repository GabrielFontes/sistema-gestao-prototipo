import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  const [ownerFilter, setOwnerFilter] = useState<string>('all');

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
  const uniqueOwners = Array.from(new Set(tasks.map(t => t.assigned_to).filter(Boolean)));


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
        <div>
        <h2 className="text-2xl font-bold mb-6">Tarefas</h2>
      </div>

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

<div className="flex flex-col gap-1 flex-1 min-w-[200px]">
  <span className="text-xs font-medium text-muted-foreground">Buscar</span>
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

  {/* Filtro por Setor */}
  <div className="flex flex-col gap-1">
    <span className="text-xs font-medium text-muted-foreground">Setor</span>
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
  </div>

  {/* Filtro por Data de Entrega */}
  <div className="flex flex-col gap-1">
    <span className="text-xs font-medium text-muted-foreground">Entrega</span>
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
  </div>

  {/* Filtro por Data de Criação */}
  <div className="flex flex-col gap-1">
    <span className="text-xs font-medium text-muted-foreground">Criação</span>
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
  </div>

  {/* Filtro por Responsável */}
  <div className="flex flex-col gap-1">
    <span className="text-xs font-medium text-muted-foreground">Responsável</span>
    <Select value={ownerFilter} onValueChange={setOwnerFilter}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Responsável" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos</SelectItem>
        <SelectItem value="no_owner">Sem responsável</SelectItem>
        {uniqueOwners.map(owner => (
          <SelectItem key={owner} value={owner as string}>{owner}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
</div>

      {viewMode === 'kanban' ? (
        <KanbanBoard
          columns={statuses}
          items={filteredTasks}
          onItemClick={setEditingTask}
          onStatusChange={handleMove}
          renderItem={(task) => (
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-400 font-medium px-2 py-0.5 text-xs uppercase">
                  {task.category || 'Projeto'}
                </Badge>
                <h4 className="font-semibold text-sm flex-1 leading-tight">{task.name}</h4>
              </div>
              {task.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {task.description}
                </p>
              )}
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{task.assigned_to || 'Sem responsável'}</span>
                </div>
                {task.due_date && (
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{new Date(task.due_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })} {new Date(task.due_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                )}
              </div>
            </div>
          )}
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
