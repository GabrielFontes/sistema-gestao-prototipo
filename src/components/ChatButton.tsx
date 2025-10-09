import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatPanel } from "./ChatPanel";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function ChatButton() {
  const [open, setOpen] = useState(false);

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="default"
            onClick={() => setOpen(!open)}
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
          >
            <MessageCircle className="h-6 w-6" />
            {/* Badge for unread messages - can be implemented later */}
          </Button>
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
      
      <ChatPanel open={open} onOpenChange={setOpen} />
    </TooltipProvider>
  );
}
