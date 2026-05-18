// src/pages/Archive.tsx  (또는 src/pages/ArchivePage.tsx)
// ✅ 수정사항:
// 1. resolveFileUrl() 사용으로 파일 URL 추출 안정화
// 2. 로딩 스피너 UI 추가
// 3. 에러 메시지 개선 + 재시도 버튼
// 4. 빈 상태 UI 개선

import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileDown, FileText, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { fetchArchives, resolveFileUrl, formatFileSize, type ArchiveItem } from '@/lib/sanity';

function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

// 파일 확장자 → 색상 배지
function ExtBadge({ ext }: { ext?: string }) {
  const e = (ext ?? '').toLowerCase();
  const colorMap: Record<string, string> = {
    pdf: 'bg-red-100 text-red-700',
    doc: 'bg-blue-100 text-blue-700',
    docx: 'bg-blue-100 text-blue-700',
    xls: 'bg-green-100 text-green-700',
    xlsx: 'bg-green-100 text-green-700',
    hwp: 'bg-purple-100 text-purple-700',
    ppt: 'bg-orange-100 text-orange-700',
    pptx: 'bg-orange-100 text-orange-700',
  };
  const cls = colorMap[e] ?? 'bg-gray-100 text-gray-600';
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${cls}`}>
      {e || 'FILE'}
    </span>
  );
}

// ── 로딩 스켈레톤 ──
function LoadingSkeleton() {
  return (
    <div className="bg-card rounded-2xl shadow-sm overflow-hidden" aria-busy="true" aria-label="자료 불러오는 중">
      {/* 로딩 스피너 메시지 */}
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" aria-hidden="true" />
        <p className="text-base text-muted-foreground font-medium">데이터를 불러오는 중입니다...</p>
        <p className="text-sm text-muted-foreground/60">잠시만 기다려 주세요.</p>
      </div>
    </div>
  );
}

// ── 에러 UI ──
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center px-6">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-500" aria-hidden="true" />
        </div>
        <div>
          <p className="text-base font-semibold text-destructive mb-1">자료를 불러오지 못했습니다.</p>
          <p className="text-sm text-muted-foreground">
            네트워크 연결을 확인하거나 잠시 후 다시 시도해 주세요.
          </p>
        </div>
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
          aria-label="자료실 다시 불러오기"
        >
          <RefreshCw size={16} aria-hidden="true" />
          다시 시도
        </button>
      </div>
    </div>
  );
}

// ── 빈 상태 UI ──
function EmptyState() {
  return (
    <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
        <FileText className="w-12 h-12 text-muted-foreground/40" aria-hidden="true" />
        <p className="text-base font-medium text-muted-foreground">등록된 자료가 없습니다.</p>
        <p className="text-sm text-muted-foreground/60">새 자료가 등록되면 이 곳에 표시됩니다.</p>
      </div>
    </div>
  );
}

// ── 자료 행 (모바일) ──
function ArchiveCardMobile({ item }: { item: ArchiveItem }) {
  const fileUrl = resolveFileUrl(item);
  const ext = item.file?.asset?.extension;
  const size = item.file?.asset?.size;

  return (
    <div className="p-4 border-b border-border last:border-0">
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          <ExtBadge ext={ext} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground leading-snug mb-1">
            {item.title}
          </p>
          {item.description && (
            <p className="text-xs text-muted-foreground mb-1 line-clamp-2">{item.description}</p>
          )}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{formatDate(item.publishedAt)}</span>
            {size && <span>· {formatFileSize(size)}</span>}
          </div>
        </div>
        {fileUrl ? (
          <a
            href={fileUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
            aria-label={`${item.title} 다운로드`}
          >
            <FileDown size={14} aria-hidden="true" />
            다운로드
          </a>
        ) : (
          <span className="flex-shrink-0 px-3 py-2 bg-gray-100 text-gray-400 rounded-lg text-xs">
            준비 중
          </span>
        )}
      </div>
    </div>
  );
}

export default function ArchivePage() {
  const {
    data: archives = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['sanity-archives'],
    queryFn: fetchArchives,
    staleTime: 1000 * 60, // 1분
    retry: 2,
  });

  return (
    <div className="min-h-screen bg-muted">
      <Header />

      <main className="container py-8 md:py-12">
        {/* 헤더 영역 */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/"
            className="p-2 rounded-lg hover:bg-accent transition-colors"
            aria-label="홈으로"
          >
            <ArrowLeft size={20} aria-hidden="true" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">📁 서식 자료실</h1>
            <p className="text-sm text-muted-foreground mt-1">
              필요한 서류와 양식을 다운로드하세요.
            </p>
          </div>
        </div>

        {/* ✅ 로딩 / 에러 / 데이터 조건부 렌더링 */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorState onRetry={() => refetch()} />
        ) : archives.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
            {/* 데스크탑 테이블 */}
            <table className="hidden md:table w-full" aria-label="자료실 목록">
              <thead className="bg-muted/60 text-sm text-muted-foreground">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold w-16">형식</th>
                  <th className="text-left px-4 py-3 font-semibold">제목</th>
                  <th className="text-left px-4 py-3 font-semibold w-28">등록일</th>
                  <th className="text-left px-4 py-3 font-semibold w-24">크기</th>
                  <th className="text-center px-4 py-3 font-semibold w-28">다운로드</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {archives.map(item => {
                  const fileUrl = resolveFileUrl(item);
                  const ext = item.file?.asset?.extension;
                  const size = item.file?.asset?.size;

                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <ExtBadge ext={ext} />
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-semibold text-sm text-foreground">{item.title}</p>
                          {item.description && (
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">
                        {formatDate(item.publishedAt)}
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">
                        {size ? formatFileSize(size) : '-'}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {fileUrl ? (
                          <a
                            href={fileUrl}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
                            aria-label={`${item.title} 파일 다운로드`}
                          >
                            <FileDown size={13} aria-hidden="true" />
                            다운로드
                          </a>
                        ) : (
                          <span className="text-xs text-muted-foreground">준비 중</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* 모바일 카드 목록 */}
            <div className="md:hidden divide-y divide-border">
              {archives.map(item => (
                <ArchiveCardMobile key={item._id} item={item} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
