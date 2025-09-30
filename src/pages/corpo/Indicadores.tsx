import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";

export default function Indicadores() {
  return (
    <Layout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Indicadores</h1>
        </div>

        {/* Card do gráfico */}
        <Card className="h-[80vh] flex flex-col"> {/* Altura relativa à tela */}
          <CardContent className="flex-1 p-0">
          <iframe
            src="https://docs.google.com/spreadsheets/d/11F0H-_uxfCaUxz_BHhTyacp_bFS2YXijOupEAbUWEKE/edit?usp=sharing"
            className="w-full h-full border-none"
            style={{
              display: "block",
              transform: "scale(0.8)",
              transformOrigin: "0 0", // garante que o zoom saia do canto superior esquerdo
              width: "125%", // compensar o zoom
              height: "125%" // compensar o zoom
            }}
            title="Planilha Indicadores"
          />

          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
