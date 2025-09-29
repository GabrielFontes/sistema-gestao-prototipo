import { Plus, CheckSquare, FolderKanban, GitBranch, StickyNote } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const quickActions = [
  { title: "Tarefas", icon: CheckSquare, url: "/alma/tarefas" },
  { title: "Projetos", icon: FolderKanban, url: "/corpo/projetos" },
  { title: "Processos", icon: GitBranch, url: "/corpo" },
  { title: "Nota", icon: StickyNote, url: "/alma/app" },
];

export function QuickActionButton() {
  const navigate = useNavigate();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          className="fixed top-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2" align="end">
        <div className="space-y-1">
          {quickActions.map((action) => (
            <button
              key={action.title}
              onClick={() => navigate(action.url)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-left transition-colors"
            >
              <action.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{action.title}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
