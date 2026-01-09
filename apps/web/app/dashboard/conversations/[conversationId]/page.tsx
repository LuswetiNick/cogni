import { Id } from "@workspace/backend/_generated/dataModel";
import ConversationIdView from "../_components/conversation-id-view";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;
  return (
    <ConversationIdView
      conversationId={conversationId as Id<"conversations">}
    />
  );
}
