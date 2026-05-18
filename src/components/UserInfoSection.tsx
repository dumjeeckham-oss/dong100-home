import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { fetchGnuboardRss } from '@/lib/rss';

const formatDate = (s?: string) => {
  if (!s) return '';
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

const UserInfoSection = () => {
  const [expanded, setExpanded] = useState(false);
  const { data: items = [], isLoading, isError } = useQuery({
    queryKey: ['rss', 'support5'],
    queryFn: () => fetchGnuboardRss('support5'),
    staleTime: 1000 * 60 * 10,
  });

  const visible = expanded ? items : items.slice(0, 5);

  return (
    <section id="user-info" className="py-12 md:py-16 bg-background" aria-label="이용자 정보">
      <div className="container">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Users className="text-primary" />
          <h2 className="text-2xl md:text-3xl font-bold text-center">이용자 정보</h2>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-sm max-w-3xl mx-auto">
          {isLoading ? (
            <ul className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <li key={i} className="py-2"><Skeleton className="h-5 w-full" /></li>
              ))}
            </ul>
          ) : isError ? (
            <p className="text-center text-muted-foreground py-8">
              소식을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
            </p>
          ) : items.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">등록된 글이 없습니다.</p>
          ) : (
            <>
              <ul className="divide-y divide-border" role="list">
                {visible.map((item, idx) => (
                  <li key={idx} className="py-3">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => console.log('[이용자정보] open:', item.link)}
                      className="flex items-start justify-between gap-3 group"
                    >
                      <span className="flex-1 text-foreground group-hover:text-primary transition-colors font-medium text-base leading-snug">
                        {item.title}
                        <ExternalLink size={12} className="inline-block ml-1.5 opacity-50 group-hover:opacity-100" />
                      </span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap pt-1">
                        {formatDate(item.pubDate)}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              {items.length > 5 && (
                <div className="flex justify-center mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setExpanded(!expanded)}
                    className="rounded-full gap-1"
                  >
                    {expanded ? (<>접기 <ChevronUp size={16} /></>) : (<>더보기 ({items.length - 5}개) <ChevronDown size={16} /></>)}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default UserInfoSection;
