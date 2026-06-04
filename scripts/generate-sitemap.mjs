import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const siteUrl = 'https://tony-almanac.pages.dev';
const postsDirectory = path.join(process.cwd(), '_posts');
const publicDirectory = path.join(process.cwd(), 'public');

const postFilenames = fs.readdirSync(postsDirectory).filter(f => f.endsWith('.mdx'));

const posts = postFilenames
  .map(name => {
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

// ✅ sitemap.xml 생성
const postUrls = posts.map(({ slug, data }) => `
  <url>
    <loc>${siteUrl}/posts/${slug}</loc>
    <lastmod>${data.date ? new Date(data.date).toISOString() : new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`).join('');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${postUrls}
</urlset>`;

fs.writeFileSync(path.join(publicDirectory, 'sitemap.xml'), sitemap);
console.log('✅ sitemap.xml 생성 완료');

// ✅ robots.txt 생성
const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml`;

fs.writeFileSync(path.join(publicDirectory, 'robots.txt'), robots);
console.log('✅ robots.txt 생성 완료');

// ✅ rss.xml 생성
const escape = (str) =>
  String(str).replace(/[<>&'"]/g, (c) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c] ?? c)
  );

const postItems = posts.map(({ slug, data, content }) => {
  const description = escape(data.description || content.substring(0, 150));
  return `
    <item>
      <title><![CDATA[${data.title || slug}]]></title>
      <link>${siteUrl}/posts/${slug}</link>
      <description><![CDATA[${description}]]></description>
      <pubDate>${data.date ? new Date(data.date).toUTCString() : new Date().toUTCString()}</pubDate>
      <guid isPermaLink="true">${siteUrl}/posts/${slug}</guid>
    </item>`;
}).join('');

const rss = `<?xml version="1.0" encoding="UTF-8" ?>
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

fs.writeFileSync(path.join(publicDirectory, 'rss.xml'), rss);
console.log('✅ rss.xml 생성 완료');
