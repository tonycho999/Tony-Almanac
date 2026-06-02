import { MetadataRoute } from 'next';
import { glob } from 'glob';
import path from 'path';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = 'https://tony-almanac.pages.dev';

  const files = await glob('_posts/**/*.mdx', {
    cwd: process.cwd(),
  });

  const postUrls: MetadataRoute.Sitemap = files.map((file) => {
    const slug = path.basename(file, '.mdx');
    return {
      url: `${siteUrl}/posts/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    };
  });

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...postUrls,
  ];
}
