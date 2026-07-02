import { defineField, defineType } from 'sanity'

// 마크다운 + HTML 사용 안내 (색/굵기/글씨체 등 서식 적용 가능)
const MD_HELP =
  '마크다운/HTML 사용 가능 — 예) **굵게**, *기울임*, <span style="color:#e11d48">빨간 글씨</span>, <span style="font-size:1.4em;font-weight:800">크고 굵게</span>'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: '사이트 설정',
  type: 'document',
  groups: [
    { name: 'hero', title: '메인 히어로' },
    { name: 'slides', title: '메인 슬라이더' },
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

    // --- 메인 슬라이더 (상단 3개 슬라이드) ---
    // 슬라이드 1: 위 '메인 히어로'의 제목/부제목/설명을 사용합니다.
    defineField({ name: 'slide1Title', title: '슬라이드 1 - 제목 (줄바꿈은 Enter)', type: 'text', rows: 2, group: 'slides' }),
    defineField({ name: 'slide1Subtitle', title: '슬라이드 1 - 부제목', type: 'string', group: 'slides' }),
    defineField({ name: 'slide1Description', title: '슬라이드 1 - 설명 (줄바꿈은 Enter)', type: 'text', rows: 3, group: 'slides' }),
    defineField({ name: 'slide2Title', title: '슬라이드 2 - 제목 (줄바꿈은 Enter)', type: 'text', rows: 2, group: 'slides' }),
    defineField({ name: 'slide2Subtitle', title: '슬라이드 2 - 부제목', type: 'string', group: 'slides' }),
    defineField({ name: 'slide2Description', title: '슬라이드 2 - 설명 (줄바꿈은 Enter)', type: 'text', rows: 3, group: 'slides' }),
    defineField({ name: 'slide3Title', title: '슬라이드 3 - 제목 (줄바꿈은 Enter)', type: 'text', rows: 2, group: 'slides' }),
    defineField({ name: 'slide3Subtitle', title: '슬라이드 3 - 부제목', type: 'string', group: 'slides' }),
    defineField({ name: 'slide3Description', title: '슬라이드 3 - 설명 (줄바꿈은 Enter)', type: 'text', rows: 3, group: 'slides' }),

    // --- 배너 ---
    defineField({ name: 'kakaoBannerTitle', title: '카카오 배너 제목', type: 'string', group: 'banners' }),
    defineField({ name: 'kakaoBannerDescription', title: '카카오 배너 설명', type: 'string', group: 'banners' }),
    defineField({ name: 'kakaoBannerImage', title: '카카오 배너 이미지', type: 'image', options: { hotspot: true }, group: 'banners' }),
    defineField({ name: 'coopBannerTitle', title: '조합원 배너 제목', type: 'string', group: 'banners' }),
    defineField({ name: 'coopBannerDescription', title: '조합원 배너 설명', type: 'string', group: 'banners' }),
    defineField({ name: 'coopBannerImage', title: '조합원 배너 이미지', type: 'image', options: { hotspot: true }, group: 'banners' }),

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
    defineField({ name: 'popupEmoji', title: '팝업 이모티콘 (예: 🚨)', type: 'string', group: 'popup' }),
    defineField({ name: 'popupTitle', title: '팝업 제목', type: 'string', group: 'popup' }),
    defineField({ name: 'popupContent', title: '팝업 내용 (마크다운)', type: 'text', group: 'popup' }),
    defineField({ name: 'popupImage', title: '팝업 이미지', type: 'image', options: { hotspot: true }, group: 'popup' }),
  ],
})
