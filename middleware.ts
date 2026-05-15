import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Vercel이 제공하는 국가 코드 추출 (예: KR, PH, US 등)
  const country = request.headers.get('x-vercel-ip-country') || 'US';

  const response = NextResponse.next();

  // 클라이언트나 서버 컴포넌트에서 읽을 수 있도록 쿠키에 저장
  response.cookies.set('user-country', country);
  
  return response;
}

// 미들웨어가 실행될 경로 설정 (블로그 포스트 경로만 지정 가능)
export const config = {
  matcher: '/posts/:path*',
};
