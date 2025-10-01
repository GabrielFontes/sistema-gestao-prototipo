import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useEmpresa } from "@/contexts/EmpresaContext";
import { useState } from "react";

export function EmpresaSelector() {
  const { currentEmpresa, empresas, setEmpresa } = useEmpresa();
  const [open, setOpen] = useState(false);

  if (!currentEmpresa) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="h-8 px-2 hover:bg-accent"
        >
          <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-2" align="start">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground px-2 py-1.5">Trocar empresa</p>
          {empresas.map((empresa) => (
            <button
              key={empresa.id}
              onClick={() => {
                setEmpresa(empresa.id);
                setOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-2 py-2 rounded-md text-sm hover:bg-accent transition-colors text-left",
                currentEmpresa.id === empresa.id && "bg-accent"
              )}
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{empresa.name}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {empresa.subtitle}
                </div>
              </div>
              {currentEmpresa.id === empresa.id && (
                <Check className="h-4 w-4 shrink-0 text-primary" />
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
