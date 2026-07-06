import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { blocksToText, sanityFetch } from "../sanityQuery";

interface Notice {
  _id: string;
  title: string;
  content?: unknown;
  publishedAt?: string;
  important?: boolean;
}

export default defineTool({
  name: "list_notices",
  title: "List notices",
  description:
    "List the latest announcements (공지사항) published by the 부천 동백 장애인활동지원센터. Returns titles, publish dates, and content.",
  inputSchema: {
    limit: z
      .number()
      .int()
      .min(1)
      .max(50)
      .optional()
      .describe("Maximum number of notices to return (default 10)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }) => {
    const max = limit ?? 10;
    const notices = await sanityFetch<Notice[]>(
      `*[_type == "notice"] | order(publishedAt desc)[0...$max]{ _id, title, content, publishedAt, important }`,
      { max },
    );
    const items = (notices ?? []).map((n) => ({
      id: n._id,
      title: n.title,
      important: !!n.important,
      publishedAt: n.publishedAt ?? null,
      content: blocksToText(n.content),
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { notices: items },
    };
  },
});
