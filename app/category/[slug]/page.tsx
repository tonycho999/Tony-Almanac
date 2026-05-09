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

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const displayTitle = categoryTitles[slug] || 'Archive';

  return {
    title: displayTitle,
    description: `Read all posts about ${displayTitle.replace(/[^a-zA-Z\s]/g, '').trim()} in Tony's Almanac.`,
  };
}

function getPostsByCategory(categorySlug: string) {
  const postsDirectory = path.join(process.cwd(), '_posts');
  
  if (!fs.existsSync(postsDirectory)) return [];

  const fileNames = fs.readdirSync(postsDirectory);
  
  const posts = fileNames
    .filter((fileName) => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map((fileName) => {
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      const titleMatch = fileContents.match(/title:\s*['"]([^'"]+)['"]/);
      const descMatch = fileContents.match(/description:\s*['"]([^'"]+)['"]/);
      const dateMatch = fileContents.match(/date:\s*['"]([^'"]+)['"]/);
      const categoryMatch = fileContents.match(/category:\s*['"]?([^'"\n]+)['"]?/i);

      return {
        slug: fileName.replace(/\.mdx?$/, ''),
        title: titleMatch ? titleMatch[1] : 'Untitled Post',
        description: descMatch ? descMatch[1] : '',
        date: dateMatch ? dateMatch[1] : '',
        category: categoryMatch ? categoryMatch[1].trim().toLowerCase() : 'uncategorized',
      };
    })
    .filter((post) => post.category === categorySlug.toLowerCase())
    // 🚀 최신 글이 위로, 오래된 글이 아래로 가도록 정렬 (내림차순)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  
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

      {/* 글 목록 표시 영역: 1단(한 줄) 레이아웃으로 변경 (space-y-6 사용) */}
      {posts.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-500 font-medium">아직 작성된 글이 없습니다.</p>
          <p className="text-sm text-gray-400 mt-2">새로운 기록이 곧 업데이트될 예정입니다.</p>
        </div>
      ) : (
        <div className="flex flex-col space-y-6">
          {posts.map((post) => (
            <Link href={`/posts/${post.slug}`} key={post.slug} className="group block bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-300 transition-all">
              
              {/* 🚀 날짜와 시간을 함께 표시 */}
              {post.date && (
                <time className="text-sm font-semibold text-gray-500 tracking-wider mb-3 block">
                  {new Date(post.date).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                </time>
              )}
              
              <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h2>
              
              <p className="text-base text-gray-600 mb-5 line-clamp-3">
                {post.description}
              </p>
              
              <div className="inline-flex items-center text-sm font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                Read more →
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export async function generateStaticParams() {
  return Object.keys(categoryTitles).map((slug) => ({
    slug,
  }));
}
