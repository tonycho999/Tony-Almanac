import fs from 'fs';
import path from 'path';
import matter from 'gray-matter'; // .mdx 파일의 제목, 날짜 등을 읽어오는 라이브러리

// 💡 Cloudflare Pages 환경에서 빌드 시점에 이 파일을 정적(Static) 파일로 미리 구워내도록 강제합니다.
// 이 설정이 있어야 fs 모듈로 인한 런타임 에러를 막을 수 있습니다.
export const dynamic = 'force-static';

export async function GET() {
  // 끝의 슬래시를 제거하여 주소 중복을 방지합니다.
  const siteUrl = 'https://tony-almanac.pages.dev';
  
  // 1. '_posts' 폴더에서 모든 마크다운 파일(.mdx)을 읽어옵니다.
  const postsDirectory = path.join(process.cwd(), '_posts');
  let postFilenames: string[] = [];
  
  try {
    postFilenames = fs.readdirSync(postsDirectory);
  } catch (error) {
    console.error("RSS 피드 생성 중 게시물 폴더 읽기 실패:", error);
  }

  // 2. 각 파일의 내용을 읽어와서 RSS <item> 형식으로 만듭니다.
  const postItems = postFilenames.map((name) => {
    const filePath = path.join(postsDirectory, name);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents); // gray-matter로 파일 정보 추출
    const slug = name.replace(/\.mdx$/, '');

    // XML 문법 오류를 방지하기 위해 본문 내 특수문자를 최소한으로 치환하거나 다듬어주는 것이 좋습니다.
    const descriptionText = data.description || content.substring(0, 150).replace(/[<>&'"]/g, '');

    return `
      <item>
        <title>${data.title || slug}</title>
        <link>${siteUrl}/posts/${slug}</link>
        <description>${descriptionText}</description>
        <pubDate>${data.date ? new Date(data.date).toUTCString() : new Date().toUTCString()}</pubDate>
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
