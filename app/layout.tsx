import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // (기존에 설정된 폰트가 있다면 그대로 유지하세요)
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

// 👇 이 부분을 수정합니다.
export const metadata: Metadata = {
  title: 'My Ad Blog',
  description: 'Performance marketing insights and reviews.',
  verification: {
    google: 'DH63NsFaoB_Vb_mnoq8fNircDFilQwQ5a_nnCYSEiL4', // 발급받으신 코드를 여기에 넣습니다.
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
        <div className="hidden">
          Impact-Site-Verification: f0b8d1a5-b171-4135-a742-9dcc402f2f4f
        </div>
        <Footer />
      </body>
    </html>
  );
}
