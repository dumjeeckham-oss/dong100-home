// Vercel Serverless function to enable preview mode for Sanity Presentation
// Sets a preview cookie (`sanity_preview`) and redirects back to the referer.

module.exports = (req, res) => {
  try {
    const referer = req.headers.referer || '/';
    const url = new URL(req.url, `https://${req.headers.host}`);
    const token = url.searchParams.get('token') || url.searchParams.get('preview') || '';

    // Set a cookie that your frontend can read to enable preview mode.
    // Adjust cookie name and value handling to match your preview implementation.
    const cookieParts = [`sanity_preview=${encodeURIComponent(token)}`];
    cookieParts.push('Path=/');
    cookieParts.push('HttpOnly');
    cookieParts.push('SameSite=Lax');
    cookieParts.push('Secure');
    // Optional: set short expiration so previews don't persist forever
    cookieParts.push('Max-Age=600'); // 10 minutes

    res.setHeader('Set-Cookie', cookieParts.join('; '));
    res.writeHead(307, { Location: referer });
    res.end();
  } catch (err) {
    console.error('Preview route error', err);
    res.statusCode = 500;
    res.end('Preview setup failed');
  }
};
