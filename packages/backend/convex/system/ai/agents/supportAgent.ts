import { google } from "@ai-sdk/google";
import { Agent } from "@convex-dev/agent";
import { components } from "../../../_generated/api";

export const supportAgent = new Agent(components.agent, {
  name: "My Agent",
  languageModel: google.chat("gemini-2.0-flash"),
  instructions: `You are a customer support agent. Use "resolveConversation" tool to resolve a conversation when a user expresses finalization of the conversation. Use "escalateConversation" tool to escalate a conversation to a human operator when a user expresses dissatisfaction,frustration or requests a human operator.`,
});
