import { cookies } from "next/headers";
import SummaryCards from "@/components/dashboard/SummaryCards";
import RecentBlogs from "@/components/dashboard/RecentBlogs";
import ChartsWrapper from "@/components/dashboard/ChartsWrapper";
import Link from "next/link";
import { PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";

export const revalidate = 60;

export default async function DashboardPage() {
  const cookieHeader = (await cookies()).toString();
  const fetchOptions: RequestInit = {
    method: "GET",
    headers: { Cookie: cookieHeader },
    next: { revalidate: 60 },
  };

  const [analyticsRes, recentRes] = await Promise.all([
    fetch(`${process.env.NEXTAUTH_URL}/api/manage-blogs`, fetchOptions),
    fetch(`${process.env.NEXTAUTH_URL}/api/manage-blogs?page=1&limit=6`, fetchOptions),
  ]);

  if (!analyticsRes.ok || !recentRes.ok) {
    return (
      <div className="flex h-full items-center justify-center p-10">
        <p className="text-red-500 text-sm">Failed to load dashboard data. Please refresh.</p>
      </div>
    );
  }

  const {
    blogs: allBlogs = [],
    totalBlogs = 0,
    publishedCount = 0,
    draftCount = 0,
  } = await analyticsRes.json();

  const { blogs: recentBlogs = [] } = await recentRes.json();

  const viewsData = allBlogs
    .filter((b: any) => b.publishedAt && b.views != null)
    .map((b: any) => ({
      date: new Date(b.publishedAt).toLocaleDateString(),
      views: b.views,
    }));

  const publishedData = Object.entries(
    allBlogs.reduce((acc: any, b: any) => {
      if (b.publishedAt) {
        const date = new Date(b.publishedAt).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>)
  ).map(([date, count]) => ({ date, count }));

  return (
    <div className="p-6 space-y-6 max-w-8xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Here's what's happening with your blog</p>
        </div>
        <Link href="/dashboard/manage-blogs/new">
          <Button variant="primary" className="flex items-center gap-2 cursor-pointer">
            <PenLine className="w-4 h-4" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Summary cards */}
      <SummaryCards
        totalBlogs={totalBlogs}
        published={publishedCount}
        drafts={draftCount}
      />

      {/* Analytics charts */}
      {(viewsData.length > 0 || publishedData.length > 0) && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Analytics</h2>
          <ChartsWrapper chartData={{ viewsData, publishedData }} />
        </div>
      )}

      {/* Recent posts */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Recent Posts</h2>
        <RecentBlogs blogs={recentBlogs} />
      </div>
    </div>
  );
}
