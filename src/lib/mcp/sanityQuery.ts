// Shared helper to query the center's public Sanity content over HTTP.
// These are public project values (same as the browser client) — no secrets.
// Keep this import-safe: no env reads or I/O at module top level.

const SANITY_PROJECT_ID = "xczp11sl";
const SANITY_DATASET = "production";
const SANITY_API_VERSION = "2024-01-01";

export async function sanityFetch<T = unknown>(
  query: string,
  params: Record<string, string | number> = {},
): Promise<T> {
  const url = new URL(
    `https://${SANITY_PROJECT_ID}.apicdn.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`,
  );
  url.searchParams.set("query", query);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(`$${key}`, JSON.stringify(value));
  }

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Sanity query failed: ${res.status} ${res.statusText}`);
  }
  const json = (await res.json()) as { result: T };
  return json.result;
}

// Portable Text blocks -> plain text (best-effort, for AI-readable output).
export function blocksToText(blocks: unknown): string {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .map((block) => {
      const b = block as { _type?: string; children?: Array<{ text?: string }> };
      if (b?._type !== "block" || !Array.isArray(b.children)) return "";
      return b.children.map((c) => c?.text ?? "").join("");
    })
    .filter(Boolean)
    .join("\n");
}
