import { ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import type { Tables } from '@/integrations/supabase/types';

type BoardPost = Tables<'posts'>;

const fetchPosts = async (type: string): Promise<BoardPost[]> => {
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('board_type', type as 'notice' | 'archive' | 'info')
    .order('created_at', { ascending: false })
    .limit(5);
  return data || [];
};

const boards = [
  { key: 'notice', label: '공지사항', emoji: '📢', tab: 'notice' },
  { key: 'archive', label: '자료실', emoji: '📁', tab: 'archive' },
  { key: 'info', label: '이용자 정보', emoji: '👥', tab: 'info' },
  { key: 'recruit', label: '활동지원사 모집', emoji: '🤝', tab: 'recruit', external: 'https://docs.google.com/forms/d/e/1FAIpQLSfN7sbIDGSZRxTYq6z-z6doJVNyBfITRntE2yeDaVpIGTstXg/viewform?pli=1' },
];

const BoardSection = () => {
  const { data: notices = [] } = useQuery({ queryKey: ['posts', 'notice'], queryFn: () => fetchPosts('notice') });
  const { data: resources = [] } = useQuery({ queryKey: ['posts', 'archive'], queryFn: () => fetchPosts('archive') });
  const { data: userInfos = [] } = useQuery({ queryKey: ['posts', 'info'], queryFn: () => fetchPosts('info') });

  const itemsMap: Record<string, BoardPost[]> = { notice: notices, archive: resources, info: userInfos };

  return (
    <section id="board" className="py-12 md:py-16 bg-muted" aria-label="공지사항 및 자료실">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">게시판</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {boards.map(board => {
            if (board.external) {
              return (
                <div key={board.key} className="bg-card rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
                  <span className="text-4xl mb-3">{board.emoji}</span>
                  <h3 className="text-xl font-bold mb-2">{board.label}</h3>
                  <p className="text-sm text-muted-foreground mb-4">활동지원사로 지원하세요</p>
                  <a
                    href={board.external}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"
                  >
                    지원하기 <ChevronRight size={14} />
                  </a>
                </div>
              );
            }

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
        </div>
      </div>
    </section>
  );
};

export default BoardSection;
