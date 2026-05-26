import fs from 'fs';
import path from 'path';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = 'https://tony-almanac.pages.dev';

  // 1. '_posts' 폴더에서 모든 마크다운 파일(.mdx)의 이름을 읽어옵니다.
  const postsDirectory = path.join(process.cwd(), '_posts');
  let postFilenames: string[] = [];
  
  try {
    postFilenames = fs.readdirSync(postsDirectory);
  } catch (error) {
    console.error("게시물 디렉토리를 읽는 중 오류 발생:", error);
    // 폴더가 없거나 에러가 날 경우 빈 배열 처리
  }

  // 2. 각 파일 이름에서 확장자를 제거하여 URL 객체 배열을 만듭니다.
  const postUrls = postFilenames.map((name) => {
    const slug = name.replace(/\.mdx$/, '');
    return {
      url: `${siteUrl}/posts/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    };
  });

  // 3. 메인 페이지와 포스트(게시글) 배열을 합쳐서 반환합니다.
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    ...postUrls,
  ];
}
