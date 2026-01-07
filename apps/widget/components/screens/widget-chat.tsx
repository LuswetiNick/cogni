"use client";

import {
  contactSessionIdAtomFamily,
  conversationIdAtom,
  organizationIdAtom,
  screenAtoms,
} from "@/atoms/widget-atoms";
import { toUIMessages, useThreadMessages } from "@convex-dev/agent/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@workspace/backend/_generated/api";
import {
  AIConversation,
  AIConversationContent,
} from "@workspace/ui/components/ai/conversation";
import {
  AIInput,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from "@workspace/ui/components/ai/input";
import {
  AIMessage,
  AIMessageContent,
} from "@workspace/ui/components/ai/message";
import { AIResponse } from "@workspace/ui/components/ai/response";
import { Button } from "@workspace/ui/components/button";
import DicebearAvatar from "@workspace/ui/components/dicebear-avatar";
import { Field, FieldError, FieldGroup } from "@workspace/ui/components/field";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { useAction, useQuery } from "convex/react";
import { useAtomValue, useSetAtom } from "jotai";
import { ArrowLeft, EllipsisVertical } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { WidgetHeader } from "../widget-header";

const formSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

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

  const messages = useThreadMessages(
    api.public.messages.getMany,
    conversation?.threadId && contactSessionId
      ? {
          threadId: conversation.threadId,
          contactSessionId,
        }
      : "skip",
    { initialNumItems: 10 }
  );

  const { topElementRef, handleLoadMore, canLoadMore, isLoadingMore } =
    useInfiniteScroll({
      status: messages.status,
      loadMore: messages.loadMore,
      loadSize: 10,
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const createMessage = useAction(api.public.messages.create);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!conversation || !contactSessionId) return;
    form.reset();
    await createMessage({
      threadId: conversation.threadId,
      contactSessionId,
      prompt: values.message,
    });
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
      <AIConversation>
        <AIConversationContent>
          <InfiniteScrollTrigger
            canLoadMore={canLoadMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={handleLoadMore}
            ref={topElementRef}
          />

          {toUIMessages(messages.results ?? [])?.map((message) => {
            return (
              <AIMessage
                from={message.role === "user" ? "user" : "assistant"}
                key={message.id}
              >
                <AIMessageContent>
                  <AIResponse>{message.text}</AIResponse>
                </AIMessageContent>
                {message.role === "assistant" && (
                  <DicebearAvatar
                    imageURL="/logo.svg"
                    seed="assistant"
                    size={32}
                    badgeImageURL="/logo.svg"
                  />
                )}
              </AIMessage>
            );
          })}
        </AIConversationContent>
      </AIConversation>
      {/* TODO: Add suggestions */}
      <>
        <AIInput
          className="rounded-none border-x-0 border-b-0"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Controller
              disabled={conversation?.status === "resolved"}
              name="message"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <AIInputTextarea
                    {...field}
                    id="widget-chat-form-message"
                    aria-invalid={fieldState.invalid}
                    onChange={field.onChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        form.handleSubmit(onSubmit)();
                      }
                    }}
                    placeholder={
                      conversation?.status === "resolved"
                        ? "This conversation has been resolved"
                        : "Type your message..."
                    }
                    value={field.value}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                  <AIInputToolbar>
                    <AIInputTools />
                    <AIInputSubmit
                      disabled={
                        conversation?.status === "resolved" ||
                        !form.formState.isValid
                      }
                      status="ready"
                      type="submit"
                    />
                  </AIInputToolbar>
                </Field>
              )}
            />
          </FieldGroup>
        </AIInput>
      </>
    </>
  );
};
