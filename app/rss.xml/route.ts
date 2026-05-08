import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  // 1. _posts 폴더 경로 설정 및 파일 읽어오기
  const postsDirectory = path.join(process.cwd(), '_posts');
  
  let fileNames: string[] = [];
  try {
    fileNames = fs.readdirSync(postsDirectory);
  } catch (error) {
    console.log("No _posts directory found");
  }

  // 2. 실제 마크다운 파일에서 데이터 추출
  const posts = fileNames
    .filter(fileName => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map(fileName => {
      const slug = fileName.replace(/\.mdx?$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      const titleMatch = fileContents.match(/title:\s*'([^']+)'/) || fileContents.match(/title:\s*"([^"]+)"/);
      const descMatch = fileContents.match(/description:\s*'([^']+)'/) || fileContents.match(/description:\s*"([^"]+)"/);
      const dateMatch = fileContents.match(/date:\s*'([^']+)'/) || fileContents.match(/date:\s*"([^"]+)"/);

      return {
        slug,
        title: titleMatch ? titleMatch[1] : slug,
        description: descMatch ? descMatch[1] : '',
        // RSS 표준 포맷인 UTC 문자열로 변환
        date: dateMatch ? new Date(dateMatch[1]).toUTCString() : new Date().toUTCString(),
      };
    })
    // 3. 최신 날짜 및 시간순 정렬 (최신글이 상단)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // 🚀 설정된 블로그 주소
  const blogUrl = 'https://whisky-and-me.vercel.app';

  // 4. RSS XML 구조 생성 (영문 슬로건 적용)
  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>WHISKY and ME</title>
        <link>${blogUrl}</link>
        <description>A whisky journal: A hobby that became my daily ritual</description>
        <language>en-us</language>
        <atom:link href="${blogUrl}/rss.xml" rel="self" type="application/rss+xml" />
        ${posts.map(post => `
          <item>
            <title><![CDATA[${post.title}]]></title>
            <link>${blogUrl}/posts/${post.slug}</link>
            <guid isPermaLink="true">${blogUrl}/posts/${post.slug}</guid>
            <description><![CDATA[${post.description}]]></description>
            <pubDate>${post.date}</pubDate>
          </item>
        `).join('')}
      </channel>
    </rss>`;

  return new NextResponse(rssFeed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=1200, stale-while-revalidate=600',
    },
  });
}
