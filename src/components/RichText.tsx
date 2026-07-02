import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import type { Components } from 'react-markdown';

interface RichTextProps {
  /** 마크다운 + HTML 문자열 */
  children?: string | null;
  /** 폴백 텍스트 (children 이 비어있을 때) */
  fallback?: string;
  /** 제목처럼 한 줄 안에서 렌더링할지 여부 (p 태그를 span 으로 대체) */
  inline?: boolean;
  className?: string;
}

/**
 * 사이트 설정 텍스트를 마크다운 + HTML 로 렌더링합니다.
 * 색상/글씨체/굵기 등을 <span style="...">, **굵게**, <b>, <font> 등으로 자유롭게 지정할 수 있습니다.
 */
const RichText = ({ children, fallback, inline, className }: RichTextProps) => {
  const text = (children && children.trim().length > 0) ? children : (fallback ?? '');
  if (!text) return null;

  const components: Components = inline
    ? {
        // 제목/부제목 등 인라인: 블록 마진 없이 렌더링
        p: ({ children }) => <>{children}</>,
      }
    : {};

  const Wrapper = inline ? 'span' : 'div';

  return (
    <Wrapper className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {text}
      </ReactMarkdown>
    </Wrapper>
  );
};

export default RichText;
