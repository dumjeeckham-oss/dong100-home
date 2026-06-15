// 마크다운 파일 로드 유틸리티

export async function loadMarkdownFile(filename: string): Promise<string> {
  try {
    const response = await fetch(`/content/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to load ${filename}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    return '';
  }
}

// 마크다운 파싱 (간단한 구현)
export function parseMarkdown(markdown: string): {
  title: string;
  sections: Array<{
    title: string;
    content: string;
  }>;
  contactInfo?: {
    department: string;
    phone: string;
    email: string;
    address: string;
    parking: string;
  };
  serviceInfo?: {
    description: string;
    target: string;
    exceptions: string[];
    documents: string[];
  };
} {
  const lines = markdown.split('\n');
  const sections: Array<{ title: string; content: string }> = [];
  let currentSection: { title: string; content: string } | null = null;
  let contactInfo: {
    department: string;
    phone: string;
    email: string;
    address: string;
    parking: string;
  } | undefined;
  let serviceInfo: {
    description: string;
    target: string;
    exceptions: string[];
    documents: string[];
  } | undefined;

  lines.forEach(line => {
    if (line.startsWith('## ')) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        title: line.replace('## ', ''),
        content: ''
      };
    } else if (line.startsWith('### ')) {
      if (currentSection) {
        currentSection.content += line + '\n';
      }
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (currentSection) {
        currentSection.content += line + '\n';
      }
    } else if (line.trim() !== '') {
      if (currentSection) {
        currentSection.content += line + '\n';
      }
    }
  });

  if (currentSection) {
    sections.push(currentSection);
  }

  // 연락처 정보 파싱
  const contactSection = sections.find(s => s.title === '연락처 및 주소');
  if (contactSection) {
    const contactLines = contactSection.content.split('\n');
    contactInfo = {
      department: '',
      phone: '',
      email: '',
      address: '',
      parking: '',
    };

    contactLines.forEach(line => {
      if (line.includes('담당부서')) {
        contactInfo!.department = line.replace('### 담당부서', '').trim();
      } else if (line.includes('전화번호')) {
        contactInfo!.phone = line.replace('### 전화번호', '').trim();
      } else if (line.includes('이메일')) {
        contactInfo!.email = line.replace('### 이메일', '').trim();
      } else if (line.includes('주소')) {
        contactInfo!.address = line.replace('### 주소', '').trim();
      } else if (line.includes('주차안내')) {
        contactInfo!.parking = line.replace('### 주차안내', '').trim();
      }
    });
  }

  // 서비스 정보 파싱
  const serviceIntroSection = sections.find(s => s.title === '서비스 소개');
  const targetSection = sections.find(s => s.title === '이용대상');
  const exceptionsSection = sections.find(s => s.title === '예외사항');
  const documentsSection = sections.find(s => s.title === '신청 필요 서류');

  if (serviceIntroSection || targetSection || exceptionsSection || documentsSection) {
    serviceInfo = {
      description: serviceIntroSection?.content.trim() || '',
      target: targetSection?.content.trim() || '',
      exceptions: exceptionsSection?.content
        .split('\n')
        .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
        .map(line => line.replace(/^[-*]\s*/, '').trim()) || [],
      documents: documentsSection?.content
        .split('\n')
        .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
        .map(line => line.replace(/^[-*]\s*/, '').trim()) || [],
    };
  }

  return {
    title: lines[0].replace('# ', ''),
    sections,
    contactInfo,
    serviceInfo,
  };
}
