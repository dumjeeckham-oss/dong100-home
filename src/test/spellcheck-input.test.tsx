import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider, studioTheme } from '@sanity/ui';
import type { StringInputProps } from 'sanity';
import { SpellcheckInput } from '../../sanity/components/SpellcheckInput';

vi.mock('sanity', () => ({ set: (value: string, path: unknown[]) => ({ type: 'set', value, path }) }));

function Editor({ readOnly = false }: { readOnly?: boolean }) {
  const [value, setValue] = useState('몇일 뒤에 뵈요.');
  const props = {
    value, readOnly,
    renderDefault: () => <input aria-label="글" value={value} onChange={(event) => setValue(event.target.value)} />,
    onChange: (patches: Array<{ value: string }>) => setValue(patches[0].value),
  } as unknown as StringInputProps;
  return <ThemeProvider theme={studioTheme}><SpellcheckInput {...props} /></ThemeProvider>;
}

describe('글쓰기 맞춤법 검사 흐름', () => {
  it('검사한 제안을 확인하고 모두 적용하면 글에 반영한다', () => {
    render(<Editor />);
    fireEvent.click(screen.getByRole('button', { name: '기본 맞춤법 검사' }));
    expect(screen.getAllByRole('button', { name: '적용' })).toHaveLength(2);
    fireEvent.click(screen.getByRole('button', { name: '모두 적용' }));
    expect(screen.getByRole('textbox', { name: '글' })).toHaveValue('며칠 뒤에 봬요.');
  });
  it('검사 뒤 글이 바뀌면 예전 결과로 덮어쓰지 않는다', () => {
    render(<Editor />);
    fireEvent.click(screen.getByRole('button', { name: '기본 맞춤법 검사' }));
    fireEvent.change(screen.getByRole('textbox', { name: '글' }), { target: { value: '새로운 글' } });
    expect(screen.queryByRole('button', { name: '모두 적용' })).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '글' })).toHaveValue('새로운 글');
  });
  it('읽기 전용 필드에서는 검사와 수정이 비활성화된다', () => {
    render(<Editor readOnly />);
    expect(screen.getByRole('button', { name: '기본 맞춤법 검사' })).toBeDisabled();
  });
});