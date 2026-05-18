// src/lib/rss.ts

export interface RssItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
}

// ✅ 핵심 수정: RSS 링크 처리 함수
// 기존 버그: board.php 발견하면 wr_id 없어도 바로 반환
//   예) link = "board.php?bo_table=support4" (wr_id 없음) → 메인으로 이동
// 수정: board.php 발견해도 wr_id 있는지 먼저 확인
//       link와 guid 양쪽 다 확인해서 wr_id가 있는 쪽 사용
function resolveRssLink(link: string, guid: string, boTable: string): string {
  const candidates = [link, guid].filter(Boolean).map(s => s.replace(/&amp;/g, '&'));

  // 1순위: wr_id가 포함된 board.php URL
  for (const candidate of candidates) {
    if (/board\.php/.test(candidate) && /wr_id=\d+/.test(candidate)) {
      return candidate;
    }
  }

  // 2순위: wr_id 값 어디서든 추출
  for (const candidate of candidates) {
    const match = candidate.match(/wr_id=(\d+)/);
    if (match) {
      return `https://bcmedcoop.org/bbs/board.php?bo_table=${boTable}&wr_id=${match[1]}`;
    }
  }

  // 3순위: guid가 숫자만인 경우 (일부 그누보드 RSS 형식)
  const numericGuid = guid.match(/^(\d+)$/);
  if (numericGuid) {
    return `https://bcmedcoop.org/bbs/board.php?bo_table=${boTable}&wr_id=${numericGuid[1]}`;
  }

  // 4순위: link 자체가 유효한 상세 URL
  try {
    const url = new URL(link);
    if (
      url.hostname.includes('bcmedcoop.org') &&
      url.pathname.length > 5 &&
      url.pathname !== '/' &&
      url.searchParams.size > 1
    ) {
      return link;
    }
  } catch {
    // URL parsing failed, fallback to next option
  }

  // 최후 fallback: bo_table 목록 페이지
  return `https://bcmedcoop.org/bbs/board.php?bo_table=${boTable}`;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&[a-z#0-9]+;/gi, ' ').trim();
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function cleanText(text: string): string {
  return decodeEntities(stripHtml(text)).trim();
}

// ✅ 메인 함수 - fetchRssFeed (새 이름)
export async function fetchRssFeed(boTable: string): Promise<RssItem[]> {
  const rssUrl = `https://bcmedcoop.org/bbs/rss.php?bo_table=${boTable}`;
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`;

  // 방법 1: allorigins 프록시로 XML 직접 파싱
  try {
    const res = await fetch(proxyUrl);
    if (res.ok) {
      const xmlText = await res.text();
      const doc = new DOMParser().parseFromString(xmlText, 'text/xml');
      if (!doc.querySelector('parsererror')) {
        const items = Array.from(doc.querySelectorAll('item'));
        if (items.length > 0) {
          return items.map(item => {
            const get = (tag: string) =>
              item.querySelector(tag)?.textContent?.trim() ?? '';
            return {
              title: cleanText(get('title')),
              link: resolveRssLink(get('link'), get('guid'), boTable),
              pubDate: get('pubDate'),
              description: cleanText(get('description')).slice(0, 200),
            };
          });
        }
      }
    }
  } catch (e) {
    console.warn('[RSS] allorigins 실패, rss2json으로 전환:', e);
  }

  // 방법 2: rss2json API fallback
  const jsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
  const res = await fetch(jsonUrl);
  if (!res.ok) throw new Error('RSS fetch failed');
  const json = await res.json();
  if (json.status !== 'ok') throw new Error('RSS parse failed');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (json.items ?? []).map((item: any) => ({
    title: cleanText(item.title ?? ''),
    link: resolveRssLink(item.link ?? '', item.guid ?? '', boTable),
    pubDate: item.pubDate ?? '',
    description: cleanText(item.description ?? '').slice(0, 200),
  }));
}

// ✅ 기존 코드 호환용 별칭
// ActivityNewsSection.tsx 에서 import { fetchGnuboardRss } 로 사용 중
export const fetchGnuboardRss = fetchRssFeed;

export function formatRssDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}
