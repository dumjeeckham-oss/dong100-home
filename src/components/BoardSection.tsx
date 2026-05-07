import { useState } from 'react';
import { ChevronRight, Newspaper, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import type { Tables } from '@/integrations/supabase/types';

type BoardPost = Tables<'board_posts'>;
type RssItem = { title: string; link: string; pubDate: string; description: string };

const fetchPosts = async (type: string): Promise<BoardPost[]> => {
  const { data } = await supabase
    .from('board_posts')
    .select('*')
    .eq('board_type', type as 'notice' | 'resource' | 'user_info')
    .order('created_at', { ascending: false })
    .limit(5);
  return data || [];
};

const fetchRss = async (boTable: string): Promise<RssItem[]> => {
  const { data, error } = await supabase.functions.invoke('fetch-rss', { body: { bo_table: boTable } });
  if (error) throw error;
  return (data?.items ?? []) as RssItem[];
};

const RssCard = ({
  label,
  icon: Icon,
  boTable,
}: {
  label: string;
  icon: typeof Newspaper;
  boTable: string;
}) => {
  const [expanded, setExpanded] = useState(false);
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['rss', boTable],
    queryFn: () => fetchRss(boTable),
    staleTime: 1000 * 60 * 10,
  });
  const visible = expanded ? items : items.slice(0, 5);

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon size={22} className="text-primary" aria-hidden="true" />
          <h3 className="text-xl font-bold">{label}</h3>
        </div>
      </div>
      <ul className="space-y-3" role="list">
        {isLoading ? (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <li key={i} className="py-2"><Skeleton className="h-4 w-full" /></li>
            ))}
          </>
        ) : items.length === 0 ? (
          <li className="text-sm text-muted-foreground text-center py-4">소식이 없습니다.</li>
        ) : (
          visible.map((item, idx) => (
            <li key={idx} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => console.log(`[RSS:${boTable}] open:`, item.link)}
                className="text-foreground hover:text-primary transition-colors font-medium text-sm truncate flex-1 mr-3"
              >
                {item.title}
              </a>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {item.pubDate ? new Date(item.pubDate).toLocaleDateString('ko-KR') : ''}
              </span>
            </li>
          ))
        )}
      </ul>
      {items.length > 5 && (
        <button
          onClick={() => setExpanded(v => !v)}
          className="mt-4 w-full text-xs text-primary hover:underline flex items-center justify-center gap-0.5"
        >
          {expanded ? '접기' : `더보기 (${items.length - 5})`} <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
};

const standardBoards = [
  { key: 'notice', label: '공지사항', emoji: '📢', tab: 'notice' },
  { key: 'resource', label: '자료실', emoji: '📁', tab: 'resource' },
];

const BoardSection = () => {
  const { data: notices = [] } = useQuery({ queryKey: ['board_posts', 'notice'], queryFn: () => fetchPosts('notice') });
  const { data: resources = [] } = useQuery({ queryKey: ['board_posts', 'resource'], queryFn: () => fetchPosts('resource') });
  const itemsMap: Record<string, BoardPost[]> = { notice: notices, resource: resources };

  return (
    <section id="board" className="py-12 md:py-16 bg-muted" aria-label="공지사항 및 자료실">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">게시판</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {standardBoards.map(board => {
            const items = itemsMap[board.key];
            return (
              <div key={board.key} className="bg-card rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl" aria-hidden="true">{board.emoji}</span>
                    <h3 className="text-xl font-bold">{board.label}</h3>
                  </div>
                  <a
                    href={`/board?tab=${board.tab}`}
                    className="text-xs text-primary hover:underline flex items-center gap-0.5"
                    aria-label={`${board.label} 더보기`}
                  >
                    더보기 <ChevronRight size={14} />
                  </a>
                </div>
                <ul className="space-y-3" role="list">
                  {items.length === 0 ? (
                    <li className="text-sm text-muted-foreground text-center py-4">등록된 글이 없습니다.</li>
                  ) : (
                    items.map(item => (
                      <li key={item.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <a
                          href={`/board?tab=${board.tab}`}
                          className="text-foreground hover:text-primary transition-colors font-medium text-sm truncate flex-1 mr-3"
                        >
                          {item.title}
                        </a>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(item.created_at).toLocaleDateString('ko-KR')}
                        </span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            );
          })}

          <div id="activity-news">
            <RssCard label="활동 소식" icon={Newspaper} boTable="support4" />
          </div>
          <div id="user-info">
            <RssCard label="이용자 정보" icon={Users} boTable="support5" />
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
            <span className="text-4xl mb-3">🤝</span>
            <h3 className="text-xl font-bold mb-2">활동지원사 모집</h3>
            <p className="text-sm text-muted-foreground mb-4">활동지원사로 지원하세요</p>
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
