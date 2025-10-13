import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";

export default function Cargos() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cargos</h1>
        </div>
      </div>

      {/* Card principal */}
      <Card>
        
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

            {/* Google Drive embed */}
            <div className="flex-1 h-full border border-gray-300 rounded overflow-hidden">
              <iframe
                src="https://drive.google.com/embeddedfolderview?id=1G4InfgMuQLN4Gv-P3Cp0SQpAb-tD6f7W#grid"
                style={{ width: "100%", height: "100%", border: "0" }}
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
