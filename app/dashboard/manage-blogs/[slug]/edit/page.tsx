import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import BlogEditor from "@/components/blogs/BlogEditor";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditBlogPage({ params }: PageProps) {
  const { slug } = await params;
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/manage-blogs/${slug}`, {
    headers: { Cookie: (await cookies()).toString() },
  });

  if (!res.ok) notFound();
  const blog = await res.json();

  return <BlogEditor initialData={blog} slug={slug} />;
}
