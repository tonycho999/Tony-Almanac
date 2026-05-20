import fs from 'fs';
import path from 'path';
import matter from 'gray-matter'; // .mdx 파일의 제목, 날짜 등을 읽어오는 라이브러리

// 이 파일은 /rss.xml 경로를 최종적으로 생성합니다.
export async function GET() {
  const siteUrl = 'https://tony-almanac.vercel.app';
  
  // 1. '_posts' 폴더에서 모든 마크다운 파일(.mdx)을 읽어옵니다.
  const postsDirectory = path.join(process.cwd(), '_posts');
  const postFilenames = fs.readdirSync(postsDirectory);

  // 2. 각 파일의 내용을 읽어와서 RSS <item> 형식으로 만듭니다.
  const postItems = postFilenames.map((name) => {
    const filePath = path.join(postsDirectory, name);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents); // gray-matter로 파일 정보 추출
    const slug = name.replace(/\.mdx$/, '');

    return `
      <item>
        <title>${data.title || slug}</title>
        <link>${siteUrl}/posts/${slug}</link>
        <description>${data.description || content.substring(0, 150)}</description>
        <pubDate>${new Date(data.date).toUTCString()}</pubDate>
        <guid>${siteUrl}/posts/${slug}</guid>
      </item>
    `;
  }).join('');

  // 3. 최종 rss.xml 내용을 조립합니다.
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
      'Content-Type': 'application/xml',
    },
  });
}
