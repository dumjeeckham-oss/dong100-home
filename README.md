# 🏠 동백 장애인활동지원센터 홈페이지 (dong100.org)

> 부천의료복지사회적협동조합 산하 장애인활동지원 전문 기관

---

## 📐 전체 아키텍처 (수정본)

<details>
<summary>⚠️ 원 제안과의 비교 및 수정 사항</summary>

**원 제안의 문제점:**
| 항목 | 원 제안 | 실제 구현 | 이유 |
|------|---------|-----------|------|
| 정적 페이지 엔진 | VitePress | ❌ 사용 안 함 | 마크다운은 React가 직접 렌더링 |
| 빌드 분리 | React + VitePress 별도 빌드 | ✅ 단일 Vite 빌드 | 두 시스템 통합 불필요 |
| 배포 구조 | Vercel이 두 환경 통합 | ✅ 단일 SPA 배포 | 더 단순하고 오류 가능성 낮음 |

**수정 사유:** VitePress는 별도 정적 사이트 생성기로, React SPA와 통합하려면 복잡한 라우팅·빌드 설정이 필요합니다. 현재 구현은 마크다운 파일을 React 컴포넌트가 직접 불러와 렌더링하므로, 단일 코드베이스·단일 빌드로 충분합니다. VitePress 도입은 불필요한 복잡성을 추가할 뿐입니다.

</details>

### 아키텍처 다이어그램

