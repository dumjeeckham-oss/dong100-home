import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PortableText } from '@portabletext/react';
import { fetchFaqItems, type FaqItem } from '@/lib/sanity';
import { portableComponents } from '@/components/portableComponents';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const FaqSection = () => {
  const { data: items = [], isLoading, isError } = useQuery({
    queryKey: ['faq-items'],
    queryFn: () => fetchFaqItems(),
    staleTime: 1000 * 60 * 15,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        // 검색 로직: 질문 및 답변에서 검색 (한글 검색 지원)
        const searchMatch = searchQuery === '' || 
          item.question.includes(searchQuery) ||
          (item.answer && 
            (typeof item.answer === 'string' 
              ? item.answer.includes(searchQuery)
              : JSON.stringify(item.answer).includes(searchQuery)
            )
          );
        
        return searchMatch;
      }),
    [items, searchQuery],
  );

  const displayItems = useMemo(() => {
    if (showAll || searchQuery !== '') {
      return filteredItems;
    }
    return filteredItems.slice(0, 5);
  }, [filteredItems, showAll, searchQuery]);

  const groupedItems = useMemo(() => {
    const groups: Record<string, FaqItem[]> = {};
    displayItems.forEach((item) => {
      const category = item.category || '기타';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
    });
    return groups;
  }, [displayItems]);


  return (
    <section id="faq" className="scroll-mt-24 py-16 bg-slate-50" aria-label="자주 묻는 질문" data-sb-field-path="faq">
      <div className="container">
        <div className="mb-8 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">FAQ</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">자주 묻는 질문</h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground">
            궁금한 내용을 빠르게 찾을 수 있도록 질문을 정리했습니다.
          </p>
        </div>

        <div className="mb-6 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="FAQ 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          {isLoading ? (
            <div className="py-16 text-center text-muted-foreground">FAQ를 불러오는 중입니다...</div>
          ) : isError ? (
            <div className="py-16 text-center text-muted-foreground">
              FAQ를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              검색 결과가 없습니다.
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedItems).map(([category, categoryItems]) => (
                <div key={category}>
                  <h3 className="text-xl font-bold text-foreground mb-4 pb-2 border-b border-border">
                    {category}
                  </h3>
                  <Accordion type="multiple" className="space-y-3">
                    {categoryItems.map((item) => (
                      <AccordionItem key={item._id} value={`faq-${item._id}`} className="rounded-2xl border border-border bg-background">
                        <AccordionTrigger className="px-5 py-5 text-left text-base font-semibold text-foreground">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="px-5 pb-5 pt-0 text-sm leading-relaxed text-muted-foreground">
                          <PortableText value={item.answer ?? []} components={portableComponents} />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
              {filteredItems.length > 5 && searchQuery === '' && (
                <div className="mt-4 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAll(!showAll)}
                    className="rounded-full px-6"
                  >
                    {showAll ? '접기' : `더보기 (${filteredItems.length - 5}개)`}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
