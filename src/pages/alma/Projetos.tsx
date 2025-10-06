import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { ProjectKanbanDialog } from "@/components/ProjectKanbanDialog";
import { ProcessChecklistDialog } from "@/components/ProcessChecklistDialog";
import { ProjectsList } from "@/components/ProjectsList";

export default function Processos() {
  const [selectedProject, setSelectedProject] = useState<{ title: string } | null>(null);
  const [selectedProcess, setSelectedProcess] = useState<{ title: string } | null>(null);
  
  return (
    <div className="space-y-6">
       <div>
        <h2 className="text-2xl font-bold mb-6">Projetos</h2>
        </div>

{/* Conteúdo Projetos */}
  <Card className="h-[80vh] flex flex-col">
    <CardContent className="flex-1 p-0">
      <iframe
        src="https://www.appsheet.com/start/47848970-00d0-48a1-a44f-75f6344f48cc"
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


        {/* Dialogs */}

        <ProjectKanbanDialog
          open={selectedProject !== null}
          onOpenChange={(open) => !open && setSelectedProject(null)}
          projectTitle={selectedProject?.title || ""}
        />
        <ProcessChecklistDialog
          open={selectedProcess !== null}
          onOpenChange={(open) => !open && setSelectedProcess(null)}
          processTitle={selectedProcess?.title || ""}
        />
      </div>
  );
}
