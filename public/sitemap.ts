import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

export default function sitemap(): MetadataRoute.Sitemap {
  // 🚀 새로운 블로그 주소 적용
  const blogUrl = 'https://tony-almanac.vercel.app';
  const postsDirectory = path.join(process.cwd(), '_posts');
  
  let fileNames: string[] = [];
  try {
    fileNames = fs.readdirSync(postsDirectory);
  } catch (error) {
    console.log("No _posts directory found");
  }

  // 1. 개별 포스팅 주소 자동 생성
  const posts = fileNames
    .filter(fileName => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map(fileName => {
      const slug = fileName.replace(/\.mdx?$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      // 날짜 추출 (정규식 강화)
      const dateMatch = fileContents.match(/date:\s*['"]([^'"]+)['"]/);
      
      return {
        url: `${blogUrl}/posts/${slug}`,
        lastModified: dateMatch ? new Date(dateMatch[1]) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      };
    });

  // 2. 카테고리 페이지 주소 생성 (SEO 핵심)
  const categories = [
    'programming',
    'whisky',
    'golf',
    'lions',
    'travel',
    'insights'
  ].map((slug) => ({
    url: `${blogUrl}/category/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // 3. 기본 고정 페이지 (메인, 이용약관, 개인정보처리방침)
  const routes = [
    '',
    '/terms',
    '/privacy',
  ].map((route) => ({
    url: `${blogUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1.0 : 0.5, // 메인 페이지는 가장 높은 우선순위
  }));

  // 고정 페이지 + 카테고리 + 포스팅 주소를 모두 합쳐서 반환
  return [...routes, ...categories, ...posts];
}
