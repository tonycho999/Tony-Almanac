import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 flex-shrink-0 z-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Tony's Almanac. All rights reserved.
        </p>
        <div className="flex space-x-6 text-sm text-gray-500">
          <Link href="/rss.xml" className="hover:text-gray-900 transition-colors">RSS</Link>
          <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
