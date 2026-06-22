// src/lib/sanity.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import { loadLocalNotices, loadLocalArchives, loadLocalSiteSettings } from '@/lib/loadLocalData';
import { fetchContentfulSiteSettings, type ContentfulSiteSettings } from '@/lib/contentful';

export const projectId = 'xczp11sl';
export const dataset = 'production';

// Preview 쿠키 감지 함수
export const isPreviewMode = (): boolean => {
  if (typeof document === 'undefined') return false;
  const cookies = document.cookie.split(';');
  return cookies.some(cookie => cookie.trim().startsWith('sanity_preview_mode=true'));
};

// getClient(): preview 모드일 때 useCdn:false로 새 클라이언트 반환
// 모듈 초기화 시점이 아닌 호출 시점에 preview 상태를 평가함
const getClient = () => createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: !isPreviewMode(),
  token: import.meta.env.VITE_SANITY_WRITE_TOKEN,
  stega: {
    enabled: true,
    studioUrl: '/studio',
  },
});

// sanityClient: Proxy로 래핑하여 매 호출 시 preview 상태에 맞는 클라이언트 사용
export const sanityClient = new Proxy({} as ReturnType<typeof createClient>, {
  get(_, prop: string) {
    const client = getClient();
    const value = (client as Record<string, unknown>)[prop];
    if (typeof value === 'function') {
      return (value as Function).bind(client);
    }
    return value;
  },
}) as ReturnType<typeof createClient>;

const builder = createImageUrlBuilder(sanityClient);
export const urlFor = (source: any) => builder.image(source);

