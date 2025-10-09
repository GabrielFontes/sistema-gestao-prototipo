import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatPanel } from "./ChatPanel";
import { Badge } from "@/components/ui/badge";

export function ChatButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        size="icon"
        variant="default"
        onClick={() => setOpen(!open)}
        className="relative h-14 w-14 rounded-full shadow-lg"
      >
        <MessageCircle className="h-6 w-6" />
        {/* Badge for unread messages - can be implemented later */}
      </Button>
      
      <ChatPanel open={open} onOpenChange={setOpen} />
    </>
  );
}
