// components/AffiliateLink.tsx

// 'cookies'를 사용하는 모든 코드를 삭제합니다.
// import { cookies } from 'next/headers';

interface LinkProps {
  ph: string;
  kr: string;
  global: string;
  label?: string;
}

export default function AffiliateLink({ ph, kr, global, label = "Buy Now" }: LinkProps) {
  // 쿠키에서 국가를 확인하는 동적 로직을 삭제합니다.
  // const cookieStore = cookies();
  // const country = cookieStore.get('user-country')?.value || 'US';

  // 정적 사이트에서는 모든 사용자에게 'global' 링크를 기본으로 보여줍니다.
  const activeLink = global;

  return (
    <div className="my-4">
      <a 
        href={activeLink} 
        rel="nofollow noopener noreferrer" // rel 속성 보강
        target="_blank" // 새 탭에서 열리도록 target 추가
        className="inline-block px-6 py-3 bg-[#1a202c] text-white rounded-lg font-bold hover:bg-gold transition-colors"
      >
        {label}
      </a>
    </div>
  );
}
