import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Phone } from 'lucide-react';
import hero1 from '@/assets/hero-1.jpg';
import hero2 from '@/assets/hero-2.jpg';
import hero3 from '@/assets/hero-3.jpg';
import type { SiteSettings } from '@/lib/sanity';

interface HeroSliderProps {
  siteSettings: SiteSettings | null;
}

const HeroSlider = ({ siteSettings }: HeroSliderProps) => {
  const [current, setCurrent] = useState(0);

  const phone = siteSettings?.contactNumber || '032-675-7517';
  const defaultSlides = [
    {
      title: siteSettings?.slide1Title || siteSettings?.title || siteSettings?.heroTitle || '장애인의 자립생활을\n함께 만들어갑니다',
      subtitle: siteSettings?.slide1Subtitle || siteSettings?.bannerText || siteSettings?.heroSubtitle || '부천의료복지사회적협동조합 동백 장애인활동지원센터',
      desc: siteSettings?.slide1Description || siteSettings?.description || siteSettings?.heroDescription || '신체적·정신적 장애로 일상생활이 어려운 분들에게\n활동지원서비스를 제공하여 자립생활을 돕습니다.',
      image: hero1,
    },
    {
      title: siteSettings?.slide2Title || '활동지원서비스\n신청 안내',
      subtitle: siteSettings?.slide2Subtitle || '만 6세 ~ 64세 등록 장애인 대상',
      desc: siteSettings?.slide2Description || '활동지원 급여(기본급여 15구간) + 특별지원급여(3종)를\n받으실 수 있습니다.',
      image: hero2,
    },
    {
      title: siteSettings?.slide3Title || '활동지원사를\n모집합니다',
      subtitle: siteSettings?.slide3Subtitle || '장애인과 함께하는 보람찬 일자리',
      desc: siteSettings?.slide3Description || '활동지원사 교육 이수 후 전문 직업인으로\n함께 일할 수 있습니다.',
      image: hero3,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % defaultSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [defaultSlides.length]);

  const prev = () => setCurrent(c => (c - 1 + defaultSlides.length) % defaultSlides.length);
  const next = () => setCurrent(c => (c + 1) % defaultSlides.length);

  return (
    <section
      className="relative overflow-hidden"
      aria-label="메인 슬라이드"
      role="region"
      data-sb-field-path="hero"
    >
      {/* Background images */}
      {defaultSlides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden={i !== current}
        >
          <img
            src={slide.image}
            alt=""
            className="w-full h-full object-cover"
            width={1200}
            height={800}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>
      ))}

      <div className="container py-14 sm:py-20 md:py-28 lg:py-36 relative z-10">
        <div className="max-w-2xl">
          {defaultSlides.map((slide, i) => (
            <div
              key={i}
              className={`transition-all duration-700 ${i === current ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}
              aria-hidden={i !== current}
            >
              <p 
                className="text-white/80 text-sm md:text-base font-medium mb-3 tracking-wide"
                data-id={siteSettings?._id}
                data-field="heroSubtitle"
                data-type="siteSettings"
              >
                {slide.subtitle}
              </p>
              <h1 
                className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight whitespace-pre-line mb-6 text-white"
                data-id={siteSettings?._id}
                data-field="heroTitle"
                data-type="siteSettings"
              >
                {slide.title}
              </h1>
              <p 
                className="text-white/90 text-base md:text-lg max-w-xl whitespace-pre-line leading-relaxed"
                data-id={siteSettings?._id}
                data-field="heroDescription"
                data-type="siteSettings"
              >
                {slide.desc}
              </p>
            </div>
          ))}
          <div className="mt-8 sm:mt-10 flex flex-wrap gap-3 relative z-20 pointer-events-auto">
            <button 
              onClick={() => {
                window.dispatchEvent(new CustomEvent('show-details'));
                setTimeout(() => {
                  document.getElementById('service-apply')?.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
              className="bg-primary text-primary-foreground px-6 py-4 min-h-[48px] rounded-lg font-bold text-base hover:bg-primary/90 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:-translate-y-1"
            >
              서비스 신청하기
            </button>
            <a 
              href={`tel:${phone.replace(/[^0-9+]/g, '')}`} 
              className="bg-white text-slate-800 px-6 py-4 min-h-[48px] rounded-lg font-bold text-base hover:bg-gray-50 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:-translate-y-1 flex items-center gap-2"
            >
              <Phone size={18} className="text-primary" /> 
              <span className="hidden sm:inline">전화문의 ({phone})</span>
              <span className="sm:hidden">전화문의</span>
            </a>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 right-6 flex items-center gap-2 z-20">
        <button onClick={prev} className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white" aria-label="이전 슬라이드">
          <ChevronLeft size={20} />
        </button>
        <div className="flex gap-1.5">
          {defaultSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? 'bg-white w-6' : 'bg-white/40'}`}
              aria-label={`슬라이드 ${i + 1}`}
              aria-current={i === current}
            />
          ))}
        </div>
        <button onClick={next} className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white" aria-label="다음 슬라이드">
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
};

export default HeroSlider;
