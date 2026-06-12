// Decap CMS (Netlify CMS) 데이터 로딩 로직
// 로컬 마크다운 파일에서 데이터를 읽어옵니다.

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
  contact?: string;
}

// 마크다운 파일의 frontmatter 파싱
const parseFrontmatter = (content: string) => {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { data: {}, body: content };
  }

  const frontmatter = match[1];
  const body = match[2];

  const data: Record<string, any> = {};
  frontmatter.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();
      
      // 불리언 값 처리
      if (value === 'true') data[key] = true;
      else if (value === 'false') data[key] = false;
      // 숫자 값 처리
      else if (!isNaN(Number(value))) data[key] = Number(value);
      else {
        // 따옴표 제거
        data[key] = value.replace(/^["']|["']$/g, '');
      }
    }
  });

  return { data, body };
};

// 공지사항 데이터 로드
export const loadLocalNotices = async (): Promise<LocalNotice[]> => {
  try {
    // Vite에서 정적 파일을 직접 import하는 방식
    const noticeModules = import.meta.glob('/content/notices/*.md', { as: 'raw' });
    
    const notices: LocalNotice[] = [];
    
    for (const path in noticeModules) {
      const content = await noticeModules[path]() as string;
      const { data, body } = parseFrontmatter(content);
      
      const slug = path.split('/').pop()?.replace('.md', '') || '';
      
      notices.push({
        title: data.title || '',
        date: data.date || new Date().toISOString(),
        important: data.important || false,
        body: body || '',
        slug,
      });
    }
    
    // 날짜순 정렬
    return notices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error loading local notices:', error);
    return [];
  }
};

// 활동보고 데이터 로드
export const loadLocalArchives = async (): Promise<LocalArchive[]> => {
  try {
    const archiveModules = import.meta.glob('/content/archives/*.md', { as: 'raw' });
    
    const archives: LocalArchive[] = [];
    
    for (const path in archiveModules) {
      const content = await archiveModules[path]() as string;
      const { data, body } = parseFrontmatter(content);
      
      const slug = path.split('/').pop()?.replace('.md', '') || '';
      
      archives.push({
        title: data.title || '',
        date: data.date || new Date().toISOString(),
        category: data.category || '기타',
        image: data.image,
        body: body || '',
        slug,
      });
    }
    
    // 날짜순 정렬
    return archives.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error loading local archives:', error);
    return [];
  }
};

// 사이트 설정 데이터 로드
export const loadLocalSiteSettings = async (): Promise<LocalSiteSettings> => {
  try {
    const settingsModule = import.meta.glob('/content/settings/*.md', { as: 'raw' });
    
    for (const path in settingsModule) {
      const content = await settingsModule[path]() as string;
      const { data } = parseFrontmatter(content);
      
      return {
        title: data.title,
        description: data.description,
        contact: data.contact,
      };
    }
    
    return {};
  } catch (error) {
    console.error('Error loading local site settings:', error);
    return {};
  }
};
