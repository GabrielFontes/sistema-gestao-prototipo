import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Plus, MessageSquare } from "lucide-react";

const ProcessCard = ({ process, setSelectedProcess }) => {
  const tagStyles = {
    'Pré-venda': 'bg-blue-300 text-white',
    'Venda': 'bg-green-300 text-white',
    'Entrega': 'bg-yellow-300 text-white',
    'Suporte': 'bg-purple-300 text-white',
  };

  return (
    <Card
      className="p-3 cursor-pointer transition-all duration-150 hover:shadow-sm bg-white"
      onClick={() => setSelectedProcess(process)}
    >
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <Badge className={`${tagStyles[process.tag]} text-xs`}>{process.tag}</Badge>
          <h4 className="font-medium text-sm leading-tight">{process.name}</h4>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1">{process.description}</p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <User className="h-3.5 w-3.5" />
          <span>{process.responsible}</span>
        </div>
        <div>
          <Progress value={process.progress} className="h-1.5" />
          <div className="text-xs text-muted-foreground mt-0.5">
            {process.progress}% concluído
          </div>
        </div>
      </div>
    </Card>
  );
};

const ProcessColumn = ({ column, processes, setSelectedProcess }) => {
  const tagOrder = ['Pré-venda', 'Venda', 'Entrega', 'Suporte'];

  const sortedProcesses = [...processes].sort((a, b) => {
    return tagOrder.indexOf(a.tag) - tagOrder.indexOf(b.tag);
  });

  return (
<Card className="h-fit bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <span>{column.title}</span>
          <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
            {processes.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {sortedProcesses.map(process => (
          <ProcessCard
            key={process.id}
            process={process}
            setSelectedProcess={setSelectedProcess}
          />
        ))}
        <Button
          variant="ghost"
          className="w-full border border-dashed border-muted-foreground/25 h-10 text-sm hover:border-primary hover:bg-primary/5"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Adicionar
        </Button>
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

const ProcessChecklist = ({ process, open, onOpenChange }) => {
  const [tasks, setTasks] = useState(process.tasks);
  const [selectedTask, setSelectedTask] = useState(null);

  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const updateTask = (updatedTask) => {
    setTasks(tasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const milestoneOrder = ['Início', 'Meio', 'Finalização'];

  const sortedTasks = [...tasks].sort((a, b) => {
    return milestoneOrder.indexOf(a.milestone) - milestoneOrder.indexOf(b.milestone);
  });

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] p-0 overflow-y-auto">
          <DialogHeader className="p-6">
            <DialogTitle className="text-xl font-semibold">{process.name}</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">{process.description}</DialogDescription>
          </DialogHeader>
          <div className="p-6 space-y-5">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Checklist de Tarefas</h4>
              {sortedTasks.map(task => (
                <div key={task.id} className="flex items-center gap-2 p-2 bg-white rounded-md shadow-sm hover:bg-gray-50">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTaskCompletion(task.id)}
                    className="h-4 w-4"
                    onClick={e => e.stopPropagation()}
                  />
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => setSelectedTask(task)}
                  >
                    <div className="flex items-center gap-1.5">
                      {task.comments.length > 0 && (
                        <MessageSquare className="h-3.5 w-3.5 text-gray-400" />
                      )}
                      <Badge
                        className={`${
                          task.milestone === 'Início' ? 'bg-indigo-300' :
                          task.milestone === 'Meio' ? 'bg-teal-300' :
                          'bg-orange-300'
                        } text-white text-xs`}
                      >
                        {task.milestone}
                      </Badge>
                      <span className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-gray-700'}`}>
                        {task.title}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{task.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {selectedTask && (
        <TaskEditDialog
          task={selectedTask}
          open={!!selectedTask}
          onOpenChange={() => setSelectedTask(null)}
          onTaskUpdated={updateTask}
        />
      )}
    </>
  );
};

const Processos = () => {
  const [processes, setProcesses] = useState([
    {
      id: '1',
      name: 'Processo Website',
      description: 'Desenvolvimento de site institucional',
      responsible: 'João Silva',
      tag: 'Pré-venda',
      progress: 20,
      status: 'in_progress',
      tasks: [
        { id: '1', title: 'Criar wireframe', description: 'Desenhar o layout inicial', status: 'todo', milestone: 'Início', completed: false, comments: [] },
        { id: '2', title: 'Reunião com cliente', description: 'Discutir requisitos', status: 'in_progress', milestone: 'Início', completed: false, comments: [{ id: 'c1', text: 'Agendada para 10/10', username: 'Usuário Atual', timestamp: '09/10/2025 15:04' }] },
        { id: '3', title: 'Definir paleta de cores', description: 'Escolher cores do design', status: 'todo', milestone: 'Meio', completed: false, comments: [] },
        { id: '4', title: 'Testar protótipo', description: 'Validar com equipe', status: 'done', milestone: 'Finalização', completed: true, comments: [{ id: 'c2', text: 'Protótipo aprovado', username: 'Usuário Atual', timestamp: '09/10/2025 15:15' }] }
      ]
    },
    {
      id: '2',
      name: 'Processo ERP',
      description: 'Implementação de sistema de gestão',
      responsible: 'Maria Oliveira',
      tag: 'Venda',
      progress: 50,
      status: 'in_progress',
      tasks: [
        { id: '5', title: 'Configurar API', description: 'Integrar com serviços externos', status: 'in_progress', milestone: 'Meio', completed: false, comments: [] },
        { id: '6', title: 'Iniciar integração', description: 'Configurar endpoints iniciais', status: 'todo', milestone: 'Início', completed: false, comments: [{ id: 'c3', text: 'Endpoints configurados', username: 'Usuário Atual', timestamp: '09/10/2025 15:20' }] },
        { id: '7', title: 'Finalizar testes', description: 'Testar integrações', status: 'done', milestone: 'Finalização', completed: true, comments: [] }
      ]
    },
    {
      id: '3',
      name: 'Processo App Mobile',
      description: 'Finalização do app mobile',
      responsible: 'Carlos Souza',
      tag: 'Entrega',
      progress: 80,
      status: 'in_progress',
      tasks: [
        { id: '8', title: 'Iniciar desenvolvimento', description: 'Configurar ambiente', status: 'todo', milestone: 'Início', completed: false, comments: [] },
        { id: '9', title: 'Testes unitários', description: 'Verificar funcionalidades', status: 'done', milestone: 'Finalização', completed: true, comments: [{ id: 'c4', text: 'Testes concluídos', username: 'Usuário Atual', timestamp: '09/10/2025 15:25' }] }
      ]
    },
    {
      id: '4',
      name: 'Processo Suporte',
      description: 'Manutenção do sistema legado',
      responsible: 'Ana Costa',
      tag: 'Suporte',
      progress: 10,
      status: 'delayed',
      tasks: [
        { id: '10', title: 'Identificar bug', description: 'Analisar problema de login', status: 'todo', milestone: 'Início', completed: false, comments: [] },
        { id: '11', title: 'Corrigir bug', description: 'Resolver problema de login', status: 'todo', milestone: 'Finalização', completed: false, comments: [{ id: 'c5', text: 'Bug identificado', username: 'Usuário Atual', timestamp: '09/10/2025 15:30' }] }
      ]
    }
  ]);
  const [selectedProcess, setSelectedProcess] = useState(null);

  const columns = [
    { id: 'in_progress', title: 'Em andamento', status: 'in_progress' },
    { id: 'delayed', title: 'Atrasados', status: 'delayed' },
    { id: 'done', title: 'Concluídos', status: 'done' }
  ];

  return (
    <div className="space-y-6">
                        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Processos</h1>
          </div>
      <div className="grid gap-4 md:grid-cols-3">
        {columns.map(column => (
          <ProcessColumn
            key={column.id}
            column={column}
            processes={processes.filter(process => process.status === column.status)}
            setSelectedProcess={setSelectedProcess}
          />
        ))}
      </div>
      {selectedProcess && (
        <ProcessChecklist
          process={selectedProcess}
          open={!!selectedProcess}
          onOpenChange={() => setSelectedProcess(null)}
        />
      )}
    </div>
  );
};

export default Processos;

{/*
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, List, FolderOpen } from "lucide-react";
import { ProcessDialog } from "@/components/ProcessDialog";
import { ProcessEditDialog } from "@/components/ProcessEditDialog";
import { useProcesses } from "@/hooks/useProcesses";
import { useParams } from "react-router-dom";
import { useUserRoles } from "@/hooks/useUserRoles";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { KanbanBoard, KanbanColumn } from "@/components/KanbanBoard";

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

export default function Processos() {
  const { empresaId } = useParams();
  const { processes, isLoading, updateProcess, createProcess, deleteProcess } = useProcesses(empresaId || '');
  const { canManageOperacao } = useUserRoles(empresaId || null);
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingProcess, setEditingProcess] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  const handleStatusChange = async (processId: string, newStatus: string) => {
    await updateProcess(processId, { status: newStatus as any });
  };

  const handleCreateProcess = async (data: any) => {
    await createProcess(data);
  };

  const handleUpdateProcess = async (data: any) => {
    if (editingProcess) {
      await updateProcess(editingProcess.id, data);
    }
  };

  const handleDeleteProcess = async () => {
    if (editingProcess) {
      await deleteProcess(editingProcess.id);
    }
  };

  const renderProcessCard = (process: any) => (
    <Card
      key={process.id}
      className="p-3 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => setEditingProcess(process)}
    >
      <div className="space-y-2">
        <h4 className="font-medium text-sm line-clamp-2">{process.name}</h4>
        {process.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{process.description}</p>
        )}
        {process.owner && (
          <p className="text-xs text-muted-foreground">👤 {process.owner}</p>
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
          <h2 className="text-2xl font-bold">Processos</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie os processos operacionais
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
          {canManageOperacao && (
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Processo
            </Button>
          )}
        </div>
      </div>

      {processes.length === 0 ? (
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <FolderOpen className="h-16 w-16 text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold">Nenhum processo encontrado</h3>
              <p className="text-sm text-muted-foreground">
                Comece criando seu primeiro processo
              </p>
            </div>
            {canManageOperacao && (
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeiro Processo
              </Button>
            )}
          </div>
        </Card>
      ) : viewMode === 'kanban' ? (
        <KanbanBoard
          columns={columns}
          categories={categories}
          items={processes}
          renderItem={renderProcessCard}
          onStatusChange={handleStatusChange}
          getCategoryLabel={(catId) => categories.find(c => c.id === catId)?.label || ''}
          getCategoryIcon={(catId) => categories.find(c => c.id === catId)?.icon || ''}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {processes.map((process) => renderProcessCard(process))}
        </div>
      )}

      <ProcessDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateProcess}
      />

      <ProcessEditDialog
        open={editingProcess !== null}
        onOpenChange={(open) => !open && setEditingProcess(null)}
        process={editingProcess}
        onSubmit={handleUpdateProcess}
        onDelete={handleDeleteProcess}
      />
    </div>
  );
}
*/}