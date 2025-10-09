import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Plus } from "lucide-react";

const ItemTypes = {
  PROJECT: 'PROJECT',
  TASK: 'TASK'
};

const DraggableProject = ({ project, moveProject, setSelectedProject }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.PROJECT,
    item: { id: project.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const tagStyles = {
    'Pré-venda': 'bg-blue-300 text-white',
    'Venda': 'bg-green-300 text-white',
    'Entrega': 'bg-yellow-300 text-white',
    'Suporte': 'bg-purple-300 text-white',
  };

  return (
    <Card
      ref={drag}
      className={`p-3 cursor-grab transition-all duration-150 hover:shadow-sm bg-white ${
        isDragging ? 'opacity-60 scale-102 rotate-1 shadow-md' : 'opacity-100'
      }`}
      onClick={() => setSelectedProject(project)}
    >
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <Badge className={`${tagStyles[project.tag]} text-xs`}>{project.tag}</Badge>
          <h4 className="font-medium text-sm leading-tight">{project.name}</h4>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1">{project.description}</p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <User className="h-3.5 w-3.5" />
          <span>{project.responsible}</span>
        </div>
        <div>
          <Progress value={project.progress} className="h-1.5" />
          <div className="text-xs text-muted-foreground mt-0.5">
            {project.progress}% concluído
          </div>
        </div>
      </div>
    </Card>
  );
};

const DroppableColumn = ({ column, projects, moveProject, setSelectedProject }) => {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.PROJECT,
    drop: (item) => moveProject(item.id, column.status),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const tagOrder = ['Pré-venda', 'Venda', 'Entrega', 'Suporte'];

  const sortedProjects = [...projects].sort((a, b) => {
    return tagOrder.indexOf(a.tag) - tagOrder.indexOf(b.tag);
  });

  return (
    <Card ref={drop} className={`h-fit bg-white transition-colors duration-150 ${isOver ? 'bg-gray-50' : ''}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <span>{column.title}</span>
          <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
            {projects.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {sortedProjects.map(project => (
          <DraggableProject
            key={project.id}
            project={project}
            moveProject={moveProject}
            setSelectedProject={setSelectedProject}
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

const DraggableTask = ({ task, moveTask, setSelectedTask }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const milestoneStyles = {
    'Marco 1': 'bg-indigo-300 text-white',
    'Marco 2': 'bg-teal-300 text-white',
    'Marco 3': 'bg-orange-300 text-white',
  };

  return (
    <Card
      ref={drag}
      className={`p-2.5 cursor-grab transition-all duration-150 hover:shadow-sm bg-white ${
        isDragging ? 'opacity-60 scale-102 rotate-1 shadow-md' : 'opacity-100'
      }`}
      onClick={() => setSelectedTask(task)}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          <Badge className={`${milestoneStyles[task.milestone]} text-xs`}>{task.milestone}</Badge>
          <span className="text-xs font-medium">{task.title}</span>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1">{task.description}</p>
      </div>
    </Card>
  );
};

const DroppableTaskColumn = ({ column, tasks, moveTask, setSelectedTask }) => {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.TASK,
    drop: (item) => moveTask(item.id, column.status),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const milestoneOrder = ['Marco 1', 'Marco 2', 'Marco 3'];

  const sortedTasks = [...tasks].sort((a, b) => {
    return milestoneOrder.indexOf(a.milestone) - milestoneOrder.indexOf(b.milestone);
  });

  return (
    <Card ref={drop} className={`h-fit bg-gray-50 transition-colors duration-150 ${isOver ? 'bg-gray-100' : ''}`}>
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
          <DraggableTask key={task.id} task={task} moveTask={moveTask} setSelectedTask={setSelectedTask} />
        ))}
      </CardContent>
    </Card>
  );
};

const TaskEditDialog = ({ task, open, onOpenChange, onTaskUpdated }) => {
  const [editedTitle, setEditedTitle] = useState(task?.title || '');
  const [editedDescription, setEditedDescription] = useState(task?.description || '');
  const [editedStatus, setEditedStatus] = useState(task?.status || 'todo');
  const [editedMilestone, setEditedMilestone] = useState(task?.milestone || 'Marco 1');
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
      <DialogContent className="max-w-5xl max-h-[90vh] p-0">
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
                    <SelectItem value="done">Concluídos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Marco</label>
                <Select value={editedMilestone} onValueChange={setEditedMilestone}>
                  <SelectTrigger className="h-10 text-sm border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Marco 1">Marco 1</SelectItem>
                    <SelectItem value="Marco 2">Marco 2</SelectItem>
                    <SelectItem value="Marco 3">Marco 3</SelectItem>
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

const ProjectKanban = ({ project, open, onOpenChange }) => {
  const [tasks, setTasks] = useState(project.tasks);
  const [newTask, setNewTask] = useState('');
  const [newMilestone, setNewMilestone] = useState('Marco 1');
  const [selectedTask, setSelectedTask] = useState(null);

  const columns = [
    { id: 'todo', title: 'A fazer', status: 'todo' },
    { id: 'in_progress', title: 'Em andamento', status: 'in_progress' },
    { id: 'done', title: 'Concluídos', status: 'done' }
  ];

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const newTaskObj = {
      id: Date.now().toString(),
      title: newTask,
      description: '',
      status: 'todo',
      milestone: newMilestone,
      comments: []
    };
    setTasks([...tasks, newTaskObj]);
    setNewTask('');
    setNewMilestone('Marco 1');
  };

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
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0 overflow-y-auto">
          <DialogHeader className="p-6">
            <DialogTitle className="text-xl font-semibold">{project.name}</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">{project.description}</DialogDescription>
          </DialogHeader>
          <div className="p-6 space-y-5">
            <form onSubmit={addTask} className="flex gap-3 items-center">
              <Input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Nova tarefa..."
                className="w-48 h-10 text-sm border-gray-200"
              />
              <Select value={newMilestone} onValueChange={setNewMilestone}>
                <SelectTrigger className="w-32 h-10 text-sm border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Marco 1">Marco 1</SelectItem>
                  <SelectItem value="Marco 2">Marco 2</SelectItem>
                  <SelectItem value="Marco 3">Marco 3</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" size="sm" className="h-10 text-sm bg-primary hover:bg-primary/90">
                Adicionar
              </Button>
            </form>
            <div className="grid gap-4 md:grid-cols-3">
              {columns.map(column => (
                <DroppableTaskColumn
                  key={column.id}
                  column={column}
                  tasks={tasks.filter(task => task.status === column.status)}
                  moveTask={moveTask}
                  setSelectedTask={setSelectedTask}
                />
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

const KanbanBoard = () => {
  const [projects, setProjects] = useState([
    {
      id: '1',
      name: 'Projeto Website',
      description: 'Desenvolvimento de site institucional',
      responsible: 'João Silva',
      tag: 'Pré-venda',
      progress: 20,
      status: 'todo',
      tasks: [
        { id: '1', title: 'Criar wireframe', description: 'Desenhar o layout inicial', status: 'todo', milestone: 'Marco 1', comments: [] },
        { id: '2', title: 'Reunião com cliente', description: 'Discutir requisitos', status: 'in_progress', milestone: 'Marco 1', comments: [{ id: 'c1', text: 'Agendada para 10/10', username: 'Usuário Atual', timestamp: '09/10/2025 14:54' }] },
        { id: '3', title: 'Definir paleta de cores', description: 'Escolher cores do design', status: 'todo', milestone: 'Marco 2', comments: [] },
        { id: '4', title: 'Testar protótipo', description: 'Validar com equipe', status: 'done', milestone: 'Marco 3', comments: [] }
      ]
    },
    {
      id: '2',
      name: 'Sistema ERP',
      description: 'Implementação de sistema de gestão',
      responsible: 'Maria Oliveira',
      tag: 'Venda',
      progress: 50,
      status: 'in_progress',
      tasks: [
        { id: '5', title: 'Configurar API', description: 'Integrar com serviços externos', status: 'in_progress', milestone: 'Marco 2', comments: [] }
      ]
    },
    {
      id: '3',
      name: 'Entrega App Mobile',
      description: 'Finalização do app mobile',
      responsible: 'Carlos Souza',
      tag: 'Entrega',
      progress: 80,
      status: 'in_progress',
      tasks: [
        { id: '6', title: 'Testes unitários', description: 'Verificar funcionalidades', status: 'done', milestone: 'Marco 3', comments: [] }
      ]
    },
    {
      id: '4',
      name: 'Suporte Sistema',
      description: 'Manutenção do sistema legado',
      responsible: 'Ana Costa',
      tag: 'Suporte',
      progress: 10,
      status: 'todo',
      tasks: [
        { id: '7', title: 'Corrigir bug', description: 'Resolver problema de login', status: 'todo', milestone: 'Marco 1', comments: [] }
      ]
    }
  ]);
  const [selectedProject, setSelectedProject] = useState(null);

  const columns = [
    { id: 'todo', title: 'A fazer', status: 'todo' },
    { id: 'in_progress', title: 'Em andamento', status: 'in_progress' },
    { id: 'done', title: 'Concluídos', status: 'done' }
  ];

  const moveProject = (projectId, newStatus) => {
    setProjects(projects.map(project =>
      project.id === projectId ? { ...project, status: newStatus } : project
    ));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
                <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Projetos</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {columns.map(column => (
            <DroppableColumn
              key={column.id}
              column={column}
              projects={projects.filter(project => project.status === column.status)}
              moveProject={moveProject}
              setSelectedProject={setSelectedProject}
            />
          ))}
        </div>
      </div>
      {selectedProject && (
        <ProjectKanban
          project={selectedProject}
          open={!!selectedProject}
          onOpenChange={() => setSelectedProject(null)}
        />
      )}
    </DndProvider>
  );
};

export default KanbanBoard;