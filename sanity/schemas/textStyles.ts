// 에디터 툴바와 프런트엔드 렌더러가 공유하는 텍스트 스타일 정의.
// 여기에 항목을 추가하면 Sanity 에디터 툴바와 홈페이지 출력에 모두 자동 반영됩니다.

export interface StyleDef {
  value: string;
  title: string;
  color: string;
}

// 글자 색상 (한 번 클릭으로 적용되는 데코레이터)
export const TEXT_COLORS: StyleDef[] = [
  { value: "textRed", title: "빨강 글자", color: "#dc2626" },
  { value: "textOrange", title: "주황 글자", color: "#ea580c" },
  { value: "textGreen", title: "초록 글자", color: "#16a34a" },
  { value: "textBlue", title: "파랑 글자", color: "#2563eb" },
  { value: "textPurple", title: "보라 글자", color: "#9333ea" },
];

// 형광펜(배경색) — 한 번 클릭으로 적용
export const HIGHLIGHT_COLORS: StyleDef[] = [
  { value: "hlYellow", title: "노랑 형광", color: "#fef08a" },
  { value: "hlGreen", title: "초록 형광", color: "#bbf7d0" },
  { value: "hlPink", title: "분홍 형광", color: "#fbcfe8" },
  { value: "hlBlue", title: "파랑 형광", color: "#bfdbfe" },
];

// 글자 크기 — 한 번 클릭으로 적용 (em 단위, 본문 대비 상대 크기)
export interface SizeDef {
  value: string;
  title: string;
  em: string;
}

export const TEXT_SIZES: SizeDef[] = [
  { value: "sizeSm", title: "작게", em: "0.85em" },
  { value: "sizeLg", title: "크게", em: "1.25em" },
  { value: "sizeXl", title: "아주 크게", em: "1.6em" },
];
