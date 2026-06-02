import React from 'react';
import { ChevronRight } from 'lucide-react';

const steps = [
  { step: '1', title: '읍·면·동 내방', desc: '신규/갱신 등 신청서 제출' },
  { step: '2', title: '국민연금공단', desc: '방문조사 (종합조사)' },
  { step: '3', title: '시·군·구', desc: '수급자격 및 등급결정' },
  { step: '4', title: '사회보장정보원', desc: '통지서 수령 및 바우처카드 발급' },
  { step: '5', title: '동백 활동지원센터', desc: '활동지원급여 매칭 및 서비스 제공' },
];

const ApplicationStepsSection = () => {
  return (
    <section id="service-apply" className="py-12 md:py-16 bg-background" aria-label="신청 절차">
      <div className="container max-w-5xl">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">신청 절차</h2>
        <div className="flex flex-row items-stretch justify-start sm:justify-center gap-2 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory scroll-smooth">
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center text-center p-5 bg-card border border-border shadow-sm rounded-2xl w-[150px] sm:w-auto sm:min-w-[140px] sm:flex-1 shrink-0 snap-center hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl mb-3 shadow-sm">
                  {s.step}
                </div>
                <p className="font-bold text-[15px] mb-1">{s.title}</p>
                <p className="text-xs text-muted-foreground break-keep leading-tight">{s.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <ChevronRight className="text-muted-foreground shrink-0 self-center" size={24} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ApplicationStepsSection;
