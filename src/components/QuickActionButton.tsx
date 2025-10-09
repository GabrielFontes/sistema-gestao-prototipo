import { useState } from "react";
import { Plus, FolderKanban, StickyNote } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ProjectDialog } from "./ProjectDialog";
import { NoteDialog } from "./NoteDialog";

const quickActions = [
  { title: "Projetos", icon: FolderKanban, type: "project" as const },
  { title: "Nota", icon: StickyNote, type: "note" as const },
];

export function QuickActionButton() {
  const [openPopover, setOpenPopover] = useState(false);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);

  const handleActionClick = (type: string) => {
    setOpenPopover(false);
    
    switch (type) {
      case "project":
        setProjectDialogOpen(true);
        break;
      case "note":
        setNoteDialogOpen(true);
        break;
    }
  };

  return (
    <>
      <Popover open={openPopover} onOpenChange={setOpenPopover}>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            className="h-14 w-14 rounded-full shadow-lg"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2" align="end">
          <div className="space-y-1">
            {quickActions.map((action) => (
              <button
                key={action.title}
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

      <ProjectDialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen} />
      <NoteDialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen} />
    </>
  );
}