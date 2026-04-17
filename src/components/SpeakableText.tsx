import { useAccessibility } from '@/contexts/AccessibilityContext';

interface SpeakableTextProps {
  children: string;
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'li' | 'td';
  className?: string;
}

const SpeakableText = ({ children, as: Tag = 'p', className = '' }: SpeakableTextProps) => {
  const { speak } = useAccessibility();

  return (
    <Tag
      className={`cursor-pointer hover:underline decoration-primary/30 ${className}`}
      onClick={() => speak(children)}
      role="button"
      tabIndex={0}
      aria-label={`${children} - 클릭하면 음성으로 읽어줍니다`}
      onKeyDown={(e) => { if (e.key === 'Enter') speak(children); }}
    >
      {children}
    </Tag>
  );
};

export default SpeakableText;
