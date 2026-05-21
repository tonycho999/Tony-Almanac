'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 w-full flex-shrink-0 z-10">
      <div className="flex justify-between items-center px-6 py-4 lg:px-8 max-w-7xl mx-auto">
        <Link 
          href="/" 
          className="text-2xl font-extrabold tracking-tighter text-gray-900 hover:text-gray-600 transition-colors flex items-center gap-2"
        >
          <span className="text-xl">📓</span> 
          Tony's Almanac
        </Link>

        
          href="https://tony-almanac.blogspot.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1"
        >
          <span>📝</span> Blog
        </a>
      </div>
    </header>
  );
}
