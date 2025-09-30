import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Edit2, Plus } from "lucide-react";

export default function Fluxos() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Fluxos</h1>
          </div>
        </div>

          {/* Conteúdo Fluxos */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center h-[80vh]">
                <div className="flex flex-col gap-4 mr-4">
                  <button
                    className="p-2 rounded-full bg-primary text-white hover:bg-primary/90"
                    onClick={() => window.open( "https://lucid.app/lucidchart/50322aeb-a5b2-4d2c-b318-16716b12ca2f/edit?from_internal=true", "Editar Fluxo", "width=1200,height=800" ) } >
                      <Edit2 size={20} />
                  </button>
                </div>
                  <div className="flex-1 h-full border border-gray-300 rounded overflow-hidden">
                    <iframe
                      allowFullScreen
                      className="w-full h-full"
                      src="https://lucid.app/documents/embedded/50322aeb-a5b2-4d2c-b318-16716b12ca2f"
                    ></iframe>
                  </div>
                </div>
              </CardContent>
            </Card>
 
      </div>
    </Layout>
  );
}
