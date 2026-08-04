import { defineArrayMember, defineField, defineType } from "sanity";
import { colorDecorators, highlightDecorators, sizeDecorators } from "./marks";

// 표 내부 텍스트 블록 (한 셀 안에 여러 줄·서식 가능한 rich text)
const tableCellBlock = defineArrayMember({
  type: "block",
  styles: [
    { title: "본문", value: "normal" },
    { title: "제목 3", value: "h3" },
    { title: "제목 4", value: "h4" },
  ],
  lists: [
    { title: "글머리", value: "bullet" },
    { title: "번호", value: "number" },
  ],
  marks: {
    decorators: [
      { title: "굵게", value: "strong" },
      { title: "기울임", value: "em" },
      { title: "밑줄", value: "underline" },
      { title: "취소선", value: "strike-through" },
      ...colorDecorators,
      ...highlightDecorators,
      ...sizeDecorators,
    ],
    annotations: [
      {
        name: "color",
        title: "글자 색상",
        type: "color",
      },
      {
        name: "highlight",
        title: "글자 배경색",
        type: "color",
      },
      {
        name: "link",
        title: "링크",
        type: "object",
        fields: [
          defineField({ name: "href", title: "URL", type: "url" }),
        ],
      },
    ],
  },
});

// 표(Table) 커스텀 타입: 행(row) × 열(col)을 직접 입력하는 구조
const tableType = defineType({
  name: "richTable",
  title: "표",
  type: "object",
  fields: [
    defineField({
      name: "caption",
      title: "표 제목 (선택)",
      type: "string",
    }),
    defineField({
      name: "rows",
      title: "행",
      type: "array",
      of: [
        defineArrayMember({
          name: "tableRow",
          title: "행",
          type: "object",
          fields: [
            defineField({
              name: "cells",
              title: "열",
              type: "array",
              of: [
                defineArrayMember({
                  name: "tableCell",
                  title: "셀",
                  type: "object",
                  fields: [
                    defineField({
                      name: "content",
                      title: "내용",
                      type: "array",
                      of: [tableCellBlock],
                    }),
                    defineField({
                      name: "header",
                      title: "헤더 셀 (굵게 + 가운데 정렬)",
                      type: "boolean",
                      initialValue: false,
                    }),
                  ],
                  preview: {
                    select: {
                      content: "content",
                      header: "header",
                    },
                    prepare: ({ content, header }: { content?: any[]; header?: boolean }) => {
                      const text = content?.find((b: any) => b._type === "block")?.children?.find((c: any) => c._type === "span")?.text || "(빈 셀)";
                      return { title: (header ? "[헤더] " : "") + text };
                    },
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: { cells: "cells" },
            prepare: ({ cells }: { cells?: any[] }) => {
              const cellCount = cells?.length ?? 0;
              return { title: `${cellCount}개 열` };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      caption: "caption",
      rows: "rows",
    },
    prepare: ({ caption, rows }: { caption?: string; rows?: any[] }) => {
      const rowCount = rows?.length ?? 0;
      return { title: caption || `표 (${rowCount}행)` };
    },
  },
});

export { tableType };

// Reusable rich content (Block Content) with color, text size, headings, table, and image with size/alignment.
export const richBlock = [
  defineArrayMember({
    type: "block",
    styles: [
      { title: "본문", value: "normal" },
      { title: "제목 1", value: "h1" },
      { title: "제목 2", value: "h2" },
      { title: "제목 3", value: "h3" },
      { title: "제목 4", value: "h4" },
      { title: "인용", value: "blockquote" },
    ],
    lists: [
      { title: "글머리", value: "bullet" },
      { title: "번호", value: "number" },
    ],
    marks: {
      decorators: [
        { title: "굵게", value: "strong" },
        { title: "기울임", value: "em" },
        { title: "밑줄", value: "underline" },
        { title: "취소선", value: "strike-through" },
        { title: "코드", value: "code" },
        // 한 번 클릭으로 적용 + 에디터 내 실시간 미리보기 (WYSIWYG)
        ...colorDecorators,
        ...highlightDecorators,
        ...sizeDecorators,
      ],
      annotations: [
        {
          name: "color",
          title: "글자 색상",
          type: "color",
        },
        {
          name: "highlight",
          title: "글자 배경색",
          type: "color",
        },
        {
          name: "size",
          title: "글자 크기",
          type: "object",
          fields: [
            defineField({
              name: "value",
              title: "크기",
              type: "string",
              options: {
                list: [
                  { title: "아주 작게", value: "xs" },
                  { title: "작게", value: "sm" },
                  { title: "보통", value: "base" },
                  { title: "크게", value: "lg" },
                  { title: "더 크게", value: "xl" },
                  { title: "아주 크게", value: "2xl" },
                ],
              },
            }),
          ],
        },
        {
          name: "link",
          title: "링크",
          type: "object",
          fields: [
            defineField({ name: "href", title: "URL", type: "url" }),
            defineField({ 
              name: "openInNewTab", 
              title: "새 탭에서 열기", 
              type: "boolean", 
              initialValue: false 
            }),
          ],
        },
      ],
    },
  }),
  defineArrayMember({ type: "richTable" }),
  defineArrayMember({
    type: "image",
    options: { hotspot: true },
    fields: [
      defineField({ name: "alt", title: "대체 텍스트", type: "string" }),
      defineField({
        name: "size",
        title: "이미지 크기",
        type: "string",
        options: {
          list: [
            { title: "작게", value: "small" },
            { title: "중간", value: "medium" },
            { title: "크게", value: "large" },
            { title: "전체 너비", value: "full" },
          ],
          layout: "radio",
        },
        initialValue: "medium",
      }),
      defineField({
        name: "align",
        title: "정렬",
        type: "string",
        options: {
          list: [
            { title: "왼쪽", value: "left" },
            { title: "가운데", value: "center" },
            { title: "오른쪽", value: "right" },
          ],
          layout: "radio",
        },
        initialValue: "center",
      }),
    ],
  }),
];
