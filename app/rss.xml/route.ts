import { NextResponse } from 'next/server';

export async function GET() {
  // 실제 환경에서는 마크다운 파일이나 데이터베이스에서 글 목록을 불러와야 합니다.
  // 여기서는 예시로 하드코딩된 데이터를 사용합니다.
  const posts = [
    {
      title: "첫 번째 제휴 상품 리뷰",
      description: "필리핀 Shopee에서 구매할 수 있는 최고의 가성비 상품입니다.",
      slug: "first-affiliate-review",
      date: new Date().toUTCString()
    }
  ];

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>My Ad Blog</title>
        <link>https://tony-ad-blog.vercel.app</link>
        <description>Performance marketing insights and reviews.</description>
        ${posts.map(post => `
          <item>
            <title>${post.title}</title>
            <link>https://tony-ad-blog.vercel.app/posts/${post.slug}</link>
            <description>${post.description}</description>
            <pubDate>${post.date}</pubDate>
          </item>
        `).join('')}
      </channel>
    </rss>`;

  return new NextResponse(rssFeed, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
