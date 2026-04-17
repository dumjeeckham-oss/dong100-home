const tabs = [
  { label: '홈', href: '#', emoji: '🏠' },
  { label: '서비스', href: '#service', emoji: '📋' },
  { label: '게시판', href: '#board', emoji: '📢' },
  { label: '오시는 길', href: '#directions', emoji: '📍' },
  { label: '전화문의', href: 'tel:070-4127-1611', emoji: '📞' },
];

const MobileTabBar = () => {
  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 safe-area-pb"
      aria-label="모바일 하단 메뉴"
      role="navigation"
    >
      <div className="flex items-center justify-around py-2">
        {tabs.map(tab => (
          <a
            key={tab.label}
            href={tab.href}
            className="flex flex-col items-center gap-0.5 px-2 py-1 text-muted-foreground hover:text-primary transition-colors min-w-[56px]"
            aria-label={tab.label}
          >
            <span className="text-xl" aria-hidden="true">{tab.emoji}</span>
            <span className="text-[11px] font-medium">{tab.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
};

export default MobileTabBar;
