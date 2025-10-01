import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Plus, StickyNote, CheckSquare, Clock } from "lucide-react";
import { useState } from "react";

const notas = [
  {
    id: 1,
    titulo: "Reunião com cliente XPTO",
    conteudo: "Discutir proposta de mapeamento de processos. Cliente interessado em implementação até março.",
    data: "24/09/2025",
    categoria: "cliente"
  },
  {
    id: 2,
    titulo: "Ideias para melhorias",
    conteudo: "Implementar dashboard com métricas em tempo real. Criar sistema de notificações automáticas.",
    data: "23/09/2025",
    categoria: "desenvolvimento"
  }
];

const todos = [
  {
    id: 1,
    titulo: "Finalizar relatório mensal",
    concluido: false,
    prioridade: "alta",
    prazo: "25/09/2025"
  },
  {
    id: 2,
    titulo: "Agendar reunião de equipe",
    concluido: true,
    prioridade: "media",
    prazo: "24/09/2025"
  },
  {
    id: 3,
    titulo: "Revisar documentação",
    concluido: false,
    prioridade: "baixa",
    prazo: "30/09/2025"
  }
];

export default function App() {
  const [novaNotaTitulo, setNovaNotaTitulo] = useState("");
  const [novaNotaConteudo, setNovaNotaConteudo] = useState("");
  const [novoTodo, setNovoTodo] = useState("");

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
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

  return (
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Notas</h1>
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
            {/* Lista de Notas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notas.map((nota) => (
                <Card key={nota.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{nota.titulo}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {nota.data}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {nota.conteudo}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {nota.categoria}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

      </div>
  );
}