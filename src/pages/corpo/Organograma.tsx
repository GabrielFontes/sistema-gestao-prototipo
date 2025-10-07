import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, TrendingUp, Target, BarChart3 } from "lucide-react";

{/*
const indicadores = [
  {
    title: "Pré-venda",
    value: "87%",
    trend: "+12%",
    description: "Visitas no Site",
    icon: TrendingUp,
    color: "success",
  },
  {
    title: "Venda",
    value: "24",
    trend: "+3",
    description: "Novos Pedidos",
    icon: Target,
    color: "primary",
  },
  {
    title: "Entrega",
    value: "92%",
    trend: "+8%",
    description: "Entregues no prazo",
    icon: BarChart3,
    color: "info",
  },
  {
    title: "Suporte",
    value: "92%",
    trend: "+8%",
    description: "Clima emocional",
    icon: BarChart3,
    color: "info",
  },
];
*/}

export default function Organograma() {
  return (
    <div className="space-y-6">
        
         {/* Header */}
         <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Organograma</h1>
          </div>
        </div>

        {/* Card principal com Tabs */}
        <Card>
  <Tabs defaultValue="organograma" className="w-full">
    <CardHeader>
      <div className="flex justify-center">
        <TabsList className="flex gap-4">
          <TabsTrigger
            value="organograma"
            className="w-32 text-center px-4 py-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Organograma
          </TabsTrigger>
          <TabsTrigger
            value="cargos"
            className="w-32 text-center px-4 py-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Cargos
          </TabsTrigger>
        </TabsList>
      </div>
    </CardHeader>

    <CardContent className="p-6 space-y-0">
      {/* Aba Organograma */}
      <TabsContent value="organograma" className="mt-0">
        <div className="flex items-center justify-center h-[80vh] gap-4">
          {/* Botões */}
          <div className="flex flex-col gap-4">
            <button
              className="p-2 rounded-full bg-primary text-white hover:bg-primary/90"
              onClick={() => console.log("Sincronizar clicado")}
            >
              <RefreshCw size={20} />
            </button>
          </div>

          {/* Lucidchart */}
          <div className="flex-1 h-full border border-gray-300 rounded overflow-hidden">
            <iframe
              allowFullScreen
              className="w-full h-full"
              src="https://lucid.app/documents/embedded/07ee9e3f-c79f-449a-b47f-06b88c8993e8"
            ></iframe>
          </div>
        </div>
      </TabsContent>

      {/* Aba Cargos */}
      <TabsContent value="cargos" className="!mt-0">
      <div className="flex items-center justify-center h-[80vh] gap-4">
          {/* Botões */}
          <div className="flex flex-col gap-4">
            <button
              className="p-2 rounded-full bg-primary text-white hover:bg-primary/90"
              onClick={() => console.log("Sincronizar clicado")}
            >
              <RefreshCw size={20} />
            </button>
          </div>
          <div className="flex-1 h-full border border-gray-300 rounded overflow-hidden">
          <iframe
            src="https://drive.google.com/embeddedfolderview?id=1G4InfgMuQLN4Gv-P3Cp0SQpAb-tD6f7W#grid"
            style={{ width: "100%", height: "100%", border: "0" }}
            allowFullScreen
          ></iframe>
        </div>
        </div>
      </TabsContent>

    </CardContent>
  </Tabs>
</Card>

      </div>
  );
}
