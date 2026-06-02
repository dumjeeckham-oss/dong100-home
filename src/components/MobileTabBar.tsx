const tabs = [
  { label: '홈', href: '#top', emoji: '🏠' },
  { label: '서비스', href: '#service', emoji: '📋' },
  { label: '게시판', href: '#board', emoji: '📢' },
  { label: '오시는 길', href: '#directions', emoji: '📍' },
  { label: '전화문의', href: 'tel:070-4127-1611', emoji: '📞' },
];

const detailIds = new Set(['about', 'service', 'cost', 'business']);

const MobileTabBar = () => {
  const handleClick = (e: React.MouseEvent, href: string) => {
    if (!href.startsWith('#')) return; // tel: links proceed normally
    e.preventDefault();
    const id = href.slice(1);

    // Not on home → navigate home with hash, Index handles the scroll
    if (window.location.pathname !== '/') {
      window.location.href = `/${href}`;
      return;
    }

    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Service / detail sections are hidden until expanded
    if (detailIds.has(id)) window.dispatchEvent(new Event('show-details'));

    const scroll = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    setTimeout(scroll, detailIds.has(id) ? 300 : 0);
  };

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 safe-area-pb"
      aria-label="모바일 하단 메뉴"
      role="navigation"
    >
      <div className="flex items-center justify-around py-1.5">
        {tabs.map(tab => (
          <a
            key={tab.label}
            href={tab.href}
            onClick={(e) => handleClick(e, tab.href)}
            className="flex flex-col items-center gap-0.5 px-3 py-2 text-muted-foreground hover:text-primary active:text-primary transition-colors min-w-[60px] min-h-[52px] justify-center"
            aria-label={tab.label}
          >
            <span className="text-2xl" aria-hidden="true">{tab.emoji}</span>
            <span className="text-[12px] font-semibold">{tab.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
};

export default MobileTabBar;
