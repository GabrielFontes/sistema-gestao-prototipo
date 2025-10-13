import { useParams } from "react-router-dom";
import { useObjectives } from "@/hooks/useObjectives";
import { useProjects } from "@/hooks/useProjects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RefreshCw, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function Corpo() {
  const { empresaId } = useParams();
  const { isLoading } = useObjectives(empresaId || null);
  const { projects } = useProjects(empresaId || null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Corpo</h1>
        </div>
      </div>

      {/* Métricas principais */}
      <TooltipProvider>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          <Card className="flex flex-col h-full border border-gray-300 rounded-lg hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pré-venda</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-4">
              <div className="text-2xl font-bold text-success">85%</div>
              <div className="text-sm text-muted-foreground">Taxa de Conversão de Leads</div>
              <Progress value={85} className="w-3/4 mt-2" />
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-muted-foreground mt-2" />
                </TooltipTrigger>
                <TooltipContent>
                  Percentual de visitantes que agendam uma reunião inicial.
                </TooltipContent>
              </Tooltip>
            </CardContent>
          </Card>

          <Card className="flex flex-col h-full border border-gray-300 rounded-lg hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Venda</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-4">
              <div className="text-2xl font-bold text-primary">12 dias</div>
              <div className="text-sm text-muted-foreground">Ciclo Médio de Venda</div>
              <Progress value={60} className="w-3/4 mt-2" />
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-muted-foreground mt-2" />
                </TooltipTrigger>
                <TooltipContent>
                  Tempo médio desde a primeira reunião até a emissão do pedido.
                </TooltipContent>
              </Tooltip>
            </CardContent>
          </Card>

          <Card className="flex flex-col h-full border border-gray-300 rounded-lg hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Entrega</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-4">
              <div className="text-2xl font-bold text-success">95%</div>
              <div className="text-sm text-muted-foreground">Entregas no Prazo</div>
              <Progress value={95} className="w-3/4 mt-2" />
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-muted-foreground mt-2" />
                </TooltipTrigger>
                <TooltipContent>
                  Percentual de pedidos entregues dentro do prazo estimado.
                </TooltipContent>
              </Tooltip>
            </CardContent>
          </Card>
        </div>
      </TooltipProvider>

      {/* Tabs de trimestres */}
      <Card className="border-muted">
              <CardContent className="p-6">
                <div className="flex items-center justify-center h-[80vh]">
                <div className="flex flex-col gap-4 mr-4">
              <button
                className="p-2 rounded-full bg-primary text-white hover:bg-primary/90 transition"
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

        </CardContent>
      </Card>
    </div>
  );
}