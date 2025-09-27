import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function DRE() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">DRE</h1>
          </div>
          <div className="flex items-center gap-4">
            <Select defaultValue="trimestre">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trimestre">Trimestre</SelectItem>
                <SelectItem value="mensal">Mensal</SelectItem>
                <SelectItem value="anual">Anual</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="2025">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="q1">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="q1">Jan - Mar</SelectItem>
                <SelectItem value="q2">Abr - Jun</SelectItem>
                <SelectItem value="q3">Jul - Set</SelectItem>
                <SelectItem value="q4">Out - Dez</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="fluxo-caixa">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fluxo-caixa">Fluxo de caixa</SelectItem>
                <SelectItem value="competencia">Competência</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabela DRE */}
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Categoria</TableHead>
                  <TableHead className="text-center">%</TableHead>
                  <TableHead className="text-center">Janeiro</TableHead>
                  <TableHead className="text-center">Fevereiro</TableHead>
                  <TableHead className="text-center">Março</TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead className="text-center">Realizado</TableHead>
                  <TableHead className="text-center">Previsto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="bg-muted/50">
                  <TableCell className="font-semibold">RECEITA BRUTA</TableCell>
                  <TableCell className="text-center">100%</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-8">Vendas de Produtos</TableCell>
                  <TableCell className="text-center">85%</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-8">Prestação de Serviços</TableCell>
                  <TableCell className="text-center">15%</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                </TableRow>
                <TableRow className="bg-muted/50">
                  <TableCell className="font-semibold">(-) DEDUÇÕES</TableCell>
                  <TableCell className="text-center">12%</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-8">Impostos sobre Vendas</TableCell>
                  <TableCell className="text-center">8%</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-8">Devoluções</TableCell>
                  <TableCell className="text-center">2%</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                </TableRow>
                <TableRow className="bg-success/10 font-semibold">
                  <TableCell>RECEITA LÍQUIDA</TableCell>
                  <TableCell className="text-center">88%</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
