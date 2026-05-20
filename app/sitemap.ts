import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = 'https://tony-almanac.vercel.app';

  // 1. 기본 고정 페이지
  const routes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/posts`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // 2. 작성한 블로그 포스트들을 자동으로 읽어와서 추가
  try {
    // 마크다운 파일들이 들어있는 폴더 경로 (보통 최상위 posts 폴더)
    // 만약 폴더 이름이 다르다면 'posts' 부분을 수정해 주세요.
    const postsDirectory = path.join(process.cwd(), 'posts'); 
    
    if (fs.existsSync(postsDirectory)) {
      const fileNames = fs.readdirSync(postsDirectory);
      
      fileNames.forEach((fileName) => {
        // .md 또는 .mdx 파일만 걸러냄
        if (fileName.endsWith('.md') || fileName.endsWith('.mdx')) {
          const slug = fileName.replace(/\.mdx?$/, ''); // 확장자 제거
          
          routes.push({
            url: `${siteUrl}/posts/${slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
          });
        }
      });
    }
  } catch (error) {
    console.error("사이트맵 포스트 불러오기 오류:", error);
  }

  return routes;
}