```
┌─────────────────────────────────────────────────────────────┐
│                      Vercel (배포)                           │
│                   https://dong100.org                         │
│                                                              │
│  ┌──────────────────────────────────────────────┐           │
│  │           단일 React SPA (Vite 빌드)          │           │
│  │                                               │           │
│  │  ┌─────────────┐  ┌───────────────────────┐  │           │
│  │  │  Sanity CMS  │  │  Markdown 파일        │  │           │
│  │  │  (게시판)    │  │  (고정 페이지 콘텐츠)  │  │           │
│  │  │             │  │                       │  │           │
│  │  │ • 공지사항   │  │ • site.md (사이트설정) │  │           │
│  │  │ • 자료실     │  │ • about.md (센터소개)  │  │           │
│  │  │ • 이용자자료 │  │ • service.md (서비스)  │  │           │
│  │  │ • FAQ       │  │ • cost.md (비용안내)   │  │           │
│  │  │ • 활동소식   │  │ • business.md (사업)   │  │           │
│  │  │             │  │ • steps.md (신청절차)   │  │           │
│  │  └──────┬──────┘  │ • apply.md (신청방법)   │  │           │
│  │         │         └───────────┬───────────┘  │           │
│  │         │                     │              │           │
│  │         └──────┬──────────────┘              │           │
│  │                ▼                             │           │
│  │     fetchSiteSettingsDualSource()            │           │
│  │     (마크다운 > Sanity 우선 병합)             │           │
│  │                                              │           │
│  │  ┌──────────────────────────────────────┐   │           │
│  │  │         React 컴포넌트                │   │           │
│  │  │  HeroSlider, QuickMenu, Banners,      │   │           │
│  │  │  ServiceSection, CostSection,         │   │           │
│  │  │  BusinessSection, AboutSection,       │   │           │
│  │  │  ApplicationStepsSection, Board, FAQ  │   │           │
│  │  └──────────────────────────────────────┘   │           │
│  └──────────────────────────────────────────────┘           │
│                                                              │
│  ┌────────────────┐  ┌─────────────────────────────────┐    │
│  │  Sanity Studio  │  │  GitHub                         │    │
│  │  /studio        │  │  dumjeeckham-oss/dong100-home   │    │
│  │  (관리자 CMS)   │  │  (버전 관리)                     │    │
│  └────────────────┘  └─────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### 진짜 두 기둥 (실제 구현)

| | 기둥 A: Sanity (동적) | 기둥 B: Markdown (정적) |
|---|---|---|
| 무엇을 관리? | 게시판 글, FAQ, RSS | 센터 소개, 서비스 설명, 비용 등 콘텐츠 |
| 어디서 편집? | Sanity Studio (`/studio`) | GitHub에서 `public/content/*.md` 직접 편집 |
| 배포 방식 | 실시간 (API) | `main` 푸시 → Vercel 자동 배포 |
| 버전 관리 | Sanity 자체 기록 | Git 히스토리 |
| 비주얼 에디팅 | Preview 모드(`/api/draft`)에서 가능 | 불가 (텍스트로만 편집) |

---

## 📋 콘텐츠 편집 가이드

### 방법 A: 마크다운 파일 편집 (권장)

`public/content/` 폴더의 파일을 GitHub에서 직접 편집합니다.

| 파일 | 편집 내용 | 홈페이지 위치 |
|------|-----------|---------------|
| `settings/site.md` | 사이트 설정, 배너 문구, 섹션 제목, 긴급 팝업 | 전체 |
| `about.md` | 센터 소개, 연혁, 가치 | `#about` (상세보기) |
| `service.md` | 서비스 상세 안내 | `#service` (상세보기) |
| `cost.md` | 비용 테이블 (마크다운 표) | `#cost` (상세보기) |
| `business.md` | 사업/서비스 설명 | `#business` (상세보기) |
| `steps.md` | 5단계 신청 절차 카드 | `#service-apply` (상세보기) |
| `apply.md` | 신청 방법 상세 안내 | `#service-apply` (상세보기) |

#### site.md 특별 설정
```yaml
---
popupEnabled: false       # true로 바꾸면 긴급 팝업 표시
popupTitle: "긴급 안내"
popupContent: |
  **마크다운** 형식으로
  팝업 내용을 작성합니다
---
```

#### 편집 방법
1. https://github.com/dumjeeckham-oss/dong100-home 접속
2. `public/content/` 폴더로 이동 → 수정할 `.md` 파일 클릭
3. 연필 아이콘(✏️) 클릭하여 편집
4. "Commit changes..." → main 브랜치에 직접 커밋
5. 1~2분 후 Vercel 자동 배포 → 사이트에 반영

### 방법 B: Sanity Studio (게시판 관리)

| 메뉴 | 기능 |
|------|------|
| 사이트 설정 | 배너 문구, 섹션 제목, 팝업 관리 |
| 공지사항 | 새 공지 작성·수정·삭제 |
| FAQ | 자주 묻는 질문 관리 |
| 자료실 | 서식 파일 업로드 |
| 이용자자료실 | 이용자용 자료 업로드 |
| 활동소식 | 활동 뉴스 작성 |

#### Visual Editing (Preview 모드)
1. `https://dong100.org/api/draft` 접속
2. Sanity에 `siteSettings` 문서가 생성되어 있어야 함
3. `data-*` 속성이 있는 텍스트만 클릭 편집 가능 (히어로·배너·섹션 제목)
4. 저장 시 Sanity에 반영 → markdown에 수동 동기화 필요

### 방법 C: 긴급 팝업

```
site.md 에서:
  popupEnabled: true     ← 켜기
  popupEnabled: false    ← 끄기

팝업 내용은 popupContent에 마크다운으로 작성
"오늘 하루 보지 않기" 클릭 시 24시간 후 재표시
```

---

## 🔧 기술 스택

| 계층 | 기술 | 설명 |
|------|------|------|
| **프레임워크** | React 18 + TypeScript | SPA |
| **빌드 도구** | Vite 5 | 빠른 번들링 |
| **스타일링** | Tailwind CSS | 유틸리티 클래스 기반 |
| **UI 컴포넌트** | shadcn/ui + Lucide Icons | 접근성 높은 컴포넌트 |
| **CMS** | Sanity.io | 게시판·FAQ 데이터베이스 |
| **RSS** | Sanity → RSS 피드 자동 생성 | 외부 연동 |
| **마크다운** | react-markdown + remark-gfm | `.md` 파일 렌더링 |
| **정적 콘텐츠** | `public/content/*.md` | GitHub 직접 편집 |
| **배포** | Vercel | 자동 배포 (main 푸시) |
| **버전 관리** | GitHub (`dumjeeckham-oss/dong100-home`) | 모든 코드·콘텐츠 |
| **도메인** | dong100.org | 커스텀 도메인 |

---

## 🚀 배포 흐름

```
GitHub main 브랜치 푸시
        │
        ▼
   Vercel 감지
        │
        ▼
  npm install + vite build
        │
        ▼
  dong100.org 배포 완료 (~2분)
```

---

## 📂 프로젝트 구조 (핵심 경로)

```
dong100-home/
├── index.html                  # HTML 진입점 (메타태그, Schema.org)
├── public/
│   ├── content/                # 📝 편집용 마크다운 파일들
│   │   ├── settings/site.md    # 사이트 전역 설정
│   │   ├── about.md            # 센터 소개
│   │   ├── service.md          # 서비스 안내
│   │   ├── cost.md             # 비용 안내
│   │   ├── business.md         # 사업 안내
│   │   ├── steps.md            # 신청 절차 (5단계)
│   │   ├── apply.md            # 신청 방법 상세
│   │   └── guide.md            # 가이드
│   ├── robots.txt              # 검색엔진·AI 크롤러 허용
│   ├── sitemap.xml             # 사이트맵
│   ├── llms.txt                # LLM용 사이트 요약
│   └── llms-full.txt           # LLM용 전체 정보
├── src/
│   ├── views/Index.tsx         # 홈페이지 메인 페이지
│   ├── components/             # React 컴포넌트
│   │   ├── HeroSlider.tsx      # 메인 히어로 슬라이더
│   │   ├── QuickMenu.tsx       # 자주 찾는 서비스
│   │   ├── BannersContainer.tsx # 카카오·조합원 배너
│   │   ├── AboutSection.tsx    # 센터 소개 섹션
│   │   ├── ServiceSection.tsx  # 서비스 안내
│   │   ├── CostSection.tsx     # 비용 안내 (표)
│   │   ├── BusinessSection.tsx # 사업 안내
│   │   ├── ApplicationStepsSection.tsx # 신청 절차
│   │   ├── EmergencyPopup.tsx  # 긴급 팝업
│   │   ├── BoardSection.tsx    # 게시판
│   │   ├── FaqSection.tsx      # FAQ
│   │   └── ...
│   └── lib/
│       ├── sanity.ts           # Sanity 클라이언트·데이터 페칭
│       ├── markdown.ts         # 마크다운 로딩 유틸
│       ├── loadLocalData.ts    # 로컬 데이터 로더
│       └── contentful.ts       # Contentful (사용 안 함)
└── sanity/                     # Sanity Studio 설정
    └── schemas/
        └── siteSettings.ts     # 사이트 설정 스키마
```

---

## 🔗 RSS 피드

| 피드 | URL |
|------|-----|
| 공지사항 | `https://dong100.org/api/rss/notice` |
| 자료실 | `https://dong100.org/api/rss/archive` |
| 이용자자료실 | `https://dong100.org/api/rss/user-archive` |
| 활동소식 | `https://dong100.org/api/rss/activity-news` |

---

## 🛡️ AI 검색 최적화

| 파일 | URL | 용도 |
|------|-----|------|
| robots.txt | `/robots.txt` | AI 크롤러 허용 (GPTBot, PerplexityBot 등) |
| sitemap.xml | `/sitemap.xml` | 검색엔진 색인 |
| llms.txt | `/llms.txt` | LLM이 사이트 구조 파악 |
| llms-full.txt | `/llms-full.txt` | LLM이 상세 정보 인용 |
| Schema.org | `<head>` 내 JSON-LD | 구글·AI에 구조화 데이터 제공 |

---

## ⚠️ VitePress 미사용 이유

제안된 VitePress 도입 계획은 다음 이유로 채택하지 않았습니다:

1. **이미 마크다운 렌더링 중**: React 컴포넌트가 `react-markdown`으로 `.md` 파일을 직접 렌더링
2. **통합 불필요**: 단일 Vite 빌드로 충분, 두 빌드 시스템 통합은 복잡도만 증가
3. **실시간 반영**: VitePress는 빌드 필요, 현재 방식은 마크다운 수정 후 fetch로 즉시 반영 가능
4. **Visual Editing 호환성**: 단일 SPA 구조가 Sanity Preview 모드와 호환됨
