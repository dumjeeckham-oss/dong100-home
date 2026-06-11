// src/lib/sanity.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

export const projectId = 'xczp11sl';
export const dataset = 'production';

// Detect preview mode by reading the sanity_preview cookie
function isPreviewMode(): boolean {
  if (typeof document === 'undefined') return false; // SSR context
  const cookies = document.cookie.split(';');
  return cookies.some(c => c.trim().startsWith('sanity_preview='));
}

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: true,
  stega: {
    enabled: true,
    studioUrl: '/studio',
  },
});

// Fetch from server-side preview endpoint when in preview mode
async function fetchPreviewData<T>(query: string, params?: Record<string, any>): Promise<T> {
  const response = await fetch('/api/preview-data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: params }),
  });

  if (!response.ok) {
    throw new Error(`Preview fetch failed: ${response.status}`);
  }

  const data = await response.json();
  return data.result;
}

// Wrapper function: fetch from preview endpoint if in preview mode, otherwise use regular client
async function fetchData<T>(query: string, params?: Record<string, any>): Promise<T> {
  if (isPreviewMode()) {
    console.log('[preview] Fetching draft content from /api/preview-data');
    return fetchPreviewData<T>(query, params);
  }
  return sanityClient.fetch<T>(query, params);
}

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

// ===== GROQ 쿼리 =====
export const fetchSiteSettings = async (): Promise<SiteSettings | null> => {
  const data = await fetchData<SiteSettings>(`
    *[_type == "siteSettings"][0] {
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
  const data = await fetchData<FaqItem[]>(`
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
