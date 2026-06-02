import SpeakableText from './SpeakableText';

const ServiceSection = () => {
  return (
    <section id="service" className="py-12 md:py-16 bg-background" aria-label="서비스 안내">
      <div className="container max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">서비스 안내 (이용안내)</h2>
        <div className="bg-card rounded-2xl p-6 md:p-10 shadow-sm space-y-6">
          <SpeakableText as="h3" className="text-xl font-bold text-primary">
            장애인의 자립생활이 가능하도록 활동보조서비스를 제공합니다.
          </SpeakableText>

          <div>
            <SpeakableText as="h4" className="font-bold text-lg mb-2">이용대상</SpeakableText>
            <SpeakableText className="text-foreground/80">활동지원급여 신청자격을 갖춘 장애인</SpeakableText>
          </div>

          <div>
            <SpeakableText as="h4" className="font-bold text-lg mb-2">예외사항</SpeakableText>
            <ul className="space-y-1.5 text-foreground/80 list-disc pl-5">
              <li>장애인거주시설이나 요양시설 등에서 생활하는 경우</li>
              <li>노인장기요양서비스 수급 자격이 있는 경우</li>
              <li>병원 등 의료기관에 60일 이상 입원 중인 경우</li>
              <li>교정시설 또는 치료감호시설 등에 있는 경우</li>
              <li>가사간병서비스, 장애아가족양육지원서비스, 노인돌봄서비스 등 유사 서비스를 이미 받고 있는 경우</li>
            </ul>
          </div>

          <div>
            <SpeakableText as="h4" className="font-bold text-lg mb-2">신청 필요 서류</SpeakableText>
            <ul className="space-y-1.5 text-foreground/80 list-disc pl-5">
              <li>사회보장급여(사회서비스이용권) 신청(변경)서</li>
              <li>바우처카드 발급 신청서</li>
              <li>가구원수 산정 및 확인을 위한 건강보험증 사본</li>
              <li>본인부담금을 환급받을 본인 명의 계좌의 통장사본</li>
              <li>기타 대상자별 해당하는 사항에 대한 추가 제출 서류</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
