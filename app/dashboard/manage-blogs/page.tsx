import { Blog } from "@/lib/types/blog";
import { cookies } from "next/headers";
import ManageBlogsListWrapper from "@/components/blogs/ManageBlogsListWrapper";

const blogsPerPage = 6;

interface ManageBlogsPageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function ManageBlogsPage({ searchParams }: ManageBlogsPageProps) {
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
      <ManageBlogsListWrapper blogs={blogs} totalPages={totalPages} page={page} searchParams={params} />
    </div>
  );
}
