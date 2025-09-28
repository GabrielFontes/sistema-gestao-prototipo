import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, BarChart3, TrendingUp, Target } from "lucide-react";

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