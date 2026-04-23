import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white shrink-0">
      <div className="px-6 h-9 flex items-center justify-between text-xs text-gray-400">
        <span>© {new Date().getFullYear()} MasWrite</span>
        <Link
          href="/blogs"
          target="_blank"
          className="hover:text-gray-600 transition-colors"
        >
          View blog →
        </Link>
      </div>
    </footer>
  );
}
