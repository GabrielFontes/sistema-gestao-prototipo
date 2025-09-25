import { Layout } from "@/components/Layout";
import { MetricCard } from "@/components/MetricCard";
import { CircularProgress } from "@/components/CircularProgress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const productivityData = [
  { value: 89, color: "success" as const, name: "João Silva", hours: "5h 35min" },
  { value: 78, color: "warning" as const, name: "Maria Santos", hours: "5h 35min" },
  { value: 46, color: "info" as const, name: "Pedro Costa", hours: "5h 35min" },
  { value: 46, color: "info" as const, name: "Ana Lima", hours: "5h 35min" },
  { value: 46, color: "info" as const, name: "Carlos Rocha", hours: "5h 35min" },
];

export default function Dashboard() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Overview</h1>
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

        {/* Productivity Dashboard */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Produtividade da Equipe</CardTitle>
                <p className="text-muted-foreground">Dezembro 2025</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Produtividade */}
              <div>
                <h3 className="font-medium mb-4 text-center">Produtividade</h3>
                <div className="space-y-4">
                  {productivityData.map((item, index) => (
                    <div key={index} className="flex items-center justify-center">
                      <CircularProgress value={item.value} color={item.color} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Colaborador */}
              <div>
                <h3 className="font-medium mb-4 text-center">Colaborador</h3>
                <div className="space-y-4">
                  {productivityData.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 h-16">
                      <Avatar>
                        <AvatarImage src={`/placeholder-avatar-${index + 1}.jpg`} />
                        <AvatarFallback>{item.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Horas Trabalhadas */}
              <div>
                <h3 className="font-medium mb-4 text-center">Horas Trabalhadas</h3>
                <div className="space-y-4">
                  {productivityData.map((item, index) => (
                    <div key={index} className={`h-16 rounded-lg flex items-center justify-center font-medium ${
                      item.color === 'success' ? 'bg-success-light text-success' : 
                      item.color === 'warning' ? 'bg-warning-light text-warning' : 
                      'bg-info-light text-info'
                    }`}>
                      {item.hours}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}