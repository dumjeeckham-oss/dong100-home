import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Props {
  siteSettings?: {
    popupEnabled?: boolean;
    popupTitle?: string;
    popupContent?: string;
    _id?: string;
  };
}

const EmergencyPopup = ({ siteSettings }: Props) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!siteSettings?.popupEnabled) return;

    const dismissed = localStorage.getItem('emergency_popup_dismissed');
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10);
      if (Date.now() - dismissedAt < 24 * 60 * 60 * 1000) return;
    }

    const timer = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(timer);
  }, [siteSettings?.popupEnabled]);

  const handleClose = () => {
    setVisible(false);
    localStorage.setItem('emergency_popup_dismissed', String(Date.now()));
  };

  if (!visible || !siteSettings?.popupEnabled) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-lg bg-card rounded-2xl shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="bg-destructive/10 px-6 py-4 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-xl">🚨</span>
            <h3
              className="text-lg font-bold text-destructive"
              data-id={siteSettings._id}
              data-field="popupTitle"
              data-type="siteSettings"
            >
              {siteSettings.popupTitle || '긴급 안내'}
            </h3>
          </div>
          <button onClick={handleClose} className="w-8 h-8 rounded-full bg-card hover:bg-accent flex items-center justify-center transition-colors" aria-label="닫기">
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5 max-h-[50vh] overflow-y-auto">
          <div
            className="prose prose-sm max-w-none text-foreground/90"
            data-id={siteSettings._id}
            data-field="popupContent"
            data-type="siteSettings"
          >
            {siteSettings.popupContent ? (
              <ReactMarkdown>{siteSettings.popupContent}</ReactMarkdown>
            ) : (
              <p className="text-muted-foreground">긴급 공지사항이 없습니다.</p>
            )}
          </div>
        </div>
        <div className="px-6 py-3 bg-muted/50 border-t border-border text-center">
          <button onClick={handleClose} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            오늘 하루 보지 않기
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyPopup;
