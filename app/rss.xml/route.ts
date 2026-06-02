import { glob } from 'glob';
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';

export const dynamic = 'force-static';

export async function GET() {
  const siteUrl = 'https://tony-almanac.pages.dev';

  const files = await glob('_posts/**/*.mdx', {
    cwd: process.cwd(),
  });

  // date 기준 최신순 정렬
  const posts = files
    .map((file) => {
      const filePath = path.join(process.cwd(), file);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      const slug = path.basename(file, '.mdx');
      return { slug, data, content };
    })
    .sort((a, b) => {
      const dateA = a.data.date ? new Date(a.data.date).getTime() : 0;
      const dateB = b.data.date ? new Date(b.data.date).getTime() : 0;
      return dateB - dateA;
    });

  const postItems = posts
    .map(({ slug, data, content }) => {
      const description = (
        data.description ||
        content.substring(0, 150)
      ).replace(/[<>&'"]/g, (c) =>
        ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c] ?? c)
      );
      return `
    <item>
      <title><![CDATA[${data.title || slug}]]></title>
      <link>${siteUrl}/posts/${slug}</link>
      <description><![CDATA[${description}]]></description>
      <pubDate>${data.date ? new Date(data.date).toUTCString() : new Date().toUTCString()}</pubDate>
      <guid isPermaLink="true">${siteUrl}/posts/${slug}</guid>
    </item>`;
    })
    .join('');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Tony's Almanac</title>
    <link>${siteUrl}</link>
    <description>A collection of stories about Tony's minor experiences.</description>
    <language>ko-kr</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${postItems}
  </channel>
</rss>`;

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
