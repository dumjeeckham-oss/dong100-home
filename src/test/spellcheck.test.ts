import { describe, expect, it } from 'vitest';
import { checkBasicSpelling, collectText, correctedText } from '../../sanity/spellcheck';

describe('무료 기본 맞춤법 검사', () => {
  it('수정안을 뒤에서부터 적용해 위치를 보존한다', () => {
    const text = '몇일 뒤에 뵈요. 설겆이 할께요.';
    expect(correctedText(text, checkBasicSpelling(collectText(text)))).toBe('며칠 뒤에 봬요. 설거지 할게요.');
  });
  it('정상 단어와 URL, 이메일을 수정하지 않는다', () => {
    expect(checkBasicSpelling(collectText('금새우 뵙겠습니다 https://example.com/몇일 www.example.com/되요 test@example.com'))).toHaveLength(0);
  });
  it('본문과 표의 텍스트 경로를 찾고 링크와 이미지·서식을 보존한다', () => {
    const content = [
      { _key: 'b', _type: 'block', markDefs: [{ _key: 'url', _type: 'link' }], children: [
        { _key: 's', _type: 'span', text: '안되요', marks: ['strong'] },
        { _key: 'l', _type: 'span', text: '몇일', marks: ['url'] },
        { _key: 'i', _type: 'inlineLink', text: '몇일', href: 'https://example.com' },
      ] },
      { _key: 'image', _type: 'image', alt: '몇일', asset: { _ref: 'asset' } },
      { _key: 't', _type: 'richTable', rows: [{ _key: 'r', cells: [{ _key: 'c', content: [{ _key: 'cb', _type: 'block', children: [{ _key: 'cs', _type: 'span', text: '역활' }] }] }] }] },
    ];
    const before = JSON.stringify(content);
    const suggestions = checkBasicSpelling(collectText(content));
    expect(suggestions.map((s) => s.replacement)).toEqual(['안 돼요', '역할']);
    expect(suggestions[0].path).toEqual([{ _key: 'b' }, 'children', { _key: 's' }, 'text']);
    expect(suggestions[1].path).toEqual([{ _key: 't' }, 'rows', { _key: 'r' }, 'cells', { _key: 'c' }, 'content', { _key: 'cb' }, 'children', { _key: 'cs' }, 'text']);
    expect(JSON.stringify(content)).toBe(before);
  });
});