
CREATE TYPE public.board_type AS ENUM ('notice', 'resource', 'user_info');
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Anyone can read roles" ON public.user_roles FOR SELECT USING (true);
CREATE POLICY "Only admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.board_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_type board_type NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  file_name TEXT,
  file_url TEXT,
  file_type TEXT,
  author_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.board_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read posts" ON public.board_posts FOR SELECT USING (true);
CREATE POLICY "Admins can insert posts" ON public.board_posts FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update posts" ON public.board_posts FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete posts" ON public.board_posts FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_board_posts_updated_at
  BEFORE UPDATE ON public.board_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO storage.buckets (id, name, public) VALUES ('board-files', 'board-files', true);

CREATE POLICY "Anyone can download board files" ON storage.objects FOR SELECT USING (bucket_id = 'board-files');
CREATE POLICY "Admins can upload board files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'board-files' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update board files" ON storage.objects FOR UPDATE USING (bucket_id = 'board-files' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete board files" ON storage.objects FOR DELETE USING (bucket_id = 'board-files' AND public.has_role(auth.uid(), 'admin'));
