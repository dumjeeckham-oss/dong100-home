export type TextPath = Array<string | { _key: string }>;
export interface TextSegment { text: string; path: TextPath }
export interface SpellingSuggestion extends TextSegment {
  start: number;
  end: number;
  replacement: string;
}

// Deliberately conservative, whole-word corrections only. No external requests.
const corrections: Record<string, string> = {
  '되요': '돼요',
  '안되요': '안 돼요',
  '됬다': '됐다',
  '됬어요': '됐어요',
  '됬습니다': '됐습니다',
  '뵈요': '봬요',
  '뵙겠습니다': '뵙겠습니다',
  '몇일': '며칠',
  '금새': '금세',
  '어의없다': '어이없다',
  '어의없어요': '어이없어요',
  '왠만하면': '웬만하면',
  '왠만한': '웬만한',
  '설겆이': '설거지',
  '역활': '역할',
  '할께요': '할게요',
  '할께': '할게',
  '갈께요': '갈게요',
  '바램입니다': '바람입니다',
  '오랫만에': '오랜만에',
};

export function collectText(value: unknown, path: TextPath = []): TextSegment[] {
  if (typeof value === 'string') return [{ text: value, path }];
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== 'object' || typeof item._key !== 'string') return [];
    const itemPath = [...path, { _key: item._key }];
    if (item._type === 'block' && Array.isArray(item.children)) {
      const linkKeys = new Set((item.markDefs ?? []).filter((m: { _type?: string }) => m._type === 'link').map((m: { _key: string }) => m._key));
      return item.children.flatMap((child: { _key?: string; _type?: string; text?: string; marks?: string[] }) =>
        child._type === 'span' && typeof child._key === 'string' && typeof child.text === 'string' && !child.marks?.some((mark) => linkKeys.has(mark))
          ? [{ text: child.text, path: [...itemPath, 'children', { _key: child._key }, 'text'] }]
          : [],
      );
    }
    if (item._type === 'richTable' && Array.isArray(item.rows)) {
      return item.rows.flatMap((row: { _key: string; cells?: Array<{ _key: string; content?: unknown }> }) =>
        (row.cells ?? []).flatMap((cell) => collectText(cell.content, [...itemPath, 'rows', { _key: row._key }, 'cells', { _key: cell._key }, 'content'])),
      );
    }
    return [];
  });
}

export function checkBasicSpelling(segments: TextSegment[]): SpellingSuggestion[] {
  return segments.flatMap(({ text, path }) => {
    const excluded = [...text.matchAll(/(?:https?:\/\/|www\.)\S+|[\w.+-]+@[\w.-]+/g)].map((match) => ({ start: match.index ?? 0, end: (match.index ?? 0) + match[0].length }));
    return [...text.matchAll(/[가-힣]+/g)].flatMap((match) => {
      const start = match.index ?? 0;
      const replacement = corrections[match[0]];
      if (!replacement || replacement === match[0] || excluded.some((range) => start >= range.start && start < range.end)) return [];
      return [{ text, path, start, end: start + match[0].length, replacement }];
    });
  });
}

export function correctedText(text: string, suggestions: SpellingSuggestion[]): string {
  return [...suggestions].sort((a, b) => b.start - a.start).reduce((result, suggestion) =>
    result.slice(0, suggestion.start) + suggestion.replacement + result.slice(suggestion.end), text);
}