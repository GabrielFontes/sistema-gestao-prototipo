import { Layout } from "@/components/Layout";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";


const tarefas = [
  { id: 1, title: "🥇 Implementar autenticação", responsavel: "João Silva", concluida: false, iniciativa: "Sistema de Login", deadline: "2025-10-02" },
  { id: 2, title: "🥇 Migrar banco de dados", responsavel: "Maria Santos", concluida: true, iniciativa: "Infraestrutura", deadline: "2025-09-28" },
  { id: 3, title: "🥈 Criar tela de dashboard", responsavel: "Pedro Costa", concluida: false, iniciativa: "Interface Admin", deadline: "2025-10-05" },
  { id: 4, title: "🥈 Integrar API de pagamentos", responsavel: "Ana Oliveira", concluida: false, iniciativa: "E-commerce", deadline: "2025-10-08" },
  { id: 5, title: "🥉 Documentar APIs", responsavel: "Carlos Souza", concluida: false, deadline: "2025-10-10" },
  { id: 6, title: "🥉 Revisar código", responsavel: "Juliana Lima", concluida: true, deadline: "2025-09-29" },
];

const getPriorityFromEmoji = (title: string) => {
  if (title.includes("🥇")) return "ouro";
  if (title.includes("🥈")) return "prata";
  return "bronze";
};

export default function Tarefas() {
  const tasksByPriority = {
    ouro: tarefas.filter(t => getPriorityFromEmoji(t.title) === "ouro"),
    prata: tarefas.filter(t => getPriorityFromEmoji(t.title) === "prata"),
    bronze: tarefas.filter(t => getPriorityFromEmoji(t.title) === "bronze"),
  };

  return (
      <div className="space-y-6">
        <div>
        <h2 className="text-2xl font-bold mb-6">Tarefas</h2>
        </div>
  <Card className="h-[80vh] flex flex-col">
    <CardContent className="flex-1 p-0">
      <iframe
        src="https://www.appsheet.com/start/47848970-00d0-48a1-a44f-75f6344f48cc"
        className="w-full h-full border-none"
        style={{
          display: "block",
          transform: "scale(0.8)",
          transformOrigin: "0 0", // zoom a partir do canto superior esquerdo
          width: "125%", // compensar o zoom
          height: "125%" // compensar o zoom
        }}
        title="Planilha Indicadores"
      />
    </CardContent>
  </Card>

{/*        <div>
          <h2 className="text-2xl font-bold mb-6">Tarefas</h2>
*/}          
          {/* Tarefas Ouro */}
{/*          {tasksByPriority.ouro.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase">Prioridade Alta 🥇</h3>
              <div className="space-y-3">
                {tasksByPriority.ouro.map((task) => (
                  <Card key={task.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox checked={task.concluida} className="mt-1" />
                      <div className="flex-1 space-y-1">
                        <h4 className={`font-medium ${task.concluida ? "line-through text-muted-foreground" : ""}`}>
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>Responsável: {task.responsavel}</span>
                          <span>•</span>
                          <span>Prazo: {new Date(task.deadline).toLocaleDateString('pt-BR')}</span>
                        </div>
                        {task.iniciativa && (
                          <Badge variant="secondary" className="text-xs">
                            {task.iniciativa}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
*/}
          {/* Tarefas Prata */}
{/*          {tasksByPriority.prata.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase">Prioridade Média 🥈</h3>
              <div className="space-y-3">
                {tasksByPriority.prata.map((task) => (
                  <Card key={task.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox checked={task.concluida} className="mt-1" />
                      <div className="flex-1 space-y-1">
                        <h4 className={`font-medium ${task.concluida ? "line-through text-muted-foreground" : ""}`}>
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>Responsável: {task.responsavel}</span>
                          <span>•</span>
                          <span>Prazo: {new Date(task.deadline).toLocaleDateString('pt-BR')}</span>
                        </div>
                        {task.iniciativa && (
                          <Badge variant="secondary" className="text-xs">
                            {task.iniciativa}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Tarefas Bronze */}
{/*          {tasksByPriority.bronze.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase">Prioridade Baixa 🥉</h3>
              <div className="space-y-3">
                {tasksByPriority.bronze.map((task) => (
                  <Card key={task.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox checked={task.concluida} className="mt-1" />
                      <div className="flex-1 space-y-1">
                        <h4 className={`font-medium ${task.concluida ? "line-through text-muted-foreground" : ""}`}>
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>Responsável: {task.responsavel}</span>
                          <span>•</span>
                          <span>Prazo: {new Date(task.deadline).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
*/}
      </div>
  );
}
