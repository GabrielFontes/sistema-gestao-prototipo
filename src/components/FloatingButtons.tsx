import { QuickActionButton } from "@/components/QuickActionButton";
import { TasksOverviewButton } from "@/components/TasksOverviewButton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function FloatingButtons() {
  return (
    <TooltipProvider delayDuration={0}>
      <div className="fixed bottom-24 right-6 flex flex-col-reverse gap-3 z-40">
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <QuickActionButton />
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="left"
            align="center"
            sideOffset={12}
            className="bg-primary text-primary-foreground px-3 py-1 rounded-md font-medium shadow-md"
          >
            Ações Rápidas
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <TasksOverviewButton />
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="left"
            align="center"
            sideOffset={12}
            className="bg-primary text-primary-foreground px-3 py-1 rounded-md font-medium shadow-md"
          >
            Minhas Tarefas
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
