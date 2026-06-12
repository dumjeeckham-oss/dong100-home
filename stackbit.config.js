import { defineStackbitConfig } from '@stackbit/sdk';

export default defineStackbitConfig({
  stackbitVersion: '~0.6.0',
  ssgName: 'custom',
  nodeVersion: '18',
  
  // 사이트 설정
  siteUrl: process.env.SITE_URL || 'http://localhost:5173',
  
  // Sanity 데이터 소스 연동
  sources: [
    {
      type: 'sanity',
      projectId: process.env.VITE_SANITY_PROJECT_ID || 'xczp11sl',
      dataset: process.env.VITE_SANITY_DATASET || 'production',
      token: process.env.SANITY_AUTH_TOKEN,
    },
  ],

  // 컴포넌트 매핑
  models: {
    // Sanity 스키마 기반 모델들
    config: {
      type: 'data',
      source: 'sanity',
      documentType: 'siteSettings',
      fields: [
        { name: 'title', type: 'string', label: '홈페이지 제목' },
        { name: 'description', type: 'string', label: '홈페이지 설명' },
        { name: 'bannerText', type: 'string', label: '메인 배너 문구' },
        { name: 'contactNumber', type: 'string', label: '문의 전화번호' },
        { name: 'heroTitle', type: 'string', label: '메인 배너 제목' },
        { name: 'heroSubtitle', type: 'string', label: '메인 배너 부제목' },
        { name: 'heroDescription', type: 'string', label: '메인 배너 설명' },
        { name: 'kakaoBannerTitle', type: 'string', label: '카카오 배너 제목' },
        { name: 'kakaoBannerDescription', type: 'string', label: '카카오 배너 설명' },
        { name: 'coopBannerTitle', type: 'string', label: '조합원 배너 제목' },
        { name: 'coopBannerDescription', type: 'string', label: '조합원 배너 설명' },
      ],
    },

    notice: {
      type: 'data',
      source: 'sanity',
      documentType: 'notice',
      fields: [
        { name: 'title', type: 'string', label: '공지사항 제목' },
        { name: 'content', type: 'rich-text', label: '공지사항 내용' },
        { name: 'publishedAt', type: 'datetime', label: '발행일' },
        { name: 'important', type: 'boolean', label: '중요 공지' },
      ],
    },

    archive: {
      type: 'data',
      source: 'sanity',
      documentType: 'archive',
      fields: [
        { name: 'title', type: 'string', label: '자료 제목' },
        { name: 'description', type: 'string', label: '자료 설명' },
        { name: 'publishedAt', type: 'datetime', label: '발행일' },
      ],
    },

    faq: {
      type: 'data',
      source: 'sanity',
      documentType: 'faq',
      fields: [
        { name: 'question', type: 'string', label: '질문' },
        { name: 'answer', type: 'rich-text', label: '답변' },
        { name: 'category', type: 'string', label: '카테고리' },
        { name: 'order', type: 'number', label: '순서' },
      ],
    },

    // 페이지 모델
    page: {
      type: 'page',
      urlPath: '/',
      file: 'src/pages/Index.tsx',
      label: '홈페이지',
      layout: 'full',
      fields: [
        {
          type: 'object',
          name: 'heroSection',
          label: '메인 배너 섹션',
          fields: [
            { name: 'title', type: 'string', label: '제목' },
            { name: 'subtitle', type: 'string', label: '부제목' },
            { name: 'description', type: 'string', label: '설명' },
          ],
        },
        {
          type: 'object',
          name: 'footerSection',
          label: '하단 섹션',
          fields: [
            { name: 'phone', type: 'string', label: '전화번호' },
            { name: 'email', type: 'string', label: '이메일' },
            { name: 'address', type: 'string', label: '주소' },
          ],
        },
      ],
    },
  },

  // UI 커스터마이징
  ui: {
    editorMinWidth: 1024,
    pagePreviewWidth: 1200,
    devTools: true,
  },

  // 빌드 및 배포 설정
  build: {
    commandName: 'build',
    nodeArgs: '--loader tsx/cjs',
  },

  // 로컬 개발 서버 설정
  dev: {
    commandName: 'dev',
    port: 5173,
  },

  // 배포 설정
  publishDir: 'dist',

  // 정적 파일 경로
  staticDir: 'public',

  // 라우팅 설정
  routes: [
    {
      path: '/',
      component: 'page',
    },
    {
      path: '/notice',
      component: 'notice',
    },
    {
      path: '/archive',
      component: 'archive',
    },
  ],

  // 이미지 처리
  imageOptimization: {
    autoOptimize: true,
    format: 'webp',
  },
});
