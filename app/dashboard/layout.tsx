"use client";

import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/dashboard/SideBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto bg-slate-50">{children}</div>
        <Footer />
      </div>
    </div>
  );
}
