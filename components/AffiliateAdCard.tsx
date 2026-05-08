interface AffiliateAdCardProps {
  brand: string;
  title: string;
  price: string;
  imageUrl: string;
  buyLink: string;
  themeColor?: string;
}

export default function AffiliateAdCard({
  brand,
  title,
  price,
  imageUrl,
  buyLink,
  themeColor = 'bg-gray-900',
}: AffiliateAdCardProps) {
  return (
    <div className="flex flex-col sm:flex-row border border-gray-200 rounded-2xl overflow-hidden shadow-sm my-8 bg-white">
      {/* 이미지 영역 */}
      <div className="relative w-full sm:w-48 h-48 bg-gray-50 flex-shrink-0 flex items-center justify-center p-4">
        {/* Next.js 설정 충돌을 피하기 위해 일반 img 태그를 사용합니다 */}
        <img
          src={imageUrl}
          alt={brand}
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* 텍스트 및 버튼 영역 */}
      <div className="p-6 flex flex-col justify-center flex-grow">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
          {brand}
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 mt-0">
          {title}
        </h3>
        <p className="text-gray-600 mb-4">{price}</p>
        
        {/* Involve Asia 구매 링크 버튼 */}
        <a
          href={buyLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-block text-center px-6 py-3 text-white font-semibold rounded-xl transition-opacity hover:opacity-90 ${themeColor}`}
        >
          Get Started Now
        </a>
      </div>
    </div>
  );
}
