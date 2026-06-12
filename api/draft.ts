import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', 'https://dong100.org');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  try {
    const { secret } = req.body;

    // Sanity Studio에서 보내는 시크릿 키 검증
    if (secret !== process.env.SANITY_PREVIEW_SECRET) {
      return res.status(401).json({ message: 'Invalid secret' });
    }

    // Preview 모드 쿠키 설정 (7일 동안 유효)
    res.setHeader('Set-Cookie', `sanity_preview_mode=true; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`);

    // 메인 페이지로 리다이렉트
    res.redirect(307, '/');
  } catch (error) {
    console.error('Draft API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
