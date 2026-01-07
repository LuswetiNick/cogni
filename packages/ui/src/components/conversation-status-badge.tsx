import { ArrowRight, ArrowUp, CircleCheck } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { Badge } from "@workspace/ui/components/badge";

interface ConversationStatusBadgeProps {
  status: "unresolved" | "escalated" | "resolved";
  className?: string;
}

const statusConfig = {
  resolved: {
    icon: CircleCheck,
    bgColor: "bg-[#3FB62F]",
  },
  unresolved: {
    icon: ArrowRight,
    bgColor: "bg-destructive",
  },
  escalated: {
    icon: ArrowUp,
    bgColor: "bg-yellow-500",
  },
} as const;

export const ConversationStatusBadge = ({
  status,
  className,
}: ConversationStatusBadgeProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <Badge
      className={cn(
        "flex items-center justify-center",
        config.bgColor,
        className
      )}
    >
      <Icon className="size-3 stroke-3 text-white" />
    </Badge>
  );
};
