import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Alma - Área Pessoal</h1>
            <p className="text-muted-foreground">Gerencie suas notas pessoais e tarefas</p>
          </div>
        </div>

        {/* Tabs para Notas e To-do */}
        <Tabs defaultValue="notas" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notas" className="flex items-center gap-2">
              <StickyNote className="w-4 h-4" />
              Notas
            </TabsTrigger>
            <TabsTrigger value="todo" className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4" />
              To Do
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notas" className="space-y-6">
            {/* Nova Nota */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Nova Nota
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Título da nota..."
                  value={novaNotaTitulo}
                  onChange={(e) => setNovaNotaTitulo(e.target.value)}
                />
                <Textarea
                  placeholder="Conteúdo da nota..."
                  rows={4}
                  value={novaNotaConteudo}
                  onChange={(e) => setNovaNotaConteudo(e.target.value)}
                />
                <Button className="bg-primary hover:bg-primary-dark">
                  Salvar Nota
                </Button>
              </CardContent>
            </Card>

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
          </TabsContent>

          <TabsContent value="todo" className="space-y-6">
            {/* Nova Tarefa */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Nova Tarefa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Nova tarefa..."
                    value={novoTodo}
                    onChange={(e) => setNovoTodo(e.target.value)}
                    className="flex-1"
                  />
                  <Button className="bg-primary hover:bg-primary-dark">
                    Adicionar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Lista de To-dos */}
            <Card>
              <CardHeader>
                <CardTitle>Minhas Tarefas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      todo.concluido ? 'bg-muted/50' : 'bg-card'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={todo.concluido}
                        className="w-4 h-4"
                        readOnly
                      />
                      <span className={todo.concluido ? 'line-through text-muted-foreground' : ''}>
                        {todo.titulo}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPrioridadeColor(todo.prioridade)}>
                        {todo.prioridade}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {todo.prazo}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}