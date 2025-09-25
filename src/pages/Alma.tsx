import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircularProgress } from "@/components/CircularProgress";

const colaboradores = [
  { nome: "Qualquer nome teste", avatar: "/placeholder.svg", produtividade: 89, horas: "5h 35min", color: "success" },
  { nome: "Qualquer nome teste", avatar: "/placeholder.svg", produtividade: 78, horas: "5h 35min", color: "warning" },
  { nome: "Qualquer nome teste", avatar: "/placeholder.svg", produtividade: 46, horas: "5h 35min", color: "info" },
  { nome: "Qualquer nome teste", avatar: "/placeholder.svg", produtividade: 45, horas: "5h 35min", color: "info" },
  { nome: "Qualquer nome teste", avatar: "/placeholder.svg", produtividade: 46, horas: "5h 35min", color: "info" },
  { nome: "Qualquer nome teste", avatar: "/placeholder.svg", produtividade: 46, horas: "5h 35min", color: "info" },
];

export default function Alma() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
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
            <Select defaultValue="2025">
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Métricas principais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Produtividade</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <CircularProgress value={89} size="lg" className="text-success" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Colaborador</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center">
              <Avatar className="w-16 h-16">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>QT</AvatarFallback>
              </Avatar>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Horas Trabalhadas</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
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
                      className={`text-${colaborador.color}`}
                    />
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={colaborador.avatar} />
                      <AvatarFallback>QT</AvatarFallback>
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