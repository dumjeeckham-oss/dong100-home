import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { blocksToText, sanityFetch } from "../sanityQuery";

interface Archive {
  _id: string;
  title: string;
  category?: string;
  description?: string;
  body?: unknown;
  publishedAt?: string;
  fileUrl?: string | null;
}

export default defineTool({
  name: "list_archives",
  title: "List archive documents",
  description:
    "List documents, forms, and reference materials from the 자료실 (archive) of the 부천 동백 장애인활동지원센터, including downloadable file URLs when available.",
  inputSchema: {
    limit: z
      .number()
      .int()
      .min(1)
      .max(50)
      .optional()
      .describe("Maximum number of documents to return (default 15)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }) => {
    const max = limit ?? 15;
    const archives = await sanityFetch<Archive[]>(
      `*[_type == "archive"] | order(publishedAt desc)[0...$max]{
        _id, title, category, description, body, publishedAt,
        "fileUrl": file.asset->url
      }`,
      { max },
    );
    const items = (archives ?? []).map((a) => ({
      id: a._id,
      title: a.title,
      category: a.category ?? null,
      description: a.description ?? blocksToText(a.body).slice(0, 500),
      publishedAt: a.publishedAt ?? null,
      fileUrl: a.fileUrl ?? null,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { archives: items },
    };
  },
});
