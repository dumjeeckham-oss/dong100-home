import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PortableText } from "@portabletext/react";
import { portableComponents } from "@/components/portableComponents";

// Studio의 "링크" 삽입(이미지 올리기와 같은 메뉴)으로 들어간 본문 데이터
const withLink = [
  {
    _type: "block",
    _key: "b1",
    style: "normal",
    markDefs: [],
    children: [
      { _type: "span", _key: "s1", text: "신청은 ", marks: [] },
      {
        _type: "inlineLink",
        _key: "l1",
        text: "여기서",
        href: "https://dong100.org/apply",
        openInNewTab: true,
      },
      { _type: "span", _key: "s2", text: " 가능합니다", marks: [] },
    ],
  },
];

describe("본문 인라인 링크", () => {
  it("링크 글자를 누르면 입력한 주소로 이동한다", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render(<PortableText value={withLink as any} components={portableComponents} />);
    const link = screen.getByRole("link", { name: "여기서" });
    expect(link).toHaveAttribute("href", "https://dong100.org/apply");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("새 창 옵션을 끄면 같은 창에서 열린다", () => {
    const sameTab = [
      {
        _type: "block",
        _key: "b2",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "inlineLink",
            _key: "l2",
            text: "자세히",
            href: "https://dong100.org",
            openInNewTab: false,
          },
        ],
      },
    ];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render(<PortableText value={sameTab as any} components={portableComponents} />);
    const link = screen.getByRole("link", { name: "자세히" });
    expect(link).toHaveAttribute("href", "https://dong100.org");
    expect(link).not.toHaveAttribute("target");
  });
});
