import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, Wallet, TrendingUp, TrendingDown } from "lucide-react";

export default function Mente() {
  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Mente</h1>
          </div>
        </div>

{/* Resumo Financeiro */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <Card className="border border-gray-300 rounded-lg hover:shadow-lg transition-shadow bg-primary/5">
    <CardContent className="p-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <Wallet className="h-8 w-8 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Balanço de Dezembro</p>
          <p className="text-2xl font-bold text-primary">R$ 14.481,77</p>
          <div className="text-sm text-muted-foreground space-y-1 mt-2">
            <div>Investido: <span className="text-foreground">R$ 5.150,77</span></div>
            <div>Caixa: <span className="text-info font-medium">R$ 9.331,77</span></div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>

  <Card className="border border-gray-300 rounded-lg hover:shadow-lg transition-shadow bg-success/5">
    <CardContent className="p-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-success/10 rounded-lg">
          <TrendingUp className="h-8 w-8 text-success" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Total de Receitas</p>
          <p className="text-2xl font-bold text-success">R$ 14.481,77</p>
          <p className="text-sm text-muted-foreground mt-2">
            Receitas Previstas: <span className="text-success">R$ 9.331,77</span>
          </p>
        </div>
      </div>
    </CardContent>
  </Card>

  <Card className="border border-gray-300 rounded-lg hover:shadow-lg transition-shadow bg-destructive/5">
    <CardContent className="p-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-destructive/10 rounded-lg">
          <TrendingDown className="h-8 w-8 text-destructive" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Total de Despesas</p>
          <p className="text-2xl font-bold text-destructive">R$ 14.481,77</p>
          <p className="text-sm text-muted-foreground mt-2">
            Despesas Previstas: <span className="text-destructive">R$ 9.331,77</span>
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
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
  );
}