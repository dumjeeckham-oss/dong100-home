import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { loadMarkdownFile } from '@/lib/markdown';

const BusinessSection = () => {
  const [content, setContent] = useState('');

  useEffect(() => {
    loadMarkdownFile('business.md').then(data => {
      if (data.content) setContent(data.content);
    });
  }, []);

  return (
    <section id="business" className="py-12 md:py-16 bg-background" aria-label="사업안내" data-sb-field-path="business">
      <div className="container max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">사업안내</h2>
        <div className="bg-card rounded-2xl p-6 md:p-10 shadow-sm">
          <div className="prose prose-sm max-w-none
            prose-h3:text-xl prose-h3:font-bold prose-h3:text-primary prose-h3:mb-2
            prose-p:text-foreground/80 prose-p:leading-relaxed
            prose-li:marker:text-primary
            prose-strong:text-foreground
          ">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessSection;
