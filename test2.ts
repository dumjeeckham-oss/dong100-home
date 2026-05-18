import { sanityClient } from './src/lib/sanity';
sanityClient.fetch(`*[_type == "archive"] | order(publishedAt desc) {
  _id, title, description, publishedAt,
  file { asset-> { _ref:_id, url, originalFilename, size, extension } }
}`).then(console.log).catch(console.error);
