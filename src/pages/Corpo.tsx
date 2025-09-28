import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Edit2, RefreshCw } from "lucide-react";

const supervisores = [
  "Supervisor de Vendas",
  "Supervisor de Vendas", 
  "Supervisor de Vendas",
  "Supervisor de Vendas",
  "Supervisor de Vendas",
  "Supervisor de Vendas",
  "Supervisor de Vendas",
  "Supervisor de Vendas",
  "Supervisor de Vendas"
];

export default function Corpo() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Tabs */}
        <Tabs defaultValue="organograma" className="w-full">
          <div className="flex justify-center">
            <TabsList className="grid w-96 grid-cols-2">
              <TabsTrigger value="organograma" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Organograma
              </TabsTrigger>
              <TabsTrigger value="fluxos" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Fluxos
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Aba Organograma */}
          <TabsContent value="organograma" className="mt-6">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center justify-center h-[70vh]">
                  {/* Botões */}
                  <div className="flex flex-col gap-4 mr-4">
                    <button
                      className="p-2 rounded-full bg-primary text-white hover:bg-primary/90"
                      onClick={() =>
                        window.open(
                          "https://lucid.app/lucidchart/50322aeb-a5b2-4d2c-b318-16716b12ca2f/edit?from_internal=true",
                          "Editar Fluxo",
                          "width=1200,height=800"
                        )
                      }
                    >
                      <Edit2 size={20} />
                    </button>

                    <button
                      className="p-2 rounded-full bg-primary text-white hover:bg-primary/90"
                      onClick={() => {
                        console.log("Sincronizar clicado");
                      }}
                    >
                      <RefreshCw size={20} />
                    </button>
                  </div>

                  {/* Iframe Lucidchart */}
                  <div style={{ flex: 1, height: "100%" }}>
                    <iframe
                      allowFullScreen
                      style={{ width: "100%", height: "100%" }}
                      src="https://lucid.app/documents/embedded/07ee9e3f-c79f-449a-b47f-06b88c8993e8"
                    ></iframe>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Fluxos */}
          <TabsContent value="fluxos" className="mt-6">
            <Card className="mb-6">
              <CardContent className="p-8">
                <div className="flex items-center justify-center h-[70vh]">
                  {/* Botões */}
                  <div className="flex flex-col gap-4 mr-4">
                    <button
                      className="p-2 rounded-full bg-primary text-white hover:bg-primary/90"
                      onClick={() =>
                        window.open(
                          "https://lucid.app/lucidchart/50322aeb-a5b2-4d2c-b318-16716b12ca2f/edit?from_internal=true",
                          "Editar Fluxo",
                          "width=1200,height=800"
                        )
                      }
                    >
                      <Edit2 size={20} />
                    </button>

                    <button
                      className="p-2 rounded-full bg-primary text-white hover:bg-primary/90"
                      onClick={() => {
                        console.log("Sincronizar clicado");
                      }}
                    >
                      <RefreshCw size={20} />
                    </button>
                  </div>

                  {/* Iframe Lucidchart */}
                  <div style={{ flex: 1, height: "100%" }}>
                    <iframe
                      allowFullScreen
                      style={{ width: "100%", height: "100%" }}
                      src="https://lucid.app/documents/embedded/50322aeb-a5b2-4d2c-b318-16716b12ca2f"
                    ></iframe>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Novo Card com Google Drive */}
        <Card>
          <CardContent className="p-6">
            <div className="w-full h-[600px]">
              <iframe
                src="https://drive.google.com/embeddedfolderview?id=1G4InfgMuQLN4Gv-P3Cp0SQpAb-tD6f7W#grid"
                style={{ width: "100%", height: "100%", border: "0" }}
                allowFullScreen
              ></iframe>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
