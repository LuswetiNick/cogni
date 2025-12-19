import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { Home, Inbox } from "lucide-react";

export const WidgetFooter = () => {
  const screen = "selection";
  return (
    <footer className="flex items-center justify-between border-t bg-background">
      <Button
        className="h-14 flex-1 rounded-none"
        onClick={() => {}}
        size="icon"
        variant="secondary"
      >
        <Home
          className={cn("size-5", screen === "selection" && "text-primary")}
        />
      </Button>
      <Button
        className="h-14 flex-1 rounded-none"
        onClick={() => {}}
        size="icon"
        variant="secondary"
      >
        <Inbox className={cn("size-5", screen === "inbox" && "text-primary")} />
      </Button>
    </footer>
  );
};
