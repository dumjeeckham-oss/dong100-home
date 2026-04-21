import { useState, useRef, useEffect } from 'react';
import { Menu, X, Phone, ChevronDown, Lock } from 'lucide-react';
import logo from '@/assets/logo.png';

type NavItem = {
  label: string;
  emoji: string;
  href: string;
  external?: boolean;
  children?: { label: string; emoji: string; href: string; external?: boolean }[];
};

const navItems: NavItem[] = [
  { label: '센터소개', emoji: '🏠', href: '#about' },
  {
    label: '서비스안내',
    emoji: '📋',
    href: '#service',
    children: [
      { label: '비용 안내', emoji: '💰', href: '#cost' },
      { label: '사업안내', emoji: '🏢', href: '#business' },
    ],
  },
  {
    label: '게시판',
    emoji: '📌',
    href: '#board',
    children: [
      { label: '공지사항', emoji: '📢', href: '/board?tab=notice' },
      { label: '자료실', emoji: '📁', href: '/board?tab=resource' },
      { label: '이용자 정보', emoji: '👥', href: '/board?tab=user_info' },
      { label: '활동지원사 모집', emoji: '🤝', href: 'https://docs.google.com/forms/d/e/1FAIpQLSfN7sbIDGSZRxTYq6z-z6doJVNyBfITRntE2yeDaVpIGTstXg/viewform?pli=1', external: true },
    ],
  },
  { label: '오시는 길', emoji: '📍', href: '#directions' },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showAAC, setShowAAC] = useState(false);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout>>();

  const handleMouseEnter = (label: string) => {
    clearTimeout(dropdownTimeout.current);
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  useEffect(() => () => clearTimeout(dropdownTimeout.current), []);

  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50" role="banner">
      <div className="container flex items-center justify-between py-3">
        <a href="#" className="flex items-center gap-3" aria-label="동백 장애인활동지원센터 홈">
          <img src={logo} alt="동백 장애인활동지원센터 로고" className="h-12 md:h-14 w-auto" />
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="메인 메뉴">
          {navItems.map(item =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => handleMouseEnter(item.label)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className="flex items-center gap-1 px-4 py-2 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors font-medium text-[15px]"
                  aria-expanded={openDropdown === item.label}
                  aria-haspopup="true"
                >
                  {showAAC && <span className="text-lg">{item.emoji}</span>}
                  {item.label}
                  <ChevronDown size={14} className={`transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-1 bg-background border border-border rounded-xl shadow-lg min-w-[180px] py-1 z-50">
                    {item.children.map(child => (
                      <a
                        key={child.label}
                        href={child.href}
                        target={child.external ? '_blank' : undefined}
                        rel={child.external ? 'noopener noreferrer' : undefined}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors font-medium"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {showAAC && <span className="text-base">{child.emoji}</span>}
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors font-medium text-[15px]"
              >
                {showAAC && <span className="text-lg">{item.emoji}</span>}
                {item.label}
              </a>
            )
          )}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={() => setShowAAC(!showAAC)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm font-medium hover:bg-accent transition-colors"
            aria-label={showAAC ? 'AAC 아이콘 숨기기' : 'AAC 아이콘 보기'}
            title="쉬운 아이콘 보기"
          >
            {showAAC ? '🔤 글자' : '🎨 AAC'}
          </button>
          <a
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm font-medium hover:bg-accent transition-colors"
            title="관리자 페이지"
            aria-label="관리자 로그인"
          >
            <Lock size={16} aria-hidden="true" />
            관리자
          </a>
          <a
            href="tel:032-675-7517"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm"
            aria-label="문의 전화 032-675-7517 내선 2번"
          >
            <Phone size={16} aria-hidden="true" />
            032-675-7517 (내선 2번)
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-accent"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="lg:hidden border-t border-border bg-background" aria-label="모바일 메뉴">
          <div className="container py-4 flex flex-col gap-1">
            {navItems.map(item =>
              item.children ? (
                <div key={item.label}>
                  <button
                    onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-lg hover:bg-accent transition-colors font-medium text-lg"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-xl">{item.emoji}</span>
                      {item.label}
                    </span>
                    <ChevronDown size={18} className={`transition-transform ${mobileExpanded === item.label ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileExpanded === item.label && (
                    <div className="ml-4 border-l-2 border-primary/20 pl-3 space-y-1">
                      {item.children.map(child => (
                        <a
                          key={child.label}
                          href={child.href}
                          target={child.external ? '_blank' : undefined}
                          rel={child.external ? 'noopener noreferrer' : undefined}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-lg hover:bg-accent transition-colors font-medium text-base text-muted-foreground"
                        >
                          <span>{child.emoji}</span>
                          {child.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors font-medium text-lg"
                >
                  <span className="text-xl">{item.emoji}</span>
                  {item.label}
                </a>
              )
            )}
            <a
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 mt-2 bg-accent text-accent-foreground rounded-lg font-semibold text-lg justify-center border border-border"
              aria-label="관리자 로그인"
            >
              <Lock size={22} aria-hidden="true" />
              관리자 로그인
            </a>
            <a
              href="tel:032-675-7517"
              className="flex items-center gap-3 px-4 py-3 mt-2 bg-primary text-primary-foreground rounded-lg font-semibold text-lg justify-center"
              aria-label="문의 전화 연결"
            >
              <Phone size={22} aria-hidden="true" />
              문의전화: 032-675-7517 (내선 2번)
            </a>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
