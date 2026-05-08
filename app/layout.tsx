import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  // 기본 URL 설정 (SEO 향상)
  metadataBase: new URL('https://whisky-and-me.vercel.app'),
  
  // 브라우저 탭에 표시될 제목 설정
  title: {
    template: '%s | WHISKY and ME',
    default: 'WHISKY and ME | A whisky journal',
  },
  
  // 구글 검색 결과에 노출될 설명
  description: 'A whisky journal: A hobby that became my daily ritual. Exploring the world of single malts and home bar gear.',
  
  // 소셜 미디어 공유 시 표시될 정보 (OpenGraph)
  openGraph: {
    title: 'WHISKY and ME',
    description: 'A whisky journal: A hobby that became my daily ritual.',
    url: 'https://whisky-and-me.vercel.app',
    siteName: 'WHISKY and ME',
    locale: 'en_US',
    type: 'website',
  },

  // 검색 엔진 인증 정보 유지
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
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        
        {/* 기존 인증 코드 유지 */}
        <div className="hidden" aria-hidden="true">
          Impact-Site-Verification: f0b8d1a5-b171-4135-a742-9dcc402f2f4f
        </div>
        
        <Footer />
      </body>
    </html>
  );
}
