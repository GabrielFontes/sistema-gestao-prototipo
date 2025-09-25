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
        <Tabs defaultValue="fluxos" className="w-full">
          <div className="flex justify-center">
            <TabsList className="grid w-96 grid-cols-2">
              <TabsTrigger value="organograma">Organograma</TabsTrigger>
              <TabsTrigger value="fluxos" className="bg-primary text-primary-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Fluxos
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="organograma" className="mt-6">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center justify-center h-96 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/25">
                  <div className="text-center text-muted-foreground">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4" />
                    <p>Organograma será exibido aqui</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fluxos" className="mt-6">
            {/* Área principal do fluxo */}
            <Card className="mb-6">
              <CardContent className="p-8">
                <div className="flex items-center justify-center h-96 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/25">
                  <div className="text-center text-muted-foreground">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4" />
                    <p>Área para criar e visualizar fluxos de trabalho</p>
                  </div>
                </div>
              </CardContent>
            </Card>

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
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}