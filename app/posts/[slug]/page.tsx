import fs from 'fs';
import path from 'path';
import { MDXRemote } from 'next-mdx-remote/rsc';
import AffiliateAdCard from '@/components/AffiliateAdCard';
import { notFound } from 'next/navigation';

const components = { AffiliateAdCard };

export default function PostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const postsDirectory = path.join(process.cwd(), '_posts');
  let fullPath = path.join(postsDirectory, `${slug}.mdx`);
  
  if (!fs.existsSync(fullPath)) {
    fullPath = path.join(postsDirectory, `${slug}.md`);
  }

  if (!fs.existsSync(fullPath)) notFound();

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  // Frontmatter 제외하고 본문만 추출하는 단순화된 로직
  const content = fileContents.split('---').slice(2).join('---').trim();

  return (
    <div className="container mx-auto px-4 max-w-3xl py-10">
      <div className="prose prose-lg mx-auto">
        <MDXRemote source={content} components={components} />
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), '_posts');
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => ({
    slug: fileName.replace(/\.mdx?$/, ''),
  }));
}
