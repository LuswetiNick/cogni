import { WIDGET_SCREENS } from "./constants";

export type WidgetScreen = (typeof WIDGET_SCREENS)[number];

export type InitStep = "org" | "settings" | "session" | "vapi" | "done";
