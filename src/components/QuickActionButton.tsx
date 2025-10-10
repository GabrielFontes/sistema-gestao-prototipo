import { useState } from "react";
import { Plus, CheckSquare, Play, FolderKanban, StickyNote } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ProjectDialog } from "./ProjectDialog";
import { NoteDialog } from "./NoteDialog"; // Ensure this exists
import { ProcessDialog } from "./ProcessDialog";
import { TaskDialog } from "./TaskDialog";

type ActionType = "process" | "project" | "note" | "task";

const quickActions = [
  { title: "Processos", icon: Play, type: "process" as ActionType },
  { title: "Projetos", icon: FolderKanban, type: "project" as ActionType },
  { title: "Nota", icon: StickyNote, type: "note" as ActionType },
  { title: "Tarefas", icon: CheckSquare, type: "task" as ActionType },
];

export function QuickActionButton() {
  const [openPopover, setOpenPopover] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [processDialogOpen, setProcessDialogOpen] = useState(false);

  const handleActionClick = (type: ActionType) => {
    setOpenPopover(false);
    switch (type) {
      case "task":
        setTaskDialogOpen(true);
        break;
      case "project":
        setProjectDialogOpen(true);
        break;
      case "process":
        setProcessDialogOpen(true);
        break;
      case "note":
        setNoteDialogOpen(true);
        break;
    }
  };

  const handleProjectCreated = () => {
    console.log("Project created");
  };

  const handleTaskCreated = () => {
    console.log("Task created");
  };

  const handleProcessCreated = () => {
    console.log("Process created");
  };

  return (
    <>
      <Popover open={openPopover} onOpenChange={setOpenPopover}>
        <PopoverTrigger asChild>
          <Button size="icon" className="h-14 w-14 rounded-full shadow-lg">
            <Plus className="h-6 w-6" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2" align="end">
          <div className="space-y-1">
            {quickActions.map((action) => (
              <button
                key={action.title}
                type="button"
                onClick={() => handleActionClick(action.type)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-left transition-colors"
              >
                <action.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{action.title}</span>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        milestoneId={null} // Explicitly pass null, adjust based on app logic
        onTaskCreated={handleTaskCreated}
      />
      <ProjectDialog
        open={projectDialogOpen}
        onOpenChange={setProjectDialogOpen}
        onProjectCreated={handleProjectCreated}
      />
<ProcessDialog
  open={processDialogOpen}
  onOpenChange={setProcessDialogOpen}
/>
      <NoteDialog
        open={noteDialogOpen}
        onOpenChange={setNoteDialogOpen}
      />
    </>
  );
}