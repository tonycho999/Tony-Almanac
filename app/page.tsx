import fs from 'fs';
import path from 'path';
import Link from 'next/link';

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

  // 파일 목록에서 메타데이터(제목, 설명, 날짜) 추출하기
  const posts = fileNames
    .filter(fileName => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map(fileName => {
      const slug = fileName.replace(/\.mdx?$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      // 마크다운 상단(Frontmatter)에서 데이터 추출
      const titleMatch = fileContents.match(/title:\s*'([^']+)'/) || fileContents.match(/title:\s*"([^"]+)"/);
      const descMatch = fileContents.match(/description:\s*'([^']+)'/) || fileContents.match(/description:\s*"([^"]+)"/);
      const dateMatch = fileContents.match(/date:\s*'([^']+)'/) || fileContents.match(/date:\s*"([^"]+)"/);

      return {
        slug,
        title: titleMatch ? titleMatch[1] : slug,
        description: descMatch ? descMatch[1] : '',
        date: dateMatch ? dateMatch[1] : '',
      };
    })
    // 최신 날짜순으로 정렬
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="container mx-auto px-4 max-w-3xl min-h-[60vh] pt-10">
      
      {/* 🚀 수정된 부분: 그라데이션 타이틀과 인디고 서브타이틀 */}
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
        My whisky story
      </h1>
      
      <div className="space-y-6">
        {posts.map(post => (
          <Link href={`/posts/${post.slug}`} key={post.slug} className="block group">
            <div className="border border-gray-200 p-6 rounded-2xl hover:border-blue-500 hover:shadow-md transition-all bg-white">
              <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 mb-2 transition-colors">
                {post.title}
              </h2>
              {post.description && (
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {post.description}
                </p>
              )}
              <div className="text-sm font-medium text-gray-400">
                {post.date}
              </div>
            </div>
          </Link>
        ))}

        {posts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            아직 작성된 포스팅이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
