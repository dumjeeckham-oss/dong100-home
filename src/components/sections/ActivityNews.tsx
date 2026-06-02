// src/components/sections/ActivityNews.tsx
// ✅ 수정사항:
// 1. fetchRssFeed(수정된 rss.ts) 사용 → 개별 게시글 링크 정확히 연결
// 2. 로딩 스피너 UI 추가
// 3. 에러 상태 표시
// 4. 외부 링크 보안 속성 적용

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink, Loader2, AlertCircle, Newspaper } from 'lucide-react';
import { fetchRssFeed, formatRssDate } from '@/lib/rss';

export default function ActivityNews() {
  const [showAll, setShowAll] = useState(false);

  const { data: items = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['rss', 'support4'],
    queryFn: () => fetchRssFeed('support4'),
    staleTime: 1000 * 60 * 10, // 10분 캐시
    retry: 1,
  });

  const displayItems = showAll ? items : items.slice(0, 5);

  return (
    <section
      id="activity-news"
      className="py-12 md:py-16 bg-muted/30"
      aria-label="활동 소식"
    >
      <div className="container">
        {/* 섹션 헤더 */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Newspaper className="text-primary" aria-hidden="true" />
          <h2 className="text-2xl md:text-3xl font-bold text-center">활동 소식</h2>
        </div>

        {/* ✅ 로딩 상태 */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 gap-3" aria-busy="true">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">데이터를 불러오는 중입니다...</p>
          </div>
        )}

        {/* ✅ 에러 상태 */}
        {isError && !isLoading && (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <AlertCircle className="w-8 h-8 text-red-400" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">활동 소식을 불러오지 못했습니다.</p>
            <button
              onClick={() => refetch()}
              className="text-xs text-blue-600 underline hover:no-underline"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* ✅ 데이터 목록 */}
        {!isLoading && !isError && (
          <>
            {items.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                등록된 소식이 없습니다.
              </p>
            ) : (
              <ul className="bg-card rounded-2xl shadow-sm divide-y divide-border overflow-hidden" role="list">
                {displayItems.map((item, idx) => (
                  <li key={`${item.link}-${idx}`} role="listitem">
                    {/*
                      ✅ 핵심 수정: href={item.link}
                      rss.ts의 resolveRssLink()가 이미 올바른 개별 게시글 URL을 반환함
                    */}
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-4 p-4 md:p-5 hover:bg-muted/50 transition-colors group"
                      aria-label={`${item.title} - 새 탭에서 열기`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm md:text-base text-foreground group-hover:text-blue-700 transition-colors leading-snug mb-1 line-clamp-2">
                          {item.title}
                        </p>
                        {item.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                            {item.description}
                          </p>
                        )}
                        <time
                          dateTime={item.pubDate}
                          className="text-xs text-muted-foreground/70"
                        >
                          {formatRssDate(item.pubDate)}
                        </time>
                      </div>
                      <ExternalLink
                        size={16}
                        className="flex-shrink-0 mt-1 text-muted-foreground/40 group-hover:text-blue-500 transition-colors"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            )}

            {/* 더보기 버튼 */}
            {items.length > 5 && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setShowAll(prev => !prev)}
                  className="px-6 py-2.5 border border-border rounded-full text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  aria-expanded={showAll}
                >
                  {showAll ? '접기 ▲' : `더보기 (${items.length - 5}개 더) ▼`}
                </button>
              </div>
            )}

            {/* 원문 링크 */}
            <div className="text-center mt-4">
              <a
                href="https://bcmedcoop.org/bbs/board.php?bo_table=support4"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-blue-600 transition-colors"
                aria-label="부천의료복지사회적협동조합 홈페이지에서 더 보기"
              >
                부천의료복지사회적협동조합 홈페이지에서 더 보기
                <ExternalLink size={12} aria-hidden="true" />
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
