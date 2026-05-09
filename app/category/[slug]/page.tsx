import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// 카테고리별 표시될 예쁜 제목 매핑
const categoryTitles: Record<string, string> = {
  programming: '💻 Programming Archive',
  whisky: '🥃 Whisky Vault',
  golf: '⛳ Golf Diary',
  lions: "🦁 Lion's Roar",
  travel: '✈️ Global Wanderer',
  insights: '💡 Daily Insights',
};

// 🚀 [SEO] 각 카테고리 페이지별 동적 메타데이터 생성
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const displayTitle = categoryTitles[slug] || 'Archive';

  return {
    title: displayTitle,
    description: `Read all posts about ${displayTitle.replace(/[^a-zA-Z\s]/g, '').trim()} in Tony's Almanac.`,
  };
}

// _posts 폴더에서 특정 카테고리의 글만 필터링하는 함수
function getPostsByCategory(categorySlug: string) {
  const postsDirectory = path.join(process.cwd(), '_posts');
  
  if (!fs.existsSync(postsDirectory)) return [];

  const fileNames = fs.readdirSync(postsDirectory);
  
  const posts = fileNames
    .filter((fileName) => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map((fileName) => {
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      // 정규식으로 Frontmatter 데이터 추출
      const titleMatch = fileContents.match(/title:\s*['"]([^'"]+)['"]/);
      const descMatch = fileContents.match(/description:\s*['"]([^'"]+)['"]/);
      const dateMatch = fileContents.match(/date:\s*['"]([^'"]+)['"]/);
      
      // ✨ 핵심: category 속성 추출 (작은따옴표, 큰따옴표, 따옴표 없음 모두 대응)
      const categoryMatch = fileContents.match(/category:\s*['"]?([^'"\n]+)['"]?/i);

      return {
        slug: fileName.replace(/\.mdx?$/, ''),
        title: titleMatch ? titleMatch[1] : 'Untitled Post',
        description: descMatch ? descMatch[1] : '',
        date: dateMatch ? dateMatch[1] : '',
        category: categoryMatch ? categoryMatch[1].trim().toLowerCase() : 'uncategorized',
      };
    })
    // URL로 전달된 카테고리(slug)와 파일에 적힌 카테고리가 일치하는 것만 필터링
    .filter((post) => post.category === categorySlug.toLowerCase())
    // 최신 글이 맨 위로 오도록 날짜순 정렬
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return posts;
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  
  // 정의되지 않은 이상한 카테고리 주소로 들어오면 404 처리
  if (!Object.keys(categoryTitles).includes(slug)) {
    notFound();
  }

  const displayTitle = categoryTitles[slug];
  const posts = getPostsByCategory(slug);

  return (
    <div className="w-full animate-fadeIn">
      {/* 카테고리 헤더 */}
      <header className="mb-12 pb-6 border-b border-gray-200">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {displayTitle}
        </h1>
        <p className="text-gray-500 mt-2">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'} available
        </p>
      </header>

      {/* 글 목록 표시 영역 */}
      {posts.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-500 font-medium">아직 작성된 글이 없습니다.</p>
          <p className="text-sm text-gray-400 mt-2">새로운 기록이 곧 업데이트될 예정입니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <Link href={`/posts/${post.slug}`} key={post.slug} className="group flex flex-col h-full bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-300 transition-all">
              {post.date && (
                <time className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </time>
              )}
              <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                {post.title}
              </h2>
              <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">
                {post.description}
              </p>
              <div className="mt-auto text-sm font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                Read more →
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// Vercel 배포 시 정적 페이지(Static Site Generation)로 사전 렌더링
export async function generateStaticParams() {
  return Object.keys(categoryTitles).map((slug) => ({
    slug,
  }));
}
