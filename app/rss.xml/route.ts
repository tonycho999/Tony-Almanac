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

  // 2. 실제 마크다운 파일에서 제목, 설명, 날짜, 슬러그(주소) 자동 추출
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
    // 3. 최신 날짜순 정렬
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // 🚀 새 블로그 주소로 변경하세요 (예: https://whisky-and-me.vercel.app)
  const blogUrl = 'https://새로운위스키블로그주소를여기에입력하세요.vercel.app';

  // 4. 추출한 데이터를 바탕으로 RSS XML 구조 생성
  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>WHISKY and ME</title>
        <link>${blogUrl}</link>
        <description>나의 일상이자 취미가 되어버린 위스키 기록</description>
        ${posts.map(post => `
          <item>
            <title><![CDATA[${post.title}]]></title>
            <link>${blogUrl}/posts/${post.slug}</link>
            <description><![CDATA[${post.description}]]></description>
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
