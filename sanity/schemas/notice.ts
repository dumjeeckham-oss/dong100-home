import { defineField, defineType } from "sanity";
import { richBlock } from "./richBlock";

export const notice = defineType({
  name: "notice",
  title: "공지사항",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "제목",
      type: "string",
      validation: (r) => r.required().max(150),
    }),
    defineField({
      name: "content",
      title: "내용",
      type: "array",
      of: richBlock,
    }),
    defineField({
      name: "publishedAt",
      title: "작성일",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({
      name: "important",
      title: "중요공지",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "images",
      title: "첨부 이미지",
      type: "array",
      of: [
        defineField({
          name: "image",
          title: "이미지",
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "대체 텍스트", type: "string" }),
          ],
        }),
      ],
    }),
  ],
  orderings: [
    { title: "최신순", name: "dateDesc", by: [{ field: "publishedAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", subtitle: "publishedAt", media: "images.0.image" },
  },
});
