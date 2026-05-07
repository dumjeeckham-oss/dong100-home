import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const ALLOWED = new Set(["support4", "support5"]);

function pick(xml: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = xml.match(re);
  if (!m) return "";
  let v = m[1].trim();
  const cdata = v.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/);
  if (cdata) v = cdata[1];
  return v.trim();
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

function normalizeLink(link: string, guid: string, block: string, boTable: string): string {
  let url = decodeEntities(decodeEntities(link || guid || ""));
  if (url) return url;
  const idMatch = block.match(/wr_id[=:]?\s*(\d+)/i);
  if (idMatch) {
    return `https://bcmedcoop.org/bbs/board.php?bo_table=${boTable}&wr_id=${idMatch[1]}`;
  }
  return "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    let boTable = "support4";
    try {
      if (req.method === "POST") {
        const body = await req.json().catch(() => ({}));
        if (body?.bo_table && ALLOWED.has(body.bo_table)) boTable = body.bo_table;
      } else {
        const url = new URL(req.url);
        const q = url.searchParams.get("bo_table");
        if (q && ALLOWED.has(q)) boTable = q;
      }
    } catch (_) { /* ignore */ }

    const RSS_URL = `https://bcmedcoop.org/bbs/rss.php?bo_table=${boTable}`;
    const res = await fetch(RSS_URL, { headers: { "User-Agent": "Mozilla/5.0" } });
    const xml = await res.text();

    const items: Array<Record<string, string>> = [];
    const itemRe = /<item[^>]*>([\s\S]*?)<\/item>/gi;
    let m;
    while ((m = itemRe.exec(xml)) !== null) {
      const block = m[1];
      const description = pick(block, "description");
      const rawLink = pick(block, "link");
      const guid = pick(block, "guid");
      items.push({
        title: decodeEntities(pick(block, "title")),
        link: normalizeLink(rawLink, guid, block, boTable),
        pubDate: pick(block, "pubDate") || pick(block, "dc:date"),
        description: stripHtml(decodeEntities(description)).slice(0, 200),
      });
    }

    return new Response(JSON.stringify({ items, bo_table: boTable }), {
      headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "public, max-age=600" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e), items: [] }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
