"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Home, Edit, Settings, LogOut, Plus } from "lucide-react";
import toast from "react-hot-toast";

export default function SideBar() {
  const router = useRouter();
  const pathname = usePathname();

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
    { href: "/dashboard/blogs", label: "Manage Blogs", icon: Edit },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex flex-col h-full p-4 bg-background shadow-sm border-r text-base">
      {/* Top Section */}
      <div className="flex flex-col flex-1">
        {/* New Post Button */}
        <Link href="/dashboard/blogs/new" className="mb-4">
          <Button
            variant="default"
            className="flex items-center gap-2 w-full justify-center rounded-full py-5 text-base cursor-pointer"
          >
            <Plus className="w-5 h-5" /> New Post
          </Button>
        </Link>

        <Separator className="mb-3" />

        {/* Menu buttons */}
        <nav className="flex flex-col gap-1">
          {menuItems.map(({ href, label, icon: Icon }) => {
            // const isActive = pathname.startsWith(href);
            const isActive = pathname === href; // ✅ exact match only
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-5 h-5" /> {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout at bottom */}
      <Button
        variant="ghost"
        onClick={handleLogout}
        className="flex items-center gap-2 text-md text-destructive hover:text-destructive hover:bg-muted mt-auto cursor-pointer"
      >
        <LogOut className="w-5 h-5" /> Logout
      </Button>
    </div>
  );
}
