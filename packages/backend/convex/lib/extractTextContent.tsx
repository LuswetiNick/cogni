import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import type { StorageActionWriter } from "convex/server";
import { assert } from "convex-helpers";
import { Id } from "../_generated/dataModel";

const AI_MODELS = {
  image: google.chat("gemini-2.0-flash"),
  pdf: google.chat("gemini-2.0-flash"),
  html: google.chat("gemini-2.0-flash"),
} as const;

const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const SYSTEM_PROMPTS = {
  image:
    "You turn images into text. If it is a photo of a document, transcribe it. If it is not a document, describe it.",
  pdf: "You transform PDF files into text",
  html: "You turn HTML content into markdown",
};

export type ExtractTextContentArgs = {
  storageId: Id<"_storage">;
  filename: string;
  mimeType: string;
  bytes?: ArrayBuffer;
};

async function extractTextContentFromImage(url: string): Promise<string> {
  const result = await generateText({
    model: AI_MODELS.image,
    system: SYSTEM_PROMPTS.image,
    messages: [
      {
        role: "user",
        content: [{ type: "image", image: new URL(url) }],
      },
    ],
  });
  return result.text;
}

async function extractTextContentFromPdf(
  url: string,
  filename: string,
  mimeType: string
): Promise<string> {
  const result = await generateText({
    model: AI_MODELS.pdf,
    system: SYSTEM_PROMPTS.pdf,
    messages: [
      {
        role: "user",
        content: [
          { type: "file", data: new URL(url), mediaType: mimeType, filename },
          {
            type: "text",
            text: "Extract the text content from the PDF file",
          },
        ],
      },
    ],
  });
  return result.text;
}

async function extractTextFileContent(
  ctx: { storage: StorageActionWriter },
  storageId: Id<"_storage">,
  bytes: ArrayBuffer | undefined,
  mimeType: string
): Promise<string> {
  const arrayBuffer =
    bytes || (await (await ctx.storage.get(storageId))?.arrayBuffer());
  if (!arrayBuffer) {
    throw new Error("Failed to get file");
  }

  const text = new TextDecoder().decode(arrayBuffer);
  if (mimeType.toLowerCase() !== "text/plain") {
    const result = await generateText({
      model: AI_MODELS.html,
      system: SYSTEM_PROMPTS.html,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text },
            {
              type: "text",
              text: "Extract the text content from the HTML file and print it in markdown format",
            },
          ],
        },
      ],
    });
    return result.text;
  }
  return text;
}

export async function extractTextContent(
  ctx: { storage: StorageActionWriter },
  args: ExtractTextContentArgs
): Promise<string> {
  const { storageId, filename, mimeType, bytes } = args;
  const url = await ctx.storage.getUrl(storageId);
  assert(url, "Failed to get storage Url");
  const a = url;
  if (SUPPORTED_IMAGE_TYPES.some((type) => type === mimeType)) {
    return extractTextContentFromImage(url);
  }
  if (mimeType.toLowerCase().includes("pdf")) {
    return extractTextContentFromPdf(url, filename, mimeType);
  }
  if (mimeType.toLowerCase().includes("text")) {
    return extractTextFileContent(ctx, storageId, bytes, mimeType);
  }
  throw new Error(`Unsupported file type: ${mimeType}`);
}
