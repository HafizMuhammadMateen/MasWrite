import PublicNavbar from "@/components/layout/PublicNavbar";

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />
      <main>{children}</main>
    </div>
  );
}
