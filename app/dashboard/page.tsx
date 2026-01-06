import { cookies } from "next/headers";
import SummaryCards from "@/components/dashboard/SummaryCards";
import RecentBlogs from "@/components/dashboard/RecentBlogs";
import ChartsWrapper from "@/components/dashboard/ChartsWrapper";
import { FaFileAlt, FaCheckCircle, FaRegEdit } from "react-icons/fa";

export const revalidate = 60;

interface DashboardPageProps {
  params: {
    page: string;
  };
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const page = parseInt(params.page) || 1;
  const cookieHeader = (await cookies()).toString();
  const fetchOptions = { method: "GET", headers: { Cookie: cookieHeader }, next: { revalidate: 60 } };
  const blogsPerPage = 6;

  const [analyticsResponse, recentBlogsResponse] = await Promise.all([
    fetch(`${process.env.NEXTAUTH_URL}/api/manage-blogs`, fetchOptions),
    fetch(`${process.env.NEXTAUTH_URL}/api/manage-blogs?page=${page}&limit=${blogsPerPage}`, fetchOptions),
  ]);

  if (!analyticsResponse.ok || !recentBlogsResponse.ok) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-600">Failed to load dashboard data.</p>
      </div>
    );
  }

  const {
    blogs: allBlogs = [],
    totalBlogs = 0,
    publishedCount = 0,
    draftCount = 0,
  } = await analyticsResponse.json();

  const { blogs = [] } = await recentBlogsResponse.json();

  // Chart 1: Views per published date
  const viewsData = allBlogs
    .filter((b: any) => b.publishedAt && b.views != null)
    .map((b: any) => ({
      date: new Date(b.publishedAt).toLocaleDateString(),
      views: b.views,
    }));

  // Chart 2: Published count per day
  const publishedData = Object.entries(
    allBlogs.reduce((acc: any, b: any) => {
      if (b.publishedAt) {
        const date = new Date(b.publishedAt).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
      }
      return acc;
    }, {})
  ).map(([date, count]) => ({ date, count }));

  const chartData = { viewsData, publishedData };

  return (
    <div className="h-full p-6 flex flex-col flex-grow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h2>

      <SummaryCards
        totalBlogs={totalBlogs}
        published={publishedCount}
        drafts={draftCount}
        icons={[
          <FaFileAlt key="total" className="w-6 h-6" />,
          <FaCheckCircle key="published" className="w-6 h-6 text-green-500" />,
          <FaRegEdit key="draft" className="w-6 h-6 text-yellow-500" />,
        ]}
      />

      <ChartsWrapper chartData={chartData} />

      <section className="my-8">
        <RecentBlogs blogs={blogs} />
      </section>
    </div>
  );
}
