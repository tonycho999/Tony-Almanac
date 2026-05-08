import fs from 'fs';
import path from 'path';
import { MDXRemote } from 'next-mdx-remote/rsc';
import AffiliateAdCard from '@/components/AffiliateAdCard';
import { notFound } from 'next/navigation';

const components = { AffiliateAdCard };

// 🚀 구글 검색 노출을 위한 동적 메타데이터 생성 기능 추가
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
  
  // 마크다운 상단(Frontmatter)에서 데이터 추출
  const titleMatch = fileContents.match(/title:\s*'([^']+)'/) || fileContents.match(/title:\s*"([^"]+)"/);
  const descMatch = fileContents.match(/description:\s*'([^']+)'/) || fileContents.match(/description:\s*"([^"]+)"/);
  
  const title = titleMatch ? titleMatch[1] : slug;
  const description = descMatch ? descMatch[1] : 'A whisky journal: A hobby that became my daily ritual.';

  // 추출한 데이터를 구글 로봇에게 전달
  return {
    title: title, 
    // 👉 app/layout.tsx의 template 설정 덕분에 "글 제목 | WHISKY and ME"로 자동 완성됩니다.
    description: description,
    openGraph: {
      title: title,
      description: description,
      type: 'article', // 글 페이지이므로 article 속성 부여 (SEO 가점)
    },
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
  // Frontmatter 제외하고 본문만 추출하는 로직
  const content = fileContents.split('---').slice(2).join('---').trim();

  return (
    <div className="container mx-auto px-4 max-w-3xl py-10">
      <div className="prose prose-lg mx-auto prose-blue text-gray-800">
        <MDXRemote source={content} components={components} />
      </div>
    </div>
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
