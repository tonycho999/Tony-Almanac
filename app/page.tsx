import fs from 'fs';
import path from 'path';
import Link from 'next/link';

// 카테고리별 뱃지 디자인 매핑
const categoryMap: Record<string, { name: string; color: string }> = {
  programming: { name: '💻 Programming', color: 'bg-blue-100 text-blue-800' },
  whisky: { name: '🥃 Whisky', color: 'bg-amber-100 text-amber-800' },
  golf: { name: '⛳ Golf', color: 'bg-green-100 text-green-800' },
  lions: { name: '🦁 Lions', color: 'bg-blue-100 text-blue-800' },
  travel: { name: '✈️ Travel', color: 'bg-teal-100 text-teal-800' },
  insights: { name: '💡 Insights', color: 'bg-purple-100 text-purple-800' },
  uncategorized: { name: 'Archive', color: 'bg-gray-100 text-gray-800' }
};

export default function HomePage() {
  const postsDirectory = path.join(process.cwd(), '_posts');
  
  let fileNames: string[] = [];
  try {
    fileNames = fs.readdirSync(postsDirectory);
  } catch (error) {
    console.log("No _posts directory found");
  }

  const posts = fileNames
    .filter(fileName => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map(fileName => {
      const slug = fileName.replace(/\.mdx?$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      const titleMatch = fileContents.match(/title:\s*['"]([^'"]+)['"]/);
      const descMatch = fileContents.match(/description:\s*['"]([^'"]+)['"]/);
      const dateMatch = fileContents.match(/date:\s*['"]([^'"]+)['"]/);
      const categoryMatch = fileContents.match(/category:\s*['"]?([^'"\n]+)['"]?/i);

      return {
        slug,
        title: titleMatch ? titleMatch[1] : slug,
        description: descMatch ? descMatch[1] : '',
        date: dateMatch ? dateMatch[1] : '',
        category: categoryMatch ? categoryMatch[1].trim().toLowerCase() : 'uncategorized',
      };
    })
    // 🚀 최신 글이 위로, 오래된 글이 아래로 가도록 정렬 (내림차순)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="w-full animate-fadeIn">
      
      <header className="mb-12 pb-6 border-b border-gray-200">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Latest Entries
        </h1>
        <p className="text-gray-500 mt-2">
          The most recent thoughts and records from Tony's Almanac.
        </p>
      </header>
      
      {/* 🚀 1단(한 줄) 레이아웃으로 변경 (space-y-6 사용) */}
      <div className="flex flex-col space-y-6">
        {posts.map(post => {
          const catInfo = categoryMap[post.category] || categoryMap.uncategorized;

          return (
            <Link href={`/posts/${post.slug}`} key={post.slug} className="group block bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-300 transition-all">
              
              {/* 상단: 카테고리 뱃지와 날짜/시간 나란히 배치 */}
              <div className="flex justify-between items-center mb-4">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${catInfo.color}`}>
                  {catInfo.name}
                </span>
                
                {/* 🚀 날짜와 시간(시:분)을 함께 표시 */}
                {post.date && (
                  <time className="text-sm font-semibold text-gray-500 tracking-wider">
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
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                {post.title}
              </h2>
              <p className="text-base text-gray-600 mb-5 line-clamp-3">
                {post.description}
              </p>
              
              <div className="inline-flex items-center text-sm font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                Read more →
              </div>
            </Link>
          );
        })}

        {posts.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500 font-medium">아직 작성된 포스팅이 없습니다.</p>
            <p className="text-sm text-gray-400 mt-2">새로운 기록이 곧 업데이트될 예정입니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
