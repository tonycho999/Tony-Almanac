import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-10 mt-20 border-t border-gray-200 bg-gray-50">
      <div className="container mx-auto text-center text-sm text-gray-500 px-4">
        <p>© {currentYear} My Ad Blog. All rights reserved.</p>
        <div className="mt-4 space-x-6">
          <a href="/rss.xml" className="hover:text-gray-900 transition-colors">
            RSS
          </a>
          <Link href="/privacy" className="hover:text-gray-900 underline underline-offset-2 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-gray-900 underline underline-offset-2 transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
