import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3 } from "lucide-react";

export default function Mente() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Balanço do mês</h1>
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
                <SelectItem value="janeiro">Janeiro</SelectItem>
                <SelectItem value="fevereiro">Fevereiro</SelectItem>
                <SelectItem value="março">Março</SelectItem>
                <SelectItem value="abril">Abril</SelectItem>
                <SelectItem value="maio">Maio</SelectItem>
                <SelectItem value="junho">Junho</SelectItem>
                <SelectItem value="julho">Julho</SelectItem>
                <SelectItem value="agosto">Agosto</SelectItem>
                <SelectItem value="setembro">Setembro</SelectItem>
                <SelectItem value="outubro">Outubro</SelectItem>
                <SelectItem value="novembro">Novembro</SelectItem>
                <SelectItem value="dezembro">Dezembro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Gráfico principal */}
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center h-64 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/25 mb-4">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="w-12 h-12 mx-auto mb-4" />
                <p>Algum gráfico com todos os meses do ano</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gráficos de despesas e receitas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-lg">Gráfico de despesas só do mês atual (barras)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-48 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/25">
                <div className="text-center text-muted-foreground">
                  <BarChart3 className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Gráfico de Despesas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center text-lg">Gráfico de receitas só do mês atual (barras)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-48 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/25">
                <div className="text-center text-muted-foreground">
                  <BarChart3 className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Gráfico de Receitas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}