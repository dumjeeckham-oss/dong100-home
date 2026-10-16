import type { PortableTextComponents } from "@portabletext/react";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/lib/sanity";
import { TEXT_COLORS, HIGHLIGHT_COLORS, TEXT_SIZES } from "../../sanity/schemas/textStyles";

// 에디터에서 한 번 클릭으로 적용한 색상/형광/크기 데코레이터를 프런트엔드에서 동일하게 렌더링
const decoratorMarks: PortableTextComponents["marks"] = {};
TEXT_COLORS.forEach((c) => {
  decoratorMarks[c.value] = ({ children }: { children?: React.ReactNode }) => (
    <span style={{ color: c.color }}>{children}</span>
  );
});
HIGHLIGHT_COLORS.forEach((c) => {
  decoratorMarks[c.value] = ({ children }: { children?: React.ReactNode }) => (
    <span style={{ backgroundColor: c.color, borderRadius: 3, padding: "0 2px" }}>{children}</span>
  );
});
TEXT_SIZES.forEach((s) => {
  decoratorMarks[s.value] = ({ children }: { children?: React.ReactNode }) => (
    <span style={{ fontSize: s.em }}>{children}</span>
  );
});

const sizeClass: Record<string, string> = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
};

const imgWidth: Record<string, number> = {
  small: 360,
  medium: 720,
  large: 1080,
  full: 1600,
};

const imgWrapClass: Record<string, string> = {
  small: "max-w-[60%] sm:max-w-[40%]",
  medium: "max-w-full sm:max-w-[70%]",
  large: "max-w-full sm:max-w-[90%]",
  full: "w-full",
};

const alignWrapClass: Record<string, string> = {
  left: "mr-auto ml-0 text-left",
  center: "mx-auto text-center",
  right: "ml-auto mr-0 text-right",
};

