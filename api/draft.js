// Vercel Serverless function to enable preview mode for Sanity Presentation
// Sets a preview cookie (`sanity_preview`) and redirects back to the referer.

export default async (req, res) => {
  try {
    // Detect Edge vs Node serverless environment:
    // - Edge: req.headers.get is a function
    // - Node: req.headers is a plain object
    const isEdge = !!(req && req.headers && typeof req.headers.get === 'function');

    if (isEdge) {
      // Edge runtime: work with Web Request/Response
      const url = new URL(req.url);
      const secret = url.searchParams.get('sanity-preview-secret') || url.searchParams.get('token') || '';
      const pathname = url.searchParams.get('sanity-preview-pathname') || '/';
      const referer = req.headers.get('referer') || req.headers.get('origin') || pathname || '/';

      const cookie = `sanity_preview=${encodeURIComponent(secret)}; Path=/; SameSite=Lax; Secure; Max-Age=600`;
      console.log('[preview-edge] url=%s secret=%s referer=%s', url.href, !!secret, referer);

      return new Response(null, {
        status: 307,
        headers: {
          Location: referer,
          'Set-Cookie': cookie,
        },
      });
    }

    // Node serverless runtime
    const rawUrl = req.url || '';
    const host = req.headers && (req.headers.host || req.headers['x-forwarded-host']) || 'dong100.org';
    const parsed = new URL(rawUrl, `https://${host}`);
    const secret = parsed.searchParams.get('sanity-preview-secret') || parsed.searchParams.get('token') || '';
    const pathname = parsed.searchParams.get('sanity-preview-pathname') || '/';
    const referer = req.headers.referer || req.headers.origin || pathname || '/';

    const cookie = `sanity_preview=${encodeURIComponent(secret)}; Path=/; SameSite=Lax; Secure; Max-Age=600`;
    console.log('[preview-node] host=%s rawUrl=%s secret=%s referer=%s', host, rawUrl, !!secret, referer);

    res.setHeader('Set-Cookie', cookie);
    res.writeHead(307, { Location: referer });
    res.end();
  } catch (err) {
    console.error('Preview route error', err && err.stack ? err.stack : err);
    if (res && typeof res.end === 'function') {
      res.statusCode = 500;
      res.end('Preview setup failed');
    }
    return new Response('Preview setup failed', { status: 500 });
  }
};
