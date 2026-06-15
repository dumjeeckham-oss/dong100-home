import { createClient } from 'contentful';

const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
const accessToken = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN;

if (!spaceId || !accessToken) {
  console.warn('Contentful environment variables not found. Contentful features will be disabled.');
}

const contentfulClient = spaceId && accessToken
  ? createClient({
      space: spaceId,
      accessToken: accessToken,
    })
  : null;

export interface ContentfulSiteSettings {
  title?: string;
  description?: string;
  bannerText?: string;
  contactNumber?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  kakaoBannerTitle?: string;
  kakaoBannerDescription?: string;
  coopBannerTitle?: string;
  coopBannerDescription?: string;
}

export const fetchContentfulSiteSettings = async (): Promise<ContentfulSiteSettings | null> => {
  if (!contentfulClient) {
    console.warn('Contentful client not initialized. Skipping Contentful fetch.');
    return null;
  }

  try {
    const response = await contentfulClient.getEntries({
      content_type: 'siteSettings',
      limit: 1,
    });

    if (response.items.length === 0) {
      return null;
    }

    const item = response.items[0];
    const fields = item.fields as any;

    return {
      title: fields.title,
      description: fields.description,
      bannerText: fields.bannerText,
      contactNumber: fields.contactNumber,
      heroTitle: fields.heroTitle,
      heroSubtitle: fields.heroSubtitle,
      heroDescription: fields.heroDescription,
      kakaoBannerTitle: fields.kakaoBannerTitle,
      kakaoBannerDescription: fields.kakaoBannerDescription,
      coopBannerTitle: fields.coopBannerTitle,
      coopBannerDescription: fields.coopBannerDescription,
    };
  } catch (error) {
    console.error('Error fetching Contentful site settings:', error);
    return null;
  }
};
