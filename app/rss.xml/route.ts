import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export const dynamic = 'force-static';

export async function GET() {
  const siteUrl = 'https://tony-almanac.pages.dev';
  const postsDirectory = path.join(process.cwd(), '_posts');

  let postFilenames: string[] = [];
  try {
    postFilenames = fs.readdirSync(postsDirectory).filter((f) => f.endsWith('.mdx'));
  } catch (error) {
    console.error('RSS: _posts 읽기 실패:', error);
  }

  const posts = postFilenames
    .map((name) => {
      const filePath = path.join(postsDirectory, name);
      const { data, content } = matter(fs.readFileSync(filePath, 'utf8'));
      const slug = name.replace(/\.mdx$/, '');
      return { slug, data, content };
    })
    .sort((a, b) => {
      const dateA = a.data.date ? new Date(a.data.date).getTime() : 0;
      const dateB = b.data.date ? new Date(b.data.date).getTime() : 0;
      return dateB - dateA;
    });

  const escape = (str: string) =>
    str.replace(/[<>&'"]/g, (c) =>
      ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c] ?? c)
    );

  const postItems = posts
    .map(({ slug, data, content }) => {
      const description = escape(
        data.description || content.substring(0, 150)
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
