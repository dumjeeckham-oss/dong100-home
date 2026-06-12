import { X } from 'lucide-react';
import { isPreviewMode } from '@/lib/sanity';

export const PreviewBanner = () => {
  if (!isPreviewMode()) return null;

  const exitPreview = () => {
    document.cookie = 'sanity_preview_mode=; Path=/; Max-Age=0';
    window.location.reload();
  };

  return (
    <div className="bg-primary text-primary-foreground px-4 py-2 flex items-center justify-between fixed top-0 left-0 right-0 z-[200]">
      <span className="font-medium">Preview Mode</span>
      <button
        onClick={exitPreview}
        className="flex items-center gap-1 hover:opacity-80 transition-opacity"
        aria-label="Exit preview mode"
      >
        <X size={16} />
        Exit
      </button>
    </div>
  );
};
