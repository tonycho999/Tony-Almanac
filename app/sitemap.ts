import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = 'https://tony-almanac.pages.dev';
  const postsDirectory = path.join(process.cwd(), '_posts');

  let postFilenames: string[] = [];
  try {
    postFilenames = fs.readdirSync(postsDirectory).filter((f) => f.endsWith('.mdx'));
  } catch (error) {
    console.error('sitemap: _posts 읽기 실패:', error);
  }

  const postUrls: MetadataRoute.Sitemap = postFilenames.map((name) => ({
    url: `${siteUrl}/posts/${name.replace(/\.mdx$/, '')}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.7,
  }));

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
