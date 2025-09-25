import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

const kanbanColumns = [
  {
    title: "A Fazer",
    items: [
      { id: 1, title: "Implementar sistema de login", priority: "alta" },
      { id: 2, title: "Criar dashboard financeiro", priority: "media" },
      { id: 3, title: "Desenvolver relatórios", priority: "baixa" },
    ]
  },
  {
    title: "Em andamento", 
    items: [
      { id: 4, title: "Otimizar performance do banco", priority: "alta" },
      { id: 5, title: "Integração com API externa", priority: "media" },
    ]
  },
  {
    title: "Concluído",
    items: [
      { id: 6, title: "Setup inicial do projeto", priority: "alta" },
      { id: 7, title: "Configuração do ambiente", priority: "media" },
      { id: 8, title: "Design do sistema", priority: "baixa" },
    ]
  }
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'alta':
      return 'bg-destructive text-destructive-foreground';
    case 'media':
      return 'bg-warning text-warning-foreground';
    case 'baixa':
      return 'bg-success text-success-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export default function Projetos() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Projetos | Operação</h1>
            <p className="text-muted-foreground">Gerencie projetos e operações da empresa</p>
          </div>
          <Button className="bg-primary hover:bg-primary-dark">
            <Plus className="w-4 h-4 mr-2" />
            Novo Projeto
          </Button>
        </div>

        {/* Kanban Board */}
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
                  <Card key={item.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
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
      </div>
    </Layout>
  );
}