import { Eye, Type, RotateCcw } from 'lucide-react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

const AccessibilityToolbar = () => {
  const { highContrast, toggleHighContrast, fontScale, increaseFontSize, decreaseFontSize } = useAccessibility();

  return (
    <div className="bg-muted border-b border-border" role="toolbar" aria-label="접근성 도구모음">
      <div className="container flex items-center justify-end gap-2 py-1.5 text-sm">
        <button
          onClick={toggleHighContrast}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-background border border-border hover:bg-accent transition-colors font-medium"
          aria-label={highContrast ? '고대비 모드 해제' : '고대비 모드 켜기'}
          aria-pressed={highContrast}
        >
          <Eye size={16} aria-hidden="true" />
          <span>고대비</span>
        </button>
        <button
          onClick={increaseFontSize}
          disabled={fontScale >= 2}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-background border border-border hover:bg-accent transition-colors font-medium disabled:opacity-40"
          aria-label="글자 크기 확대"
        >
          <Type size={18} aria-hidden="true" />
          <span>가</span>
        </button>
        <button
          onClick={decreaseFontSize}
          disabled={fontScale <= 0}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-background border border-border hover:bg-accent transition-colors font-medium disabled:opacity-40"
          aria-label="글자 크기 축소"
        >
          <Type size={14} aria-hidden="true" />
          <span>가</span>
        </button>
        {fontScale > 0 && (
          <button
            onClick={() => { decreaseFontSize(); decreaseFontSize(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-background border border-border hover:bg-accent transition-colors font-medium"
            aria-label="글자 크기 원래대로"
          >
            <RotateCcw size={14} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
};

export default AccessibilityToolbar;
