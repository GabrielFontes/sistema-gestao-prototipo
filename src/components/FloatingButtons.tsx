import { QuickActionButton } from "@/components/QuickActionButton";
import { TasksOverviewButton } from "@/components/TasksOverviewButton";
import { ChatButton } from "@/components/ChatButton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function FloatingButtons() {
  return (
    <TooltipProvider delayDuration={0}>
      <div className="floating-buttons-container fixed bottom-6 right-6 flex flex-col-reverse gap-3 z-50 pointer-events-none">
        <style>{`
          .floating-buttons-container > * {
            pointer-events: auto;
          }
        `}</style>
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
              <ChatButton />
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="left"
            align="center"
            sideOffset={12}
            className="bg-primary text-primary-foreground px-3 py-1 rounded-md font-medium shadow-md"
          >
            Mensagens
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
