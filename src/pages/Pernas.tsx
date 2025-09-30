import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { ProjectKanbanDialog } from "@/components/ProjectKanbanDialog";
import { ProcessChecklistDialog } from "@/components/ProcessChecklistDialog";

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

const sprintTasks = [
  { id: 1, title: "🥇 Implementar autenticação", responsavel: "João Silva", concluida: false, iniciativa: "Sistema de Login" },
  { id: 2, title: "🥇 Migrar banco de dados", responsavel: "Maria Santos", concluida: true, iniciativa: "Infraestrutura" },
  { id: 3, title: "🥈 Criar tela de dashboard", responsavel: "Pedro Costa", concluida: false, iniciativa: "Interface Admin" },
  { id: 4, title: "🥈 Integrar API de pagamentos", responsavel: "Ana Oliveira", concluida: false, iniciativa: "E-commerce" },
  { id: 5, title: "🥉 Documentar APIs", responsavel: "Carlos Souza", concluida: false },
  { id: 6, title: "🥉 Revisar código", responsavel: "Juliana Lima", concluida: true },
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

export default function Pernas() {
  const [selectedProject, setSelectedProject] = useState<{ title: string } | null>(null);
  const [selectedProcess, setSelectedProcess] = useState<{ title: string } | null>(null);
  
  const tasksByPriority = {
    ouro: sprintTasks.filter(t => getPriorityFromEmoji(t.title) === "ouro"),
    prata: sprintTasks.filter(t => getPriorityFromEmoji(t.title) === "prata"),
    bronze: sprintTasks.filter(t => getPriorityFromEmoji(t.title) === "bronze"),
  };

  return (
    <Layout>
      <div className="space-y-6">
        <Tabs defaultValue="projetos" className="w-full">
          <div className="flex justify-center">
            <TabsList className="flex max-w-4xl justify-between">
              <TabsTrigger
                value="projetos"
                className="w-32 text-center px-4 py-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Projetos
              </TabsTrigger>
              <TabsTrigger
                value="operacoes"
                className="w-32 text-center px-4 py-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Operações
              </TabsTrigger>
              <TabsTrigger
                value="sprint"
                className="w-32 text-center px-4 py-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Sprint
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Sprint Atual */}
          <TabsContent value="sprint" className="mt-6">
            <div className="space-y-6">
              {/* Tarefas Ouro */}
              {tasksByPriority.ouro.length > 0 && (
                <div>
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
                            <p className="text-sm text-muted-foreground">Responsável: {task.responsavel}</p>
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

              {/* Tarefas Prata */}
              {tasksByPriority.prata.length > 0 && (
                <div>
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
                            <p className="text-sm text-muted-foreground">Responsável: {task.responsavel}</p>
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
              {tasksByPriority.bronze.length > 0 && (
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
                            <p className="text-sm text-muted-foreground">Responsável: {task.responsavel}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Conteúdo Projetos */}
          <TabsContent value="projetos" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {kanbanColumns.map((column, columnIndex) => (
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
                        onClick={() => setSelectedProject({ title: item.title })}
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

          {/* Conteúdo Operações */}
          <TabsContent value="operacoes" className="mt-6">
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
        </Tabs>
      </div>

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
    </Layout>
  );
}
