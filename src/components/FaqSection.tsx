import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PortableText } from '@portabletext/react';
import { fetchFaqItems, type FaqItem } from '@/lib/sanity';
import { portableComponents } from '@/components/portableComponents';
import { Button } from '@/components/ui/button';

const FaqSection = () => {
  const { data: items = [], isLoading, isError } = useQuery({
    queryKey: ['faq-items'],
    queryFn: () => fetchFaqItems(),
    staleTime: 1000 * 60 * 15,
  });
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => {
    const unique = Array.from(new Set(items.map((item) => item.category || '기타')));
    return ['All', ...unique];
  }, [items]);

  const filteredItems = useMemo(
    () =>
      items.filter((item) =>
        selectedCategory === 'All' ? true : item.category === selectedCategory,
      ),
    [items, selectedCategory],
  );

  return (
    <section id="faq" className="scroll-mt-24 py-16 bg-slate-50" aria-label="자주 묻는 질문">
      <div className="container">
        <div className="mb-8 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">FAQ</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">자주 묻는 질문</h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground">
            궁금한 내용을 빠르게 찾을 수 있도록 질문을 정리했습니다.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="rounded-full px-4 py-2"
            >
              {category}
            </Button>
          ))}
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
              선택한 카테고리에 해당하는 FAQ가 없습니다.
            </div>
          ) : (
            <Accordion type="multiple" className="space-y-3">
              {filteredItems.map((item) => (
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
          )}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
