import { Layout } from "@/components/Layout";
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, TrendingDown, Wallet } from "lucide-react";

const movimentacoes = [
  {
    data: "24/09/2025",
    referente: "Agosto",
    valor: "R$ 500,00",
    nome: "Compra de água para escritório",
    categoria: "Despesa administrativa",
    tipo: "despesa"
  },
  {
    data: "24/09/2025",
    referente: "Agosto", 
    valor: "R$ 500,00",
    nome: "Cliente XPTO",
    categoria: "Mapeamento de Processos",
    tipo: "receita"
  },
  {
    data: "24/09/2025",
    referente: "Agosto",
    valor: "R$ 500,00", 
    nome: "Compra de água para escritório",
    categoria: "Despesa administrativa",
    tipo: "despesa"
  },
];

export default function Movimentacoes() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Movimentações</h1>
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
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Resumo Financeiro */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Wallet className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Balanço do período</p>
                  <p className="text-2xl font-bold text-primary">R$ 14.481,77</p>
                  <div className="text-sm text-muted-foreground space-y-1 mt-2">
                    <div>Investido: <span className="text-foreground">R$ 5.150,77</span></div>
                    <div>Caixa: <span className="text-info font-medium">R$ 9.331,77</span></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-success/20 bg-success/5">
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

          <Card className="border-2 border-destructive/20 bg-destructive/5">
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

        {/* Tabela de Movimentações */}
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Referente a</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movimentacoes.map((mov, index) => (
                  <TableRow key={index}>
                    <TableCell>{mov.data}</TableCell>
                    <TableCell>
                      <Select defaultValue={mov.referente.toLowerCase()}>
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="agosto">Agosto</SelectItem>
                          <SelectItem value="setembro">Setembro</SelectItem>
                          <SelectItem value="outubro">Outubro</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="font-medium">{mov.valor}</TableCell>
                    <TableCell>{mov.nome}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={mov.tipo === 'receita' ? 'default' : 'secondary'}
                        className={mov.tipo === 'receita' ? 
                          'bg-success text-success-foreground' : 
                          'bg-warning text-warning-foreground'
                        }
                      >
                        {mov.categoria}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}