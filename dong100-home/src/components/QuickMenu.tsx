const quickItems = [
  {
    label: '서비스 신청방법',
    href: '#service',
    desc: '활동지원 신청 절차 안내',
    emoji: '📋',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    label: '비용 안내',
    href: '#cost',
    desc: '이용료 및 급여 구간 안내',
    emoji: '💰',
    color: 'bg-green-100 text-green-600',
  },
  {
    label: '활동지원사 모집',
    href: 'https://docs.google.com/forms/d/e/1FAIpQLSfN7sbIDGSZRxTYq6z-z6doJVNyBfITRntE2yeDaVpIGTstXg/viewform?pli=1',
    desc: '활동지원사 지원하기',
    external: true,
    emoji: '🤝',
    color: 'bg-orange-100 text-orange-600',
  },
  {
    label: '사업안내',
    href: '#business',
    desc: '활동지원서비스 상세 내용',
    emoji: '🏢',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    label: '오시는 길',
    href: '#directions',
    desc: '센터 위치 및 약도',
    emoji: '📍',
    color: 'bg-red-100 text-red-600',
  },
  {
    label: '전화 문의',
    href: 'tel:070-4127-1611',
    desc: '032-675-7517 (내선 2번)',
    emoji: '📞',
    color: 'bg-teal-100 text-teal-600',
  },
];

const QuickMenu = () => {
  return (
    <section className="py-12 md:py-16 bg-background" aria-label="퀵 메뉴">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          자주 찾는 서비스
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickItems.map(item => (
            <a
              key={item.label}
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
              className="flex flex-col items-center gap-3 p-6 rounded-xl border border-border bg-card hover:shadow-lg hover:-translate-y-1 transition-all text-center group"
              aria-label={`${item.label} - ${item.desc}`}
            >
              <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center text-3xl group-hover:scale-110 transition-transform`}>
                {item.emoji}
              </div>
              <span className="font-semibold text-base text-foreground">{item.label}</span>
              <span className="text-sm text-muted-foreground">{item.desc}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickMenu;
