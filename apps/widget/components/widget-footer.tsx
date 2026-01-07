import { screenAtoms } from "@/atoms/widget-atoms";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { useAtomValue, useSetAtom } from "jotai";
import { Home, Inbox } from "lucide-react";

export const WidgetFooter = () => {
  const screen = useAtomValue(screenAtoms);
  const setScreen = useSetAtom(screenAtoms);
  return (
    <footer className="flex items-center justify-between border-t bg-background">
      <Button
        className="h-14 flex-1 rounded-none"
        onClick={() => setScreen("selection")}
        size="icon"
        variant="secondary"
      >
        <Home
          className={cn("size-5", screen === "selection" && "text-primary")}
        />
      </Button>
      <Button
        className="h-14 flex-1 rounded-none"
        onClick={() => setScreen("inbox")}
        size="icon"
        variant="secondary"
      >
        <Inbox className={cn("size-5", screen === "inbox" && "text-primary")} />
      </Button>
    </footer>
  );
};
