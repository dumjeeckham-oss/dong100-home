import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { loadMarkdownFile } from '@/lib/markdown';

const CostSection = () => {
  const [content, setContent] = useState('');

  useEffect(() => {
    loadMarkdownFile('cost.md').then(data => {
      if (data.content) setContent(data.content);
    });
  }, []);

  return (
    <section id="cost" className="py-12 md:py-16 bg-muted" aria-label="비용 및 서비스 안내" data-sb-field-path="cost">
      <div className="container max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">비용 및 서비스 안내</h2>
        <div className="bg-card rounded-2xl p-6 md:p-10 shadow-sm">
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CostSection;
