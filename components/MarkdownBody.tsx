interface MarkdownBodyProps {
  children: React.ReactNode;
}

export default function MarkdownBody({ children }: MarkdownBodyProps) {
  return (
    // prose 클래스가 마크다운의 h1, p, ul 등의 스타일을 자동으로 예쁘게 잡아줍니다.
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <article className="prose prose-lg prose-blue mx-auto mt-8 
                          prose-headings:font-bold prose-a:text-blue-600
                          prose-img:rounded-xl">
        {children}
      </article>
    </div>
  );
}
