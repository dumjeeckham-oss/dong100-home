import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { loadMarkdownFile } from '@/lib/markdown';
import { Button } from '@/components/ui/button';

interface Step {
  step: string;
  title: string;
  desc: string;
}

const parseSteps = (markdown: string): Step[] => {
  const steps: Step[] = [];
  const lines = markdown.split('\n');
  for (const line of lines) {
    const match = line.match(/^(\d+)\.\s*\*\*(.+?)\*\*\s*[—–-]\s*(.+)$/);
    if (match) {
      steps.push({
        step: match[1],
        title: match[2].trim(),
        desc: match[3].trim(),
      });
    }
  }
  return steps;
};

const ApplicationStepsSection = ({ siteSettings }: { siteSettings?: { _id?: string; serviceApplyTitle?: string } }) => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [applyContent, setApplyContent] = useState('');
  const [showApply, setShowApply] = useState(false);

  useEffect(() => {
    loadMarkdownFile('steps.md').then(data => {
      if (data.content) setSteps(parseSteps(data.content));
    });
    loadMarkdownFile('apply.md').then(data => {
      if (data.content) setApplyContent(data.content);
    });
  }, []);

  return (
    <section id="service-apply" className="scroll-mt-24 py-12 md:py-16 bg-background" aria-label="서비스 신청방법">
      <div className="container max-w-5xl">
        <h2
          className="text-2xl md:text-3xl font-bold text-center mb-8"
          data-id={siteSettings?._id}
          data-field="serviceApplyTitle"
          data-type="siteSettings"
        >
          {siteSettings?.serviceApplyTitle || '서비스 신청방법'}
        </h2>

        {/* 5단계 카드 — 항상 보임 */}
        {steps.length > 0 && (
          <div className="flex flex-row items-stretch justify-start sm:justify-center gap-2 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory scroll-smooth mb-8">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-2 shrink-0">
                <div className="flex flex-col items-center text-center p-5 bg-card border border-border shadow-sm rounded-2xl w-[150px] sm:w-auto sm:min-w-[140px] sm:flex-1 snap-center hover:border-primary/50 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl mb-3 shadow-sm">
                    {s.step}
                  </div>
                  <p className="font-bold text-[15px] mb-1">{s.title}</p>
                  <p className="text-xs text-muted-foreground break-keep leading-tight">{s.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <ChevronRight className="text-muted-foreground shrink-0 self-center" size={24} />
                )}
              </div>
            ))}
          </div>
        )}


        {/* apply.md 상세 내용 */}
        {applyContent && showApply && (
          <div className="bg-card rounded-2xl p-6 md:p-10 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="prose prose-sm max-w-none
              prose-h2:text-xl prose-h2:font-bold prose-h2:text-primary prose-h2:mt-8 prose-h2:mb-3
              prose-h3:text-lg prose-h3:font-semibold prose-h3:text-foreground prose-h3:mb-2
              prose-p:text-foreground/80 prose-p:leading-relaxed
              prose-li:text-foreground/80
              prose-strong:text-foreground
            ">
              <ReactMarkdown>{applyContent}</ReactMarkdown>
            </div>

            {/* 접기 버튼 */}
            <div className="flex justify-center pt-8 border-t border-border mt-8">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowApply(false)}
                className="rounded-full px-8 py-6 text-lg font-bold shadow-lg border-2 border-primary/30 bg-card hover:bg-primary hover:text-primary-foreground transition-all gap-2"
              >
                상세 안내 접기 <ChevronUp />
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ApplicationStepsSection;
