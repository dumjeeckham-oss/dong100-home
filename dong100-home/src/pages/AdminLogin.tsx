import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, ArrowLeft } from 'lucide-react';
import logo from '@/assets/logo.png';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: err } = await signIn(email, password);
    if (err) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    } else {
      // Redirect to the page user came from, or board
      const from = new URLSearchParams(window.location.search).get('from');
      navigate(from || '/board');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <img src={logo} alt="로고" className="h-16 mx-auto" />
          <CardTitle className="flex items-center justify-center gap-2 text-xl">
            <Lock size={20} /> 관리자 로그인
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">이메일</label>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">비밀번호</label>
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '로그인 중...' : '로그인'}
            </Button>
          </form>
          <Button variant="ghost" className="w-full mt-4" onClick={() => navigate('/')}>
            <ArrowLeft size={16} /> 홈으로 돌아가기
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
