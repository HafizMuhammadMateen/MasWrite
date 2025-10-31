import { cookies } from "next/headers";
import SummaryCards from "@/components/dashboard/SummaryCards";
import RecentBlogs from "@/components/dashboard/RecentBlogs";
import { FaFileAlt, FaCheckCircle, FaRegEdit } from "react-icons/fa";
import ChartsWrapper from "@/components/dashboard/ChartsWrapper";

export const revalidate = 60; // ISR (but effectively SSR due to cookies)

export default async function DashboardPage({ params }: { params: { page: string } }) {
  const page = Number((await params).page) || 1;
  const blogsPerPage = 6;

  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/manage-blogs?page=${page}&limit=${blogsPerPage}`,
    { 
      method: "GET",
      headers: { Cookie: (await cookies()).toString() }, // Dynamic SSR
    }
  );

  if (!res.ok) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-600">Failed to load dashboard data.</p>
      </div>
    );
  }

  const { 
    blogs = [], 
    totalPages, 
    totalBlogs, 
    publishedCount, 
    draftCount 
  } = await res.json();

  // Chart 1: Views per published date
  const viewsData = blogs
    .filter((b: any) => b.publishedAt && b.views != null)
    .map((b: any) => ({
      date: new Date(b.publishedAt).toLocaleDateString(),
      views: b.views,
    }));

  // Chart 2: Published count per day
  const publishedCountMap = blogs.reduce((acc: any, b: any) => {
    if (b.publishedAt) {
      const date = new Date(b.publishedAt).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
    }
    return acc;
  }, {});

  const publishedData = Object.entries(publishedCountMap).map(([date, count]) => ({
    date,
    count,
  }));

  const chartData = { viewsData, publishedData };

  return (
    <div className="h-full p-6 flex flex-col flex-grow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h2>

      <SummaryCards
        totalBlogs={totalBlogs || 0}
        published={publishedCount || 0}
        drafts={draftCount || 0}
        icons={[
          <FaFileAlt key="total" className="w-6 h-6" />,
          <FaCheckCircle key="published" className="w-6 h-6 text-green-500" />,
          <FaRegEdit key="draft" className="w-6 h-6 text-yellow-500" />,
        ]}
      />

      <ChartsWrapper chartData={chartData} />

      <section className="my-8">
        <RecentBlogs blogs={blogs} page={page} totalPages={totalPages} />
      </section>
    </div>
  );
}
