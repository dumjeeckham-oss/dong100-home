'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchFaqItems, FaqItem } from '@/lib/sanity';
import { PortableText } from '@portabletext/react';
import { portableComponents } from '@/components/portableComponents';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQPage = () => {
  const { data: faqItems, isLoading, error } = useQuery({
    queryKey: ['faq'],
    queryFn: fetchFaqItems,
  });

  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // 카테고리별로 그룹화
  const groupedFaqs = faqItems?.reduce((acc, faq) => {
    const category = faq.category || '기타';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(faq);
    return acc;
  }, {} as Record<string, FaqItem[]>) || {};

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">FAQ를 불러오는 중 오류가 발생했습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4">자주 묻는 질문</h1>
          <p className="text-center text-muted-foreground mb-12">
            동백 장애인활동지원센터에 대한 자주 묻는 질문과 답변입니다.
          </p>

          {Object.entries(groupedFaqs).map(([category, items]) => (
            <div key={category} className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-primary">{category}</h2>
              <div className="space-y-4">
                {items.map((faq) => (
                  <div
                    key={faq._id}
                    className="border border-border rounded-lg overflow-hidden bg-card"
                  >
                    <button
                      onClick={() => toggleItem(faq._id)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-accent transition-colors"
                      aria-expanded={openItems.has(faq._id)}
                    >
                      <span className="font-medium text-lg">{faq.question}</span>
                      {openItems.has(faq._id) ? (
                        <ChevronUp className="flex-shrink-0 ml-2" size={20} />
                      ) : (
                        <ChevronDown className="flex-shrink-0 ml-2" size={20} />
                      )}
                    </button>
                    {openItems.has(faq._id) && (
                      <div className="px-6 py-4 border-t border-border bg-accent/50">
                        {faq.answer && (
                          <div className="prose prose-sm max-w-none">
                            <PortableText
                              value={faq.answer}
                              components={portableComponents}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {faqItems && faqItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">등록된 FAQ가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
