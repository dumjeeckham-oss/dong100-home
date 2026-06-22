import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { loadMarkdownFile } from '@/lib/markdown';

interface Step {
  step: string;
  title: string;
  desc: string;
}

const parseSteps = (markdown: string): Step[] => {
  const steps: Step[] = [];
  const lines = markdown.split('\n');
  for (const line of lines) {
    // "1. **타이틀** — 설명" 패턴 매칭
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

const ApplicationStepsSection = () => {
  const [steps, setSteps] = useState<Step[]>([]);

  useEffect(() => {
    loadMarkdownFile('steps.md').then(data => {
      if (data.content) {
        setSteps(parseSteps(data.content));
      }
    });
  }, []);

  if (steps.length === 0) return null;

  return (
    <section id="service-apply" className="py-12 md:py-16 bg-background" aria-label="신청 절차">
      <div className="container max-w-5xl">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">신청 절차</h2>
        <div className="flex flex-row items-stretch justify-start sm:justify-center gap-2 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory scroll-smooth">
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
      </div>
    </section>
  );
};

export default ApplicationStepsSection;
