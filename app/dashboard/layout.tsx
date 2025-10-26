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
      <Header onToggleSidebar={handleToggleSidebar} />

      <main className="flex flex-1 overflow-hidden transition-all duration-300 ease-in-out">
        {/* Sidebar */}
        <aside
          className={`transition-all duration-300 ease-in-out shadow-[4px_0_6px_-1px_rgba(0,0,0,0.1)]
            ${isSidebarOpen ? "w-1/8" : "w-0"}
          `}
        >
          {/* Make sidebar fill width & height */}
          <div className={`h-full ${isSidebarOpen ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}>
            <Sidebar />
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>

      <Footer />
    </div>
  );
}

