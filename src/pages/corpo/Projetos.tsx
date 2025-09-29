import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Plus } from "lucide-react";

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

export default function Projetos() {
  return (
    <Layout>
      <div className="space-y-6">
{/* Tabs principais */}
<Tabs defaultValue="fluxos" className="w-full">
  <div className="flex justify-center">
    <TabsList className="flex w-full max-w-4xl justify-between">
      <TabsTrigger
        value="fluxos"
        className="flex-1 text-center px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
      >
        Fluxos
      </TabsTrigger>
      <TabsTrigger
        value="projetos"
        className="flex-1 text-center px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
      >
        Projetos
      </TabsTrigger>
      <TabsTrigger
        value="operacoes"
        className="flex-1 text-center px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
      >
        Operações
      </TabsTrigger>
      <TabsTrigger
        value="ferramentas"
        className="flex-1 text-center px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
      >
        Ferramentas
      </TabsTrigger>
    </TabsList>
  </div>


          {/* Conteúdo Fluxos */}
          <TabsContent value="fluxos" className="mt-6 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center h-[80vh]">
                <div className="flex flex-col gap-4 mr-4">
                  <button
                    className="p-2 rounded-full bg-primary text-white hover:bg-primary/90"
                    onClick={() => window.open( "https://lucid.app/lucidchart/50322aeb-a5b2-4d2c-b318-16716b12ca2f/edit?from_internal=true", "Editar Fluxo", "width=1200,height=800" ) } >
                      <Edit2 size={20} />
                  </button>
                </div>
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


          {/* Conteúdo Ferramentas */}
          <TabsContent value="ferramentas" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center h-[80vh]">
                <div className="flex flex-col gap-4 mr-4">
                  <button
                    className="p-2 rounded-full bg-primary text-white hover:bg-primary/90"
                    onClick={() =>
                      window.open(
                        "https://lucid.app/lucidchart/9d169a22-6311-4957-a966-157242da30f9/edit?viewport_loc=-11%2C-11%2C1479%2C591%2C0_0&invitationId=inv_9d655e5e-7c20-4db5-8aae-43f791f76a8c",
                        "Editar Ferramentas",
                        "width=1200,height=800"
                      )
                    }
                  >
                    <Edit2 size={20} />
                  </button>
                </div>
                  <div className="flex-1 h-full border border-gray-300 rounded overflow-hidden">
                    <iframe
                      allowFullScreen
                      className="w-full h-full"
                      src="https://lucid.app/documents/embedded/9d169a22-6311-4957-a966-157242da30f9"
                    ></iframe>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
