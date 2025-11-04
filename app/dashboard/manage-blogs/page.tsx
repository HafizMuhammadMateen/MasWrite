import BlogCard from "@/components/blogs/BlogCard";
import { Blog } from "@/lib/types/blog";
import ManageBlogHeaderWrapper from "@/components/blogs/ManageBlogHeaderWrapper";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { cookies } from "next/headers";

const blogsPerPage = 6;

export default async function ManageBlogsPage({ searchParams }: { searchParams: any }) {
  const page = parseInt((await searchParams).page) || 1;
  const q = (await searchParams).q || "";
  const status = (await searchParams).status || "";
  const category = (await searchParams).category || "";
  const sort = (await searchParams).sort || "";

  const params = new URLSearchParams({
    ...(q ? { q } : {}),
    ...(status ? { status } : {}),
    ...(category ? { category } : {}),
    ...(sort ? { sort } : {}),
    page: page.toString(),
    limit: blogsPerPage.toString(),
  });

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/manage-blogs?${params.toString()}`, {
    method: "GET",
    headers: {
      Cookie: (await cookies()).toString(),
    },
    cache: "no-store",
    credentials: "include",
  });

  const data = await res.json();
  const blogs: Blog[] = data.blogs || [];
  const totalPages = data.totalPages || 1;

  return (
    <div className="p-6 flex flex-col h-full overflow-hidden">
      <ManageBlogHeaderWrapper />

      {blogs.length > 0 ? (
        <div className="flex-1 overflow-y-auto space-y-4 p-2">
          {blogs.map((blog) => (
            <BlogCard
              key={blog._id}
              title={blog.title}
              slug={blog.slug}
              authorName={
                typeof blog.author === "string"
                  ? blog.author
                  : blog.author?.userName
              }
              excerpt={blog.content?.slice(0, 100)}
              publishedAt={blog.publishedAt}
              readingTime={blog.readingTime}
              views={blog.views}
              tags={blog.tags}
              isDashboardBlogs
              status={blog.status as "published" | "draft"}
              id={blog._id}
            />
          ))}

          <div className="flex justify-center gap-4 mt-4">
            <a
              href={`?page=${Math.max(page - 1, 1)}`}
              className={`cursor-pointer inline-flex items-center px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition ${page === 1 ? "opacity-50 pointer-events-none" : ""}`}
            >
              <FiChevronLeft className="w-4 h-4" /> Prev
            </a>

            <span className="text-gray-700 font-medium">
              {page} / {totalPages}
            </span>

            <a
              href={`?page=${Math.min(page + 1, totalPages)}`}
              className={`cursor-pointer inline-flex items-center px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition ${page === totalPages ? "opacity-50 pointer-events-none" : ""}`}
            >
              Next <FiChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      ) : (
        <div className="text-gray-500 bg-white rounded-lg shadow p-6 text-center">
          No blog posts found.
        </div>
      )}
    </div>
  );
}