export const portableComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => <h1 className="text-3xl md:text-4xl font-bold mt-6 mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl md:text-3xl font-bold mt-5 mb-3">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl md:text-2xl font-semibold mt-4 mb-2">{children}</h3>,
    h4: ({ children }) => <h4 className="text-lg md:text-xl font-semibold mt-3 mb-2">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => <p className="leading-relaxed my-3">{children}</p>,
  },
  marks: {
    ...decoratorMarks,
    color: ({ children, value }: { children?: React.ReactNode; value?: { hex?: string; hsl?: { h: number; s: number; l: number } } }) => (
      <span style={{ color: value?.hex || value?.hsl ? `hsl(${value.hsl.h}, ${value.hsl.s}%, ${value.hsl.l}%)` : undefined }}>{children}</span>
    ),
    highlight: ({ children, value }: { children?: React.ReactNode; value?: { hex?: string; hsl?: { h: number; s: number; l: number } } }) => (
      <span style={{ backgroundColor: value?.hex || value?.hsl ? `hsl(${value.hsl.h}, ${value.hsl.s}%, ${value.hsl.l}%)` : undefined }}>{children}</span>
    ),
    size: ({ children, value }: { children?: React.ReactNode; value?: { value?: string } }) => (
      <span className={sizeClass[value?.value ?? "base"] ?? "text-base"}>{children}</span>
    ),
    link: ({ children, value }: { children?: React.ReactNode; value?: { href?: string; openInNewTab?: boolean } }) => (
      <a
        href={value?.href}
        target={value?.openInNewTab ? "_blank" : undefined}
        rel={value?.openInNewTab ? "noopener noreferrer" : undefined}
        className="text-primary underline underline-offset-2 hover:opacity-80"
      >
        {children}
      </a>
    ),
    underline: ({ children }) => <span className="underline">{children}</span>,
    "strike-through": ({ children }) => <span className="line-through">{children}</span>,
  },
  types: {
    inlineLink: ({
      value,
    }: {
      value?: { text?: string; href?: string; openInNewTab?: boolean };
    }) => {
      if (!value?.href) return null;
      return (
        <a
          href={value.href}
          target={value.openInNewTab === false ? undefined : "_blank"}
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-2 hover:opacity-80"
        >
          {value.text || value.href}
        </a>
      );
    },
    richTable: ({
      value,
    }: {
      value?: { caption?: string; rows?: Array<{ _key: string; cells?: Array<{ _key: string; content?: any[]; header?: boolean }> }> };
    }) => {
      if (!value?.rows || value.rows.length === 0) return null;
      return (
        <figure className="my-6 overflow-x-auto">
          {value.caption && (
            <figcaption className="text-sm text-center text-muted-foreground mb-2 font-medium">
              {value.caption}
            </figcaption>
          )}
          <table className="w-full border-collapse border border-border text-sm">
            <tbody>
              {value.rows.map((row) => (
                <tr key={row._key} className="border-b border-border">
                  {row.cells?.map((cell) => {
                    const CellTag = cell.header ? 'th' : 'td';
                    return (
                      <CellTag
                        key={cell._key}
                        className={
                          cell.header
                            ? 'px-3 py-2 bg-muted font-bold text-center align-middle border-r border-border last:border-r-0'
                            : 'px-3 py-2 align-middle border-r border-border last:border-r-0'
                        }
                      >
                        {cell.content ? (
                          <PortableText
                            value={cell.content}
                            components={{
                              block: {
                                normal: ({ children }) => <span className="leading-relaxed">{children}</span>,
                              },
                              marks: decoratorMarks,
                            } as PortableTextComponents}
                          />
                        ) : null}
                      </CellTag>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </figure>
      );
    },
    image: ({
      value,
    }: {
      value?: { asset?: unknown; alt?: string; size?: string; align?: string };
    }) => {
      if (!value?.asset) return null;
      const size = value.size ?? "medium";
      const align = value.align ?? "center";
      const w = imgWidth[size] ?? 720;
      return (
        <figure className={`my-5 ${alignWrapClass[align] ?? alignWrapClass.center}`}>
          <img
            src={urlFor(value).width(w).auto("format").url()}
            alt={value.alt ?? ""}
            loading="lazy"
            className={`rounded-lg h-auto w-full inline-block ${imgWrapClass[size] ?? imgWrapClass.medium}`}
          />
        </figure>
      );
    },
  },
};

// 본문에 그냥 입력한 URL(https://..., www....)을 자동으로 클릭 가능한 링크로 변환
const URL_RE = /((?:https?:\/\/|www\.)[^\s<>"']+[^\s<>"'.,!?)\]])/g;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function linkifyBlocks(blocks: any): any {
  if (!Array.isArray(blocks)) return blocks;
  return blocks.map((block) => {
    if (block?._type !== "block" || !Array.isArray(block.children)) {
      if (block?._type === "richTable" && Array.isArray(block.rows)) {
        return { ...block, rows: block.rows.map((r: any) => ({ ...r, cells: r.cells?.map((c: any) => ({ ...c, content: linkifyBlocks(c.content) })) })) };
      }
      return block;
    }
    const markDefs = [...(block.markDefs ?? [])];
    const linkKeys = new Set(markDefs.filter((m: any) => m._type === "link").map((m: any) => m._key));
    const children: any[] = [];
    block.children.forEach((span: any, si: number) => {
      const marks: string[] = span.marks ?? [];
      if (span._type !== "span" || typeof span.text !== "string" || marks.some((m) => linkKeys.has(m))) {
        children.push(span);
        return;
      }
      const parts = span.text.split(URL_RE);
      if (parts.length === 1) { children.push(span); return; }
      parts.forEach((part: string, pi: number) => {
        if (!part) return;
        if (pi % 2 === 1) {
          const key = `auto-${si}-${pi}`;
          markDefs.push({ _key: key, _type: "link", href: part.startsWith("http") ? part : `https://${part}`, openInNewTab: true });
          children.push({ ...span, _key: `${span._key}-${pi}`, text: part, marks: [...marks, key] });
        } else {
          children.push({ ...span, _key: `${span._key}-${pi}`, text: part });
        }
      });
    });
    return { ...block, markDefs, children };
  });
}

export function LinkifiedText({ text }: { text: string }) {
  const parts = text.split(URL_RE);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <a key={i} href={p.startsWith("http") ? p : `https://${p}`} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 break-all hover:opacity-80">{p}</a>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}
