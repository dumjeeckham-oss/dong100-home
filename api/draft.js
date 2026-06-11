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
      let pathname = url.searchParams.get('sanity-preview-pathname') || null;
      let referer = req.headers.get('referer') || req.headers.get('origin') || null;

      // If pathname is provided, use it. Otherwise try referer.
      // But if referer is /studio, redirect to root instead.
      let redirectUrl = pathname;
      if (!redirectUrl && referer) {
        try {
          const refererUrl = new URL(referer);
          redirectUrl = refererUrl.pathname === '/studio' ? '/' : refererUrl.pathname;
        } catch (e) {
          redirectUrl = referer.startsWith('/') ? referer : '/';
          if (redirectUrl === '/studio') redirectUrl = '/';
        }
      }
      redirectUrl = redirectUrl || '/';

      const cookie = `sanity_preview=${encodeURIComponent(secret)}; Path=/; SameSite=Lax; Secure; Max-Age=600`;
      console.log('[preview-edge] pathname=%s referer=%s -> redirectUrl=%s', pathname, referer, redirectUrl);

      return new Response(null, {
        status: 307,
        headers: {
          Location: redirectUrl,
          'Set-Cookie': cookie,
        },
      });
    }

    // Node serverless runtime
    const rawUrl = req.url || '';
    const host = req.headers && (req.headers.host || req.headers['x-forwarded-host']) || 'dong100.org';
    const parsed = new URL(rawUrl, `https://${host}`);
    const secret = parsed.searchParams.get('sanity-preview-secret') || parsed.searchParams.get('token') || '';
    let pathname = parsed.searchParams.get('sanity-preview-pathname') || null;
    let referer = req.headers.referer || req.headers.origin || null;

    // If pathname is provided, use it. Otherwise try referer.
    // But if referer is /studio, redirect to root instead.
    let redirectUrl = pathname;
    if (!redirectUrl && referer) {
      try {
        const refererUrl = new URL(referer);
        redirectUrl = refererUrl.pathname === '/studio' ? '/' : refererUrl.pathname;
      } catch (e) {
        redirectUrl = referer.startsWith('/') ? referer : '/';
        if (redirectUrl === '/studio') redirectUrl = '/';
      }
    }
    redirectUrl = redirectUrl || '/';

    const cookie = `sanity_preview=${encodeURIComponent(secret)}; Path=/; SameSite=Lax; Secure; Max-Age=600`;
    console.log('[preview-node] pathname=%s referer=%s -> redirectUrl=%s', pathname, referer, redirectUrl);

    res.setHeader('Set-Cookie', cookie);
    res.writeHead(307, { Location: redirectUrl });
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
