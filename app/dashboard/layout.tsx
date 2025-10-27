"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/dashboard/SideBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <Header />

      <main className="flex flex-1 overflow-hidden transition-all duration-300 ease-in-out">
        <Sidebar />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>

      <Footer />
    </div>
  );
}

