/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://tony-almanac.vercel.app',
  generateRobotsTxt: true,
  // rss.xml도 정적 파일로 함께 생성하도록 설정 추가
  additionalPaths: async (config) => [
    await config.transform(config, '/rss.xml'),
  ],
};
