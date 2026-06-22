// 로컬 마크다운 파일 데이터 로딩 (public/content/ 경로에서 fetch)
import matter from 'gray-matter';

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
}

// 공용 fetch wrapper (캐시 방지)
async function fetchMarkdown(path: string): Promise<{ data: Record<string, any>; body: string } | null> {
  try {
    const url = `${path}?t=${Date.now()}`;
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status !== 404) console.error(`Failed to fetch ${path}: ${response.status}`);
      return null;
    }
    const text = await response.text();
    const { data, content } = matter(text);
    return { data, body: content };
  } catch (error) {
    console.error(`Error fetching ${path}:`, error);
    return null;
  }
}

// 사이트 설정 데이터 로드
export const loadLocalSiteSettings = async (): Promise<LocalSiteSettings> => {
  const result = await fetchMarkdown('/content/settings/site.md');
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
  };
};

// 공지사항 데이터 로드 (미리 알려진 파일 목록에서 fetch)
// 새 공지사항 추가 시 아래 slugs 배열에 slug만 추가하면 됩니다.
export const loadLocalNotices = async (): Promise<LocalNotice[]> => {
  // content/notices/ 디렉토리의 알려진 파일들
  const slugs: string[] = []; // 예: ['2025-notice-1', '2025-notice-2']
  const notices: LocalNotice[] = [];

  for (const slug of slugs) {
    const result = await fetchMarkdown(`/content/notices/${slug}.md`);
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
    const result = await fetchMarkdown(`/content/archives/${slug}.md`);
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
