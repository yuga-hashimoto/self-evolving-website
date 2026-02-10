import Link from 'next/link';

export default function SupportEvolution() {
  return (
    <Link
      href="https://ko-fi.com/yugahashimoto"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105"
    >
      ☕ Support the Evolution
    </Link>
  );
}
