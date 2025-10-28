// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
// import { Blog } from "@/lib/types/blog";
// import RecentBlogs from "@/components/dashboard/RecentBlogs";

// export const revalidate = 6; // static + refresh every 60s

// export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
//   const page = Number((await searchParams).page) || 1;
//   const blogsPerPage = 6;

//   const token = (await cookies()).get("token")?.value;
//   if (!token) redirect("/login");

//   try {
//     const [userRes, blogsRes] = await Promise.all([
//       fetch(`${process.env.NEXTAUTH_URL}/api/auth/me`, {
//         headers: { Cookie: `token=${token}` },
//         // cache: "no-store",
//       }),
//       fetch(`${process.env.NEXTAUTH_URL}/api/manage-blogs?page=${page}&limit=${blogsPerPage}`, {
//         next: { revalidate: 60 },
//       }),
//     ]);

//     if (!userRes.ok) redirect("/login");

//     const userData = await userRes.json();
//     const user = userData.data?.user;

//     const blogsData = await blogsRes.json();
//     const blogs: Blog[] = blogsData.blogs || [];
//     const totalPages = blogsData.totalPages || 1;

//     return (
//       <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
//         <main className="flex flex-1">
//           <div className="flex-1">
//             <h2 className="text-xl font-bold text-gray-800 my-4 text-center">
//               Welcome, {user?.userName || "User"} 👋
//             </h2>

//             <section className="shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.1)] max-h-[calc(100vh-150px)] p-6">
//               <RecentBlogs blogs={blogs} page={page} totalPages={totalPages}/>
//             </section>
//           </div>
//         </main>
//       </div>
//     );
//   } catch (err) {
//     console.error("Dashboard Error:", err);
//     redirect("/login"); // fallback if something fails server-side
//   }
// }

import { Blog } from "@/lib/types/blog";
import RecentBlogs from "@/components/dashboard/RecentBlogs";

// Enable Incremental Static Regeneration (SSG)
export const revalidate = 60; // rebuild every 60 seconds

export default async function DashboardPage() {
  try {
    const page = 1;
    const blogsPerPage = 6;

    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/manage-blogs?page=${page}&limit=${blogsPerPage}`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) {
      console.error("Failed to fetch blogs:", res.status);
      return (
        <div className="flex h-screen items-center justify-center">
          <p className="text-red-600">Failed to load dashboard data.</p>
        </div>
      );
    }

    const blogsData = await res.json();
    const blogs: Blog[] = blogsData.blogs || [];
    const totalPages = blogsData.totalPages || 1;

    // ✅ Return valid JSX component
    return (
      <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
        <main className="flex flex-1">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800 my-4 text-center">
              Dashboard
            </h2>

            <section className="shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.1)] max-h-[calc(100vh-150px)] p-6">
              <RecentBlogs blogs={blogs} page={page} totalPages={totalPages} />
            </section>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error("Dashboard build error:", error);
    // Return a fallback component so build doesn’t crash
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-600">Something went wrong while building dashboard.</p>
      </div>
    );
  }
}

// app/dashboard/page.tsx
export const dynamic = "force-dynamic"; // make SSR again
