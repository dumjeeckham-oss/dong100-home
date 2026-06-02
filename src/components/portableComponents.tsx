import type { PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/lib/sanity";

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
    color: ({ children, value }: { children?: React.ReactNode; value?: { value?: string } }) => (
      <span style={{ color: value?.value }}>{children}</span>
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
    table: ({ value }: { value?: { rows?: any[] } }) => {
      if (!value?.rows || value.rows.length === 0) return null;
      return (
        <div className="my-6 overflow-x-auto">
          <table className="min-w-full border-collapse border border-border">
            <tbody>
              {value.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-border">
                  {row.cells?.map((cell: any, cellIndex: number) => (
                    <td
                      key={cellIndex}
                      className="border border-border px-4 py-2 text-sm"
                      dangerouslySetInnerHTML={{ __html: cell }}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },
  },
};
