// Vercel API route for fetching preview/draft data
// Validates preview cookie and returns draft content using server-side Sanity token

const SANITY_API_TOKEN = process.env.SANITY_API_TOKEN || '';
const SANITY_PROJECT_ID = 'xczp11sl';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2024-01-01';

export default async (req, res) => {
  try {
    // Check for preview cookie
    const cookies = req.headers.cookie || '';
    const previewCookie = cookies
      .split(';')
      .find(c => c.trim().startsWith('sanity_preview='));

    if (!previewCookie) {
      return res.status(401).json({ error: 'No preview session' });
    }

    // Parse the query and variables from request body
    // In serverless, req.body might be a string or already parsed
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        console.error('[preview-data] Failed to parse body:', e);
        return res.status(400).json({ error: 'Invalid JSON in request body' });
      }
    }

    const { query, variables = {} } = body || {};
    if (!query) {
      console.error('[preview-data] Missing query:', { body, query });
      return res.status(400).json({ error: 'Missing query parameter' });
    }

    // Fetch from Sanity API with draft token (use GET with query params)
    const url = new URL(
      `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`
    );
    url.searchParams.set('query', query);
    if (variables && Object.keys(variables).length > 0) {
      url.searchParams.set('variables', JSON.stringify(variables));
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${SANITY_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[preview-data] Sanity API error:', response.status, error);
      return res.status(response.status).json({ error: 'Failed to fetch draft data' });
    }

    const data = await response.json();
    console.log('[preview-data] Fetched draft data successfully');
    return res.status(200).json(data);
  } catch (err) {
    console.error('[preview-data] Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
