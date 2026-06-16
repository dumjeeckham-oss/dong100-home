import { useEffect, useState } from 'react';
import SpeakableText from './SpeakableText';
import ReactMarkdown from 'react-markdown';
import { loadMarkdownFile } from '@/lib/markdown';

const ServiceSection = () => {
  const [markdownContent, setMarkdownContent] = useState('');

  // 마크다운 파일 로드
  useEffect(() => {
    loadMarkdownFile('service.md').then(data => {
      if (data.content) {
        setMarkdownContent(data.content);
      }
    });
  }, []);

  return (
    <section id="service" className="py-12 md:py-16 bg-background" aria-label="서비스 안내" data-sb-field-path="service">
      <div className="container max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">서비스 안내 (이용안내)</h2>
        <div className="bg-card rounded-2xl p-6 md:p-10 shadow-sm">
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
