import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit2, RefreshCw, TrendingUp, Target, BarChart3 } from "lucide-react";

const indicadores = [
  {
    title: "Pré-venda",
    value: "87%",
    trend: "+12%",
    description: "Visitas no Site",
    icon: TrendingUp,
    color: "success",
  },
  {
    title: "Venda",
    value: "24",
    trend: "+3",
    description: "Novos Pedidos",
    icon: Target,
    color: "primary",
  },
  {
    title: "Entrega",
    value: "92%",
    trend: "+8%",
    description: "Entregues no prazo",
    icon: BarChart3,
    color: "info",
  },
  {
    title: "Suporte",
    value: "92%",
    trend: "+8%",
    description: "Clima emocional",
    icon: BarChart3,
    color: "info",
  },
];

export default function Corpo() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Corpo</h1>
          </div>
          <div className="flex items-center gap-4">
            <Select defaultValue="2025">
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="dezembro">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[
                  "janeiro",
                  "fevereiro",
                  "março",
                  "abril",
                  "maio",
                  "junho",
                  "julho",
                  "agosto",
                  "setembro",
                  "outubro",
                  "novembro",
                  "dezembro",
                ].map((mes) => (
                  <SelectItem key={mes} value={mes}>
                    {mes.charAt(0).toUpperCase() + mes.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Indicadores Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-4">
          {indicadores.map((indicador, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {indicador.title}
                </CardTitle>
                <indicador.icon
                  className={`h-4 w-4 ${
                    indicador.color === "success"
                      ? "text-success"
                      : indicador.color === "primary"
                      ? "text-primary"
                      : "text-info"
                  }`}
                />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{indicador.value}</div>
                <div className="flex items-center space-x-2 text-sm">
                  <span
                    className={`font-medium ${
                      indicador.color === "success"
                        ? "text-success"
                        : indicador.color === "primary"
                        ? "text-primary"
                        : "text-info"
                    }`}
                  >
                    {indicador.trend}
                  </span>
                  <span className="text-muted-foreground">
                    {indicador.description}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Card com Tabs e Iframes */}
        <Card>
          <Tabs defaultValue="organograma" className="w-full">
            <CardHeader>
              <TabsList className="grid w-96 grid-cols-2 mx-auto">
                <TabsTrigger
                  value="organograma"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Organograma
                </TabsTrigger>
                <TabsTrigger
                  value="fluxos"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Ferramentas
                </TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent className="p-8">
            <TabsContent value="organograma" className="mt-2">
  <div className="flex items-center justify-center h-[80vh]">
    {/* Botões */}
    <div className="flex flex-col gap-4 mr-4">
      <button
        className="p-2 rounded-full bg-primary text-white hover:bg-primary/90"
        onClick={() =>
          window.open(
            "https://lucid.app/lucidchart/50322aeb-a5b2-4d2c-b318-16716b12ca2f/edit?from_internal=true",
            "Editar Ferramentas",
            "width=1200,height=800"
          )
        }
      >
        <Edit2 size={20} />
      </button>
      <button
        className="p-2 rounded-full bg-primary text-white hover:bg-primary/90"
        onClick={() => console.log("Sincronizar clicado")}
      >
        <RefreshCw size={20} />
      </button>
    </div>

    {/* Container com borda */}
    <div className="flex-1 h-full border border-gray-300 rounded overflow-hidden">
      <iframe
        allowFullScreen
        className="w-full h-full"
        src="https://lucid.app/documents/embedded/07ee9e3f-c79f-449a-b47f-06b88c8993e8"
      ></iframe>
    </div>
  </div>
</TabsContent>

<TabsContent value="fluxos" className="mt-2">
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
      <button
        className="p-2 rounded-full bg-primary text-white hover:bg-primary/90"
        onClick={() => console.log("Sincronizar clicado")}
      >
        <RefreshCw size={20} />
      </button>
    </div>

    {/* Container com borda */}
    <div className="flex-1 h-full border border-gray-300 rounded overflow-hidden">
      <iframe
        allowFullScreen
        className="w-full h-full"
        src="https://lucid.app/documents/embedded/50322aeb-a5b2-4d2c-b318-16716b12ca2f"
      ></iframe>
    </div>
  </div>
</TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </Layout>
  );
}
