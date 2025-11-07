import BlogCard from "@/components/blogs/BlogCard";
import { Blog } from "@/lib/types/blog";

interface RecentBlogsProps {
  blogs: Blog[];
}

export default function RecentBlogs({ blogs }: RecentBlogsProps) {
  const latestBlogs = blogs; // Show only latest 6(handled by route) updated blogs

  return (
    <section className="h-full md:col-span-2 bg-white p-6 rounded-lg shadow-md overflow-y-auto">
      <h2 className="text-2xl text-center font-semibold mb-4">Recent Published Blogs</h2>

      {latestBlogs.length === 0 ? (
        <div className="text-gray-500 bg-white rounded-lg shadow p-6 text-center">
          No blog posts yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {latestBlogs.map((blog) => (
            <BlogCard
              key={blog._id || blog.slug}
              id={blog._id}
              title={blog.title}
              slug={blog.slug}
              excerpt={blog.content.slice(0, 100)}
              authorName={
                typeof blog.author === "string"
                  ? blog.author
                  : blog.author?.userName || "Unknown"
              }
              readingTime={blog.readingTime}
              views={blog.views}
              tags={blog.tags}
              publishedAt={blog.publishedAt}
            />
          ))}
        </div>
      )}
    </section>
  );
}
