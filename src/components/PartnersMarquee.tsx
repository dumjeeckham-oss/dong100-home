import type { SiteSettings, Partner } from '@/lib/sanity';

interface Props {
  siteSettings?: SiteSettings | null;
}

const PartnerItem = ({ p }: { p: Partner }) => {
  const inner = (
    <div className="flex h-20 w-40 shrink-0 items-center justify-center rounded-xl bg-card px-4 shadow-sm transition-transform hover:scale-105 md:h-24 md:w-52">
      {p.logo ? (
        <img
          src={p.logo}
          alt={p.name || '협약기관 로고'}
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
  if (partners.length === 0) return null;

  const loop = [...partners, ...partners];

  return (
    <section className="border-t border-border bg-muted py-10" aria-label="협약기관">
      <div className="container mb-6">
        <h2 className="text-center text-xl font-bold md:text-2xl">협약기관</h2>
      </div>
      <div className="group relative overflow-hidden">
        <div className="marquee-track flex w-max gap-6 group-hover:[animation-play-state:paused]">
          {loop.map((p, i) => (
            <PartnerItem key={`${p._key || p.name}-${i}`} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersMarquee;
