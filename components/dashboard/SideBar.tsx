"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Home, Edit, Settings, LogOut } from "lucide-react";
import { TbBrandBlogger } from "react-icons/tb";
import { VscLayoutSidebarLeftOff } from "react-icons/vsc";
import { FaBars } from "react-icons/fa";
import toast from "react-hot-toast";
import { useState } from "react";

export default function SideBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Logout handler
  async function handleLogout() {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        toast.success("Logged out successfully");
        router.push("/login");
      } else {
        toast.error("Logout failed, please try again");
      }
    } catch {
      toast.error("Something went wrong while logging out");
    }
  }

  // Sidebar menu items
  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/blogs", label: "Manage Blogs", icon: TbBrandBlogger },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside
      className={`flex flex-col h-full p-4 bg-background border-t shadow-sm text-base transition-all duration-300 ease-in-out
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      {/* Top Section */}
      <div className="flex items-center justify-between mb-4">
        {!collapsed && <span className="font-semibold text-xl">Menu</span>}

        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="p-2 pl-4 rounded hover:bg-muted transition cursor-col-resize"
        >
          {/* Responsive icons */}
          <FaBars size={18} className="block md:hidden" />
          <VscLayoutSidebarLeftOff size={20} className="hidden md:block" />
        </button>
      </div>

      {/* New Post */}
      <Link href="/dashboard/blogs/new" className="mb-4">
        <Button
          variant="default"
          className={`flex items-center justify-center gap-2 w-full rounded-full py-5 text-base transition-all cursor-pointer ${
            collapsed ? "px-0 justify-center" : "px-4"
          }`}
        >
          <Edit className="w-5 h-5"/>
          {!collapsed && "New Post"}
        </Button>
      </Link>

      <Separator className="mb-3" />

      {/* Menu Buttons */}
      <nav className="flex flex-col gap-1 flex-1">
        {menuItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors
                ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }
                ${collapsed ? "justify-center" : ""}
              `}
            >
              <Icon className="w-5 h-5" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout at bottom */}
      <Button
        variant="ghost"
        onClick={handleLogout}
        className={`flex items-center gap-2 text-md text-destructive hover:text-destructive hover:bg-muted mt-auto cursor-pointer transition-all
          ${collapsed ? "justify-center" : ""}
        `}
      >
        <LogOut className="w-5 h-5" />
        {!collapsed && "Logout"}
      </Button>
    </aside>
  );
}
