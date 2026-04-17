import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, FileText, Users, Plus, Pencil, Trash2, Upload, LogOut, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';
import RichTextEditor from '@/components/RichTextEditor';

type BoardPost = Tables<'posts'>;
type BoardType = 'notice' | 'archive' | 'info';

const boardLabels: Record<BoardType, { label: string; icon: React.ElementType }> = {
  notice: { label: '공지사항', icon: Bell },
  archive: { label: '자료실', icon: FileText },
  info: { label: '이용자 정보', icon: Users },
};

const AdminBoard = () => {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BoardPost[]>([]);
  const [activeTab, setActiveTab] = useState<BoardType>('notice');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BoardPost | null>(null);
  
  // Form State
  const [targetBoard, setTargetBoard] = useState<BoardType>('notice');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/admin');
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('board_type', activeTab)
      .order('created_at', { ascending: false });
    setPosts(data || []);
  };

  const openNew = () => {
    setEditingPost(null);
    setTargetBoard(activeTab); // 기본값은 현재 탭
    setTitle('');
    setContent('');
    setFile(null);
    setDialogOpen(true);
  };

  const openEdit = (post: BoardPost) => {
    setEditingPost(post);
    setTargetBoard(post.board_type);
    setTitle(post.title);
    setContent(post.content || '');
    setFile(null);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!title.trim()) return toast.error('제목을 입력해주세요.');
    setSaving(true);

    let fileUrl = editingPost?.file_url || null;
    let fileName = editingPost?.file_name || null;
    let fileType = editingPost?.file_type || null;

    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        toast.error('파일 크기는 20MB 이하여야 합니다.');
        setSaving(false);
        return;
      }
      const ext = file.name.split('.').pop();
      const path = `${targetBoard}/${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from('board-files').upload(path, file);
      if (uploadErr) {
        toast.error('파일 업로드 실패: ' + uploadErr.message);
        setSaving(false);
        return;
      }
      const { data: urlData } = supabase.storage.from('board-files').getPublicUrl(path);
      fileUrl = urlData.publicUrl;
      fileName = file.name;
      fileType = ext?.toUpperCase() || null;
    }

    const payload = {
      title: title.trim(),
      content: content || null,
      board_type: targetBoard,
      file_url: fileUrl,
      file_name: fileName,
      file_type: fileType,
      author_id: user?.id,
    };

    if (editingPost) {
      const { error } = await supabase.from('posts').update(payload).eq('id', editingPost.id);
      if (error) toast.error('수정 실패: ' + error.message);
      else toast.success('수정되었습니다.');
    } else {
      const { error } = await supabase.from('posts').insert(payload);
      if (error) toast.error('등록 실패: ' + error.message);
      else toast.success('등록되었습니다.');
    }

    setDialogOpen(false);
    setSaving(false);
    
    // 만약 작성/수정한 글이 현재 열려있는 탭과 다르다면 해당 탭으로 이동
    if (activeTab !== targetBoard) {
      setActiveTab(targetBoard);
    } else {
      fetchPosts();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) toast.error('삭제 실패');
    else {
      toast.success('삭제되었습니다.');
      fetchPosts();
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center">로딩중...</div>;

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container flex items-center justify-between py-3">
          <h1 className="text-lg font-bold text-primary">관리자 게시판 관리</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft size={16} /> 홈
            </Button>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut size={16} /> 로그아웃
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-6">
        <Tabs value={activeTab} onValueChange={v => setActiveTab(v as BoardType)}>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <TabsList>
              {(Object.keys(boardLabels) as BoardType[]).map(key => {
                const { label, icon: Icon } = boardLabels[key];
                return (
                  <TabsTrigger key={key} value={key} className="flex items-center gap-1.5">
                    <Icon size={16} /> {label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            <Button onClick={openNew} className="flex items-center gap-1.5">
              <Plus size={16} /> 새 글 작성
            </Button>
          </div>

          {(Object.keys(boardLabels) as BoardType[]).map(key => (
            <TabsContent key={key} value={key}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{boardLabels[key].label} 목록</CardTitle>
                </CardHeader>
                <CardContent>
                  {posts.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">등록된 글이 없습니다.</p>
                  ) : (
                    <div className="space-y-2">
                       {posts.map(post => (
                        <div key={post.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{post.title}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-muted-foreground">
                                {new Date(post.created_at).toLocaleDateString('ko-KR')}
                              </span>
                              {post.file_name && (
                                <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded">
                                  📎 {post.file_name}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1 ml-3 shrink-0">
                            <Button variant="ghost" size="icon" onClick={() => openEdit(post)} aria-label="수정">
                              <Pencil size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)} aria-label="삭제" className="text-destructive hover:text-destructive">
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPost ? '글 수정' : '새 글 작성'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">게시판 선택 *</label>
              <select 
                value={targetBoard}
                onChange={e => setTargetBoard(e.target.value as BoardType)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="notice">공지사항</option>
                <option value="archive">자료실</option>
                <option value="info">이용자 정보</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">제목 *</label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="제목을 입력하세요" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">내용</label>
              <RichTextEditor content={content} onChange={setContent} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                <Upload size={14} className="inline mr-1" />
                파일 첨부
              </label>
              <Input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
              <p className="text-xs text-muted-foreground mt-1">최대 20MB까지 업로드 가능합니다.</p>
              {editingPost?.file_name && !file && (
                <p className="text-xs text-muted-foreground mt-1">현재 파일: {editingPost.file_name}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>취소</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? '저장 중...' : editingPost ? '수정' : '등록'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBoard;
