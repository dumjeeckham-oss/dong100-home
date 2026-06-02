// src/components/layout/Header.tsx
// ✅ 수정사항:
// 1. sticky top-0 z-50 유지하면서 bg-white/95 backdrop-blur로 항상 불투명 배경
// 2. 스크롤 시 box-shadow 동적 적용 (useScrolled hook)
// 3. 배경이 투명해서 본문과 겹치는 문제 해결

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

// 로고 이미지 경로 (기존 프로젝트의 실제 경로로 교체)
import logo from '@/assets/logo.png';

const NAV_ITEMS = [
  { label: '센터소개', emoji: '🏢', href: '/about' },
  { label: '서비스 안내', emoji: '🤝', href: '/service' },
  {
    label: '게시판',
    emoji: '📋',
    href: '#',
    children: [
      { label: '공지사항', emoji: '📢', href: '/notices' },
      { label: '서식 자료실', emoji: '📁', href: '/archive' },
      { label: '이용자 정보', emoji: '👥', href: '#user-info' },
      { label: '활동 소식', emoji: '📰', href: '#activity-news' },
      { label: '활동지원사 모집', emoji: '🤝', href: 'https://docs.google.com/forms/d/e/1FAIpQLSfN7sbIDGSZRxTYq6z-z6doJVNyBfITRntE2yeDaVpIGTstXg/viewform', external: true },
    ],
  },
  { label: '구인구직', emoji: '👷', href: '/recruit' },
  { label: '오시는 길', emoji: '📍', href: '/map' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  // ✅ 스크롤 감지 → 그림자 적용
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 라우트 변경 시 모바일 메뉴 닫기
  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  return (
    <>
      <header
        className={[
          // ✅ sticky + 충분한 z-index
          'sticky top-0 z-50',
          // ✅ 배경: 항상 불투명 (흰색 95% + 블러)
          'bg-white/95 backdrop-blur-md',
          // ✅ 하단 구분선
          'border-b border-gray-200',
          // ✅ 스크롤 시 그림자
          scrolled ? 'shadow-md' : 'shadow-sm',
          'transition-shadow duration-200',
        ].join(' ')}
        role="banner"
      >
        <div className="container flex items-center justify-between py-3">
          {/* 로고 */}
          <Link
            to="/"
            className="flex items-center gap-3"
            aria-label="동백 장애인활동지원센터 홈"
          >
            <img
              src={logo}
              alt="동백 장애인활동지원센터 로고"
              className="h-12 md:h-14 w-auto"
            />
          </Link>

          {/* 데스크탑 내비게이션 */}
          <nav
            className="hidden lg:flex items-center gap-1"
            aria-label="주요 메뉴"
          >
            {NAV_ITEMS.map(item =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    aria-haspopup="true"
                    aria-expanded={activeDropdown === item.label}
                  >
                    <span aria-hidden="true">{item.emoji}</span>
                    {item.label}
                    <ChevronDown size={14} className={`transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                  </button>

                  {activeDropdown === item.label && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl border border-gray-100 shadow-lg py-1 z-50">
                      {item.children.map(child => (
                        child.external ? (
                          <a
                            key={child.label}
                            href={child.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                          >
                            <span aria-hidden="true">{child.emoji}</span>
                            {child.label}
                          </a>
                        ) : (
                          <Link
                            key={child.label}
                            to={child.href}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                          >
                            <span aria-hidden="true">{child.emoji}</span>
                            {child.label}
                          </Link>
                        )
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  className={[
                    'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    location.pathname === item.href
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700',
                  ].join(' ')}
                >
                  <span aria-hidden="true">{item.emoji}</span>
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* 전화 버튼 (데스크탑) */}
          <a
            href="tel:07041271611"
            className="hidden lg:flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
            aria-label="전화 문의: 032-675-7517"
          >
            📞 032-675-7517
          </a>

          {/* 햄버거 (모바일) */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(prev => !prev)}
            aria-label={mobileOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white" role="navigation" aria-label="모바일 메뉴">
            <div className="container py-3 space-y-1">
              {NAV_ITEMS.map(item =>
                item.children ? (
                  <div key={item.label}>
                    <button
                      className="w-full flex items-center justify-between px-3 py-3 rounded-lg text-left font-semibold text-gray-800 hover:bg-blue-50"
                      onClick={() =>
                        setActiveDropdown(prev => prev === item.label ? null : item.label)
                      }
                      aria-expanded={activeDropdown === item.label}
                    >
                      <span className="flex items-center gap-2">
                        <span aria-hidden="true">{item.emoji}</span>
                        {item.label}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {activeDropdown === item.label && (
                      <div className="ml-4 mt-1 space-y-1 border-l-2 border-blue-100 pl-3">
                        {item.children.map(child =>
                          child.external ? (
                            <a
                              key={child.label}
                              href={child.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <span aria-hidden="true">{child.emoji}</span>
                              {child.label}
                            </a>
                          ) : (
                            <Link
                              key={child.label}
                              to={child.href}
                              className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <span aria-hidden="true">{child.emoji}</span>
                              {child.label}
                            </Link>
                          )
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="flex items-center gap-2 px-3 py-3 rounded-lg font-semibold text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    <span aria-hidden="true">{item.emoji}</span>
                    {item.label}
                  </Link>
                )
              )}

              {/* 전화 (모바일) */}
              <a
                href="tel:07041271611"
                className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-3 rounded-xl font-bold mt-3 hover:bg-blue-700 transition-colors"
                aria-label="전화 문의"
              >
                📞 전화 문의 (032-675-7517)
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
