"use client";

import { WidgetHeader } from "../widget-header";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@workspace/ui/components/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field";
import { Button } from "@workspace/ui/components/button";
import { Loader2 } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

import { Doc } from "@workspace/backend/_generated/dataModel";
import { useAtomValue, useSetAtom } from "jotai";
import {
  contactSessionIdAtomFamily,
  organizationIdAtom,
  screenAtoms,
} from "@/atoms/widget-atoms";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
});

export const WidgetAuthScreen = () => {
  const organizationId = useAtomValue(organizationIdAtom);
  const setScreen = useSetAtom(screenAtoms);

  const setContactSessionId = useSetAtom(
    contactSessionIdAtomFamily(organizationId || "")
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const createSession = useMutation(api.public.contactSessions.create);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!organizationId) return;
    const metadata: Doc<"contactSessions">["metadata"] = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      vendor: navigator.vendor,
      screenResolution: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: new Date().getTimezoneOffset(),
      cookieEnabled: navigator.cookieEnabled,
      referrer: document.referrer || "direct",
      currentUrl: window.location.href,
    };
    const contactSessionId = await createSession({
      ...data,
      organizationId,
      metadata,
    });
    setContactSessionId(contactSessionId);
    setScreen("selection");
  };
  const isLoading = form.formState.isSubmitting;
  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2 px-2 py-6">
          <p className="font-semibold text-3xl">Hello!👋</p>
          <p className="font-semibold text-lg">Let&apos;s get you started</p>
        </div>
      </WidgetHeader>
      <form
        id="widget-auth-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="p-4"
      >
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="widget-auth-form-name">Name</FieldLabel>
                <Input
                  {...field}
                  id="widget-auth-form-name"
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                  placeholder="Your name"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="widget-auth-form-email">Email</FieldLabel>
                <Input
                  {...field}
                  id="widget-auth-form-email"
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                  placeholder="example@example.com"
                  type="email"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
        <Field orientation="horizontal" className="mt-4">
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? <Loader2 className="h-4 animate-spin" /> : "Continue"}
          </Button>
        </Field>
      </form>
    </>
  );
};