// ✅ 파일 URL 추출 - split 버그 수정
export function getFileUrl(ref: string | null | undefined): string | null {
  if (!ref) return null;
  const parts = ref.split('-');
  if (parts.length < 3 || parts[0] !== 'file') return null;
  const extension = parts[parts.length - 1];
  const fileId = parts.slice(1, parts.length - 1).join('-');
  if (!fileId || !extension) return null;
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${fileId}.${extension}`;
}

export function resolveFileUrl(item: ArchiveItem | string | null | undefined): string | null {
  if (!item) return null;
  if (typeof item === 'string') {
    return getFileUrl(item);
  }
  const asset = item.file?.asset;
  if (!asset) return null;
  // 1순위: GROQ asset-> 가 직접 내려준 url
  if (asset.url) return asset.url;
  // 2순위: _ref로 URL 직접 조합
  if (asset._ref) return getFileUrl(asset._ref);
  return null;
}

// 기존 코드 호환 이름들
export const fileUrl = resolveFileUrl;
export const JY = getFileUrl;

export function formatFileSize(bytes: number | undefined): string {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
export const formatBytes = formatFileSize;

// ===== 타입 =====
export interface ArchiveItem {
  _id: string;
  title: string;
  category?: 'service' | 'info';
  description?: string;
  body?: any[];
  publishedAt?: string;
  file?: {
    asset?: {
      _ref?: string;
      url?: string | null;
      originalFilename?: string;
      size?: number;
      extension?: string;
    };
  };
  images?: Array<{ image: any; alt?: string }>;
}

export interface NoticeItem {
  _id: string;
  title: string;
  content?: any[];
  publishedAt?: string;
  important?: boolean;
  images?: Array<{ image: any; alt?: string }>;
}

export interface SiteSettings {
  _id?: string;
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

export interface FaqItem {
  _id: string;
  question: string;
  answer?: any[];
  category?: string;
  order?: number;
}

export type SanityArchive = ArchiveItem;
export type SanityNotice = NoticeItem;

// ===== 데이터 이중 소스 처리 (Sanity + Decap CMS) =====

// 공지사항 데이터 병합 (Sanity + Decap CMS)
export const fetchNoticesDualSource = async () => {
  try {
    // Sanity 데이터 가져오기
    const sanityNotices = await fetchNotices();
    
    // Decap CMS 데이터 가져오기
    const localNotices = await loadLocalNotices();
    
    // Decap CMS 데이터를 Sanity 형식으로 변환
    const convertedLocalNotices = localNotices.map(notice => ({
      _id: `local-${notice.slug}`,
      title: notice.title,
      publishedAt: notice.date,
      important: notice.important,
      content: [{ _type: 'block', children: [{ _type: 'span', text: notice.body }] }],
    }));
    
    // 데이터 병합 (Decap CMS 데이터를 우선)
    return [...convertedLocalNotices, ...sanityNotices];
  } catch (error) {
    console.error('Error fetching dual source notices:', error);
    // Fallback to Sanity only
    return fetchNotices();
  }
};

// 활동보고 데이터 병합 (Sanity + Decap CMS)
export const fetchArchivesDualSource = async () => {
  try {
    // Sanity 데이터 가져오기
    const sanityArchives = await fetchArchives();
    
    // Decap CMS 데이터 가져오기
    const localArchives = await loadLocalArchives();
    
    // Decap CMS 데이터를 Sanity 형식으로 변환
    const convertedLocalArchives = localArchives.map(archive => ({
      _id: `local-${archive.slug}`,
      title: archive.title,
      publishedAt: archive.date,
      category: archive.category,
      images: archive.image ? [{ image: { _type: 'image', asset: { _ref: archive.image } }, alt: archive.title }] : [],
      content: [{ _type: 'block', children: [{ _type: 'span', text: archive.body }] }],
    }));
    
    // 데이터 병합 (Decap CMS 데이터를 우선)
    return [...convertedLocalArchives, ...sanityArchives];
  } catch (error) {
    console.error('Error fetching dual source archives:', error);
    // Fallback to Sanity only
    return fetchArchives();
  }
};

// 사이트 설정 데이터 병합
// Preview 모드 → Sanity 우선 (Visual Editing 라이브 편집)
// 일반 모드 → 마크다운 > Contentful > Sanity (안정적 콘텐츠)
export const fetchSiteSettingsDualSource = async () => {
  try {
    // Preview 모드: Sanity 데이터를 직접 보여줌 (Visual Editing 대상)
    if (isPreviewMode()) {
      const sanitySettings = await fetchSiteSettings();
      return sanitySettings || {};
    }

    // 일반 모드: 마크다운 파일이 최종 콘텐츠
    const localSettings = await loadLocalSiteSettings();
    const sanitySettings = await fetchSiteSettings();
    const contentfulSettings = await fetchContentfulSiteSettings();

    return {
      ...sanitySettings,
      ...contentfulSettings,
      ...localSettings, // 마크다운 최우선
      _id: sanitySettings?._id || '', // 참조용
    };
  } catch (error) {
    console.error('Error fetching dual source site settings:', error);
    // Fallback to Sanity only
    return fetchSiteSettings();
  }
};

// ===== GROQ 쿼리 =====
export const fetchSiteSettings = async (): Promise<SiteSettings | null> => {
  const data = await sanityClient.fetch<SiteSettings>(`
    *[_type == "siteSettings"][0] {
      _id,
      title,
      description,
      bannerText,
      contactNumber,
      heroTitle,
      heroSubtitle,
      heroDescription,
      kakaoBannerTitle,
      kakaoBannerDescription,
      coopBannerTitle,
      coopBannerDescription
    }
  `);
  return data ?? null;
};

export const fetchFaqItems = async (): Promise<FaqItem[]> => {
  const data = await sanityClient.fetch<FaqItem[]>(`
    *[_type == "faq"] | order(order asc, _createdAt desc) {
      _id,
      question,
      answer,
      category,
      order
    }
  `);
  return data ?? [];
};

// ✅ 핵심 수정:
//   - "fileRef": file.asset._ref  → _ref를 직접 projection으로 꺼냄
//   - "fileUrl": file.asset->url  → CDN url도 직접 꺼냄
//   - 두 값 모두 있어서 resolveFileUrl()이 정상 동작함
export const fetchArchives = async (): Promise<ArchiveItem[]> => {
  const data = await sanityClient.fetch<any[]>(`
    *[_type == "archive"] | order(publishedAt desc) {
      _id,
      title,
      description,
      publishedAt,
      "file": {
        "asset": {
          "_ref": file.asset._ref,
          "url": file.asset->url,
          "originalFilename": file.asset->originalFilename,
          "size": file.asset->size,
          "extension": file.asset->extension
        }
      }
    }
  `);
  return data ?? [];
};

export const fetchArchive = async (id: string): Promise<ArchiveItem | null> => {
  const data = await sanityClient.fetch<any>(`
    *[_type == "archive" && _id == $id][0] {
      _id,
      title,
      description,
      body,
      publishedAt,
      images,
      "file": {
        "asset": {
          "_ref": file.asset._ref,
          "url": file.asset->url,
          "originalFilename": file.asset->originalFilename,
          "size": file.asset->size,
          "extension": file.asset->extension
        }
      }
    }
  `, { id });
  return data ?? null;
};

export const fetchArchivesPreview = async (): Promise<ArchiveItem[]> => {
  const data = await sanityClient.fetch<any[]>(`
    *[_type == "archive"] | order(publishedAt desc)[0...5] {
      _id,
      title,
      publishedAt,
      "file": {
        "asset": {
          "_ref": file.asset._ref,
          "url": file.asset->url,
          "originalFilename": file.asset->originalFilename,
          "extension": file.asset->extension
        }
      }
    }
  `);
  return data ?? [];
};

// ===== 이용자 자료실 (userArchive) =====
export const fetchUserArchives = async (): Promise<ArchiveItem[]> => {
  const data = await sanityClient.fetch<any[]>(`
    *[_type == "userArchive"] | order(publishedAt desc) {
      _id,
      title,
      category,
      description,
      publishedAt,
      "file": {
        "asset": {
          "_ref": file.asset._ref,
          "url": file.asset->url,
          "originalFilename": file.asset->originalFilename,
          "size": file.asset->size,
          "extension": file.asset->extension
        }
      }
    }
  `);
  return data ?? [];
};

export const fetchUserArchive = async (id: string): Promise<ArchiveItem | null> => {
  const data = await sanityClient.fetch<any>(`
    *[_type == "userArchive" && _id == $id][0] {
      _id,
      title,
      category,
      description,
      body,
      publishedAt,
      images,
      "file": {
        "asset": {
          "_ref": file.asset._ref,
          "url": file.asset->url,
          "originalFilename": file.asset->originalFilename,
          "size": file.asset->size,
          "extension": file.asset->extension
        }
      }
    }
  `, { id });
  return data ?? null;
};

export const fetchUserArchivesPreview = async (): Promise<ArchiveItem[]> => {
  const data = await sanityClient.fetch<any[]>(`
    *[_type == "userArchive"] | order(publishedAt desc)[0...5] {
      _id,
      title,
      category,
      publishedAt,
      "file": {
        "asset": {
          "_ref": file.asset._ref,
          "url": file.asset->url,
          "originalFilename": file.asset->originalFilename,
          "extension": file.asset->extension
        }
      }
    }
  `);
  return data ?? [];
};

export const fetchNotices = async (): Promise<NoticeItem[]> => {
  const data = await sanityClient.fetch(`
    *[_type == "notice"] | order(important desc, publishedAt desc) {
      _id, title, content, publishedAt, important, coverImage
    }
  `);
  return data ?? [];
};

export const fetchNotice = async (id: string): Promise<NoticeItem | null> => {
  const data = await sanityClient.fetch(`
    *[_type == "notice" && _id == $id][0] {
      _id, title, content, publishedAt, important, images
    }
  `, { id });
  return data ?? null;
};

export const fetchNoticesPreview = async (): Promise<NoticeItem[]> => {
  const data = await sanityClient.fetch(`
    *[_type == "notice"] | order(important desc, publishedAt desc)[0...5] {
      _id, title, publishedAt, important
    }
  `);
  return data ?? [];
};
