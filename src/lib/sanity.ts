import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || "your-project-id";
const dataset = import.meta.env.VITE_SANITY_DATASET || "production";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: true,
});

const builder = imageUrlBuilder(sanityClient);
type SanityImageSource = Parameters<ReturnType<typeof imageUrlBuilder>["image"]>[0];
export const urlFor = (source: SanityImageSource) => builder.image(source);

export type SanityPost = {
  _id: string;
  title: string;
  content?: string;
  date?: string;
  image?: SanityImageSource;
  category: "notice" | "activity";
};
