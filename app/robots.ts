import { MetadataRoute } from 'next';

// 이 파일은 robots.txt를 생성합니다.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://tony-almanac.vercel.app/sitemap.xml',
  };
}
