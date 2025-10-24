import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, List, Grid3x3, Search, Filter } from 'lucide-react';
import { useProcesses } from '@/hooks/useProcesses';
import { ProcessEditDialog } from '@/components/ProcessEditDialog';
import { KanbanBoard } from '@/components/KanbanBoard';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { isAfter, isBefore, isToday, isTomorrow, isThisWeek, isThisMonth, startOfWeek, endOfWeek, addWeeks } from 'date-fns';

export default function Processos() {
  const { empresaId } = useParams();
  const { processes, createProcess, updateProcess, deleteProcess } = useProcesses(empresaId || null);
  const [editingProcess, setEditingProcess] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');
  
  // Filters
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [setorFilter, setSetorFilter] = useState<string>('all');
  const [dueDateFilter, setDueDateFilter] = useState<string>('all');
  const [creationDateFilter, setCreationDateFilter] = useState<string>('all');
  const [ownerFilter, setOwnerFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'Todos', value: null },
    { id: 'pre_venda', label: 'Pré-venda', value: 'pre_venda' },
    { id: 'venda', label: 'Venda', value: 'venda' },
    { id: 'entrega', label: 'Entrega', value: 'entrega' },
    { id: 'suporte', label: 'Suporte', value: 'suporte' },
  ];

  const statuses = [
    { id: 'pending', title: 'Pendente', status: 'pending' },
    { id: 'in_progress', title: 'Em Progresso', status: 'in_progress' },
    { id: 'completed', title: 'Concluído', status: 'completed' },
  ];

  // Get unique setores and owners
  const uniqueSetores = Array.from(new Set(processes.map(p => p.setor).filter(Boolean)));
  const uniqueOwners = Array.from(new Set(processes.map(p => p.owner).filter(Boolean)));

  const filterByDueDate = (process: any) => {
    if (dueDateFilter === 'all') return true;
    if (dueDateFilter === 'no_date') return !process.due_date;
    if (!process.due_date) return false;
    
    const dueDate = new Date(process.due_date);
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

  const filterByCreationDate = (process: any) => {
    if (creationDateFilter === 'all') return true;
    
    const createdDate = new Date(process.created_at);
    
    if (creationDateFilter === 'today') return isToday(createdDate);
    if (creationDateFilter === 'this_week') return isThisWeek(createdDate, { weekStartsOn: 0 });
    if (creationDateFilter === 'this_month') return isThisMonth(createdDate);
    
    return true;
  };

  const filteredProcesses = processes.filter(process => {
    const matchesCategory = categoryFilter === 'all' || process.category === categoryFilter;
    const matchesSetor = setorFilter === 'all' || 
                        (setorFilter === 'no_setor' ? !process.setor : process.setor === setorFilter);
    const matchesOwner = ownerFilter === 'all' || 
                        (ownerFilter === 'no_owner' ? !process.owner : process.owner === ownerFilter);
    const matchesSearch = process.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (process.description?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDueDate = filterByDueDate(process);
    const matchesCreationDate = filterByCreationDate(process);
    
    return matchesCategory && matchesSetor && matchesOwner && matchesSearch && matchesDueDate && matchesCreationDate;
  });

  const handleMove = async (processId: string, newStatus: string) => {
    await updateProcess(processId, { status: newStatus as any });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">🔧 Processos</h1>
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
        </div>
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
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar processos..."
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

      {viewMode === 'kanban' ? (
        <KanbanBoard
          columns={statuses}
          items={filteredProcesses}
          onItemClick={setEditingProcess}
          onStatusChange={handleMove}
        />
      ) : (
        <div className="grid gap-4">
          {filteredProcesses.map(process => (
            <Card
              key={process.id}
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setEditingProcess(process)}
            >
              <h3 className="font-semibold">{process.name}</h3>
              {process.description && (
                <p className="text-sm text-muted-foreground mt-1">{process.description}</p>
              )}
              <div className="flex gap-2 mt-2">
                {process.category && (
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {categories.find(c => c.value === process.category)?.label}
                  </span>
                )}
                {process.setor && (
                  <span className="text-xs px-2 py-1 rounded-full bg-secondary">
                    {process.setor}
                  </span>
                )}
                {process.owner && (
                  <span className="text-xs px-2 py-1 rounded-full bg-accent">
                    {process.owner}
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <ProcessEditDialog
        open={!!editingProcess}
        onOpenChange={(open) => !open && setEditingProcess(null)}
        process={editingProcess}
        onSubmit={async (data) => {
          if (editingProcess) {
            await updateProcess(editingProcess.id, data);
            setEditingProcess(null);
          }
        }}
        onDelete={async () => {
          if (editingProcess) {
            await deleteProcess(editingProcess.id);
            setEditingProcess(null);
          }
        }}
      />
    </div>
  );
}
