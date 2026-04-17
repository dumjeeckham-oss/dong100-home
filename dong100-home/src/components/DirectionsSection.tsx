import { MapPin, Navigation } from 'lucide-react';

const DirectionsSection = () => {
  const address = '부천시 원미로 97번길 31';
  const kakaoMapUrl = `https://map.kakao.com/?q=${encodeURIComponent(address)}`;
  const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(address)}`;
  const googleMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <section id="directions" className="py-12 md:py-16 bg-background" aria-label="오시는 길">
      <div className="container max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">오시는 길</h2>
        <div className="bg-card rounded-2xl p-6 md:p-10 shadow-sm space-y-6">
          <div className="flex items-start gap-3">
            <MapPin size={24} className="text-primary mt-1 shrink-0" aria-hidden="true" />
            <div>
              <p className="font-bold text-lg">경기도 부천시 원미로97번길 31 (원미동 173-5) 3층</p>
              <p className="text-muted-foreground mt-1">주차: 원미2동 공영주차장 (원미동 127-5)</p>
            </div>
          </div>

          {/* Embedded map */}
          <div className="rounded-xl overflow-hidden border border-border">
            <iframe
              title="동백 장애인활동지원센터 위치"
              src={`https://www.google.com/maps?q=${encodeURIComponent('경기도 부천시 원미로97번길 31')}&output=embed`}
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              aria-label="동백 장애인활동지원센터 지도"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={kakaoMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
              aria-label="카카오맵에서 길찾기"
            >
              <Navigation size={18} aria-hidden="true" />
              카카오맵 길찾기
            </a>
            <a
              href={naverMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity border border-border"
              aria-label="네이버지도에서 길찾기"
            >
              <Navigation size={18} aria-hidden="true" />
              네이버지도 길찾기
            </a>
            <a
              href={googleMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity border border-border"
              aria-label="구글맵에서 길찾기"
            >
              <Navigation size={18} aria-hidden="true" />
              구글맵 길찾기
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DirectionsSection;
