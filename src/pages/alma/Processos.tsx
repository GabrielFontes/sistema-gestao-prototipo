import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { ProjectKanbanDialog } from "@/components/ProjectKanbanDialog";
import { ProcessChecklistDialog } from "@/components/ProcessChecklistDialog";
import { ProjectsList } from "@/components/ProjectsList";

const operacoesColumns = [
  {
    title: "Pendentes",
    items: [
      { id: 101, title: "Auditar logs do sistema", priority: "alta" },
      { id: 102, title: "Verificar falhas no backup", priority: "media" },
    ],
  },
  {
    title: "Em Andamento",
    items: [
      { id: 103, title: "Atualizar servidores", priority: "alta" },
      { id: 104, title: "Monitorar tráfego de rede", priority: "media" },
      { id: 105, title: "Ajustar configuração de firewall", priority: "baixa" },
    ],
  },
  {
    title: "Finalizadas",
    items: [
      { id: 106, title: "Migração para nova versão", priority: "alta" },
      { id: 107, title: "Teste de recuperação de desastres", priority: "media" },
    ],
  },
];

const kanbanColumns = [
  {
    title: "A Fazer",
    items: [
      { id: 1, title: "Implementar sistema de login", priority: "alta" },
      { id: 2, title: "Criar dashboard financeiro", priority: "media" },
      { id: 3, title: "Desenvolver relatórios", priority: "baixa" },
    ],
  },
  {
    title: "Em andamento",
    items: [
      { id: 4, title: "Otimizar performance do banco", priority: "alta" },
      { id: 5, title: "Integração com API externa", priority: "media" },
    ],
  },
  {
    title: "Concluído",
    items: [
      { id: 6, title: "Setup inicial do projeto", priority: "alta" },
      { id: 7, title: "Configuração do ambiente", priority: "media" },
      { id: 8, title: "Design do sistema", priority: "baixa" },
    ],
  },
];


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

const getPriorityFromEmoji = (title: string) => {
  if (title.includes("🥇")) return "ouro";
  if (title.includes("🥈")) return "prata";
  return "bronze";
};

export default function Processos() {
  const [selectedProject, setSelectedProject] = useState<{ title: string } | null>(null);
  const [selectedProcess, setSelectedProcess] = useState<{ title: string } | null>(null);
  
  return (
    <div className="space-y-6">
        <div>
        <h2 className="text-2xl font-bold mb-6">Processos</h2>
        </div>


          {/* Conteúdo Operações */}
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
{/*          <TabsContent value="operacoes" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {operacoesColumns.map((column, columnIndex) => (
                <Card key={columnIndex} className="h-fit">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center justify-between">
                      <span>{column.title}</span>
                      <Badge variant="secondary" className="text-xs">
                        {column.items.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {column.items.map((item) => (
                      <Card
                        key={item.id}
                        className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedProcess({ title: item.title })}
                      >
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">{item.title}</h4>
                          <Badge className={getPriorityColor(item.priority)}>
                            {item.priority}
                          </Badge>
                        </div>
                      </Card>
                    ))}
                    <Button
                      variant="ghost"
                      className="w-full border-2 border-dashed border-muted-foreground/25 h-12 hover:border-primary hover:bg-primary/5"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Item
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
*/}

        {/* Dialogs */}

        <ProjectKanbanDialog
          open={selectedProject !== null}
          onOpenChange={(open) => !open && setSelectedProject(null)}
          projectTitle={selectedProject?.title || ""}
        />
        <ProcessChecklistDialog
          open={selectedProcess !== null}
          onOpenChange={(open) => !open && setSelectedProcess(null)}
          processTitle={selectedProcess?.title || ""}
        />
      </div>
  );
}
