"use client";

import {
  contactSessionIdAtomFamily,
  conversationIdAtom,
  errorMessageAtom,
  organizationIdAtom,
  screenAtoms,
} from "@/atoms/widget-atoms";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { useAtomValue, useSetAtom } from "jotai";
import { ArrowRight, MessageSquareText } from "lucide-react";
import { useState } from "react";
import { WidgetHeader } from "../widget-header";
import { WidgetFooter } from "../widget-footer";

export const WidgetSelectionScreen = () => {
  const [isPending, setIsPending] = useState(false);
  const setScreen = useSetAtom(screenAtoms);
  const setErrorMessage = useSetAtom(errorMessageAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const setConversationId = useSetAtom(conversationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || "")
  );
  const createConversation = useMutation(api.public.conversations.create);

  const handleNewConversation = async () => {
    if (!organizationId) {
      setScreen("error");
      setErrorMessage("Organization ID is missing.");
      return;
    }
    if (!contactSessionId) {
      setScreen("auth");
      return;
    }

    setIsPending(true);

    try {
      const conversationId = await createConversation({
        organizationId,
        contactSessionId,
      });
      setConversationId(conversationId);
      setScreen("chat");
    } catch (error) {
      const errorMsg =
        error instanceof ConvexError
          ? (error.data as { message: string }).message
          : "An unexpected error occurred.";
      setScreen("auth");
      setErrorMessage(errorMsg);
    } finally {
      setIsPending(false);
    }
  };
  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2 px-2 py-6">
          <p className="font-semibold text-3xl">Hello!👋</p>
          <p className="font-semibold text-lg">Let&apos;s get you started</p>
        </div>
      </WidgetHeader>
      <div className="flex flex-1 flex-col gap-y-4 p-4 overflow-y-auto">
        <Button
          className="w-full justify-between"
          variant="outline"
          size="lg"
          onClick={handleNewConversation}
          disabled={isPending}
        >
          <div className="flex items-center gap-x-2">
            <MessageSquareText className="size-5" />
            <span>Start a Chat</span>
          </div>
          <ArrowRight className="size-5" />
        </Button>
      </div>
      <WidgetFooter />
    </>
  );
};
