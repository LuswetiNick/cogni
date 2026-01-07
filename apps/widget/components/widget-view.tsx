"use client";

import { screenAtoms } from "@/atoms/widget-atoms";
import { WidgetAuthScreen } from "./screens/widget-auth";
import { useAtomValue } from "jotai";
import { WidgetErrorScreen } from "./screens/widget-error";
import { WidgetLoadingScreen } from "./screens/widget-loading";
import { WidgetSelectionScreen } from "./screens/widget-selection";
import { WidgetChatScreen } from "./screens/widget-chat";
import { WidgetInboxScreen } from "./screens/widget-inbox";

interface WidgetViewProps {
  organizationId: string | null;
}

export const WidgetView = ({ organizationId }: WidgetViewProps) => {
  const screen = useAtomValue(screenAtoms);
  const screenComponents = {
    error: <WidgetErrorScreen />,
    loading: <WidgetLoadingScreen organizationId={organizationId} />,
    auth: <WidgetAuthScreen />,
    voice: <div>Voice</div>,
    inbox: <WidgetInboxScreen />,
    selection: <WidgetSelectionScreen />,
    chat: <WidgetChatScreen />,
    contact: <div>Contact</div>,
  };
  return (
    <main className="min-h-screen min-w-screen flex w-full h-full flex-col overflow-hidden rounded-md border bg-muted ">
      {screenComponents[screen]}
    </main>
  );
};
