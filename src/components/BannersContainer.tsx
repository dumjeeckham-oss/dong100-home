import { MessageCircle, UserPlus, ArrowRight } from 'lucide-react';

const BannersContainer = () => {
  return (
    <section className="py-8 bg-muted border-t border-border">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {/* 소통채널 배너 */}
          <div className="bg-[#FAE100] text-[#371D1E] rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle size={24} className="fill-current" />
                <h3 className="text-xl font-bold">카카오톡 소통채널</h3>
              </div>
              <p className="text-[#371D1E]/80 mb-6 font-medium">
                센터의 최신 소식을 받고 언제든 1:1 상담을 남겨주세요.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a 
                href="http://pf.kakao.com/_ppVdb" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 min-w-[120px] bg-white text-[#371D1E] px-4 py-2.5 rounded-xl font-bold flex items-center justify-between hover:bg-white/90 transition-colors"
              >
                채널 홈 가기 <ArrowRight size={18} />
              </a>
              <a 
                href="http://pf.kakao.com/_ppVdb/chat" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 min-w-[120px] bg-[#371D1E] text-white px-4 py-2.5 rounded-xl font-bold flex items-center justify-between hover:bg-[#371D1E]/90 transition-colors"
              >
                1:1 채팅하기 <ArrowRight size={18} />
              </a>
            </div>
          </div>

          {/* 조합원 가입 배너 */}
          <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <UserPlus size={24} />
                <h3 className="text-xl font-bold">부천의료복지사회적협동조합</h3>
              </div>
              <p className="text-primary-foreground/90 mb-6 font-medium">
                조합원이 되어 건강한 지역사회를 만드는 데 동참해 주세요.
              </p>
            </div>
            <a 
              href="https://bcmedcoop.limefriends.com/bbs/write.php?bo_table=join_coop&join_md=coop" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white text-primary px-4 py-2.5 rounded-xl font-bold flex items-center justify-between hover:bg-white/90 transition-colors"
            >
              조합원 가입하기 <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannersContainer;
