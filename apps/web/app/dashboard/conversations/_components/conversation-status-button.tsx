import { Doc } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import Hint from "@workspace/ui/components/hint";
import { ArrowRight, ArrowUp, Check } from "lucide-react";

const ConversationStatusButton = ({
  status,
  onClick,
  disabled,
}: {
  status: Doc<"conversations">["status"];
  onClick: () => void;
  disabled?: boolean;
}) => {
  if (status === "resolved") {
    return (
      <Hint text="Mark as unresolved">
        <Button
          size="sm"
          onClick={onClick}
          variant="tertiary"
          disabled={disabled}
        >
          <Check />
          Resolved
        </Button>
      </Hint>
    );
  }
  if (status === "escalated") {
    return (
      <Hint text="Mark as resolved">
        <Button
          size="sm"
          onClick={onClick}
          variant="warning"
          disabled={disabled}
        >
          <ArrowUp />
          Escalated
        </Button>
      </Hint>
    );
  }
  return (
    <Hint text="Mark as escalated">
      <Button size="sm" onClick={onClick} variant="destructive">
        <ArrowRight />
        Unresolved
      </Button>
    </Hint>
  );
};
export default ConversationStatusButton;
