import React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import SpeakableText from './SpeakableText';

const serviceDetails = [
  {
    category: '신체활동지원',
    items: [
      { name: '개인위생관리', desc: '목욕도움, 구강 관리, 세면 도움, 배설 도움, 환복' },
      { name: '신체기능 유지 증진', desc: '체위 변경 도움, 관절구축 예방활동, 기구운동 보조' },
      { name: '식사지원', desc: '식사 준비, 식사 보조' },
      { name: '실내 이동 지원', desc: '집안 내 걷기 보조, 휠체어 옮겨 타기' },
    ],
  },
  {
    category: '가사활동지원',
    items: [
      { name: '청소 및 주변정돈', desc: '이용자 주 거주 장소의 청소 및 정리' },
      { name: '세탁', desc: '옷, 양말, 수건 등의 세탁 및 삶기' },
      { name: '취사', desc: '밥 준비, 반찬 준비, 설거지, 분리수거' },
    ],
  },
  {
    category: '사회활동지원',
    items: [
      { name: '등하교 및 출퇴근', desc: '출퇴근 및 등하교 보조 (부축, 동행 포함)' },
      { name: '외출시 동행', desc: '산책, 물품구매, 병원, 은행 등 동행' },
    ],
  },
];



const BusinessSection = () => {
  return (
    <section id="business" className="py-12 md:py-16 bg-background" aria-label="사업안내">
      <div className="container max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">사업안내</h2>
        <div className="bg-card rounded-2xl p-6 md:p-10 shadow-sm space-y-8">
          <div>
            <SpeakableText as="h3" className="text-xl font-bold text-primary mb-2">장애인 활동지원 서비스란?</SpeakableText>
            <SpeakableText className="text-foreground/80 leading-relaxed">
              신체적·정신적 사유로 일상생활과 사회생활을 하기 어려운 장애인에게 활동지원서비스를 제공함으로써, 장애인의 자립생활을 지원하고 가족의 부담을 줄여 장애인의 삶의 질을 향상하고 활동에 어려움을 해소하는 것을 목적으로 합니다.
            </SpeakableText>
          </div>

          <div>
            <SpeakableText as="h3" className="text-xl font-bold text-primary mb-2">서비스 대상자</SpeakableText>
            <SpeakableText className="text-foreground/80">
              자격: 만 6세 이상부터 만 65세 미만의 「장애인복지법」상 등록된 장애인
            </SpeakableText>
            <p className="text-sm text-muted-foreground mt-1">
              *65세 도래 시 해당 월의 다음 달까지 수급자격을 유지합니다.
            </p>
          </div>



          {/* Service details */}
          <div>
            <SpeakableText as="h3" className="text-xl font-bold text-primary mb-4">서비스 내용</SpeakableText>
            <p className="text-foreground/80 mb-4">월 47 ~ 480시간 (바우처 기준)</p>
            <div className="space-y-4">
              {serviceDetails.map(cat => (
                <div key={cat.category} className="border border-border rounded-xl overflow-hidden">
                  <div className="bg-primary/10 px-4 py-2.5 font-bold text-primary">{cat.category}</div>
                  <div className="divide-y divide-border">
                    {cat.items.map(item => (
                      <div key={item.name} className="px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-1">
                        <span className="font-medium min-w-[140px]">{item.name}</span>
                        <span className="text-foreground/70 text-sm">{item.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SpeakableText as="h3" className="text-xl font-bold text-primary mb-2">활동지원 인력 자격</SpeakableText>
            <SpeakableText className="text-foreground/80">
              보건복지부 장애인활동지원사업 안내에 준하는 교육기관에서 교육과정을 수료한 자. 요양보호사, 사회복지사, 간호사, 간호조무사 및 유사경력자는 실천 Ⅱ 과목 8시간 감면. 이론 및 실기(32시간), 현장실습(10시간) 이수한 자.
            </SpeakableText>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessSection;
