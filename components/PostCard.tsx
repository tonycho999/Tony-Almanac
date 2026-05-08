import Link from 'next/link';

// 어떤 데이터를 받아올지 정의 (타입스크립트)
interface PostCardProps {
  title: string;
  description: string;
  date: string;
  slug: string;
}

export default function PostCard({ title, description, date, slug }: PostCardProps) {
  return (
    <article className="flex flex-col mb-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <time className="text-sm text-gray-500 mb-2">{date}</time>
      <Link href={`/posts/${slug}`}>
        <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600">
          {title}
        </h2>
      </Link>
      <p className="text-gray-600 line-clamp-3">
        {description}
      </p>
      <div className="mt-4">
        <Link href={`/posts/${slug}`} className="text-blue-600 text-sm font-semibold hover:underline">
          자세히 보기 →
        </Link>
      </div>
    </article>
  );
}
