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
    const { query, variables = {} } = req.body || {};
    if (!query) {
      return res.status(400).json({ error: 'Missing query parameter' });
    }

    // Fetch from Sanity API with draft token
    const url = new URL(
      `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`
    );

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SANITY_API_TOKEN}`,
      },
      body: JSON.stringify({ query, variables }),
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
