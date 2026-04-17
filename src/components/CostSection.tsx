import SpeakableText from './SpeakableText';

const grades = [
  { grade: '1구간', score: '465점 이상', hours: '480' },
  { grade: '2구간', score: '435점 이상~465점 미만', hours: '450' },
  { grade: '3구간', score: '405점 이상~435점 미만', hours: '420' },
  { grade: '4구간', score: '375점 이상~405점 미만', hours: '390' },
  { grade: '5구간', score: '345점 이상~375점 미만', hours: '360' },
  { grade: '6구간', score: '315점 이상~345점 미만', hours: '330' },
  { grade: '7구간', score: '285점 이상~315점 미만', hours: '300' },
  { grade: '8구간', score: '255점 이상~285점 미만', hours: '270' },
  { grade: '9구간', score: '225점 이상~255점 미만', hours: '240' },
  { grade: '10구간', score: '195점 이상~225점 미만', hours: '210' },
  { grade: '11구간', score: '165점 이상~195점 미만', hours: '180' },
  { grade: '12구간', score: '135점 이상~165점 미만', hours: '150' },
  { grade: '13구간', score: '105점 이상~135점 미만', hours: '120' },
  { grade: '14구간', score: '75점 이상~105점 미만', hours: '90' },
];

const CostSection = () => {
  return (
    <section id="cost" className="py-12 md:py-16 bg-muted" aria-label="비용 및 서비스 안내">
      <div className="container max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">비용 및 서비스 안내</h2>
        <div className="bg-card rounded-2xl p-6 md:p-10 shadow-sm space-y-6">
          <div>
            <SpeakableText as="h3" className="text-xl font-bold text-primary mb-3">이용료</SpeakableText>
            <ul className="space-y-2 text-foreground/80 list-disc pl-5">
              <li>국민기초생활수급자: <strong>무료</strong></li>
              <li>차상위계층 등: <strong>2만원</strong></li>
              <li>차상위 초과: 기본급여는 소득수준에 따라 6~15%, 추가급여는 소득수준에 따라 2~5% 적용</li>
              <li>공휴일(관공서의 공휴일에 관한 규정) 및 근로자의 날에는 공휴일 요금 적용</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-2">** 수가는 변동될 수 있음</p>
          </div>

          <div>
            <SpeakableText as="h3" className="text-xl font-bold text-primary mb-3">활동지원급여 구간</SpeakableText>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse" aria-label="활동지원 등급별 지원시간 표">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    <th className="px-4 py-3 text-left font-semibold rounded-tl-lg">활동지원 등급</th>
                    <th className="px-4 py-3 text-left font-semibold">종합 점수</th>
                    <th className="px-4 py-3 text-left font-semibold rounded-tr-lg">월 지원시간</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((g, i) => (
                    <tr key={g.grade} className={i % 2 === 0 ? 'bg-accent/50' : 'bg-background'}>
                      <td className="px-4 py-2.5 font-medium">{g.grade}</td>
                      <td className="px-4 py-2.5">{g.score}</td>
                      <td className="px-4 py-2.5 font-semibold">{g.hours}시간</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CostSection;
