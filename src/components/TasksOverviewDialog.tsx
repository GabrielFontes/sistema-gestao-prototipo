import { useState } from "react";
import { CheckSquare, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface Task {
  id: string;
  name: string;
  priority: "gold" | "silver" | "bronze";
  deadline: Date;
  responsible: string;
  initiative?: string;
  completed: boolean;
}

// Mock data
const mockTasks: Task[] = [
  {
    id: "1",
    name: "🥇 Finalizar apresentação para cliente",
    priority: "gold",
    deadline: new Date(),
    responsible: "João Silva",
    initiative: "Projeto Alpha",
    completed: false,
  },
  {
    id: "2",
    name: "🥈 Revisar código da feature X",
    priority: "silver",
    deadline: new Date(),
    responsible: "Maria Santos",
    initiative: "Projeto Beta",
    completed: false,
  },
  {
    id: "3",
    name: "🥉 Atualizar documentação",
    priority: "bronze",
    deadline: new Date(),
    responsible: "Pedro Costa",
    completed: true,
  },
  {
    id: "4",
    name: "🥇 Reunião com stakeholders",
    priority: "gold",
    deadline: new Date(Date.now() + 86400000),
    responsible: "Ana Lima",
    initiative: "Projeto Gamma",
    completed: false,
  },
  {
    id: "5",
    name: "🥈 Implementar testes unitários",
    priority: "silver",
    deadline: new Date(Date.now() + 86400000 * 2),
    responsible: "Carlos Mendes",
    initiative: "Projeto Delta",
    completed: false,
  },
  {
    id: "6",
    name: "🥉 Organizar arquivos do servidor",
    priority: "bronze",
    deadline: new Date(Date.now() + 86400000 * 3),
    responsible: "Lucia Ferreira",
    completed: false,
  },
];

interface TasksOverviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TasksOverviewDialog({ open, onOpenChange }: TasksOverviewDialogProps) {
  const [view, setView] = useState<"today" | "week">("today");
  const [tasks, setTasks] = useState(mockTasks);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const filterTasks = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekEnd = new Date(today.getTime() + 7 * 86400000);

    return tasks.filter(task => {
      if (view === "today") {
        return task.deadline >= today && task.deadline < new Date(today.getTime() + 86400000);
      }
      return task.deadline >= today && task.deadline < weekEnd;
    });
  };

  const groupByPriority = () => {
    const filtered = filterTasks();
    const priorityOrder = { gold: 0, silver: 1, bronze: 2 };
    
    const sorted = filtered.sort((a, b) => {
      if (a.priority !== b.priority) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return a.deadline.getTime() - b.deadline.getTime();
    });

    const grouped = {
      gold: sorted.filter(t => t.priority === "gold"),
      silver: sorted.filter(t => t.priority === "silver"),
      bronze: sorted.filter(t => t.priority === "bronze"),
    };

    return grouped;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  };

  const grouped = groupByPriority();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Minhas Tarefas
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              variant={view === "today" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("today")}
            >
              Hoje
            </Button>
            <Button
              variant={view === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("week")}
            >
              Semana
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {grouped.gold.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3 text-yellow-600 dark:text-yellow-500">
                🥇 Prioridade Alta
              </h3>
              <div className="space-y-3">
                {grouped.gold.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
                  >
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-1">
                      <p className={`text-sm font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                        {task.name}
                      </p>
                      {task.initiative && (
                        <Badge variant="secondary" className="text-xs">
                          {task.initiative}
                        </Badge>
                      )}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{task.responsible}</span>
                        <span>•</span>
                        <span>{formatDate(task.deadline)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {(grouped.silver.length > 0 || grouped.bronze.length > 0) && (
                <Separator className="my-4" />
              )}
            </div>
          )}

          {grouped.silver.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3 text-gray-500 dark:text-gray-400">
                🥈 Prioridade Média
              </h3>
              <div className="space-y-3">
                {grouped.silver.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
                  >
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-1">
                      <p className={`text-sm font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                        {task.name}
                      </p>
                      {task.initiative && (
                        <Badge variant="secondary" className="text-xs">
                          {task.initiative}
                        </Badge>
                      )}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{task.responsible}</span>
                        <span>•</span>
                        <span>{formatDate(task.deadline)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {grouped.bronze.length > 0 && <Separator className="my-4" />}
            </div>
          )}

          {grouped.bronze.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3 text-orange-600 dark:text-orange-500">
                🥉 Prioridade Baixa
              </h3>
              <div className="space-y-3">
                {grouped.bronze.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
                  >
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-1">
                      <p className={`text-sm font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                        {task.name}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{task.responsible}</span>
                        <span>•</span>
                        <span>{formatDate(task.deadline)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {grouped.gold.length === 0 && grouped.silver.length === 0 && grouped.bronze.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma tarefa encontrada para {view === "today" ? "hoje" : "esta semana"}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
