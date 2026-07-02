import { MessageCircle, UserPlus, ArrowRight } from 'lucide-react';
import type { SiteSettings } from '@/lib/sanity';
import RichText from '@/components/RichText';

interface BannersContainerProps {
  siteSettings: SiteSettings | null;
}

const BannersContainer = ({ siteSettings }: BannersContainerProps) => {
  return (
    <section className="py-8 bg-muted border-t border-border" data-sb-field-path="banners">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {/* 소통채널 배너 */}
          <div className="bg-[#FAE100] text-[#371D1E] rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div>
              {siteSettings?.kakaoBannerImage && (
                <img
                  src={siteSettings.kakaoBannerImage}
                  alt={siteSettings?.kakaoBannerTitle || '카카오톡 소통채널'}
                  className="w-full h-40 object-cover rounded-xl mb-4"
                  loading="lazy"
                />
              )}
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle size={24} className="fill-current" />
                <h3 
                  className="text-xl font-bold"
                  data-id={siteSettings?._id}
                  data-field="kakaoBannerTitle"
                  data-type="siteSettings"
                >
                  <RichText inline fallback="카카오톡 소통채널">{siteSettings?.kakaoBannerTitle}</RichText>
                </h3>
              </div>
              <p 
                className="text-[#371D1E]/80 mb-6 font-medium"
                data-id={siteSettings?._id}
                data-field="kakaoBannerDescription"
                data-type="siteSettings"
              >
                <RichText inline fallback="센터의 최신 소식을 받고 언제든 1:1 상담을 남겨주세요.">{siteSettings?.kakaoBannerDescription}</RichText>
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
              {siteSettings?.coopBannerImage && (
                <img
                  src={siteSettings.coopBannerImage}
                  alt={siteSettings?.coopBannerTitle || '부천의료복지사회적협동조합'}
                  className="w-full h-40 object-cover rounded-xl mb-4"
                  loading="lazy"
                />
              )}
              <div className="flex items-center gap-2 mb-3">
                <UserPlus size={24} />
                <h3 
                  className="text-xl font-bold"
                  data-id={siteSettings?._id}
                  data-field="coopBannerTitle"
                  data-type="siteSettings"
                >
                  <RichText inline fallback="부천의료복지사회적협동조합">{siteSettings?.coopBannerTitle}</RichText>
                </h3>
              </div>
              <p 
                className="text-primary-foreground/90 mb-6 font-medium"
                data-id={siteSettings?._id}
                data-field="coopBannerDescription"
                data-type="siteSettings"
              >
                <RichText inline fallback="조합원이 되어 건강한 지역사회를 만드는 데 동참해 주세요.">{siteSettings?.coopBannerDescription}</RichText>
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
