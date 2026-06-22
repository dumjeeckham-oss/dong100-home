import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { loadMarkdownFile } from '@/lib/markdown';
import { Skeleton } from '@/components/ui/skeleton';

const GuideSection = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMarkdownFile('guide.md').then(data => {
      if (data.content) setContent(data.content);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-slate-50">
        <div className="container max-w-4xl">
          <Skeleton className="h-8 w-48 mx-auto mb-8" />
          <Skeleton className="h-4 w-full mb-4" />
          <Skeleton className="h-4 w-3/4 mb-4" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </section>
    );
  }

  if (!content) return null;

  return (
    <section className="py-12 md:py-16 bg-slate-50" aria-label="센터 안내">
      <div className="container max-w-4xl">
        <div className="prose prose-slate max-w-none
          prose-headings:text-foreground prose-headings:font-bold
          prose-h1:text-2xl md:prose-h1:text-3xl prose-h1:text-center prose-h1:mb-10
          prose-h2:text-xl md:prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
          prose-h3:text-lg md:prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
          prose-p:text-muted-foreground prose-p:leading-relaxed
          prose-li:text-muted-foreground
          prose-strong:text-foreground">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </section>
  );
};

export default GuideSection;
