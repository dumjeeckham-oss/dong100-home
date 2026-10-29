import type { VercelRequest, VercelResponse } from '@vercel/node';

// 게시물 링크 공유 시 카카오톡·페이스북 등이 읽는 미리보기(제목/요약/사진)를 게시물별로 넣어줍니다.
const SITE = 'https://dong100.org';
const DEFAULT_IMAGE = `${SITE}/og-default.jpg`;
const TYPES: Record<string, { doc: string; path: string; label: string }> = {
  notice: { doc: 'notice', path: 'notice', label: '공지사항' },
  archive: { doc: 'archive', path: 'archive', label: '서식 자료실' },
  'user-archive': { doc: 'userArchive', path: 'user-archive', label: '이용자 자료실' },
};

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function setMeta(html: string, attr: 'property' | 'name', key: string, value: string) {
  const re = new RegExp(`<meta\\s+${attr}="${key}"[^>]*>`, 'g');
  const tag = `<meta ${attr}="${key}" content="${esc(value)}" />`;
  return re.test(html) ? html.replace(re, tag) : html.replace('</head>', `    ${tag}\n  </head>`);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const type = TYPES[String(req.query.type || '')];
  const id = String(req.query.id || '').replace(/\/$/, '');
  const host = req.headers.host || 'dong100.org';

  let html: string;
  try {
    const r = await fetch(`https://${host}/index.html`);
    html = await r.text();
  } catch {
    return res.redirect(302, '/');
  }

  try {
    if (type && id) {
      const query = `*[_type == $t && _id == $id && !(_id in path("drafts.**"))][0]{
        title, description,
        "img": coalesce(images[0].image.asset->url, content[_type=="image"][0].asset->url, body[_type=="image"][0].asset->url),
        "text": pt::text(coalesce(content, body))
      }`;
      const url = `https://xczp11sl.apicdn.sanity.io/v2024-01-01/data/query/production?query=${encodeURIComponent(query)}&%24t=${encodeURIComponent(JSON.stringify(type.doc))}&%24id=${encodeURIComponent(JSON.stringify(id))}`;
      const data = (await (await fetch(url)).json())?.result;
      if (data?.title) {
        const title = `${data.title} | 부천 동백 장애인활동지원센터`;
        const desc = String(data.description || data.text || `${type.label} 게시물입니다.`).replace(/\s+/g, ' ').trim().slice(0, 150);
        const image = data.img ? `${data.img}?w=1200&h=630&fit=crop&auto=format` : DEFAULT_IMAGE;
        const pageUrl = `${SITE}/${type.path}/${id}`;
        html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
        html = html.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${esc(pageUrl)}" />`);
        html = setMeta(html, 'name', 'description', desc);
        html = setMeta(html, 'property', 'og:type', 'article');
        html = setMeta(html, 'property', 'og:url', pageUrl);
        html = setMeta(html, 'property', 'og:title', title);
        html = setMeta(html, 'property', 'og:description', desc);
        html = setMeta(html, 'property', 'og:image', image);
        html = setMeta(html, 'name', 'twitter:title', title);
        html = setMeta(html, 'name', 'twitter:description', desc);
        html = setMeta(html, 'name', 'twitter:image', image);
      }
    }
  } catch (e) {
    console.error('share meta error', e);
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400');
  res.status(200).send(html);
}
