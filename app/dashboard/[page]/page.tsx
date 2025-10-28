import { Blog } from "@/lib/types/blog";
import RecentBlogs from "@/components/dashboard/RecentBlogs";

export const revalidate = 60; // for SSG incremental updates

interface Props {
  params: { page: string };
}

export default async function DashboardPage({ params }: Props) {
  const page = Number((await params).page) || 1;
  const blogsPerPage = 6;

  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/manage-blogs?page=${page}&limit=${blogsPerPage}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-600">Failed to load dashboard data.</p>
      </div>
    );
  }

  const blogsData = await res.json();
  const blogs: Blog[] = blogsData.blogs || [];
  const totalPages = blogsData.totalPages || 1;

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <main className="flex flex-1">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-800 my-4 text-center">
            Dashboard - Page {page}
          </h2>

          <section className="shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.1)] max-h-[calc(100vh-150px)] p-6">
            <RecentBlogs blogs={blogs} page={page} totalPages={totalPages} />
          </section>
        </div>
      </main>
    </div>
  );
}
