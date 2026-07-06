import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { blocksToText, sanityFetch } from "../sanityQuery";

interface Faq {
  _id: string;
  question: string;
  answer?: unknown;
  category?: string;
  order?: number;
}

export default defineTool({
  name: "search_faq",
  title: "Search FAQ",
  description:
    "Search the frequently asked questions (자주 묻는 질문) of the 부천 동백 장애인활동지원센터. Optionally filter by a keyword that matches the question text.",
  inputSchema: {
    keyword: z
      .string()
      .optional()
      .describe("Optional keyword to filter questions (case-insensitive substring match)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ keyword }) => {
    const faqs = await sanityFetch<Faq[]>(
      `*[_type == "faq"] | order(order asc){ _id, question, answer, category, order }`,
    );
    let items = (faqs ?? []).map((f) => ({
      id: f._id,
      question: f.question,
      category: f.category ?? null,
      answer: blocksToText(f.answer),
    }));
    if (keyword && keyword.trim()) {
      const kw = keyword.trim().toLowerCase();
      items = items.filter(
        (f) =>
          f.question.toLowerCase().includes(kw) ||
          f.answer.toLowerCase().includes(kw),
      );
    }
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { faqs: items },
    };
  },
});
