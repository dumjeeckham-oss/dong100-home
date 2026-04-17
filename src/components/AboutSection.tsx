import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SpeakableText from './SpeakableText';
import storyCamellia from '@/assets/story-camellia.jpg';
import storyBird from '@/assets/story-bird.jpg';
import storyCare from '@/assets/story-care.jpg';
import storyTogether from '@/assets/story-together.jpg';

const storySlides = [
  {
    image: storyCamellia,
    title: '🌺 겨울에 피는 동백꽃',
    content: '동백은 특이하게도 경칩 즈음 되어야 피기 시작하는 다른 꽃과는 다르게 경칩이 되기 전부터 꽃이 핍니다. 대략 11월 말부터 꽃을 피우기 시작해서 2~3월에 만발합니다.',
    accent: 'from-red-500/80 to-rose-600/80',
  },
  {
    image: storyBird,
    title: '🐦 동박새와 조매화',
    content: '이 시기에는 곤충이 많지 않기 때문에 새들이 수정을 맡는데, 이를 조매화(鳥媒花)라고 합니다. 동백꽃의 꿀을 좋아해 자주 찾아오는 새가 바로 \'동박새\'입니다.',
    accent: 'from-amber-500/80 to-orange-600/80',
  },
  {
    image: storyTogether,
    title: '💡 동백이라는 이름의 의미',
    content: '동백이라는 센터의 이름은 바로 이러한 \'동백꽃\'과 \'동박새\'에 대한 이야기입니다. 동백이라는 글씨에 동백꽃의 동백과 동박새의 동박이 포함되어있죠.',
    accent: 'from-emerald-500/80 to-green-600/80',
  },
  {
    image: storyCare,
    title: '🤝 동박새와 동백꽃의 관계처럼',
    content: '장애인활동지원사가 장애인의 사회 활동, 가사 활동, 신체적 지원을 통해 자립 생활을 하고, 장애인들은 사회구성원으로 살아갈 수 있게 되는 모습이 마치 동박새와 동백꽃의 관계와 같다는 의미에서 \'동백\'이라는 이름이 만들어졌습니다.',
    accent: 'from-blue-500/80 to-indigo-600/80',
  },
  {
    image: storyTogether,
    title: '🌸 센터의 약속',
    content: '부천의료복지사회적협동조합 장애인활동지원센터는 동백꽃과 동박새처럼 서비스가 필요한 장애인과 활동지원사가 좋은 관계를 오래오래 맺어서 서로 삶의 질이 높아질 수 있도록 운영하겠습니다.\n\n글. 장애인활동지원센터 동백 김광민',
    accent: 'from-purple-500/80 to-violet-600/80',
  },
];

const AboutSection = () => {
  const [slide, setSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const prev = useCallback(() => setSlide(s => (s === 0 ? storySlides.length - 1 : s - 1)), []);
  const next = useCallback(() => setSlide(s => (s === storySlides.length - 1 ? 0 : s + 1)), []);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, [next]);

  // Touch swipe
  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
    setTouchStart(null);
  };

  const current = storySlides[slide];

  return (
    <section id="about" className="py-12 md:py-16 bg-muted" aria-label="센터 소개">
      <div className="container max-w-5xl">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">🌺 동백 이야기</h2>

        {/* Story Slider */}
        <div
          className="relative rounded-2xl overflow-hidden shadow-lg"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Background image */}
          <div className="relative aspect-[3/2] md:aspect-[2/1]">
            {storySlides.map((s, i) => (
              <img
                key={i}
                src={s.image}
                alt=""
                loading="lazy"
                width={960}
                height={640}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === slide ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t ${current.accent} via-black/40 to-transparent`} />

            {/* Text content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
              <SpeakableText as="h3" className="text-xl md:text-3xl font-bold text-white mb-3 drop-shadow-lg">
                {current.title}
              </SpeakableText>
              <SpeakableText className="text-sm md:text-lg leading-relaxed text-white/95 max-w-2xl whitespace-pre-line drop-shadow">
                {current.content}
              </SpeakableText>
            </div>

            {/* Nav arrows */}
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
              aria-label="이전"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
              aria-label="다음"
            >
              <ChevronRight size={22} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {storySlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlide(i)}
                  className={`h-2 rounded-full transition-all ${i === slide ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}
                  aria-label={`${i + 1}번째 이야기`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="mt-6 bg-card rounded-2xl p-5 shadow-sm">
          <SpeakableText as="h4" className="font-bold text-lg mb-3">📞 연락처 및 주소</SpeakableText>
          <ul className="space-y-2 text-base">
            <li><strong>담당부서:</strong> 장애인활동지원팀</li>
            <li><strong>전화번호:</strong> 032-675-7517 (내선 2번)</li>
            <li><strong>이메일:</strong> dong100center@naver.com</li>
            <li><strong>주소:</strong> 경기도 부천시 원미로97번길 31 (원미동 173-5) 3층</li>
            <li><strong>주차안내:</strong> 원미2동 공영주차장(원미동 127-5)</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
