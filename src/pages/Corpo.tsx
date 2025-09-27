import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ImageIcon } from "lucide-react";

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
        {/* Tabs para Organograma e Fluxos */}
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

          <TabsContent value="organograma" className="mt-6">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center justify-center h-96">
                  <div style={{ width: "100%", height: "100%", margin: "10px", position: "relative" }}>
                    <iframe
                      allowFullScreen
                      style={{ width: "100%", height: "100%" }}
                      src="https://lucid.app/documents/embedded/07ee9e3f-c79f-449a-b47f-06b88c8993e8"
                      id="kpwUBsskZLGB"
                    ></iframe>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fluxos" className="mt-6">
            {/* Área principal do fluxo */}
            <Card className="mb-6">
              <CardContent className="p-8">
                <div className="flex items-center justify-center h-96">
                <div style={{ width: "100%", height: "100%", margin: "10px", position: "relative" }}>
                    <iframe
                      allowFullScreen
                      style={{ width: "100%", height: "100%" }}
                      src="https://lucid.app/documents/embedded/50322aeb-a5b2-4d2c-b318-16716b12ca2f"
                      id="YhwU3_AD3jK1"
                    ></iframe>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
            {/* Grid de supervisores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {supervisores.map((supervisor, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Badge variant="outline" className="text-primary border-primary">
                        {supervisor}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
      </div>
    </Layout>
  );
}