import BlogCard from "@/components/blogs/BlogCard";
import BlogPagination from "@/components/blogs/BlogPagination";
import { Blog } from "@/lib/types/blog";
import ManageBlogHeader from "@/components/blogs/ManageBlogHeader";
import { cookies } from "next/headers";

const blogsPerPage = 6;

export default async function ManageBlogsPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const paramsObj = await searchParams;

  const page = parseInt(paramsObj.page || "1");
  const q = paramsObj.q || "";
  const status = paramsObj.status || "";
  const category = paramsObj.category || "";
  const sort = paramsObj.sort || "";

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
    headers: { Cookie: (await cookies()).toString() },
    credentials: "include",
  });

  const data = await res.json();
  const blogs: Blog[] = data.blogs || [];
  const totalPages = data.totalPages || 1;

  return (
    <div className="p-6 flex flex-col h-full overflow-hidden">
      <ManageBlogHeader />

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

          <BlogPagination
            page={page}
            totalPages={totalPages}
            searchParams={params}
          />
        </div>
      ) : (
        <div className="text-gray-500 bg-white rounded-lg shadow p-6 text-center">
          No blog posts found.
        </div>
      )}
    </div>
  );
}
