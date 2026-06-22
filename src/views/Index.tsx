import { useState, useEffect } from 'react';
import { AccessibilityProvider } from '@/contexts/AccessibilityContext';
import AccessibilityToolbar from '@/components/AccessibilityToolbar';
import Header from '@/components/Header';
import HeroSlider from '@/components/HeroSlider';
import QuickMenu from '@/components/QuickMenu';
import BannersContainer from '@/components/BannersContainer';
import AboutSection from '@/components/AboutSection';
import ServiceSection from '@/components/ServiceSection';
import ApplicationStepsSection from '@/components/ApplicationStepsSection';
import CostSection from '@/components/CostSection';
import BusinessSection from '@/components/BusinessSection';
import BoardSection from '@/components/BoardSection';
import ActivityNewsSection from '@/components/ActivityNewsSection';
import UserInfoSection from '@/components/UserInfoSection';
import FaqSection from '@/components/FaqSection';
import DirectionsSection from '@/components/DirectionsSection';
import Footer from '@/components/Footer';
import MobileTabBar from '@/components/MobileTabBar';
import FloatingCallButton from '@/components/FloatingCallButton';
import EmergencyPopup from '@/components/EmergencyPopup';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
// VisualEditing 사용 시 런타임 오류가 발생하여 일시적으로 주석 처리합니다.
// import { VisualEditing } from '@sanity/visual-editing/react-router';
import { fetchSiteSettingsDualSource, type SiteSettings } from '@/lib/sanity';

const Index = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await fetchSiteSettingsDualSource();
      setSiteSettings(settings);
    };
    loadSettings();

    const handleShowDetails = () => setShowDetails(true);
    window.addEventListener('show-details', handleShowDetails);

    // 해시 타겟으로 스크롤 (detailIds는 showDetails 활성화 후 지연 스크롤)
    const detailIds = new Set(['about', 'service', 'cost', 'business']);
    const scrollToHash = () => {
      const hash = window.location.hash?.slice(1);
      if (!hash) return;

      // 상세 섹션이면 showDetails 활성화
      if (detailIds.has(hash)) setShowDetails(true);

      // React 렌더링 후 스크롤 (detail은 DOM 생성에 시간이 더 걸림)
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, detailIds.has(hash) ? 350 : 100);
    };

    // 페이지 로드 시 해시 처리
    scrollToHash();

    // QuickMenu 클릭 등으로 해시 변경될 때도 처리
    window.addEventListener('hashchange', scrollToHash);

    return () => {
      window.removeEventListener('show-details', handleShowDetails);
      window.removeEventListener('hashchange', scrollToHash);
    };
  }, []);

  return (
    <AccessibilityProvider>
      <div className="min-h-screen flex flex-col pb-16 lg:pb-0">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:bg-primary focus:text-primary-foreground focus:p-3 focus:z-[100]">
          본문 바로가기
        </a>
        <AccessibilityToolbar />
        <Header />
        <main id="main-content" role="main">
          <HeroSlider siteSettings={siteSettings} />
          <QuickMenu siteSettings={siteSettings} />
          <BannersContainer siteSettings={siteSettings} />
          
          <div id="service-apply">
            <ApplicationStepsSection siteSettings={siteSettings} />
          </div>

          {!showDetails ? (
            <div className="py-8 bg-background flex justify-center border-b border-border">
              <Button 
                size="lg" 
                onClick={() => setShowDetails(true)}
                className="rounded-full px-8 py-6 text-lg font-bold shadow-md hover:-translate-y-1 transition-all gap-2"
                data-id={siteSettings?._id}
                data-field="serviceApplyButton"
                data-type="siteSettings"
              >
                {siteSettings?.serviceApplyButton || '상세 안내 펼쳐보기'} <ChevronDown />
              </Button>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
              <ServiceSection />
              <CostSection />
              <BusinessSection />
              <AboutSection />
              <div className="py-8 bg-muted flex justify-center border-t border-border">
                <Button 
                  variant="outline"
                  size="lg" 
                  onClick={() => {
                    setShowDetails(false);
                    document.getElementById('service-apply')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="rounded-full px-8 py-6 text-lg font-bold shadow-sm transition-all gap-2"
                >
                  상세 안내 접기 <ChevronUp />
                </Button>
              </div>
            </div>
          )}
          
          <BoardSection />
          <FaqSection />
          <section className="py-12 md:py-16 bg-background" aria-label="RSS 게시판">
            <div className="container">
              <div className="grid lg:grid-cols-2 gap-8 items-start">
                <UserInfoSection />
                <ActivityNewsSection />
              </div>
            </div>
          </section>
          <DirectionsSection />
        </main>
        <Footer />
        <FloatingCallButton />
        <MobileTabBar />
        <EmergencyPopup siteSettings={siteSettings} />
      </div>
      {/* VisualEditing 컴포넌트는 런타임 오류로 인해 주석 처리됨 */}
      {/** <VisualEditing /> */}
    </AccessibilityProvider>
  );
};

export default Index;
