import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProjectKanbanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectTitle: string;
}

const projectTasks = {
  milestone1: [
    { id: 1, title: "Setup inicial", priority: "alta", responsavel: "João Silva" },
    { id: 2, title: "Configurar ambiente", priority: "media", responsavel: "Maria Santos" },
  ],
  milestone2: [
    { id: 3, title: "Desenvolver funcionalidade A", priority: "alta", responsavel: "Pedro Costa" },
    { id: 4, title: "Integrar API", priority: "media", responsavel: "Ana Oliveira" },
    { id: 5, title: "Testes unitários", priority: "baixa", responsavel: "Carlos Souza" },
  ],
  milestone3: [
    { id: 6, title: "Deploy em produção", priority: "alta", responsavel: "João Silva" },
    { id: 7, title: "Documentação final", priority: "media", responsavel: "Juliana Lima" },
  ],
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "alta":
      return "bg-destructive text-destructive-foreground";
    case "media":
      return "bg-warning text-warning-foreground";
    case "baixa":
      return "bg-success text-success-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export function ProjectKanbanDialog({ open, onOpenChange, projectTitle }: ProjectKanbanDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{projectTitle}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* Milestone 1 */}
          <div>
            <h3 className="font-semibold mb-3 text-primary">Milestone 1</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {projectTasks.milestone1.map((task) => (
                <Card key={task.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">{task.title}</h4>
                    <p className="text-xs text-muted-foreground">{task.responsavel}</p>
                    <Badge className={getPriorityColor(task.priority)} variant="secondary">
                      {task.priority}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Milestone 2 */}
          <div>
            <h3 className="font-semibold mb-3 text-primary">Milestone 2</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {projectTasks.milestone2.map((task) => (
                <Card key={task.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">{task.title}</h4>
                    <p className="text-xs text-muted-foreground">{task.responsavel}</p>
                    <Badge className={getPriorityColor(task.priority)} variant="secondary">
                      {task.priority}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Milestone 3 */}
          <div>
            <h3 className="font-semibold mb-3 text-primary">Milestone 3</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {projectTasks.milestone3.map((task) => (
                <Card key={task.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">{task.title}</h4>
                    <p className="text-xs text-muted-foreground">{task.responsavel}</p>
                    <Badge className={getPriorityColor(task.priority)} variant="secondary">
                      {task.priority}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
