// 로컬 마크다운 파일 데이터 로딩
// 1순위: 빌드타임 번들 (명시적 ?raw import) → 2순위: 런타임 fetch

/** 간단한 frontmatter 파서 (gray-matter 제거, eval 이슈 방지) */
function parseFrontmatter(raw: string): { data: Record<string, any>; content: string } {
  const trimmed = raw.trimStart();
  if (trimmed.startsWith('---')) {
    const endIdx = trimmed.indexOf('---', 3);
    if (endIdx !== -1) {
      const fm = trimmed.substring(3, endIdx).trim();
      const content = trimmed.substring(endIdx + 3).trim();
      const data: Record<string, any> = {};
      for (const line of fm.split('\n')) {
        const ci = line.indexOf(':');
        if (ci > 0) {
          const key = line.substring(0, ci).trim();
          let value: any = line.substring(ci + 1).trim();
          if (value.startsWith('[') && value.endsWith(']')) {
            value = value.slice(1, -1).split(',').map((s: string) => s.trim().replace(/^['"]|['"]$/g, ''));
          }
          data[key] = value;
        }
      }
      return { data, content };
    }
  }
  return { data: {}, content: raw };
}

// 명시적 ?raw import: 모든 .md 파일을 빌드타임에 문자열로 번들링
import siteMd from '/public/content/settings/site.md?raw';

// 파일 경로 → 번들 문자열 매핑
const builtinMarkdown: Record<string, string> = {
  'settings/site.md': siteMd,
};

export interface LocalNotice {
  title: string;
  date: string;
  important: boolean;
  body: string;
  slug: string;
}

export interface LocalArchive {
  title: string;
  date: string;
  category: string;
  image?: string;
  body: string;
  slug: string;
}

export interface LocalSiteSettings {
  title?: string;
  description?: string;
  bannerText?: string;
  contactNumber?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  kakaoBannerTitle?: string;
  kakaoBannerDescription?: string;
  coopBannerTitle?: string;
  coopBannerDescription?: string;
  quickMenuTitle?: string;
  serviceApplyTitle?: string;
  serviceApplyButton?: string;
  serviceInfoTitle?: string;
  costInfoTitle?: string;
  businessInfoTitle?: string;
  aboutTitle?: string;
  directionsTitle?: string;
  footerText?: string;
  popupEnabled?: boolean;
  popupTitle?: string;
  popupContent?: string;
}

/** frontmatter가 있으면 gray-matter로 파싱, 없으면 원본 그대로 반환 */
function parseMarkdownSafe(raw: string): { data: Record<string, any>; body: string } {
  if (raw.trimStart().startsWith('---')) {
    try {
      const result = parseFrontmatter(raw);
      return { data: result.data, body: result.content };
    } catch (e) {
      console.error('matter parse error:', e);
    }
  }
  return { data: {}, body: raw };
}

// 공용 loader: 번들 우선, fetch 폴백
async function loadMarkdownContent(relativePath: string): Promise<{ data: Record<string, any>; body: string } | null> {
  // 1순위: 빌드타임 번들 (명시적 import)
  const bundled = builtinMarkdown[relativePath];
  if (bundled !== undefined) {
    return parseMarkdownSafe(bundled);
  }

  // 2순위: 런타임 fetch (수정 후 즉시 반영용)
  try {
    const url = `/content/${relativePath}?t=${Date.now()}`;
    const response = await fetch(url);
    if (response.ok) {
      const text = await response.text();
      return parseMarkdownSafe(text);
    }
  } catch (e) {
    // fetch 실패는 정적 호스팅에서 예상된 동작
  }

  console.error(`Cannot load ${relativePath}: not in bundle and fetch failed`);
  return null;
}

// 사이트 설정 데이터 로드
export const loadLocalSiteSettings = async (): Promise<LocalSiteSettings> => {
  const result = await loadMarkdownContent('settings/site.md');
  if (!result) return {};
  return {
    title: result.data.title,
    description: result.data.description,
    bannerText: result.data.bannerText,
    contactNumber: result.data.contactNumber,
    heroTitle: result.data.heroTitle,
    heroSubtitle: result.data.heroSubtitle,
    heroDescription: result.data.heroDescription,
    kakaoBannerTitle: result.data.kakaoBannerTitle,
    kakaoBannerDescription: result.data.kakaoBannerDescription,
    coopBannerTitle: result.data.coopBannerTitle,
    coopBannerDescription: result.data.coopBannerDescription,
    quickMenuTitle: result.data.quickMenuTitle,
    serviceApplyTitle: result.data.serviceApplyTitle,
    serviceApplyButton: result.data.serviceApplyButton,
    serviceInfoTitle: result.data.serviceInfoTitle,
    costInfoTitle: result.data.costInfoTitle,
    businessInfoTitle: result.data.businessInfoTitle,
    aboutTitle: result.data.aboutTitle,
    directionsTitle: result.data.directionsTitle,
    footerText: result.data.footerText,
    popupEnabled: result.data.popupEnabled,
    popupTitle: result.data.popupTitle,
    popupContent: result.data.popupContent,
  };
};

// 공지사항 데이터 로드 (미리 알려진 파일 목록)
// 새 공지사항 추가 시 아래 slugs 배열에 slug만 추가하면 됩니다.
export const loadLocalNotices = async (): Promise<LocalNotice[]> => {
  // content/notices/ 디렉토리의 알려진 파일들
  const slugs: string[] = []; // 예: ['2025-notice-1', '2025-notice-2']
  const notices: LocalNotice[] = [];

  for (const slug of slugs) {
    const result = await loadMarkdownContent(`notices/${slug}.md`);
    if (result) {
      notices.push({
        title: result.data.title || '',
        date: result.data.date || new Date().toISOString(),
        important: result.data.important || false,
        body: result.body || '',
        slug,
      });
    }
  }

  return notices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// 활동보고 데이터 로드
export const loadLocalArchives = async (): Promise<LocalArchive[]> => {
  const slugs: string[] = []; // 예: ['2025-archive-1', '2025-archive-2']
  const archives: LocalArchive[] = [];

  for (const slug of slugs) {
    const result = await loadMarkdownContent(`archives/${slug}.md`);
    if (result) {
      archives.push({
        title: result.data.title || '',
        date: result.data.date || new Date().toISOString(),
        category: result.data.category || '기타',
        image: result.data.image,
        body: result.body || '',
        slug,
      });
    }
  }

  return archives.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
