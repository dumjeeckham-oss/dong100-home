import { useEffect, useState, useRef } from 'react';
import { isPreviewMode, sanityClient } from '@/lib/sanity';
import { Edit2, X, Check } from 'lucide-react';

interface SanityMessage {
  type: string;
  data?: any;
}

interface EditableElement {
  element: HTMLElement;
  text: string;
  originalText: string;
}

export const VisualEditing = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedElement, setSelectedElement] = useState<EditableElement | null>(null);
  const [editText, setEditText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Preview 모드에서만 작동
    if (!isPreviewMode()) return;

    setIsEnabled(true);

    // 클릭한 요소 감지
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // 편집 가능한 요소인지 확인 (텍스트 노드가 있는 요소)
      if (target.childNodes.length === 1 && target.childNodes[0].nodeType === Node.TEXT_NODE) {
        const text = target.textContent || '';
        if (text.trim()) {
          setSelectedElement({
            element: target,
            text: text,
            originalText: text,
          });
          setEditText(text);
          setIsEditing(true);
        }
      }
    };

    // ESC 키로 편집 취소
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isEditing) {
        setIsEditing(false);
        setSelectedElement(null);
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);

    // Sanity Studio와의 통신 설정
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      const message = event.data as SanityMessage;

      switch (message.type) {
        case 'sanity/presentation/ready':
          console.log('Sanity Studio presentation ready');
          break;
        case 'sanity/presentation/navigate':
          console.log('Navigate to:', message.data);
          break;
        default:
          console.log('Unknown message:', message);
      }
    };

    window.addEventListener('message', handleMessage);
    window.postMessage({ type: 'sanity/presentation/ready' }, window.location.origin);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('message', handleMessage);
    };
  }, [isEditing]);

  // 편집 저장
  const handleSave = async () => {
    if (selectedElement) {
      setIsSaving(true);
      
      try {
        // DOM 업데이트
        selectedElement.element.textContent = editText;
        
        // Sanity API로 데이터 저장
        // 주의: 현재 구현은 단순히 DOM만 업데이트합니다.
        // 실제 데이터베이스 저장은 복잡한 구현이 필요합니다.
        // 데이터베이스 ID와 필드 정보가 필요하므로,
        // 현재는 DOM 업데이트만 수행합니다.
        
        console.log('Text updated:', {
          originalText: selectedElement.originalText,
          newText: editText,
        });
        
        // Sanity Studio에 변경 사항 전송
        window.postMessage({
          type: 'sanity/visual-editing/update',
          data: {
            elementId: selectedElement.element.id,
            newText: editText,
            originalText: selectedElement.originalText,
          },
        }, window.location.origin);

        setIsEditing(false);
        setSelectedElement(null);
      } catch (error) {
        console.error('Save error:', error);
        alert('저장 중 오류가 발생했습니다.');
      } finally {
        setIsSaving(false);
      }
    }
  };

  // 편집 취소
  const handleCancel = () => {
    setIsEditing(false);
    setSelectedElement(null);
  };

  if (!isEnabled) return null;

  return (
    <>
      {/* Visual Editing 표시 */}
      <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg z-[150]">
        <span className="text-sm font-medium">Visual Editing Enabled</span>
      </div>

      {/* 편집 UI */}
      {isEditing && selectedElement && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background border border-border rounded-lg shadow-2xl p-6 z-[200] w-96">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">텍스트 편집</h3>
            <button
              onClick={handleCancel}
              className="p-1 hover:bg-accent rounded"
              aria-label="닫기"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">원본 텍스트</label>
            <p className="text-sm text-muted-foreground p-2 bg-muted rounded">
              {selectedElement.originalText}
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">수정할 텍스트</label>
            <input
              ref={editInputRef}
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-border rounded-md hover:bg-accent transition-colors"
              disabled={isSaving}
            >
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                  저장 중...
                </>
              ) : (
                <>
                  <Check size={16} />
                  저장
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
