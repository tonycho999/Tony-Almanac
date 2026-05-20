export async function GET() {
  const robots = `User-agent: *
Allow: /
Sitemap: https://tony-almanac.vercel.app/sitemap.xml`;

  return new Response(robots, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
