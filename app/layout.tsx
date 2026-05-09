import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  // [SEO] 기본 URL 설정 (최신 배포 도메인 적용)
  metadataBase: new URL('https://tony-almanac.vercel.app'),
  
  // [SEO/GEO] 검색 결과 및 브라우저 탭에 표시될 제목 최적화
  title: {
    template: "%s | Tony's Almanac",
    default: "Tony's Almanac | Code, Whisky, Golf & Life",
  },
  
  // [AEO/GEO] AI 답변 엔진이 정체성을 명확히 파악하도록 설명 보강
  description: "Tony's Almanac: A curated digital archive exploring the intersection of professional programming, the refined world of single malt whisky, golf insights, the passion of Samsung Lions baseball, and global travel journals.",
  
  // [SEO] 검색 로봇 수집 및 인덱싱 설정
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // [SEO] 검색 엔진이 신뢰할 수 있는 키워드 최적화
  keywords: ['Programming', 'Software Development', 'Single Malt Whisky', 'Golf Tips', 'Samsung Lions', 'Travel Diary', 'Tony Cho'],
  
  authors: [{ name: 'Tony Cho' }],
  creator: 'Tony Cho',
  
  // [SEO] 소셜 미디어 미리보기(Open Graph) 설정
  openGraph: {
    title: "Tony's Almanac",
    description: "Curated insights on Code, Whisky, Golf, and Life by Tony.",
    url: 'https://tony-almanac.vercel.app',
    siteName: "Tony's Almanac",
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://tonycho.pages.dev/img/profile.png',
        width: 800,
        height: 600,
        alt: "Tony's Almanac Profile",
      },
    ],
  },

  // 구글 서치 콘솔 인증 정보 유지
  verification: {
    google: 'DH63NsFaoB_Vb_mnoq8fNircDFilQwQ5a_nnCYSEiL4',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* h-screen overflow-hidden: 브라우저 전체 스크롤을 막아 레이아웃을 고정합니다.
        flex flex-col: 상단(Header) - 중단(Content) - 하단(Footer)을 세로로 배치합니다.
      */}
      <body className={`${inter.className} flex flex-col h-screen overflow-hidden bg-white text-gray-900`}>
        
        {/* 상단 고정 헤더 */}
        <Header />

        {/* 중단 레이아웃: 사이드바와 메인 콘텐츠를 가로로 배치 */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* ⬅️ 좌측 사이드바: 고정형 (스크롤 없음) */}
          <aside className="w-72 flex-shrink-0 border-r border-gray-200 bg-gray-50 p-6 flex flex-col hidden md:flex">
            
            {/* 프로필 섹션: 제공해주신 외부 URL 적용 */}
            <div className="mb-10 text-center">
              <img 
                src="https://tonycho.pages.dev/img/profile.png" 
                alt="Tony Cho Profile" 
                className="w-28 h-28 mx-auto rounded-full object-cover mb-4 shadow-md border-2 border-white" 
              />
              <h2 className="text-xl font-bold text-gray-800 tracking-tight">Tony Cho</h2>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Software Engineer & <br />
                Enthusiast of Finer Details
              </p>
            </div>

            {/* 네비게이션: 6가지 핵심 카테고리 */}
            <nav className="flex-1 space-y-1">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 px-2">Archive Index</h3>
              
              <Link href="/category/programming" className="group flex items-center px-2 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                <span className="mr-3 group-hover:scale-110 transition-transform">💻</span> Programming
              </Link>
              
              <Link href="/category/whisky" className="group flex items-center px-2 py-2.5 text-sm font-medium text-gray-700 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-all">
                <span className="mr-3 group-hover:scale-110 transition-transform">🥃</span> Whisky Vault
              </Link>
              
              <Link href="/category/golf" className="group flex items-center px-2 py-2.5 text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all">
                <span className="mr-3 group-hover:scale-110 transition-transform">⛳</span> Golf Diary
              </Link>
              
              <Link href="/category/lions" className="group flex items-center px-2 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                <span className="mr-3 group-hover:scale-110 transition-transform">🦁</span> Lion's Roar
              </Link>
              
              <Link href="/category/travel" className="group flex items-center px-2 py-2.5 text-sm font-medium text-gray-700 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-all">
                <span className="mr-3 group-hover:scale-110 transition-transform">✈️</span> Global Wanderer
              </Link>
              
              <Link href="/category/insights" className="group flex items-center px-2 py-2.5 text-sm font-medium text-gray-700 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all">
                <span className="mr-3 group-hover:scale-110 transition-transform">💡</span> Daily Insights
              </Link>
            </nav>
          </aside>

          {/* ➡️ 우측 메인 영역: 독립적 스크롤 가능 */}
          <main className="flex-1 overflow-y-auto scroll-smooth">
            <div className="max-w-4xl mx-auto px-6 py-10 lg:px-12 lg:py-16">
              {children}
            </div>
          </main>
        </div>
        
        {/* 숨겨진 인증 태그 유지 */}
        <div className="hidden" aria-hidden="true">
          Impact-Site-Verification: f0b8d1a5-b171-4135-a742-9dcc402f2f4f
        </div>
        
        {/* 하단 고정 푸터 */}
        <Footer />
      </body>
    </html>
  );
}
