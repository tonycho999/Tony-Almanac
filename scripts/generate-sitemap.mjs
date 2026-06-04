import fs from 'fs';
import path from 'path';

const siteUrl = 'https://tony-almanac.pages.dev';
const postsDirectory = path.join(process.cwd(), '_posts');

const postFilenames = fs.readdirSync(postsDirectory).filter(f => f.endsWith('.mdx'));

const postUrls = postFilenames.map(name => {
  const slug = name.replace(/\.mdx$/, '');
  return `
  <url>
    <loc>${siteUrl}/posts/${slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`;
}).join('');

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

fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), sitemap);
console.log('sitemap.xml 생성 완료');
