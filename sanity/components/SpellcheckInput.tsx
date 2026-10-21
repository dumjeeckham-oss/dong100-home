import { useState } from 'react';
import { Box, Button, Card, Flex, Stack, Text, TextArea } from '@sanity/ui';
import { CheckmarkIcon, LaunchIcon } from '@sanity/icons';
import { set, type ArrayOfObjectsInputProps, type StringInputProps, type TextInputProps } from 'sanity';
import { checkBasicSpelling, collectText, correctedText, type SpellingSuggestion } from '../spellcheck';

type Props = ArrayOfObjectsInputProps | StringInputProps | TextInputProps;

export function SpellcheckInput(props: Props) {
  const [results, setResults] = useState<SpellingSuggestion[] | null>(null);
  const [snapshot, setSnapshot] = useState('');
  const [notice, setNotice] = useState('');
  const [copyText, setCopyText] = useState<string | null>(null);
  const signature = JSON.stringify(props.value);
  const stale = results !== null && snapshot !== signature;
  const segments = collectText(props.value);

  function check() {
    setResults(checkBasicSpelling(segments));
    setSnapshot(signature);
    setNotice('');
  }

  function apply(selected: SpellingSuggestion[]) {
    if (props.readOnly || snapshot !== JSON.stringify(props.value)) return;
    const grouped = new Map<string, SpellingSuggestion[]>();
    selected.forEach((suggestion) => {
      const key = JSON.stringify(suggestion.path);
      grouped.set(key, [...(grouped.get(key) ?? []), suggestion]);
    });
    const patches = [...grouped.values()].map((group) => {
      const first = group[0];
      return set(correctedText(first.text, group), first.path);
    });
    props.onChange(patches);
    setResults(null);
    setNotice('수정안을 적용했습니다.');
  }

  async function openExternal() {
    const text = segments.map((segment) => segment.text).join('\n');
    // Open synchronously to avoid popup blocking, and never send drafts in the URL.
    window.open('https://nara-speller.co.kr/old_speller/', '_blank', 'noopener,noreferrer');
    try {
      await navigator.clipboard.writeText(text);
      setCopyText(null);
      setNotice('글을 복사했습니다. 검사 창에 붙여넣어 주세요.');
    } catch {
      setCopyText(text);
      setNotice('아래 글을 선택해 복사해 주세요.');
    }
  }

  return (
    <Stack space={3}>
      {props.renderDefault(props)}
      <Flex gap={2} wrap="wrap">
        <Button icon={CheckmarkIcon} text="기본 맞춤법 검사" mode="ghost" onClick={check} disabled={props.readOnly || !segments.some((segment) => segment.text.trim())} />
        <Button icon={LaunchIcon} text="무료 검사 창 열기" mode="ghost" onClick={openExternal} disabled={!segments.some((segment) => segment.text.trim())} />
      </Flex>
      {notice && <Text size={1} role="status">{notice}</Text>}
      {copyText !== null && <TextArea value={copyText} readOnly rows={5} onFocus={(event) => event.currentTarget.select()} aria-label="검사할 글 복사" />}
      {results !== null && (
        <Card border radius={2} padding={3} tone={stale ? 'caution' : 'default'}>
          <Stack space={3}>
            <Text size={1} role="status">
              {stale ? '글이 변경되었습니다. 다시 검사해 주세요.' : results.length ? `수정 제안 ${results.length}개` : '기본 검사에서 수정할 표현을 찾지 못했습니다.'}
            </Text>
            {!stale && results.map((suggestion, index) => (
              <Flex key={`${JSON.stringify(suggestion.path)}-${suggestion.start}`} gap={3} align="center" wrap="wrap">
                <Box flex={1}><Text size={1}>{suggestion.text.slice(suggestion.start, suggestion.end)} → {suggestion.replacement}</Text></Box>
                <Button text="적용" mode="ghost" fontSize={1} onClick={() => apply([results[index]])} disabled={props.readOnly} />
              </Flex>
            ))}
            {!stale && results.length > 1 && <Button text="모두 적용" mode="ghost" onClick={() => apply(results)} disabled={props.readOnly} />}
          </Stack>
        </Card>
      )}
    </Stack>
  );
}