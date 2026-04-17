import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Quote, Undo, Redo, Link as LinkIcon,
  Image as ImageIcon, Heading1, Heading2, Heading3, Highlighter, Type, Palette,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useRef } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

const MenuButton = ({ active, onClick, children, title }: {
  active?: boolean; onClick: () => void; children: React.ReactNode; title: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`p-1.5 rounded hover:bg-accent transition-colors ${active ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'}`}
  >
    {children}
  </button>
);

const TEXT_COLORS = [
  { label: '검정', value: '#000000' },
  { label: '빨강', value: '#e53e3e' },
  { label: '파랑', value: '#3182ce' },
  { label: '초록', value: '#38a169' },
  { label: '주황', value: '#dd6b20' },
  { label: '보라', value: '#805ad5' },
  { label: '분홍', value: '#d53f8c' },
  { label: '갈색', value: '#744210' },
];

const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const colorRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false }),
      Image,
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  const addLink = () => {
    const url = prompt('URL을 입력하세요:');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  const addImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        toast.error('이미지는 5MB 이하여야 합니다.');
        return;
      }
      const ext = file.name.split('.').pop();
      const path = `images/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('board-files').upload(path, file);
      if (error) {
        toast.error('이미지 업로드 실패');
        return;
      }
      const { data } = supabase.storage.from('board-files').getPublicUrl(path);
      editor.chain().focus().setImage({ src: data.publicUrl }).run();
    };
    input.click();
  };

  const s = 15;

  return (
    <div className="border border-input rounded-lg overflow-hidden bg-background">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-input bg-muted/50">
        <MenuButton active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="제목 1">
          <Heading1 size={s} />
        </MenuButton>
        <MenuButton active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="제목 2">
          <Heading2 size={s} />
        </MenuButton>
        <MenuButton active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="제목 3">
          <Heading3 size={s} />
        </MenuButton>
        <MenuButton active={editor.isActive('paragraph')} onClick={() => editor.chain().focus().setParagraph().run()} title="본문">
          <Type size={s} />
        </MenuButton>

        <div className="w-px h-5 bg-border mx-1" />

        <MenuButton active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} title="굵게">
          <Bold size={s} />
        </MenuButton>
        <MenuButton active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} title="기울임">
          <Italic size={s} />
        </MenuButton>
        <MenuButton active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} title="밑줄">
          <UnderlineIcon size={s} />
        </MenuButton>
        <MenuButton active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()} title="취소선">
          <Strikethrough size={s} />
        </MenuButton>
        <MenuButton active={editor.isActive('highlight')} onClick={() => editor.chain().focus().toggleHighlight().run()} title="형광펜">
          <Highlighter size={s} />
        </MenuButton>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Color picker */}
        <div className="relative group">
          <MenuButton onClick={() => colorRef.current?.click()} title="글자 색상">
            <Palette size={s} />
          </MenuButton>
          <div className="absolute top-full left-0 mt-1 hidden group-hover:flex bg-background border border-border rounded-lg shadow-lg p-2 gap-1 z-50">
            {TEXT_COLORS.map(c => (
              <button
                key={c.value}
                type="button"
                title={c.label}
                className="w-6 h-6 rounded-full border border-border hover:scale-110 transition-transform"
                style={{ backgroundColor: c.value }}
                onClick={() => editor.chain().focus().setColor(c.value).run()}
              />
            ))}
            <input
              ref={colorRef}
              type="color"
              className="w-6 h-6 rounded cursor-pointer border-0 p-0"
              onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
              title="커스텀 색상"
            />
          </div>
        </div>

        <div className="w-px h-5 bg-border mx-1" />

        <MenuButton active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()} title="왼쪽 정렬">
          <AlignLeft size={s} />
        </MenuButton>
        <MenuButton active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()} title="가운데 정렬">
          <AlignCenter size={s} />
        </MenuButton>
        <MenuButton active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()} title="오른쪽 정렬">
          <AlignRight size={s} />
        </MenuButton>
        <MenuButton active={editor.isActive({ textAlign: 'justify' })} onClick={() => editor.chain().focus().setTextAlign('justify').run()} title="양쪽 정렬">
          <AlignJustify size={s} />
        </MenuButton>

        <div className="w-px h-5 bg-border mx-1" />

        <MenuButton active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} title="글머리 기호">
          <List size={s} />
        </MenuButton>
        <MenuButton active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="번호 목록">
          <ListOrdered size={s} />
        </MenuButton>
        <MenuButton active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="인용">
          <Quote size={s} />
        </MenuButton>

        <div className="w-px h-5 bg-border mx-1" />

        <MenuButton onClick={addLink} active={editor.isActive('link')} title="링크">
          <LinkIcon size={s} />
        </MenuButton>
        <MenuButton onClick={addImage} title="이미지 삽입">
          <ImageIcon size={s} />
        </MenuButton>

        <div className="w-px h-5 bg-border mx-1" />

        <MenuButton onClick={() => editor.chain().focus().undo().run()} title="실행 취소">
          <Undo size={s} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().redo().run()} title="다시 실행">
          <Redo size={s} />
        </MenuButton>
      </div>

      {/* Editor area */}
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-4 min-h-[250px] focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[250px] [&_.ProseMirror_img]:max-w-full [&_.ProseMirror_img]:rounded-lg"
      />
    </div>
  );
};

export default RichTextEditor;
