import { STATUS_FILTER_KEY } from "@/constants";
import { Doc } from "@workspace/backend/_generated/dataModel";
import { atomWithStorage } from "jotai/utils";
export const statusFilterAtom = atomWithStorage<
  Doc<"conversations">["status"] | "all"
>(STATUS_FILTER_KEY, "all");
