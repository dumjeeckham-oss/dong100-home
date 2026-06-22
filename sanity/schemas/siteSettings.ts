import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: '사이트 설정',
  type: 'document',
  groups: [
    { name: 'hero', title: '메인 히어로' },
    { name: 'banners', title: '배너' },
    { name: 'sections', title: '섹션 제목' },
    { name: 'popup', title: '긴급 팝업' },
  ],
  fields: [
    // --- 메인 히어로 ---
    defineField({ name: 'title', title: '홈페이지 제목', type: 'string', group: 'hero' }),
    defineField({ name: 'description', title: '홈페이지 설명', type: 'string', group: 'hero' }),
    defineField({ name: 'contactNumber', title: '문의 전화번호', type: 'string', group: 'hero' }),
    defineField({ name: 'heroTitle', title: '메인 배너 제목', type: 'string', group: 'hero' }),
    defineField({ name: 'heroSubtitle', title: '메인 배너 부제목', type: 'string', group: 'hero' }),
    defineField({ name: 'heroDescription', title: '메인 배너 설명', type: 'text', group: 'hero' }),
    defineField({ name: 'bannerText', title: '메인 배너 문구', type: 'string', group: 'hero' }),

    // --- 배너 ---
    defineField({ name: 'kakaoBannerTitle', title: '카카오 배너 제목', type: 'string', group: 'banners' }),
    defineField({ name: 'kakaoBannerDescription', title: '카카오 배너 설명', type: 'string', group: 'banners' }),
    defineField({ name: 'coopBannerTitle', title: '조합원 배너 제목', type: 'string', group: 'banners' }),
    defineField({ name: 'coopBannerDescription', title: '조합원 배너 설명', type: 'string', group: 'banners' }),

    // --- 섹션 제목 (Visual Editing 가능) ---
    defineField({ name: 'quickMenuTitle', title: '자주 찾는 서비스 제목', type: 'string', group: 'sections' }),
    defineField({ name: 'serviceApplyTitle', title: '서비스 신청방법 제목', type: 'string', group: 'sections' }),
    defineField({ name: 'serviceApplyButton', title: '상세 안내 펼치기 버튼 문구', type: 'string', group: 'sections' }),
    defineField({ name: 'serviceInfoTitle', title: '서비스 안내 제목', type: 'string', group: 'sections' }),
    defineField({ name: 'costInfoTitle', title: '비용 안내 제목', type: 'string', group: 'sections' }),
    defineField({ name: 'businessInfoTitle', title: '사업안내 제목', type: 'string', group: 'sections' }),
    defineField({ name: 'aboutTitle', title: '센터소개 제목', type: 'string', group: 'sections' }),
    defineField({ name: 'directionsTitle', title: '오시는 길 제목', type: 'string', group: 'sections' }),
    defineField({ name: 'footerText', title: '푸터 문구', type: 'text', group: 'sections' }),

    // --- 긴급 팝업 ---
    defineField({ name: 'popupEnabled', title: '팝업 활성화', type: 'boolean', group: 'popup', initialValue: false }),
    defineField({ name: 'popupTitle', title: '팝업 제목', type: 'string', group: 'popup' }),
    defineField({ name: 'popupContent', title: '팝업 내용 (마크다운)', type: 'text', group: 'popup' }),
  ],
})
