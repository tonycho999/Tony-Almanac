import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tony-ad-blog.vercel.app'; // 실제 도메인으로 변경하세요.
  
  // 실제로는 게시글 목록을 가져와서 추가해야 합니다.
  const posts = ['seo-guide', 'aeo-tips'].map((slug) => ({
    url: `${baseUrl}/posts/${slug}`,
    lastModified: new Date(),
  }));

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/posts`, lastModified: new Date() },
    ...posts,
  ];
}
