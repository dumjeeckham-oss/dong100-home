// Vercel Serverless function to enable preview mode for Sanity Presentation
// Sets a preview cookie (`sanity_preview`) and redirects back to the referer.

module.exports = (req, res) => {
  try {
    // Prefer explicit Sanity preview params
    const rawUrl = req.url || '';
    const host = req.headers && (req.headers.host || req.headers['x-forwarded-host'])
    const base = host ? `https://${host}` : 'https://dong100.org';

    // Parse query robustly
    const { URL } = require('url');
    const parsed = new URL(rawUrl, base);
    const secret = parsed.searchParams.get('sanity-preview-secret') || parsed.searchParams.get('token') || parsed.searchParams.get('preview') || '';
    const pathname = parsed.searchParams.get('sanity-preview-pathname') || parsed.searchParams.get('pathname') || '/';

    const referer = req.headers.referer || req.headers.origin || pathname || '/';

    // Build cookie visible to client (no HttpOnly) so client code can read and pass it to the Sanity client
    const cookieParts = [`sanity_preview=${encodeURIComponent(secret)}`];
    cookieParts.push('Path=/');
    cookieParts.push('SameSite=Lax');
    cookieParts.push('Secure');
    // Short expiration
    cookieParts.push('Max-Age=600'); // 10 minutes

    // Log debug info (Vercel function logs)
    console.log('[preview] host=%s rawUrl=%s secret=%s referer=%s', host, rawUrl, !!secret, referer);

    res.setHeader('Set-Cookie', cookieParts.join('; '));
    res.writeHead(307, { Location: referer });
    res.end();
  } catch (err) {
    console.error('Preview route error', err && err.stack ? err.stack : err);
    res.statusCode = 500;
    res.end('Preview setup failed');
  }
};
