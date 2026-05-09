import fs from 'fs';
import path from 'path';
import { MDXRemote } from 'next-mdx-remote/rsc';
import AffiliateAdCard from '@/components/AffiliateAdCard';
import { notFound } from 'next/navigation';

const components = { AffiliateAdCard };

// 🚀 [SEO/GEO] 검색 엔진 및 AI 답변 엔진을 위한 동적 메타데이터 생성
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const postsDirectory = path.join(process.cwd(), '_posts');
  let fullPath = path.join(postsDirectory, `${slug}.mdx`);
  
  if (!fs.existsSync(fullPath)) {
    fullPath = path.join(postsDirectory, `${slug}.md`);
  }

  // 파일이 없으면 기본 에러 메타 반환
  if (!fs.existsSync(fullPath)) {
    return { title: 'Post Not Found' };
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  
  // 마크다운 상단(Frontmatter)에서 데이터 추출 (정규식 개선으로 따옴표 종류 무관하게 추출)
  const titleMatch = fileContents.match(/title:\s*['"]([^'"]+)['"]/);
  const descMatch = fileContents.match(/description:\s*['"]([^'"]+)['"]/);
  const dateMatch = fileContents.match(/date:\s*['"]([^'"]+)['"]/);
  
  const title = titleMatch ? titleMatch[1] : slug;
  // 기본 설명을 Tony's Almanac에 맞게 변경
  const description = descMatch ? descMatch[1] : "A curated post from Tony's Almanac. Exploring code, whisky, golf, and life.";
  const publishedDate = dateMatch ? dateMatch[1] : new Date().toISOString();

  return {
    title: title, 
    // 👉 app/layout.tsx의 template 설정 덕분에 "글 제목 | Tony's Almanac"으로 자동 완성됩니다.
    description: description,
    openGraph: {
      title: title,
      description: description,
      type: 'article', // [SEO] 글 페이지이므로 article 속성 부여
      publishedTime: publishedDate, // [SEO] 최신 글임을 어필
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
  
  // Frontmatter 추출 (본문 상단에 제목과 날짜를 예쁘게 표시하기 위함)
  const titleMatch = fileContents.match(/title:\s*['"]([^'"]+)['"]/);
  const dateMatch = fileContents.match(/date:\s*['"]([^'"]+)['"]/);
  const title = titleMatch ? titleMatch[1] : slug;
  const date = dateMatch ? dateMatch[1] : '';

  // Frontmatter 제외하고 본문만 추출하는 로직 방어코드 추가
  const contentParts = fileContents.split('---');
  const content = contentParts.length >= 3 ? contentParts.slice(2).join('---').trim() : fileContents;

  // 🤖 [AEO/GEO] 구조화된 데이터(JSON-LD) 생성: 구글 검색 시 '리치 스니펫'으로 돋보이게 함
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    datePublished: date,
    author: {
      '@type': 'Person',
      name: 'Tony Cho',
    },
  };

  return (
    // <article> 태그를 사용하여 독립적인 콘텐츠임을 검색엔진에 알림
    <article className="w-full max-w-3xl animate-fadeIn">
      
      {/* JSON-LD 스크립트 삽입 (눈에 보이지 않지만 검색 로봇이 읽어감) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* 포스트 헤더: 제목과 날짜 */}
      <header className="mb-10 pb-6 border-b border-gray-200">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
          {title}
        </h1>
        {date && (
          <time className="text-sm text-gray-500 font-medium">
            {new Date(date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
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
