import { Card, CardContent } from "@/components/ui/card";


export default function Notas() {

  return (
      <div className="space-y-6">
        <div>
        <h2 className="text-2xl font-bold mb-6">Notas</h2>
        </div>
  <Card className="h-[80vh] flex flex-col">
    <CardContent className="flex-1 p-0">
      <iframe
        src="https://www.appsheet.com/start/47848970-00d0-48a1-a44f-75f6344f48cc#view=Notas"
        className="w-full h-full border-none"
        style={{
          display: "block",
          transform: "scale(0.8)",
          transformOrigin: "0 0", // zoom a partir do canto superior esquerdo
          width: "125%", // compensar o zoom
          height: "125%" // compensar o zoom
        }}
        title="Planilha Indicadores"
      />
    </CardContent>
  </Card>
      </div>
  );
}
