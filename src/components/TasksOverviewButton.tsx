import { useState } from "react";
import { CheckSquare, Smartphone, SmartphoneNfc } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TasksOverviewButton() {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    window.open(
      "https://www.appsheet.com/start/47848970-00d0-48a1-a44f-75f6344f48cc#view=To%20do",
      "AppSheetPopup",
      "width=1200,height=800,noopener,noreferrer"
    );;
  };

  return (
    <>
      <Button
        size="icon"
        variant="outline"
        onClick={handleClick}
        className="h-14 w-14 rounded-full shadow-lg"
      >
        <Smartphone className="h-6 w-6" />
      </Button>
    </>
  );
}