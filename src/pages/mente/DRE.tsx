import { Card, CardContent } from "@/components/ui/card";

export default function DRE() {
  return (
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">DRE</h1>
        </div>

        {/* Card com o iframe da planilha */}
        <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center h-[74vh]">
                  <div className="flex-1 h-full border-none">
                  <iframe
              src="https://docs.google.com/spreadsheets/d/1_Xpqje95N1gof2Vo5cQzJAGutkyPqmH4ljBP0rED6Ik/edit?rm=minimal#gid=1277586829"
            className="w-full h-full border border-gray-300 rounded overflow-hidden"
              style={{
                display: "block",
                transform: "scale(0.8)",
                transformOrigin: "0 0", // garante que o zoom saia do canto superior esquerdo
                width: "125%", // compensa o zoom
                height: "125%" // compensa o zoom
              }}
              title="Planilha DRE"
            />
                  </div>
                </div>
              </CardContent>
            </Card>
      </div>
  );
}
