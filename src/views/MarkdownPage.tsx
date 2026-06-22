import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { loadMarkdownFile } from '@/lib/markdown';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const MarkdownPage = () => {
  const { filename } = useParams<{ filename: string }>();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!filename) {
      setError(true);
      setLoading(false);
      return;
    }

    loadMarkdownFile(`${filename}.md`).then(data => {
      if (data.content) {
        setContent(data.content);
        setLoading(false);
      } else {
        setError(true);
        setLoading(false);
      }
    }).catch(() => {
      setError(true);
      setLoading(false);
    });
  }, [filename]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-muted-foreground">페이지를 찾을 수 없습니다.</div>
          <Button onClick={() => navigate('/')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            홈으로 이동
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <Button onClick={() => navigate('/')} variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          뒤로 가기
        </Button>
        <div className="bg-card rounded-2xl p-8 shadow-sm">
          <div className="prose prose-slate max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownPage;
