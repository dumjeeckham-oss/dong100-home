import { useState, useEffect } from 'react';
import { AccessibilityProvider } from '@/contexts/AccessibilityContext';
import AccessibilityToolbar from '@/components/AccessibilityToolbar';
import Header from '@/components/Header';
import HeroSlider from '@/components/HeroSlider';
import QuickMenu from '@/components/QuickMenu';
import BannersContainer from '@/components/BannersContainer';
import AboutSection from '@/components/AboutSection';
import ServiceSection from '@/components/ServiceSection';
import CostSection from '@/components/CostSection';
import BusinessSection from '@/components/BusinessSection';
import BoardSection from '@/components/BoardSection';
import DirectionsSection from '@/components/DirectionsSection';
import Footer from '@/components/Footer';
import MobileTabBar from '@/components/MobileTabBar';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Index = () => {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const handleShowDetails = () => {
      setShowDetails(true);
    };
    window.addEventListener('show-details', handleShowDetails);
    return () => window.removeEventListener('show-details', handleShowDetails);
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
          <HeroSlider />
          <QuickMenu />
          <BannersContainer />
          
          <div id="service-apply">
            <ServiceSection />
          </div>

          {!showDetails ? (
            <div className="py-8 bg-background flex justify-center border-b border-border">
              <Button 
                size="lg" 
                onClick={() => setShowDetails(true)}
                className="rounded-full px-8 py-6 text-lg font-bold shadow-md hover:-translate-y-1 transition-all gap-2"
              >
                자세한 신청방법 및 알아보기 <ChevronDown />
              </Button>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
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
          <DirectionsSection />
        </main>
        <Footer />
        <MobileTabBar />
      </div>
    </AccessibilityProvider>
  );
};

export default Index;
