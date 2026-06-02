import { sanityClient, fetchArchives } from './src/lib/sanity';
fetchArchives().then(data => console.log(JSON.stringify(data, null, 2))).catch(console.error);
