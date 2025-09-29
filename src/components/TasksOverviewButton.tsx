import { useState } from "react";
import { CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TasksOverviewDialog } from "./TasksOverviewDialog";

export function TasksOverviewButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        size="icon"
        variant="outline"
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-6 z-50 h-14 w-14 rounded-full shadow-lg"
      >
        <CheckSquare className="h-6 w-6" />
      </Button>
      
      <TasksOverviewDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
