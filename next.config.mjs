/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // ✨ Cloudflare Pages 정적 배포를 위한 핵심 설정
  images: {
    unoptimized: true, // 정적 배포 시 이미지 최적화 끄기 (필수)
  },
};

export default nextConfig;
