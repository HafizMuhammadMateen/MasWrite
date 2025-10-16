export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="px-10 py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Auth-Module. All rights reserved.
      </div>
    </footer>
  );
}
