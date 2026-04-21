import { Phone, Mail, MapPin } from 'lucide-react';
import logo from '@/assets/logo-footer.png';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-10" role="contentinfo" aria-label="하단 정보">
      <div className="container">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="h-14 mb-4 flex items-center">
              <img src={logo} alt="동백 장애인활동지원센터 로고" className="h-12 w-auto object-contain" />
            </div>
            <p className="text-background/70 text-sm leading-relaxed">
              부천의료복지사회적협동조합<br />
              동백 장애인활동지원센터
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-lg mb-3">연락처</h3>
            <div className="flex items-center gap-2 text-background/80">
              <Phone size={16} aria-hidden="true" />
              <span>032-675-7517 (내선 2번)</span>
            </div>
            <div className="flex items-center gap-2 text-background/80">
              <Mail size={16} aria-hidden="true" />
              <span>dong100center@naver.com</span>
            </div>
            <div className="flex items-start gap-2 text-background/80">
              <MapPin size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
              <span>경기도 부천시 원미로97번길 31<br />(원미동 173-5) 3층</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-lg mb-3">바로가기</h3>
            <ul className="space-y-2 text-background/80">
              <li><a href="#about" className="hover:text-background transition-colors">센터소개</a></li>
              <li><a href="#service" className="hover:text-background transition-colors">서비스 안내</a></li>
              <li>
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSfN7sbIDGSZRxTYq6z-z6doJVNyBfITRntE2yeDaVpIGTstXg/viewform?pli=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-background transition-colors"
                >
                  활동지원사 모집
                </a>
              </li>
              <li><a href="#directions" className="hover:text-background transition-colors">오시는 길</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-background/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-background/50 text-sm">
          <div className="text-center sm:text-left">
            © {new Date().getFullYear()} 부천의료복지사회적협동조합 동백 장애인활동지원센터. All rights reserved.
          </div>
          <a href="/admin" className="hover:text-background transition-colors flex items-center gap-1 opacity-50 hover:opacity-100">
            관리자 로그인 🔒
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
