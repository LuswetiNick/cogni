import { CONTACT_SESSION_KEY } from "@/constants";
import { WidgetScreen } from "@/types";
import { Id } from "@workspace/backend/_generated/dataModel";
import { atom } from "jotai";
import { atomFamily } from "jotai-family";
import { atomWithStorage } from "jotai/utils";

export const screenAtoms = atom<WidgetScreen>("loading");
export const organizationIdAtom = atom<string | null>(null);

// Organization scope contact session
export const contactSessionIdAtomFamily = atomFamily(
  (organizationId: string) => {
    return atomWithStorage<Id<"contactSessions"> | null>(
      `${CONTACT_SESSION_KEY}_${organizationId}`,
      null
    );
  }
);

export const errorMessageAtom = atom<string | null>(null);
export const loadingMessageAtom = atom<string | null>(null);
