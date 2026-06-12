import { defineField, defineType } from "sanity";
import { richBlock } from "./richBlock";

export const userArchive = defineType({
  name: "userArchive",
  title: "이용자 자료실",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "제목",
      type: "string",
      validation: (r) => r.required().max(150),
    }),
    {
      name: 'category',
      title: '게시판 분류',
      type: 'string',
      options: {
        list: [
          { title: '서비스제공 관련', value: 'service' },
          { title: '필요 정보', value: 'info' }
        ],
        layout: 'radio'
      }
    },
    defineField({
      name: "description",
      title: "한 줄 요약 (목록 표시용)",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "body",
      title: "본문 (이미지·서식 포함)",
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
      name: "file",
      title: "첨부 파일 (HWP, PDF, DOCX 등) — 선택",
      type: "file",
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
          preview: {
            select: {
              media: "asset",
              alt: "alt",
            },
            prepare: (selection) => ({
              media: selection.media,
              title: selection.alt || "이미지",
            }),
          },
        }),
      ],
      options: {
        layout: "grid",
      },
    }),
  ],
  orderings: [
    { title: "최신순", name: "dateDesc", by: [{ field: "publishedAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", subtitle: "publishedAt" },
  },
});
