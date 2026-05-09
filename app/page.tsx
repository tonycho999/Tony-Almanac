import fs from 'fs';
import path from 'path';
import Link from 'next/link';

// 카테고리별 뱃지 디자인(이름, 색상) 매핑
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
  // _posts 폴더 경로 설정
  const postsDirectory = path.join(process.cwd(), '_posts');
  
  let fileNames: string[] = [];
  try {
    // 폴더 내의 파일 목록 읽어오기
    fileNames = fs.readdirSync(postsDirectory);
  } catch (error) {
    console.log("No _posts directory found");
  }

  // 파일 목록에서 메타데이터(제목, 설명, 날짜, 카테고리) 추출하기
  const posts = fileNames
    .filter(fileName => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map(fileName => {
      const slug = fileName.replace(/\.mdx?$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      // 마크다운 상단(Frontmatter)에서 데이터 추출 (정규식 개선)
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
    // 최신 날짜순으로 정렬
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="w-full animate-fadeIn">
      
      {/* 🚀 타이틀 영역: Tony's Almanac 컨셉에 맞게 세련된 텍스트로 변경 */}
      <header className="mb-12 pb-6 border-b border-gray-200">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Latest Entries
        </h1>
        <p className="text-gray-500 mt-2">
          The most recent thoughts and records from Tony's Almanac.
        </p>
      </header>
      
      {/* 글 목록 표시 영역: 카테고리 페이지와 동일한 카드 그리드 디자인 적용 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map(post => {
          // 카테고리 뱃지 정보 가져오기 (매핑되지 않은 카테고리면 기본값 사용)
          const catInfo = categoryMap[post.category] || categoryMap.uncategorized;

          return (
            <Link href={`/posts/${post.slug}`} key={post.slug} className="group flex flex-col h-full bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-300 transition-all">
              
              {/* 상단: 카테고리 뱃지와 날짜 나란히 배치 */}
              <div className="flex justify-between items-center mb-3">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${catInfo.color}`}>
                  {catInfo.name}
                </span>
                {post.date && (
                  <time className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </time>
                )}
              </div>

              {/* 제목 & 설명 */}
              <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 mb-2 transition-colors line-clamp-2">
                {post.title}
              </h2>
              <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">
                {post.description}
              </p>
              
              {/* 하단 읽기 버튼 */}
              <div className="mt-auto text-sm font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                Read more →
              </div>
            </Link>
          );
        })}

        {posts.length === 0 && (
          <div className="col-span-1 md:col-span-2 text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500 font-medium">아직 작성된 포스팅이 없습니다.</p>
            <p className="text-sm text-gray-400 mt-2">새로운 기록이 곧 업데이트될 예정입니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
