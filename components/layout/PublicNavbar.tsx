"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, PenLine } from "lucide-react";

export default function PublicNavbar() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated" && !!session;

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/blogs" className="font-bold text-xl text-gray-900 tracking-tight hover:text-primary transition-colors">
          MasWrite
        </Link>

        <nav className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard/manage-blogs/new">
                <Button variant="outline" size="sm" className="flex items-center gap-1.5 cursor-pointer">
                  <PenLine className="w-3.5 h-3.5" />
                  Write
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="primary" size="sm" className="flex items-center gap-1.5 cursor-pointer">
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="cursor-pointer">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary" size="sm" className="cursor-pointer">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
