"use client";

import { screenAtoms } from "@/atoms/widget-atoms";
import { WidgetAuthScreen } from "./screens/widget-auth";
import { useAtomValue } from "jotai";
import { WidgetErrorScreen } from "./screens/widget-error";
import { WidgetLoadingScreen } from "./screens/widget-loading";

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
    inbox: <div>Inbox</div>,
    selection: <div>Selection</div>,
    chat: <div>Chat</div>,
    contact: <div>Contact</div>,
  };
  return (
    <main className="min-h-screen min-w-screen flex w-full h-full flex-col overflow-hidden rounded-md border bg-muted ">
      {screenComponents[screen]}
    </main>
  );
};
