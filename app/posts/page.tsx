import { redirect } from 'next/navigation';

export default function PostsPage() {
  // 이 경로로 들어오면 바로 홈으로 보냅니다.
  redirect('/');
  
  // 리다이렉트되므로 아래 내용은 렌더링되지 않습니다.
  return null;
}
