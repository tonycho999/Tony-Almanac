// components/AffiliateLink.tsx
import { cookies } from 'next/headers';

interface LinkProps {
  ph: string;
  kr: string;
  global: string;
  label?: string;
}

export default function AffiliateLink({ ph, kr, global, label = "Buy Now" }: LinkProps) {
  const cookieStore = cookies();
  const country = cookieStore.get('user-country')?.value || 'US';

  const links: Record<string, string> = {
    PH: ph,
    KR: kr,
    Global: global,
  };

  const activeLink = links[country] || links.Global;

  return (
    <div className="my-4">
      <a 
        href={activeLink} 
        rel="nofollow" 
        className="inline-block px-6 py-3 bg-[#1a202c] text-white rounded-lg font-bold hover:bg-gold transition-colors"
      >
        {label}
      </a>
    </div>
  );
}
