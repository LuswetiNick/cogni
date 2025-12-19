"use client";

import {
  contactSessionIdAtomFamily,
  errorMessageAtom,
  loadingMessageAtom,
  organizationIdAtom,
  screenAtoms,
} from "@/atoms/widget-atoms";
import { TextShimmerWave } from "@workspace/ui/components/text-shimmer-wave";
import { useAction, useMutation } from "convex/react";
import { useAtomValue, useSetAtom } from "jotai";
import { useState, useEffect } from "react";
import { WidgetHeader } from "../widget-header";
import { api } from "@workspace/backend/_generated/api";
import { InitStep } from "@/types";
import { Id } from "@workspace/backend/_generated/dataModel";

export const WidgetLoadingScreen = ({
  organizationId,
}: {
  organizationId: string | null;
}) => {
  const [step, setStep] = useState<InitStep>("org");
  const [sessionValid, setSessionValid] = useState(false);
  const loadingMessage = useAtomValue(loadingMessageAtom);
  const setOrganizationId = useSetAtom(organizationIdAtom);
  const setLoadingMessage = useSetAtom(loadingMessageAtom);
  const setErrorMessage = useSetAtom(errorMessageAtom);
  const setScreen = useSetAtom(screenAtoms);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || "")
  );
  const validateOrganization = useAction(api.public.organizations.validate);

  useEffect(() => {
    if (step !== "org") {
      return;
    }
    setLoadingMessage("Loading organization...");
    if (!organizationId) {
      setErrorMessage("Organization ID is required.");
      setScreen("error");
      return;
    }
    setLoadingMessage("Validating organization...");
    console.log("Validating organization with ID:", organizationId);
    validateOrganization({ organizationId })
      .then((result) => {
        if (result.valid) {
          setOrganizationId(organizationId);
          setStep("session"); // Move to the next step after successful validation
        } else {
          setErrorMessage(result.reason || "Invalid organization.");
          setScreen("error");
        }
      })
      .catch(() => {
        setErrorMessage("Failed to validate organization.");
        setScreen("error");
      });
  }, [
    step,
    organizationId,
    setErrorMessage,
    setScreen,
    setLoadingMessage,
    setOrganizationId,
    validateOrganization,
    setStep,
  ]);
  // Validate contact session
  const validateContactSession = useMutation(
    api.public.contactSessions.validate
  );
  useEffect(() => {
    if (step !== "session") {
      return;
    }
    setLoadingMessage("Finding session...");
    if (!contactSessionId) {
      setSessionValid(false);
      setStep("done");
      return;
    }

    setLoadingMessage("Validating session...");

    validateContactSession({
      contactSessionId: contactSessionId as Id<"contactSessions">,
    })
      .then((result) => {
        setSessionValid(result.valid);
        setStep("done");
      })
      .catch(() => {
        setSessionValid(false);
        setStep("done");
      });
  }, [step, contactSessionId, validateContactSession, setLoadingMessage]);

  useEffect(() => {
    if (step !== "done") {
      return;
    }
    const hasValidSession = contactSessionId && sessionValid;
    setScreen(hasValidSession ? "selection" : "auth");
  }, [step, contactSessionId, sessionValid, setScreen]);

  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2 px-2 py-6">
          <p className="font-semibold text-3xl">Hello!👋</p>
          <p className="font-semibold text-lg">Let&apos;s get you started</p>
        </div>
      </WidgetHeader>
      <div className="flex flex-1 flex-col items-center justify-center gap-y-4 p-4">
        <TextShimmerWave
          duration={1}
          className=" font-semibold text-muted-foreground"
        >
          {loadingMessage || "Loading..."}
        </TextShimmerWave>
      </div>
    </>
  );
};
