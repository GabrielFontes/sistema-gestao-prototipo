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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projeções</h1>
      </div>

      {/* Card com o iframe da planilha */}
      <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center h-[74vh]">
                  <div className="flex-1 h-full border-none">
                  <iframe
            src="https://docs.google.com/spreadsheets/d/1_Xpqje95N1gof2Vo5cQzJAGutkyPqmH4ljBP0rED6Ik/edit?rm=minimal#gid=1755962898"
            className="w-full h-full border border-gray-300 rounded overflow-hidden"
              style={{
              display: "block",
              transform: "scale(0.8)",
              transformOrigin: "0 0", // garante que o zoom saia do canto superior esquerdo
              width: "125%", // compensa o zoom
              height: "125%" // compensa o zoom
            }}
            title="Planilha de Movimentações"
          />
                  </div>
                </div>
              </CardContent>
            </Card>
    </div>
  );
}