"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/dashboard/SideBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleToggleSidebar = () => setIsSidebarOpen(prev => !prev);

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
<Header />
<main className="flex flex-1 overflow-hidden transition-all duration-300 ease-in-out">
  <aside
    className={`flex shadow-[4px_0_6px_-1px_rgba(0,0,0,0.1)]
      transition-all duration-300 ease-in-out
      ${isSidebarOpen ? "translate-x-0" : "w-0 -translate-x-full pointer-events-none overflow-hidden"}
    `}
  >
    <div
      className={`transition-opacity duration-300 ${
        isSidebarOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      <Sidebar />
    </div>
  </aside>

  <div className="flex-1 overflow-y-auto">{children}</div>
</main>


      <Footer />
    </div>
  );
}

