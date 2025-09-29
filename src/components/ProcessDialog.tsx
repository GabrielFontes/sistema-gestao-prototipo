import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ProcessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const processosPorSetor = {
  TI: [
    "Fluxo de atendimento de TI",
    "Instalação de software",
    "Manutenção de equipamentos",
  ],
  Recepção: [
    "Fluxo de Recepção",
    "Cadastro de visitantes",
    "Agendamento de salas",
  ],
  RH: [
    "Processo de onboarding",
    "Solicitação de férias",
    "Avaliação de desempenho",
  ],
  Financeiro: [
    "Aprovação de despesas",
    "Processo de reembolso",
    "Pagamento de fornecedores",
  ],
};

export function ProcessDialog({ open, onOpenChange }: ProcessDialogProps) {
  const { toast } = useToast();
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);

  const handleProcessSelect = (setor: string, processo: string) => {
    const fullProcess = `${setor} - ${processo}`;
    setSelectedProcess(fullProcess);
  };

  const handleSubmit = () => {
    if (!selectedProcess) {
      toast({
        title: "Atenção",
        description: "Selecione um fluxo para continuar.",
        variant: "destructive",
      });
      return;
    }

    console.log("Processo iniciado:", selectedProcess);
    toast({
      title: "Processo iniciado!",
      description: `${selectedProcess} foi iniciado com sucesso.`,
    });
    setSelectedProcess(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Iniciar Processo</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {Object.entries(processosPorSetor).map(([setor, processos]) => (
            <div key={setor}>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
                {setor}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {processos.map((processo) => {
                  const fullProcess = `${setor} - ${processo}`;
                  const isSelected = selectedProcess === fullProcess;
                  
                  return (
                    <button
                      key={processo}
                      onClick={() => handleProcessSelect(setor, processo)}
                      className={cn(
                        "p-4 rounded-lg border-2 text-left transition-all hover:border-primary/50",
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card"
                      )}
                    >
                      <div className="font-medium text-sm">{processo}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSelectedProcess(null);
              onOpenChange(false);
            }}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Iniciar Processo</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
