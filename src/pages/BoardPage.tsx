import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Bell, FileText, Users, UserPlus, Download, ArrowLeft, Calendar, ChevronRight, Plus, Pencil, Trash2, Upload, LogIn, LogOut, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';
import RichTextEditor from '@/components/RichTextEditor';
import logo from '@/assets/logo.png';

type BoardPost = Tables<'posts'>;
type BoardType = 'notice' | 'archive' | 'info';

const boardMeta: Record<string, { label: string; icon: React.ElementType; desc: string; external?: string }> = {
  notice: { label: '📢 공지사항', icon: Bell, desc: '센터의 주요 소식과 안내사항을 확인하세요.' },
  archive: { label: '📁 자료실', icon: FileText, desc: '필요한 서류와 양식을 다운로드하세요.' },
  info: { label: '👥 이용자 정보', icon: Users, desc: '활동지원사 매칭 관련 정보를 확인하세요.' },
  recruit: { label: '🤝 활동지원사 모집', icon: UserPlus, desc: '활동지원사로 지원하세요.', external: 'https://docs.google.com/forms/d/e/1FAIpQLSfN7sbIDGSZRxTYq6z-z6doJVNyBfITRntE2yeDaVpIGTstXg/viewform?pli=1' },
};

const boardTypes: BoardType[] = ['notice', 'archive', 'info'];
const PAGE_SIZE = 10;

const fetchBoardPosts = async (boardType: BoardType, page: number, query: string): Promise<{ data: BoardPost[], count: number }> => {
  let request = supabase
    .from('posts')
    .select('*', { count: 'exact' })
    .eq('board_type', boardType);

  if (query) {
    request = request.or(`title.ilike.%${query}%,content.ilike.%${query}%`);
  }

  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE - 1;

  const { data, count, error } = await request
    .order('created_at', { ascending: false })
    .range(start, end);

  if (error) throw error;
  return { data: data || [], count: count || 0 };
};

const BoardPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const rawTab = searchParams.get('tab') || 'notice';
  const tab = boardTypes.includes(rawTab as BoardType) ? (rawTab as BoardType) : 'notice';
  
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState<BoardPost | null>(null);

  const { data: response, isLoading: loading, error: queryError } = useQuery({
    queryKey: ['posts', tab, page, searchTerm],
    queryFn: () => fetchBoardPosts(tab, page, searchTerm),
    staleTime: 1000 * 30,
    retry: 2,
  });

  const posts = response?.data || [];
  const totalCount = response?.count || 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // Write/Edit form state
  const [writeOpen, setWriteOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BoardPost | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  };

  const changeTab = (v: string) => {
    if (v === 'recruit') {
      window.open(boardMeta.recruit.external, '_blank');
      return;
    }
    setSearchParams({ tab: v });
    setPage(1);
    setSearchInput('');
    setSearchTerm('');
  };

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setPage(1);
  };

  const openWrite = () => {
    if (!isAdmin) {
      toast.error('관리자 권한이 필요합니다. 로그인 페이지로 이동합니다.');
      navigate(`/admin?from=/board?tab=${tab}`);
      return;
    }
    setEditingPost(null);
    setTitle('');
    setContent('');
    setFile(null);
    setWriteOpen(true);
  };

  const openEdit = (post: BoardPost) => {
    setEditingPost(post);
    setTitle(post.title);
    setContent(post.content || '');
    setFile(null);
    setSelectedPost(null);
    setWriteOpen(true);
  };

  const handleDelete = async (post: BoardPost) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    const { error } = await supabase.from('posts').delete().eq('id', post.id);
    if (error) toast.error('삭제 실패');
    else {
      toast.success('삭제되었습니다.');
      setSelectedPost(null);
      invalidateAll();
    }
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
      const path = `${tab}/${Date.now()}.${ext}`;
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
      board_type: tab as BoardType,
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

    setWriteOpen(false);
    setSaving(false);
    invalidateAll();
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-primary text-primary-foreground">
        <div className="container py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="text-primary-foreground hover:bg-primary-foreground/10">
            <ArrowLeft size={24} />
          </Button>
          <img src={logo} alt="로고" className="h-10" />
          <h1 className="text-xl font-bold flex-1">게시판</h1>
          {!authLoading && (
            isAdmin ? (
              <Button variant="ghost" size="sm" onClick={signOut} className="text-primary-foreground hover:bg-primary-foreground/10 gap-1.5">
                <LogOut size={16} /> 로그아웃
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin')} className="text-primary-foreground hover:bg-primary-foreground/10 gap-1.5">
                <LogIn size={16} /> 관리자
              </Button>
            )
          )}
        </div>
      </header>

      <div className="container py-6">
        <Tabs value={tab} onValueChange={changeTab}>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <TabsList className="grid grid-cols-4 w-full md:w-auto">
              {Object.keys(boardMeta).map(key => {
                const { label, icon: Icon } = boardMeta[key];
                return (
                  <TabsTrigger key={key} value={key} className="flex items-center gap-1.5 text-xs sm:text-sm">
                    <Icon size={16} /> <span className="hidden sm:inline">{label}</span><span className="sm:hidden">{label.split(' ').pop()}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
            <Button onClick={openWrite} className="flex items-center gap-1.5 whitespace-nowrap">
              <Plus size={16} /> 글쓰기
            </Button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
            <p className="text-muted-foreground text-sm flex-1">{boardMeta[tab]?.desc}</p>
            {tab !== 'recruit' && (
              <div className="flex items-center gap-2 max-w-sm w-full">
                <Input 
                  placeholder="제목이나 내용으로 검색" 
                  value={searchInput} 
                  onChange={e => setSearchInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  className="bg-background"
                />
                <Button variant="secondary" onClick={handleSearch} className="px-3">
                  <Search size={16} />
                </Button>
              </div>
            )}
          </div>

          {boardTypes.map(key => (
            <TabsContent key={key} value={key}>
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">불러오는 중...</div>
              ) : queryError ? (
                <div className="text-center py-12 text-destructive bg-card rounded-2xl">
                  데이터를 불러오는 데 실패했습니다. 원인: {queryError instanceof Error ? queryError.message : '알 수 없는 에러'}
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground bg-card rounded-2xl">
                  등록된 게시글이 없습니다.
                </div>
              ) : (
                <div className="bg-card rounded-2xl shadow-sm divide-y divide-border">
                  {posts.map(post => (
                    <button
                      key={post.id}
                      onClick={() => setSelectedPost(post)}
                      className="w-full text-left px-5 py-4 hover:bg-accent/50 transition-colors flex items-center gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate text-lg">{post.title}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(post.created_at).toLocaleDateString('ko-KR')}
                          </span>
                          {post.file_name && (
                            <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded font-medium">
                              {post.file_type || '파일'}
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-muted-foreground shrink-0" />
                    </button>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-1.5 mt-8">
                  <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                    이전
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, i) => {
                      // 보여줄 페이지 범위: 현재 페이지 앞뒤 2개
                      if (i + 1 !== 1 && i + 1 !== totalPages && Math.abs(page - (i + 1)) > 2) {
                        if (i + 1 === 2 || i + 1 === totalPages - 1) return <span key={i} className="px-1 text-muted-foreground">...</span>;
                        return null;
                      }
                      
                      return (
                        <Button 
                          key={i} 
                          variant={page === i + 1 ? 'default' : 'ghost'} 
                          size="sm" 
                          onClick={() => setPage(i + 1)}
                          className="w-8 h-8 p-0"
                        >
                          {i + 1}
                        </Button>
                      );
                    })}
                  </div>
                  <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                    다음
                  </Button>
                </div>
              )}
            </TabsContent>
          ))}

          {/* Recruit tab content */}
          <TabsContent value="recruit">
            <div className="text-center py-12 bg-card rounded-2xl">
              <p className="text-lg mb-4">활동지원사 모집 페이지로 이동합니다.</p>
              <a
                href={boardMeta.recruit.external}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90"
              >
                🤝 지원하러 가기
              </a>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Post detail dialog */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          {selectedPost && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg leading-snug">{selectedPost.title}</DialogTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(selectedPost.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </DialogHeader>
              <div className="mt-4 break-words">
                {selectedPost.content && (
                  <div
                    className="prose prose-sm max-w-none text-foreground mb-4"
                    dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                  />
                )}
                {selectedPost.file_url && selectedPost.file_name && (
                  <a
                    href={selectedPost.file_url}
                    download={selectedPost.file_name}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
                  >
                    <Download size={16} />
                    {selectedPost.file_name} 다운로드
                  </a>
                )}
              </div>
              {isAdmin && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                  <Button variant="outline" size="sm" onClick={() => openEdit(selectedPost)} className="gap-1.5">
                    <Pencil size={14} /> 수정
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(selectedPost)} className="gap-1.5">
                    <Trash2 size={14} /> 삭제
                  </Button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Write/Edit dialog */}
      <Dialog open={writeOpen} onOpenChange={setWriteOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPost ? '글 수정' : '새 글 작성'} - {boardMeta[tab]?.label}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
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
            <Button variant="outline" onClick={() => setWriteOpen(false)}>취소</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? '저장 중...' : editingPost ? '수정' : '등록'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BoardPage;
