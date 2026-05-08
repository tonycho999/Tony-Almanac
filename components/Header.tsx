import Link from 'next/link';

export default function Header() {
  return (
    <header className="py-6 mb-10 border-b border-gray-200">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* 블로그 로고는 SEO를 위해 남겨두되, 다른 링크는 제거합니다. */}
      <Link href="/" className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
        Product Review
      </Link>
        
        {/* 네비게이션 메뉴 삭제됨 */}
      </div>
    </header>
  );
}
