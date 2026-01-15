import {
  contentHashFromArrayBuffer,
  Entry,
  EntryId,
  guessMimeTypeFromContents,
  guessMimeTypeFromExtension,
  vEntryId,
} from "@convex-dev/rag";
import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { Id } from "../_generated/dataModel";
import { action, mutation, query, QueryCtx } from "../_generated/server";
import { extractTextContent } from "../lib/extractTextContent";
import rag from "../system/ai/rag";

// Determine mime Type
function guessMimeType(filename: string, bytes: ArrayBuffer): string {
  return (
    guessMimeTypeFromExtension(filename) ||
    guessMimeTypeFromContents(bytes) ||
    "application/octet-stream"
  );
}

export const addFile = action({
  args: {
    filename: v.string(),
    mimeType: v.string(),
    bytes: v.bytes(),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "User is not authenticated",
      });
    }
    const orgId = identity.orgId as string;
    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Organization not found",
      });
    }

    const { filename, bytes, category } = args;

    const mimeType = args.mimeType || guessMimeType(filename, bytes);
    const blob = new Blob([bytes], { type: mimeType });

    const storageId = await ctx.storage.store(blob);

    const text = await extractTextContent(ctx, {
      storageId,
      filename,
      mimeType,
      bytes,
    });
    const { entryId, created } = await rag.add(ctx, {
      namespace: orgId,
      text,
      key: filename,
      metadata: {
        storageId,
        uploadedBy: orgId,
        filename,
        category: category ?? null,
      } as EntryMetadata,
      contentHash: await contentHashFromArrayBuffer(bytes),
    });
    if (!created) {
      console.debug("File already exists, skipping upload");
      await ctx.storage.delete(storageId);
      const existingEntry = await rag.getEntry(ctx, { entryId });
      const existingStorageId = existingEntry?.metadata
        ?.storageId as Id<"_storage">;
      return {
        url: existingStorageId
          ? await ctx.storage.getUrl(existingStorageId)
          : null,
        entryId,
      };
    }
    return {
      url: await ctx.storage.getUrl(storageId),
      entryId,
    };
  },
});

export const listFiles = query({
  args: {
    category: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "User is not authenticated",
      });
    }
    const orgId = identity.orgId as string;
    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Organization not found",
      });
    }
    const namespace = await rag.getNamespace(ctx, { namespace: orgId });
    if (!namespace) {
      return {
        page: [],
        isDone: true,
        continueCursor: "",
      };
    }
    const results = await rag.list(ctx, {
      namespaceId: namespace.namespaceId,
      paginationOpts: args.paginationOpts,
    });
    const files = await Promise.all(
      results.page.map((entry) => convertEntryToPublicFile(ctx, entry))
    );
    const filteredFiles = args.category
      ? files.filter((file) => file.category === args.category)
      : files;
    return {
      page: filteredFiles,
      isDone: results.isDone,
      continueCursor: results.continueCursor,
    };
  },
});

export const deleteFile = mutation({
  args: {
    entryId: vEntryId,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "User is not authenticated",
      });
    }
    const orgId = identity.orgId as string;
    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Organization not found",
      });
    }
    const namespace = await rag.getNamespace(ctx, { namespace: orgId });
    if (!namespace) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Namespace not found",
      });
    }
    // TODO: Implement file deletion logic
    const entry = await rag.getEntry(ctx, { entryId: args.entryId });
    if (!entry) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Entry not found",
      });
    }
    if (entry.metadata?.uploadedBy !== orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You are not authorized to delete this file",
      });
    }

    if (entry.metadata?.storageId) {
      await ctx.storage.delete(entry.metadata.storageId as Id<"_storage">);
    }
    await rag.deleteAsync(ctx, { entryId: args.entryId });
  },
});

export type PublicFile = {
  id: EntryId;
  name: string;
  size: string;
  type: string;
  status: "ready" | "processing" | "error";
  url: string | null;
  category?: string;
};
type EntryMetadata = {
  uploadedBy: string;
  storageId?: Id<"_storage">;
  filename: string;
  category?: string | null;
};

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
}

async function convertEntryToPublicFile(
  ctx: QueryCtx,
  entry: Entry
): Promise<PublicFile> {
  const metadata = entry.metadata as EntryMetadata | undefined;
  const storageId = metadata?.storageId;
  let fileSize = "unknown";
  if (storageId) {
    try {
      const storageMetadata = await ctx.db.system.get(storageId);
      if (storageMetadata) {
        fileSize = formatFileSize(storageMetadata.size);
      }
    } catch (error) {
      console.error("Error getting storage metadata:", error);
    }
  }
  const filename = entry.key || "unknown";
  const extension = filename.split(".").pop()?.toLowerCase() || "txt";

  let status: "ready" | "processing" | "error" = "error";
  if (entry.status === "ready") {
    status = "ready";
  } else if (entry.status === "pending") {
    status = "processing";
  }
  const url = storageId ? await ctx.storage.getUrl(storageId) : null;

  return {
    id: entry.entryId,
    name: filename,
    size: fileSize,
    type: extension,
    status,
    url,
    category: metadata?.category || undefined,
  };
}
