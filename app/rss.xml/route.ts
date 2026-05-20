// 이 파일은 /rss.xml 경로를 생성합니다.
export async function GET() {
  const siteUrl = 'https://tony-almanac.vercel.app';
  
  // 간단한 RSS 피드 예시
  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>Tony's Almanac</title>
  <link>${siteUrl}</link>
  <description>A collection of stories about Tony's minor experiences.</description>
  <item>
    <title>Welcome to my blog</title>
    <link>${siteUrl}/posts</link>
    <description>This is the first item of the RSS feed.</description>
    <pubDate>${new Date().toUTCString()}</pubDate>
  </item>
</channel>
</rss>`;

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
