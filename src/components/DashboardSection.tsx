import { ArrowRight, BookOpen, HelpCircle, Newspaper, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const boards = [
  {
    title: '이용자 자료실',
    description: '센터 자료와 이용 안내를 한눈에 확인하세요.',
    icon: BookOpen,
    href: '/user-archive',
  },
  {
    title: 'FAQ',
    description: '자주 묻는 질문을 빠르게 찾아보세요.',
    icon: HelpCircle,
    href: '#faq',
  },
  {
    title: '공지사항',
    description: '센터의 최신 공지와 안내를 확인하세요.',
    icon: Newspaper,
    href: '/notice',
  },
  {
    title: '센터 안내',
    description: '서비스 소개와 신청 안내를 바로 확인합니다.',
    icon: Users,
    href: '/archive',
  },
];

const DashboardSection = () => (
  <section className="py-16 bg-white" aria-label="게시판 모음">
    <div className="container">
      <div className="mb-10 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">게시판 모음</p>
        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">필요한 정보에 빠르게 접근하세요</h2>
        <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground">
          이용자 자료실, FAQ, 공지사항을 카드형 대시보드로 정리하여 더 빠르고 편리하게 찾을 수 있습니다.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {boards.map((board) => {
          const Icon = board.icon;
          return (
            <div key={board.title} className="group overflow-hidden rounded-3xl border border-border bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-5">
                <Icon size={24} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{board.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground mb-6">{board.description}</p>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="rounded-full gap-2"
              >
                <a href={board.href} className="inline-flex items-center gap-2">
                  이동하기 <ArrowRight size={16} />
                </a>
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export default DashboardSection;
