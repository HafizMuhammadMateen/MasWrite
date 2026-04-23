"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Settings,
  NotebookPen,
  PenLine,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronUp,
} from "lucide-react";
import { TbBrandBlogger } from "react-icons/tb";
import { useState, useRef, useEffect } from "react";
import { useLogout } from "@/hooks/useLogout";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import ProfileModal from "@/components/modals/ProfileModal";
import ChangePasswordModal from "@/components/modals/ChangePasswordModal";

function getInitials(name?: string) {
  if (!name) return "U";
  return name
    .split(/[\s_]+/)
    .map((w) => w[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
}

export default function SideBar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const handleLogout = useLogout();
  const user = useCurrentUser();

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/manage-blogs", label: "Manage Blogs", icon: NotebookPen },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
    { href: "/blogs", label: "Public Blog", icon: TbBrandBlogger, external: true },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setShowProfileModal(false);
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowProfileModal(false);
    };
    if (showProfileModal) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [showProfileModal]);

  return (
    <>
      <aside
        className={`flex flex-col h-full bg-white border-r border-gray-100 transition-all duration-300 ease-in-out ${
          collapsed ? "w-[60px]" : "w-56"
        }`}
      >
        {/* Brand + toggle */}
        <div
          className={`flex items-center h-14 border-b border-primary/10 px-3 bg-gradient-to-r from-primary/5 to-transparent ${
            collapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!collapsed && (
            <Link
              href="/dashboard"
              className="font-bold text-primary text-base tracking-tight px-1"
            >
              MasWrite
            </Link>
          )}
          <button
            onClick={() => setCollapsed((p) => !p)}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* New Post CTA */}
        <div className={`px-3 pt-4 pb-2 ${collapsed ? "flex justify-center" : ""}`}>
          <Link href="/dashboard/manage-blogs/new" className={collapsed ? "" : "block"}>
            {collapsed ? (
              <button
                title="New Post"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition cursor-pointer"
              >
                <PenLine className="w-4 h-4" />
              </button>
            ) : (
              <Button variant="primary" size="sm" className="w-full flex items-center gap-2 cursor-pointer">
                <PenLine className="w-4 h-4" />
                New Post
              </Button>
            )}
          </Link>
        </div>

        <Separator className="mx-3 w-auto" />

        {/* Nav items */}
        <nav className="flex flex-col gap-0.5 flex-1 px-2 pt-2">
          {menuItems.map(({ href, label, icon: Icon, external }) => {
            const isDashboardRoot = /^\/dashboard(\/\d+)?$/.test(pathname);
            const isActive =
              href === "/dashboard"
                ? isDashboardRoot
                : pathname.startsWith(href) && href !== "/dashboard";
            const activeStyles = isActive
              ? "bg-primary/8 text-primary font-medium"
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-800";

            return (
              <Link
                key={href}
                href={href}
                target={external ? "_blank" : undefined}
                title={collapsed ? label : undefined}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors relative ${activeStyles} ${
                  collapsed ? "justify-center" : ""
                }`}
              >
                {isActive && !collapsed && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full" />
                )}
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: profile section */}
        <div className="px-2 pb-3">
          <Separator className="mb-2" />

          <div ref={profileRef} className="relative">
            {/* Profile button */}
            <button
              onClick={() => setShowProfileModal((p) => !p)}
              title={collapsed ? (user?.userName || user?.name || "Profile") : undefined}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-sm ring-2 ring-transparent group-hover:ring-primary/20 transition">
                {getInitials(user?.userName || user?.name)}
              </div>
              {!collapsed && user && (
                <div className="min-w-0 flex-1 text-left">
                  <p className="text-sm font-medium text-gray-800 truncate leading-tight">
                    {user.userName || user.name || "User"}
                  </p>
                  <p className="text-xs text-gray-400 truncate leading-tight">{user.email}</p>
                </div>
              )}
              {!collapsed && (
                <ChevronUp
                  className={`w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform ${
                    showProfileModal ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>

            {/* Profile popup */}
            {showProfileModal && (
              <ProfileModal
                user={user ?? undefined}
                onClose={() => setShowProfileModal(false)}
                onChangePassword={() => {
                  setShowProfileModal(false);
                  setShowChangePasswordModal(true);
                }}
                onLogout={handleLogout}
                position="above"
              />
            )}
          </div>
        </div>
      </aside>

      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />
    </>
  );
}
