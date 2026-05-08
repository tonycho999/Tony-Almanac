import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';
import Image from 'next/image';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // 💡 [추가됨] 마크다운의 큰 제목(##) 처리 - 세련된 푸른색 & 밑줄 효과
    h2: ({ children, ...props }: any) => (
      <h2 
        className="text-blue-700 text-2xl font-bold mt-12 mb-4 pb-2 border-b border-gray-200" 
        {...props}
      >
        {children}
      </h2>
    ),

    // 1. 링크 처리 (내부/외부 링크 자동 구분)
    a: ({ href, children, ...props }: any) => {
      const isInternalLink = href && (href.startsWith('/') || href.startsWith('#'));
      if (isInternalLink) {
        return (
          <Link href={href} className="text-blue-600 underline hover:text-blue-800" {...props}>
            {children}
          </Link>
        );
      }
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800" {...props}>
          {children}
        </a>
      );
    },

    // 2. 마크다운 기본 이미지 (![설명](주소)) 처리
    img: ({ src, alt, ...props }: any) => (
      <div className="relative w-full h-auto my-8 overflow-hidden rounded-lg shadow-lg">
        <img
          src={src}
          alt={alt || 'Blog image'}
          className="w-full object-cover"
          referrerPolicy="no-referrer"
          {...props}
        />
      </div>
    ),

    // 3. MDX 파일에서 대문자 <Image /> 태그 직접 처리
    Image: (props: any) => <Image {...props} />,

    // 기존 설정 유지
    ...components,
  };
}
