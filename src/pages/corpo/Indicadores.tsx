import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, BarChart3, TrendingUp, Target } from "lucide-react";

const indicadores = [
  {
    title: "Pré-venda",
    value: "87%",
    trend: "+12%",
    description: "Visitas no Site",
    icon: TrendingUp,
    color: "success"
  },
  {
    title: "Venda",
    value: "24",
    trend: "+3",
    description: "Novos Pedidos",
    icon: Target,
    color: "primary"
  },
  {
    title: "Entrega",
    value: "92%",
    trend: "+8%",
    description: "Entregues no prazo",
    icon: BarChart3,
    color: "info"
  },
    {
    title: "Suporte",
    value: "92%",
    trend: "+8%",
    description: "Clima emocional",
    icon: BarChart3,
    color: "info"
  }
];

export default function Indicadores() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Indicadores</h1>
          </div>
          <div className="flex items-center gap-4">
            <Select defaultValue="2025">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="dezembro">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dezembro">Dezembro</SelectItem>
                <SelectItem value="novembro">Novembro</SelectItem>
                <SelectItem value="outubro">Outubro</SelectItem>
              </SelectContent>
            </Select>
            </div>
        </div>

        {/* Indicadores Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {indicadores.map((indicador, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {indicador.title}
                </CardTitle>
                <indicador.icon className={`h-4 w-4 ${
                  indicador.color === 'success' ? 'text-success' :
                  indicador.color === 'primary' ? 'text-primary' :
                  'text-info'
                }`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{indicador.value}</div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className={`font-medium ${
                    indicador.color === 'success' ? 'text-success' :
                    indicador.color === 'primary' ? 'text-primary' :
                    'text-info'
                  }`}>
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

        {/* Área vazia para futuras implementações */}
        <Card className="h-96">
          <CardContent className="h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto" />
              <div>
                <h3 className="text-lg font-medium">Gráficos de Indicadores</h3>
                <p className="text-muted-foreground">
                  Os gráficos detalhados dos indicadores serão exibidos aqui
                </p>
              </div>
              <Button variant="outline">
                Configurar Gráficos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}