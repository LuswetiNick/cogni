"use client";

import { Button } from "@workspace/ui/components/button";
import { WidgetHeader } from "../widget-header";
import { ArrowLeft, EllipsisVertical } from "lucide-react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  contactSessionIdAtomFamily,
  conversationIdAtom,
  organizationIdAtom,
  screenAtoms,
} from "@/atoms/widget-atoms";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

export const WidgetChatScreen = () => {
  const setScreen = useSetAtom(screenAtoms);
  const setConversationId = useSetAtom(conversationIdAtom);
  const conversationId = useAtomValue(conversationIdAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || "")
  );
  const conversation = useQuery(
    api.public.conversations.getOne,
    conversationId && contactSessionId
      ? {
          conversationId,
          contactSessionId,
        }
      : "skip"
  );

  const onBack = () => {
    setConversationId(null);
    setScreen("selection");
  };

  return (
    <>
      <WidgetHeader className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <Button
            variant="ghost"
            className="flex items-center gap-x-2"
            onClick={onBack}
          >
            <ArrowLeft className="size-5" />
            <span>back</span>
          </Button>
        </div>
        <Button size="icon" variant="ghost">
          <EllipsisVertical className="size-6" />
        </Button>
      </WidgetHeader>
      <div className="flex flex-1 flex-col gap-y-4 p-4">
        {JSON.stringify(conversation)}
      </div>
    </>
  );
};
