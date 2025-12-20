"use client";

import { errorMessageAtom } from "@/atoms/widget-atoms";
import { useAtomValue } from "jotai";
import { WidgetHeader } from "../widget-header";
import { AlertTriangle } from "lucide-react";

export const WidgetErrorScreen = () => {
  const errorMessage = useAtomValue(errorMessageAtom);
  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2 px-2 py-6">
          <p className="font-semibold text-3xl">Hello!👋</p>
          <p className="font-semibold text-lg">Let&apos;s get you started</p>
        </div>
      </WidgetHeader>
      <div className="flex flex-1 flex-col items-center justify-center gap-y-4 p-4">
        <AlertTriangle className="size-8 text-destructive" />
        <h2 className="text-sm font-semibold text-muted-foreground">
          {errorMessage || "An unexpected error occurred."}
        </h2>
      </div>
    </>
  );
};
