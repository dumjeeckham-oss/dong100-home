import { defineArrayMember, defineField } from "sanity";

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
      ],
      annotations: [
        {
          name: "color",
          title: "글자 색상",
          type: "object",
          fields: [
            defineField({
              name: "value",
              title: "색상",
              type: "string",
              options: {
                list: [
                  { title: "검정", value: "#111111" },
                  { title: "회색", value: "#6b7280" },
                  { title: "빨강", value: "#dc2626" },
                  { title: "주황", value: "#ea580c" },
                  { title: "노랑", value: "#ca8a04" },
                  { title: "초록", value: "#16a34a" },
                  { title: "파랑", value: "#2563eb" },
                  { title: "보라", value: "#7c3aed" },
                ],
              },
            }),
          ],
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
