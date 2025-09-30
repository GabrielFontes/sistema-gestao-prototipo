import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";

export default function DRE() {
  return (
    <Layout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">DRE</h1>
        </div>

        {/* Card com o iframe da planilha */}
        <Card className="h-[80vh] flex flex-col"> {/* altura relativa à tela */}
          <CardContent className="flex-1 p-0">
            <iframe
              src="https://docs.google.com/spreadsheets/d/1_Xpqje95N1gof2Vo5cQzJAGutkyPqmH4ljBP0rED6Ik/edit#gid=1277586829"
              className="w-full h-full border-none"
              style={{
                display: "block",
                transform: "scale(0.8)",
                transformOrigin: "0 0", // garante que o zoom saia do canto superior esquerdo
                width: "125%", // compensa o zoom
                height: "125%" // compensa o zoom
              }}
              title="Planilha DRE"
            />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
