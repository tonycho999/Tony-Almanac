import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

export default function sitemap(): MetadataRoute.Sitemap {
  // 🚀 회원님의 진짜 블로그 주소
  const blogUrl = 'https://whisky-and-me.vercel.app';
  const postsDirectory = path.join(process.cwd(), '_posts');
  
  let fileNames: string[] = [];
  try {
    fileNames = fs.readdirSync(postsDirectory);
  } catch (error) {
    console.log("No _posts directory found");
  }

  // 1. _posts 폴더의 마크다운 파일을 읽어서 사이트맵 주소로 자동 변환
  const posts = fileNames
    .filter(fileName => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map(fileName => {
      const slug = fileName.replace(/\.mdx?$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      const dateMatch = fileContents.match(/date:\s*'([^']+)'/) || fileContents.match(/date:\s*"([^"]+)"/);
      
      return {
        url: `${blogUrl}/posts/${slug}`,
        lastModified: dateMatch ? new Date(dateMatch[1]) : new Date(),
      };
    });

  // 2. 블로그의 기본 고정 페이지들 (메인, 이용약관, 개인정보처리방침)
  const routes = [
    '',
    '/terms-of-service',
    '/privacy-policy',
  ].map((route) => ({
    url: `${blogUrl}${route}`,
    lastModified: new Date(),
  }));

  // 3. 고정 페이지 + 자동 생성된 포스팅 주소를 합쳐서 반환
  return [...routes, ...posts];
}
