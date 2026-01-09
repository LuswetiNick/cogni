"use client";

import { Button } from "@workspace/ui/components/button";
import { WidgetFooter } from "../widget-footer";
import { WidgetHeader } from "../widget-header";
import { MoveLeft } from "lucide-react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  conversationIdAtom,
  organizationIdAtom,
  screenAtoms,
} from "@/atoms/widget-atoms";
import { contactSessionIdAtomFamily } from "@/atoms/widget-atoms";
import { usePaginatedQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { formatDistanceToNow } from "date-fns";
import { ConversationStatusBadge } from "@workspace/ui/components/conversation-status-badge";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";

export const WidgetInboxScreen = () => {
  const setScreen = useSetAtom(screenAtoms);
  const organizationId = useAtomValue(organizationIdAtom);
  const setConversationId = useSetAtom(conversationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || "")
  );
  const conversations = usePaginatedQuery(
    api.public.conversations.getMany,
    contactSessionId ? { contactSessionId } : "skip",
    { initialNumItems: 10 }
  );
  const { topElementRef, handleLoadMore, canLoadMore, isLoadingMore } =
    useInfiniteScroll({
      status: conversations.status,
      loadMore: conversations.loadMore,
      loadSize: 10,
    });
  return (
    <>
      <WidgetHeader>
        <div className="flex items-center gap-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setScreen("selection")}
          >
            <MoveLeft />
            back
          </Button>
        </div>
      </WidgetHeader>
      <div className="flex flex-1 flex-col gap-y-2 p-4 overflow-y-auto">
        {conversations?.results.length > 0 &&
          conversations?.results.map((conversation) => (
            <Button
              className="h-20 w-full justify-between"
              key={conversation._id}
              onClick={() => {
                setConversationId(conversation._id);
                setScreen("chat");
              }}
              variant="outline"
            >
              <div className="flex flex-col w-full gap-4 overflow-hidden text-start">
                <div className="flex items-center w-full justify-between gap-x-2">
                  <p className="text-sm text-muted-foreground">Chat</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(conversation._creationTime), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <div className="flex w-full items-center justify-between gap-x-2">
                  <p className="text-sm truncate">
                    {conversation.lastMessage?.text}
                  </p>
                  <ConversationStatusBadge status={conversation.status} />
                </div>
              </div>
            </Button>
          ))}
        <InfiniteScrollTrigger
          ref={topElementRef}
          canLoadMore={canLoadMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={handleLoadMore}
        />
      </div>
      <WidgetFooter />
    </>
  );
};
