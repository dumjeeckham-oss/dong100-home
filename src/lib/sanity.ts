// src/lib/sanity.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const projectId = 'xczp11sl';
export const dataset = 'production';

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: true,
});

const builder = imageUrlBuilder(sanityClient);
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

export function resolveFileUrl(item: ArchiveItem): string | null {
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
}

export interface NoticeItem {
  _id: string;
  title: string;
  body?: any[];
  publishedAt?: string;
  isPinned?: boolean;
}

export type SanityArchive = ArchiveItem;
export type SanityNotice = NoticeItem;

// ===== GROQ 쿼리 =====
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

export const fetchNotices = async (): Promise<NoticeItem[]> => {
  const data = await sanityClient.fetch(`
    *[_type == "notice"] | order(publishedAt desc) {
      _id, title, body, publishedAt, isPinned
    }
  `);
  return data ?? [];
};

export const fetchNoticesPreview = async (): Promise<NoticeItem[]> => {
  const data = await sanityClient.fetch(`
    *[_type == "notice"] | order(isPinned desc, publishedAt desc)[0...5] {
      _id, title, publishedAt, isPinned
    }
  `);
  return data ?? [];
};
