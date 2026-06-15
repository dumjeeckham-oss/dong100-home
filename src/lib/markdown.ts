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
} {
  const lines = markdown.split('\n');
  const sections: Array<{ title: string; content: string }> = [];
  let currentSection: { title: string; content: string } | null = null;

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

  return {
    title: lines[0].replace('# ', ''),
    sections
  };
}
