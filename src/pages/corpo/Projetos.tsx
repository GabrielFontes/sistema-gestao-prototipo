import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Plus, RefreshCw, TrendingUp, Target, BarChart3 } from "lucide-react";


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
        {/* Tabs */}
        <Tabs defaultValue="fluxos" className="w-full">
          <div className="flex justify-center">
            <TabsList className="grid w-96 grid-cols-3">
              <TabsTrigger value="fluxos" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Fluxos
              </TabsTrigger>
              <TabsTrigger value="projetos" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Projetos
              </TabsTrigger>
              <TabsTrigger value="operacoes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Operações
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Conteúdo do Projetos */}
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
          </TabsContent>

          <CardContent className="p-8">
  <TabsContent value="fluxos" className="mt-2">
    <div className="flex flex-col gap-6">

      {/* Card com Lucid */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-[80vh]">
            {/* Botões */}
            <div className="flex flex-col gap-4 mr-4">
              <button
                className="p-2 rounded-full bg-primary text-white hover:bg-primary/90"
                onClick={() =>
                  window.open(
                    "https://lucid.app/lucidchart/50322aeb-a5b2-4d2c-b318-16716b12ca2f/edit?from_internal=true",
                    "Editar Fluxo",
                    "width=1200,height=800"
                  )
                }
              >
                <Edit2 size={20} />
              </button>
            </div>

            {/* Container do Lucid */}
            <div className="flex-1 h-full border border-gray-300 rounded overflow-hidden">
              <iframe
                allowFullScreen
                className="w-full h-full"
                src="https://lucid.app/documents/embedded/50322aeb-a5b2-4d2c-b318-16716b12ca2f"
              ></iframe>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card com Google Drive */}
      <Card>
        <CardContent className="p-6">
          <div className="w-full h-[600px]">
            <iframe
              src="https://drive.google.com/embeddedfolderview?id=1G4InfgMuQLN4Gv-P3Cp0SQpAb-tD6f7W#grid"
              style={{ width: "100%", height: "100%", border: "0" }}
              allowFullScreen
            ></iframe>
          </div>
        </CardContent>
      </Card>

    </div>
  </TabsContent>
</CardContent>


        </Tabs> {/* <-- FECHAMENTO correto do Tabs */}
      </div> {/* <-- FECHAMENTO do space-y-6 */}
    </Layout>
  );
}
