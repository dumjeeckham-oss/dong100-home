import React from "react";
import { TEXT_COLORS, HIGHLIGHT_COLORS, TEXT_SIZES } from "./textStyles";

// Sanity 데코레이터: 툴바에 버튼으로 바로 노출되고(한 번 클릭 적용),
// component 가 에디터 안에서 실제 스타일을 즉시 렌더링(WYSIWYG)합니다.

type DecoratorChildren = { children?: React.ReactNode };

// 글자 색상 데코레이터
export const colorDecorators = TEXT_COLORS.map((c) => ({
  title: c.title,
  value: c.value,
  icon: () => (
    <span style={{ color: c.color, fontWeight: 800, fontSize: 16 }}>A</span>
  ),
  component: ({ children }: DecoratorChildren) => (
    <span style={{ color: c.color }}>{children}</span>
  ),
}));

// 형광펜(배경색) 데코레이터
export const highlightDecorators = HIGHLIGHT_COLORS.map((c) => ({
  title: c.title,
  value: c.value,
  icon: () => (
    <span
      style={{
        backgroundColor: c.color,
        color: "#111",
        fontWeight: 700,
        fontSize: 14,
        padding: "0 3px",
        borderRadius: 3,
      }}
    >
      H
    </span>
  ),
  component: ({ children }: DecoratorChildren) => (
    <span style={{ backgroundColor: c.color, borderRadius: 3, padding: "0 2px" }}>
      {children}
    </span>
  ),
}));

// 글자 크기 데코레이터
export const sizeDecorators = TEXT_SIZES.map((s) => ({
  title: s.title,
  value: s.value,
  icon: () => (
    <span style={{ fontSize: s.em === "0.85em" ? 11 : s.em === "1.25em" ? 17 : 20, fontWeight: 700 }}>
      A
    </span>
  ),
  component: ({ children }: DecoratorChildren) => (
    <span style={{ fontSize: s.em }}>{children}</span>
  ),
}));
