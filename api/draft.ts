import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS 헤더 설정 (와일드카드로 완화)
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // GET 요청도 허용 (쿠키 설정 및 리다이렉트)
  if (req.method === 'GET') {
    const secret = req.query.secret as string;
    
    // 시크릿 키 검증 (필수)
    if (!process.env.SANITY_PREVIEW_SECRET) {
      console.error('SANITY_PREVIEW_SECRET environment variable not set');
      return res.status(500).json({ message: 'Server configuration error' });
    }
    
    if (secret !== process.env.SANITY_PREVIEW_SECRET) {
      console.error('Invalid secret in GET request');
      return res.status(401).json({ message: 'Invalid secret' });
    }
    
    const previewMode = req.cookies.sanity_preview_mode;
    
    // 쿠키 설정 (HttpOnly 제거 - JavaScript에서 읽을 수 있도록)
    res.setHeader('Set-Cookie', `sanity_preview_mode=true; Path=/; SameSite=Lax; Max-Age=604800`);
    
    // 메인 페이지로 리다이렉트
    return res.redirect(307, 'https://dong100.org/');
  }

  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  try {
    // 요청 본문 파싱 (JSON 또는 URL-encoded)
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        // URL-encoded 형식 처리
        const params = new URLSearchParams(body);
        body = Object.fromEntries(params);
      }
    }

    const secret = body?.secret;

    // 시크릿 키 검증 (필수)
    if (!process.env.SANITY_PREVIEW_SECRET) {
      console.error('SANITY_PREVIEW_SECRET environment variable not set');
      return res.status(500).json({ message: 'Server configuration error' });
    }
    
    if (secret !== process.env.SANITY_PREVIEW_SECRET) {
      console.error('Invalid secret:', secret);
      return res.status(401).json({ message: 'Invalid secret' });
    }

    // Preview 모드 쿠키 설정 (7일 동안 유효, HttpOnly 제거)
    res.setHeader('Set-Cookie', `sanity_preview_mode=true; Path=/; SameSite=Lax; Max-Age=604800`);

    // 메인 페이지로 리다이렉트
    res.redirect(307, '/');
  } catch (error) {
    console.error('Draft API error:', error);
    res.status(500).json({ message: 'Internal server error', error: String(error) });
  }
}
