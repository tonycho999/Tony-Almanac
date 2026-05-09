import fs from 'fs';
import path from 'path';
import { MDXRemote } from 'next-mdx-remote/rsc';
import AffiliateAdCard from '@/components/AffiliateAdCard';
import { notFound } from 'next/navigation';

const components = { AffiliateAdCard };

// 홈페이지와 동일한 카테고리 뱃지 디자인 매핑
const categoryMap: Record<string, { name: string; color: string }> = {
  programming: { name: '💻 Programming', color: 'bg-blue-100 text-blue-800' },
  whisky: { name: '🥃 Whisky', color: 'bg-amber-100 text-amber-800' },
  golf: { name: '⛳ Golf', color: 'bg-green-100 text-green-800' },
  lions: { name: '🦁 Lions', color: 'bg-blue-100 text-blue-800' },
  travel: { name: '✈️ Travel', color: 'bg-teal-100 text-teal-800' },
  insights: { name: '💡 Insights', color: 'bg-purple-100 text-purple-800' },
  uncategorized: { name: 'Archive', color: 'bg-gray-100 text-gray-800' }
};

// 🚀 [SEO/GEO] 검색 엔진 및 AI 답변 엔진을 위한 동적 메타데이터 생성
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const postsDirectory = path.join(process.cwd(), '_posts');
  let fullPath = path.join(postsDirectory, `${slug}.mdx`);
  
  if (!fs.existsSync(fullPath)) {
    fullPath = path.join(postsDirectory, `${slug}.md`);
  }

  if (!fs.existsSync(fullPath)) {
    return { title: 'Post Not Found' };
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  
  const titleMatch = fileContents.match(/title:\s*['"]([^'"]+)['"]/);
  const descMatch = fileContents.match(/description:\s*['"]([^'"]+)['"]/);
  const dateMatch = fileContents.match(/date:\s*['"]([^'"]+)['"]/);
  
  const title = titleMatch ? titleMatch[1] : slug;
  const description = descMatch ? descMatch[1] : "A curated post from Tony's Almanac. Exploring code, whisky, golf, and life.";
  const publishedDate = dateMatch ? new Date(dateMatch[1]).toISOString() : new Date().toISOString();

  return {
    title: title, 
    description: description,
    openGraph: {
      title: title,
      description: description,
      type: 'article', 
      publishedTime: publishedDate, 
      authors: ['Tony Cho'],
      siteName: "Tony's Almanac",
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
    }
  };
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const postsDirectory = path.join(process.cwd(), '_posts');
  let fullPath = path.join(postsDirectory, `${slug}.mdx`);
  
  if (!fs.existsSync(fullPath)) {
    fullPath = path.join(postsDirectory, `${slug}.md`);
  }

  if (!fs.existsSync(fullPath)) notFound();

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  
  // Frontmatter 추출
  const titleMatch = fileContents.match(/title:\s*['"]([^'"]+)['"]/);
  const dateMatch = fileContents.match(/date:\s*['"]([^'"]+)['"]/);
  const categoryMatch = fileContents.match(/category:\s*['"]?([^'"\n]+)['"]?/i);

  const title = titleMatch ? titleMatch[1] : slug;
  const date = dateMatch ? dateMatch[1] : '';
  const category = categoryMatch ? categoryMatch[1].trim().toLowerCase() : 'uncategorized';
  
  // 카테고리 뱃지 정보 가져오기
  const catInfo = categoryMap[category] || categoryMap.uncategorized;

  const contentParts = fileContents.split('---');
  const content = contentParts.length >= 3 ? contentParts.slice(2).join('---').trim() : fileContents;

  // JSON-LD 구조화된 데이터
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    datePublished: date ? new Date(date).toISOString() : undefined,
    author: {
      '@type': 'Person',
      name: 'Tony Cho',
    },
  };

  return (
    <article className="w-full max-w-3xl animate-fadeIn">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* 🚀 포스트 헤더: 카테고리 뱃지, 제목, 날짜 및 시간 */}
      <header className="mb-10 pb-6 border-b border-gray-200">
        
        {/* 카테고리 뱃지 추가 */}
        <div className="mb-5">
          <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${catInfo.color}`}>
            {catInfo.name}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
          {title}
        </h1>
        
        {/* 시간 표시 포맷 변경 (Hour, Minute 포함) */}
        {date && (
          <div className="flex items-center text-sm text-gray-500 font-medium">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <time>
              {new Date(date).toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}
            </time>
          </div>
        )}
      </header>

      {/* 포스트 본문 영역 */}
      <div className="prose prose-lg prose-gray max-w-none hover:prose-a:text-blue-600 prose-img:rounded-xl prose-img:shadow-md">
        <MDXRemote source={content} components={components} />
      </div>
    </article>
  );
}

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), '_posts');
  
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames
      .filter((fileName) => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
      .map((fileName) => ({
        slug: fileName.replace(/\.mdx?$/, ''),
      }));
  } catch (error) {
    return [];
  }
}
