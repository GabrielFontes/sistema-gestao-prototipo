import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface ProcessChecklistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  processTitle: string;
}

const processTasks = {
  inicio: [
    { id: 1, title: "Abrir chamado no sistema", concluida: false },
    { id: 2, title: "Coletar informações iniciais", concluida: false },
    { id: 3, title: "Classificar prioridade", concluida: false },
  ],
  meio: [
    { id: 4, title: "Analisar problema", concluida: false },
    { id: 5, title: "Propor solução", concluida: false },
    { id: 6, title: "Implementar correção", concluida: false },
    { id: 7, title: "Testar solução", concluida: false },
  ],
  fim: [
    { id: 8, title: "Validar com usuário", concluida: false },
    { id: 9, title: "Documentar solução", concluida: false },
    { id: 10, title: "Fechar chamado", concluida: false },
  ],
};

export function ProcessChecklistDialog({ open, onOpenChange, processTitle }: ProcessChecklistDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{processTitle}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* Início */}
          <div>
            <h3 className="font-semibold mb-3 text-primary">Início</h3>
            <Card className="p-4">
              <div className="space-y-3">
                {processTasks.inicio.map((task) => (
                  <div key={task.id} className="flex items-start gap-3">
                    <Checkbox checked={task.concluida} className="mt-1" />
                    <span className={`text-sm ${task.concluida ? "line-through text-muted-foreground" : ""}`}>
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Meio */}
          <div>
            <h3 className="font-semibold mb-3 text-primary">Meio</h3>
            <Card className="p-4">
              <div className="space-y-3">
                {processTasks.meio.map((task) => (
                  <div key={task.id} className="flex items-start gap-3">
                    <Checkbox checked={task.concluida} className="mt-1" />
                    <span className={`text-sm ${task.concluida ? "line-through text-muted-foreground" : ""}`}>
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Fim */}
          <div>
            <h3 className="font-semibold mb-3 text-primary">Fim</h3>
            <Card className="p-4">
              <div className="space-y-3">
                {processTasks.fim.map((task) => (
                  <div key={task.id} className="flex items-start gap-3">
                    <Checkbox checked={task.concluida} className="mt-1" />
                    <span className={`text-sm ${task.concluida ? "line-through text-muted-foreground" : ""}`}>
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
