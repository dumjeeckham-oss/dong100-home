import type { SiteSettings, Partner } from '@/lib/sanity';
import { useIsMobile } from '@/hooks/use-mobile';

interface Props {
  siteSettings?: SiteSettings | null;
}

const PartnerItem = ({ p }: { p: Partner }) => {
  const inner = (
    <div className="flex h-20 w-40 shrink-0 items-center justify-center rounded-xl bg-card px-4 shadow-sm transition-transform hover:scale-105 md:h-24 md:w-52">
      {p.logo ? (
        <img
          src={p.logo}
          alt={p.name || '관련기관 로고'}
          loading="lazy"
          className="max-h-full max-w-full object-contain"
        />
      ) : (
        <span className="text-center text-sm font-semibold text-foreground">{p.name}</span>
      )}
    </div>
  );

  return p.url ? (
    <a href={p.url} target="_blank" rel="noopener noreferrer" aria-label={p.name} className="shrink-0">
      {inner}
    </a>
  ) : (
    inner
  );
};

const PartnersMarquee = ({ siteSettings }: Props) => {
  const partners = (siteSettings?.partners || []).filter(Boolean);
  const isMobile = useIsMobile();
  if (partners.length === 0) return null;

  // 모바일에서는 항상 한 줄 무한 스크롤, 데스크톱은 5개 이상일 때만 마퀴
  const shouldScroll = isMobile || partners.length >= 5;

  // 무한 스크롤이 자연스럽게 보이도록 최소 개수만큼 복제
  let loop = partners;
  if (shouldScroll) {
    const minItems = isMobile ? 12 : 8;
    while (loop.length < minItems) {
      loop = [...loop, ...partners];
    }
    // 원본 + 복제본을 이어 붙여 translateX(-50%)가 매끄럽게 연결되도록 함
    loop = [...loop, ...partners];
  }

  return (
    <section className="border-t border-border bg-muted py-10" aria-label="관련기관">
      <div className="container mb-6">
        <h2 className="text-center text-xl font-bold md:text-2xl">관련기관</h2>
      </div>
      <div className="group relative overflow-hidden">
        <div
          className={
            shouldScroll
              ? 'marquee-track flex w-max gap-4 md:gap-6 group-hover:[animation-play-state:paused]'
              : 'flex flex-wrap items-center justify-center gap-6 px-4'
          }
        >
          {loop.map((p, i) => (
            <PartnerItem key={`${p._key || p.name}-${i}`} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersMarquee;
