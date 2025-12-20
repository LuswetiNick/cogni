"use client";

import { WidgetView } from "@/components/widget-view";
import { use } from "react";

interface WidgetPageProps {
  searchParams: Promise<{ organizationId: string }>;
}

export default function Page({ searchParams }: WidgetPageProps) {
  const { organizationId } = use(searchParams);
  return <WidgetView organizationId={organizationId} />;
}
