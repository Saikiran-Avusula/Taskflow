import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-5 bg-[#111318] border border-[#252830] rounded-sm text-center max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-[#ECEEF2]" style={{ fontFamily: 'Syne, sans-serif' }}>Page not found</h1>
        <p className="text-sm text-[#6B7280] mb-4">The page you are looking for does not exist.</p>
        <Link to="/" className="inline-block bg-[#A8FF3E] text-[#080A0E] px-4 py-2 border-none rounded-sm font-semibold text-sm cursor-pointer transition-all duration-150 hover:bg-[#6AAF2A]">
          Go home
        </Link>
      </div>
    </div>
  );
}
