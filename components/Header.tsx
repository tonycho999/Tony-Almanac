import Link from 'next/link';

export default function Header() {
  return (
    // 상단에 고정되며 전체 레이아웃의 첫 번째 블록 역할을 합니다 (flex-shrink-0)
    <header className="bg-white border-b border-gray-200 w-full flex-shrink-0 z-10">
      <div className="flex justify-between items-center px-6 py-4 lg:px-8 max-w-7xl mx-auto">
        
        {/* 블로그 타이틀: SEO를 위해 최상위 링크 유지 */}
        <Link 
          href="/" 
          className="text-2xl font-extrabold tracking-tighter text-gray-900 hover:text-gray-600 transition-colors flex items-center gap-2"
        >
          {/* 타이틀 앞에 작은 아이콘(책 또는 만년필 등)을 넣어 포인트를 줍니다 */}
          <span className="text-xl">📓</span> 
          Tony's Almanac
        </Link>
        
        {/* 네비게이션은 좌측 사이드바에 배치했으므로 여기서는 생략합니다. 
          추후 모바일 화면을 위한 '햄버거 메뉴' 버튼을 이곳에 추가할 수 있습니다. 
        */}
      </div>
    </header>
  );
}
