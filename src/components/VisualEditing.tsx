import { useEffect, useState } from 'react';
import { isPreviewMode } from '@/lib/sanity';

interface SanityMessage {
  type: string;
  data?: any;
}

export const VisualEditing = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Preview 모드에서만 작동
    if (!isPreviewMode()) return;

    setIsEnabled(true);

    // Sanity Studio와의 통신 설정
    const handleMessage = (event: MessageEvent) => {
      // Sanity Studio에서 온 메시지인지 확인
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

    // Sanity Studio에 준비 완료 메시지 전송
    window.postMessage({ type: 'sanity/presentation/ready' }, window.location.origin);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  if (!isEnabled) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg z-[150]">
      <span className="text-sm font-medium">Visual Editing Enabled</span>
    </div>
  );
};
