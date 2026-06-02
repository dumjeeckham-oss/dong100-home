import { Phone } from 'lucide-react';

const FloatingCallButton = () => {
  return (
    <a
      href="tel:070-4127-1611"
      className="lg:hidden fixed right-4 bottom-20 z-40 flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-full shadow-lg shadow-primary/30 font-bold text-base active:scale-95 transition-transform min-h-[52px]"
      aria-label="전화 상담 032-675-7517"
    >
      <Phone size={20} aria-hidden="true" />
      전화 상담
    </a>
  );
};

export default FloatingCallButton;
