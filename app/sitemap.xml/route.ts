import fs from 'fs';
import path from 'path';

// 이 파일은 /sitemap.xml 경로를 최종적으로 생성합니다.
export async function GET() {
  const siteUrl = 'https://tony-almanac.vercel.app';

  // 1. 'posts' 폴더에서 모든 마크다운 파일(.mdx)의 이름을 읽어옵니다.
  //    (만약 폴더 이름이나 확장자가 다르다면 이 부분을 수정해야 합니다.)
  const postsDirectory = path.join(process.cwd(), '_posts');
  const postFilenames = fs.readdirSync(postsDirectory);

  // 2. 각 파일 이름에서 확장자를 제거하여 URL 경로(slug)를 만듭니다.
  const postUrls = postFilenames.map((name) => {
    const slug = name.replace(/\.mdx$/, '');
    return `
      <url>
        <loc>${siteUrl}/posts/${slug}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.7</priority>
      </url>
    `;
  });

  // 3. 최종 sitemap.xml 내용을 조립합니다. (기본 페이지 + 모든 글 목록)
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${postUrls.join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
