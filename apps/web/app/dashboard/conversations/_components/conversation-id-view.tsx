"use client";

import { toUIMessages, useThreadMessages } from "@convex-dev/agent/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@workspace/backend/_generated/api";
import { Id } from "@workspace/backend/_generated/dataModel";
import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton,
} from "@workspace/ui/components/ai/conversation";
import {
  AIInput,
  AIInputButton,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from "@workspace/ui/components/ai/input";
import {
  AIMessage,
  AIMessageContent,
} from "@workspace/ui/components/ai/message";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { AIResponse } from "@workspace/ui/components/ai/response";
import { Button } from "@workspace/ui/components/button";
import DicebearAvatar from "@workspace/ui/components/dicebear-avatar";
import { Field, FieldError, FieldGroup } from "@workspace/ui/components/field";
import { useAction, useMutation, useQuery } from "convex/react";
import { MoreHorizontal, Wand } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import ConversationStatusButton from "./conversation-status-button";
import { cn } from "@workspace/ui/lib/utils";
import { Skeleton } from "@workspace/ui/components/skeleton";
const formSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

const ConversationIdView = ({
  conversationId,
}: {
  conversationId: Id<"conversations">;
}) => {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isEnhancingResponse, setIsEnhancingResponse] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });
  const conversation = useQuery(api.private.conversations.getOne, {
    conversationId,
  });
  const messages = useThreadMessages(
    api.private.messages.getMany,
    conversation?.threadId ? { threadId: conversation.threadId } : "skip",
    { initialNumItems: 10 }
  );

  const { topElementRef, canLoadMore, handleLoadMore, isLoadingMore } =
    useInfiniteScroll({
      status: messages.status,
      loadMore: messages.loadMore,
      loadSize: 10,
    });

  const createMessage = useMutation(api.private.messages.create);
  const enhanceResponse = useAction(api.private.messages.enhanceResponse);
  const handleEnhanceResponse = async () => {
    setIsEnhancingResponse(true);
    const currentPrompt = form.getValues("message");
    try {
      const response = await enhanceResponse({
        prompt: currentPrompt,
      });
      form.setValue("message", response);
    } catch (error) {
      console.error(error);
    } finally {
      setIsEnhancingResponse(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createMessage({
        conversationId,
        prompt: values.message,
      });
      form.reset();
    } catch (error) {
      console.error(error);
    }
  };

  const updateConversationStatus = useMutation(
    api.private.conversations.updateStatus
  );
  const handleToggleStatus = async () => {
    if (!conversation) return;
    setIsUpdatingStatus(true);
    let newStatus: "unresolved" | "resolved" | "escalated";
    if (conversation.status === "unresolved") {
      newStatus = "escalated";
    } else if (conversation.status === "escalated") {
      newStatus = "resolved";
    } else {
      newStatus = "unresolved";
    }
    try {
      await updateConversationStatus({
        conversationId,
        status: newStatus,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (conversation === undefined || messages.status === "LoadingFirstPage")
    return <ConversationLoading />;

  return (
    <div className=" flex h-full flex-col">
      <div className="flex items-center justify-between border-b bg-background p-2.5">
        <Button size="icon" variant="ghost">
          <MoreHorizontal />
        </Button>
        {!!conversation && (
          <ConversationStatusButton
            status={conversation.status}
            onClick={handleToggleStatus}
            disabled={isUpdatingStatus}
          />
        )}
      </div>
      <AIConversation className="max-h-[calc(100vh-180px)]">
        <AIConversationContent>
          <InfiniteScrollTrigger
            isLoadingMore={isLoadingMore}
            canLoadMore={canLoadMore}
            onLoadMore={handleLoadMore}
            ref={topElementRef}
          />
          {toUIMessages(messages.results ?? [])?.map((message) => (
            <AIMessage
              className="text-background"
              from={message.role === "user" ? "assistant" : "user"}
              key={message.id}
            >
              <AIMessageContent>
                <AIResponse>{message.text}</AIResponse>
              </AIMessageContent>
              {message.role === "user" && (
                <DicebearAvatar
                  seed={conversation?.contactSessionId ?? "user"}
                  size={32}
                />
              )}
            </AIMessage>
          ))}
        </AIConversationContent>
        <AIConversationScrollButton />
      </AIConversation>
      <div className="p-2">
        <AIInput onSubmit={form.handleSubmit(onSubmit)} className="p-4 shadow">
          <FieldGroup>
            <Controller
              disabled={conversation?.status === "resolved"}
              name="message"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <AIInputTextarea
                    {...field}
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
                        : "Type your response as an operator..."
                    }
                    value={field.value}
                    disabled={
                      conversation?.status === "resolved" ||
                      form.formState.isSubmitting ||
                      isEnhancingResponse
                    }
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                  <AIInputToolbar>
                    <AIInputTools>
                      <AIInputButton
                        disabled={
                          conversation?.status === "resolved" ||
                          isEnhancingResponse ||
                          !form.formState.isValid
                        }
                        onClick={handleEnhanceResponse}
                      >
                        <Wand />{" "}
                        {isEnhancingResponse ? "Enhancing..." : "Enhance"}
                      </AIInputButton>
                    </AIInputTools>
                    <AIInputSubmit
                      disabled={
                        conversation?.status === "resolved" ||
                        !form.formState.isValid ||
                        form.formState.isSubmitting ||
                        isEnhancingResponse
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
      </div>
    </div>
  );
};
export default ConversationIdView;

export const ConversationLoading = () => {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b bg-background p-2.5">
        <Button size="icon" variant="ghost">
          <MoreHorizontal />
        </Button>
      </div>
      <AIConversation className="max-h-[calc(100vh-180px)]">
        <AIConversationContent>
          {Array.from({ length: 8 }, (_, index) => {
            const isUser = index % 2 === 0;
            const widths = ["w-48", "w-60", "w-72"];
            const width = widths[index % widths.length];
            return (
              <div
                className={cn(
                  "group flex w-full items-end justify-end gap-2 py-2 [&>div]:max-w-[80%]",
                  isUser ? "is-user" : "is-assistant flex-row-reverse"
                )}
                key={index}
              >
                <Skeleton className={`h-9 ${width} rounded-md bg-secondary`} />
                <Skeleton className="size-8 rounded-full bg-secondary" />
              </div>
            );
          })}
        </AIConversationContent>
      </AIConversation>
      <div className="p-2">
        <AIInput>
          <AIInputTextarea
            disabled
            placeholder="Type your response as an operator..."
          />
          <AIInputToolbar>
            <AIInputTools>
              <AIInputSubmit disabled status="ready" />
            </AIInputTools>
          </AIInputToolbar>
        </AIInput>
      </div>
    </div>
  );
};
