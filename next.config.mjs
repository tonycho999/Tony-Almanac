/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // 모든 외부 도메인의 이미지를 허용합니다. (가장 편한 방법)
      },
    ],
  },
};

export default nextConfig;
