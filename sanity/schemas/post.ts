// Sanity Studio schema. Place this file in your Sanity Studio project's `schemas/` folder.
import { defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "게시물 (공지사항 / 활동 소식)",
  type: "document",
  fields: [
    defineField({
      name: "category",
      title: "카테고리",
      type: "string",
      options: {
        list: [
          { title: "공지사항", value: "notice" },
          { title: "활동 소식", value: "activity" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "title",
      title: "제목",
      type: "string",
      validation: (r) => r.required().max(120),
    }),
    defineField({
      name: "content",
      title: "내용",
      type: "text",
      rows: 6,
    }),
    defineField({
      name: "image",
      title: "이미지",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "date",
      title: "날짜",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
  ],
  orderings: [
    { title: "최신순", name: "dateDesc", by: [{ field: "date", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "image" },
  },
});
