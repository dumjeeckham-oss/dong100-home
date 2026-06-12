import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS 헤더 설정 (Sanity Studio만 허용)
  const referer = req.headers.referer || req.headers.referrer;
  const origin = req.headers.origin;
  
  // Sanity Studio 도메인 확인
  const isSanityStudio = referer?.includes('/studio') || origin?.includes('/studio');
  
  if (isSanityStudio) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', origin || referer || '*');
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'https://dong100.org');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Sanity Studio에서 온 요청인지 확인
  if (!isSanityStudio) {
    console.error('Request not from Sanity Studio');
    return res.status(403).json({ message: 'Access denied: Only Sanity Studio can access this endpoint' });
  }

  // GET 요청도 허용 (쿠키 설정 및 리다이렉트)
  if (req.method === 'GET') {
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

    // Preview 모드 쿠키 설정 (7일 동안 유효, HttpOnly 제거)
    res.setHeader('Set-Cookie', `sanity_preview_mode=true; Path=/; SameSite=Lax; Max-Age=604800`);

    // 메인 페이지로 리다이렉트
    res.redirect(307, '/');
  } catch (error) {
    console.error('Draft API error:', error);
    res.status(500).json({ message: 'Internal server error', error: String(error) });
  }
}
