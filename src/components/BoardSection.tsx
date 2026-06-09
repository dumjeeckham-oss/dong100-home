import { Link } from 'react-router-dom';
import { ChevronRight, Bell, FileText, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { fileUrl, fetchNoticesPreview, fetchArchivesPreview, fetchUserArchivesPreview } from '@/lib/sanity';

const NoticeCard = () => {
  const { data: notices = [], isLoading } = useQuery({
    queryKey: ['sanity-notices', 'preview'],
    queryFn: fetchNoticesPreview,
    staleTime: 1000 * 60,
  });

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell size={22} className="text-primary" aria-hidden="true" />
          <h3 className="text-xl font-bold">공지사항</h3>
        </div>
        <Link to="/notice" className="text-xs text-primary hover:underline flex items-center gap-0.5">
          더보기 <ChevronRight size={14} />
        </Link>
      </div>
      <ul className="space-y-3" role="list">
        {isLoading ? (
          <li className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mb-3" />
            <p className="text-sm">데이터를 불러오는 중입니다...</p>
          </li>
        ) : notices.length === 0 ? (
          <li className="text-sm text-muted-foreground text-center py-4">등록된 공지가 없습니다.</li>
        ) : (
          notices.map(n => (
            <li key={n._id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <Link
                to={`/notice/${n._id}`}
                className="flex items-center gap-1.5 text-foreground hover:text-primary transition-colors font-medium text-sm truncate flex-1 mr-3"
              >
                {n.important && <AlertCircle size={12} className="text-destructive shrink-0" />}
                <span className="truncate">{n.title}</span>
              </Link>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {n.publishedAt ? new Date(n.publishedAt).toLocaleDateString('ko-KR') : ''}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

const ArchiveCard = () => {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['sanity-archives', 'preview'],
    queryFn: fetchArchivesPreview,
    staleTime: 1000 * 60,
  });

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText size={22} className="text-primary" aria-hidden="true" />
          <h3 className="text-xl font-bold">서식 자료실</h3>
        </div>
        <Link to="/archive" className="text-xs text-primary hover:underline flex items-center gap-0.5">
          더보기 <ChevronRight size={14} />
        </Link>
      </div>
      <ul className="space-y-3" role="list">
        {isLoading ? (
          <li className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mb-3" />
            <p className="text-sm">데이터를 불러오는 중입니다...</p>
          </li>
        ) : items.length === 0 ? (
          <li className="text-sm text-muted-foreground text-center py-4">등록된 자료가 없습니다.</li>
        ) : (
          items.map(it => {
            const url = it.file?.asset?.url || fileUrl(it);
            return (
              <li key={it._id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <Link to="/archive" className="text-foreground hover:text-primary transition-colors font-medium text-sm truncate flex-1 mr-3">
                  {it.title}
                </Link>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {url ? (it.file?.asset?.extension?.toUpperCase() || '파일') : ''}
                </span>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};

const UserArchiveCard = () => {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['sanity-user-archives', 'preview'],
    queryFn: fetchUserArchivesPreview,
    staleTime: 1000 * 60,
  });

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText size={22} className="text-primary" aria-hidden="true" />
          <h3 className="text-xl font-bold">이용자 자료실</h3>
        </div>
        <Link to="/user-archive" className="text-xs text-primary hover:underline flex items-center gap-0.5">
          더보기 <ChevronRight size={14} />
        </Link>
      </div>
      <ul className="space-y-3" role="list">
        {isLoading ? (
          <li className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mb-3" />
            <p className="text-sm">데이터를 불러오는 중입니다...</p>
          </li>
        ) : items.length === 0 ? (
          <li className="text-sm text-muted-foreground text-center py-4">등록된 자료가 없습니다.</li>
        ) : (
          items.map(it => {
            const url = it.file?.asset?.url || fileUrl(it);
            return (
              <li key={it._id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <Link to={`/user-archive/${it._id}`} className="flex items-center gap-1.5 text-foreground hover:text-primary transition-colors font-medium text-sm truncate flex-1 mr-3">
                  {it.category && (
                    <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground font-normal">
                      {it.category === 'service' ? '서비스' : '정보'}
                    </span>
                  )}
                  <span className="truncate">{it.title}</span>
                </Link>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {url ? (it.file?.asset?.extension?.toUpperCase() || '파일') : ''}
                </span>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};

const BoardSection = () => {
  return (
    <section id="board" className="py-12 md:py-16 bg-muted" aria-label="공지사항 및 자료실">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">게시판</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <NoticeCard />
          <ArchiveCard />
          <UserArchiveCard />

          <div className="col-span-full bg-card rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-4xl" aria-hidden="true">🤝</span>
              <div className="text-left">
                <h3 className="text-xl font-bold">활동지원사 모집</h3>
                <p className="text-sm text-muted-foreground">동백과 함께할 활동지원사로 지원하세요</p>
              </div>
            </div>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSfN7sbIDGSZRxTYq6z-z6doJVNyBfITRntE2yeDaVpIGTstXg/viewform?pli=1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"
            >
              지원하기 <ChevronRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BoardSection;
