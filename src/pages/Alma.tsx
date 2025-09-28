import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CircularProgress } from "@/components/CircularProgress";

const colaboradores = [
  { nome: "João Silva", produtividade: 89, horas: "5h 35min", color: "success" },
  { nome: "Maria Santos", produtividade: 78, horas: "5h 35min", color: "warning" },
  { nome: "Pedro Costa", produtividade: 46, horas: "5h 35min", color: "info" },
  { nome: "Ana Lima", produtividade: 45, horas: "5h 35min", color: "info" },
  { nome: "Carlos Rocha", produtividade: 46, horas: "5h 35min", color: "info" },
  { nome: "Lucas Alves", produtividade: 46, horas: "5h 35min", color: "info" },
];

export default function Alma() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Alma</h1>
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

        {/* Métricas principais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
  <Card className="flex flex-col h-full border border-gray-300 rounded-lg hover:shadow-lg transition-shadow">
    <CardHeader className="text-center pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">Produtividade</CardTitle>
    </CardHeader>
    <CardContent className="flex justify-center items-center">
      <CircularProgress value={89} size="lg" color="success" />
    </CardContent>
  </Card>

  <Card className="flex flex-col h-full border border-gray-300 rounded-lg hover:shadow-lg transition-shadow">
    <CardHeader className="text-center pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">Colaborador</CardTitle>
    </CardHeader>
    <CardContent className="flex justify-center items-center p-4">
      <Avatar className="w-16 h-16">
        <AvatarFallback>{"JS"}</AvatarFallback>
      </Avatar>
    </CardContent>
  </Card>

  <Card className="flex flex-col h-full border border-gray-300 rounded-lg hover:shadow-lg transition-shadow">
    <CardHeader className="text-center pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">Horas Trabalhadas</CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col justify-center items-center">
      <div className="text-2xl font-bold text-success">5h 35min</div>
    </CardContent>
  </Card>
</div>





        {/* Lista de colaboradores */}
        <Card>
          <CardContent className="p-0">
            <div className="space-y-1">
              {colaboradores.map((colaborador, index) => (
                <div key={index} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                  <CircularProgress 
                    value={colaborador.produtividade} 
                    size="md" 
                    className={
                      colaborador.color === "success" ? "text-success" :
                      colaborador.color === "warning" ? "text-warning" :
                      "text-info"
                    }
                  />
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>
                        {colaborador.nome
                          .split(" ")
                          .map(n => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{colaborador.nome}</span>
                  </div>
                  <div className={`px-4 py-2 rounded-lg font-medium text-${colaborador.color} bg-${colaborador.color}/10`}>
                    {colaborador.horas}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
