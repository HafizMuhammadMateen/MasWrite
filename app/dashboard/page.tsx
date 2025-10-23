"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChangePasswordModal from "@/components/modals/ChangePasswordModal";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  // Fetch dashboard data
  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/dashboard", {
          method: "GET",
          credentials: "include", // ensures cookies are sent
        });

        if (!res.ok) {
          const errData = await res.json();
          toast.error(errData.error || "Unauthorized access");
          setData({ error: errData.error || "Unauthorized" });
          return;
        }

        const result = await res.json();
        setData(result.data);
        toast.success("Dashboard loaded successfully");
      } catch {
        toast.error("Failed to load dashboard");
        setData({ error: "Failed to load dashboard" });
      }
    }
    fetchDashboard();
  }, []);

  // Redirect if unauthorized
  useEffect(() => {
    if (data?.error) {
      setTimeout(() => router.push("/login"), 800);
    }
  }, [data, router]);

  // Handle logout
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

  // Loading state
  if (!data) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <span className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></span>
        <p className="text-gray-600 text-lg font-medium">Loading Dashboard...</p>
      </div>
    );
  }

  // Redirecting state
  if (data?.error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-gray-600">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  // Main dashboard view
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Dashboard
        </h1>

        <div className="flex flex-col items-center mt-6 bg-gray-100 rounded-lg p-4 shadow-inner text-center">
          <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
            {data.user?.userName?.charAt(0)?.toUpperCase()}
          </div>
          <p className="text-xl font-semibold text-gray-800 mt-3">
            👋 Welcome, <span className="text-blue-600">{data.user?.userName}</span>
          </p>
          <p className="text-gray-600 mt-1">{data.user?.email}</p>
        </div>

        <button
          type="reset"
          onClick={() => setIsModalOpen(true)}
          className="mt-8 w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 cursor-pointer transition"
        >
          Change Password
        </button>

        <ChangePasswordModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        <button
          type="reset"
          onClick={handleLogout}
          className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 cursor-pointer transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}



// "use client"

// import type React from "react"
// import { useEffect, useMemo, useState } from "react"
// import { useRouter } from "next/navigation"
// import useSWR from "swr"

// type DashboardUser = {
//   userName?: string
//   email?: string
//   role?: string
//   lastLogin?: string
// }

// type DashboardStats = {
//   projects?: number
//   tasks?: number
//   messages?: number
//   storageUsedPct?: number
// }

// type DashboardItem = {
//   id: string
//   title: string
//   time: string
// }

// type DashboardResponse = {
//   user?: DashboardUser
//   stats?: DashboardStats
//   activity?: DashboardItem[]
//   error?: string
// }

// const fetcher = async (url: string) => {
//   const res = await fetch(url, { credentials: "include" })
//   const json = await res.json()
//   if (!res.ok) throw json
//   return json
// }

// export default function DashboardPage() {
//   const router = useRouter()
//   const [alert, setAlert] = useState<string | null>(null)
//   const [menuOpen, setMenuOpen] = useState(false)
//   const [pwOpen, setPwOpen] = useState(false)

//   const { data, error, isLoading } = useSWR<DashboardResponse>("/api/dashboard", fetcher, {
//     shouldRetryOnError: false,
//   })

//   useEffect(() => {
//     if (error?.error || data?.error) {
//       const msg = (error as any)?.error || data?.error || "Unauthorized"
//       setAlert(msg)
//       const id = setTimeout(() => router.replace("/login"), 1200)
//       return () => clearTimeout(id)
//     }
//   }, [data, error, router])

//   const user = data?.user || {}
//   const name = user.userName || "User"
//   const email = user.email || ""
//   const lastLogin = user.lastLogin || "—"
//   const role = user.role || "Member"

//   const stats = useMemo<Required<DashboardStats>>(
//     () => ({
//       projects: data?.stats?.projects ?? 8,
//       tasks: data?.stats?.tasks ?? 24,
//       messages: data?.stats?.messages ?? 5,
//       storageUsedPct: data?.stats?.storageUsedPct ?? 62,
//     }),
//     [data?.stats],
//   )

//   const activity = useMemo<DashboardItem[]>(
//     () =>
//       data?.activity && data.activity.length > 0
//         ? data.activity
//         : [
//             { id: "1", title: "Signed in from new device", time: "2h ago", className: "text-blue-600" },
//             { id: "2", title: "Updated profile details", time: "Yesterday" },
//             { id: "3", title: "Completed Onboarding Checklist", time: "2 days ago" },
//             { id: "4", title: "Invited a teammate", time: "3 days ago" },
//           ],
//     [data?.activity],
//   )

//   async function handleLogout() {
//     try {
//       await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
//     } finally {
//       router.push("/login")
//     }
//   }

//   return (
//     <main className="min-h-screen px-4 py-6 md:px-8">
//       {alert ? (
//         <div
//           role="status"
//           aria-live="polite"
//           className="mb-4 rounded-md border border-border bg-card/60 p-3 text-sm text-destructive"
//         >
//           {alert}
//         </div>
//       ) : null}

//       {isLoading ? (
//         <>
//           <HeaderSkeleton />
//           <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//             {[0, 1, 2, 3].map((i) => (
//               <div key={i} className="h-28 rounded-lg border border-border bg-card animate-pulse" />
//             ))}
//           </div>
//           <div className="mt-6 grid gap-6 lg:grid-cols-3">
//             <div className="lg:col-span-2 rounded-lg border border-border bg-card">
//               <div className="p-5">
//                 <div className="h-6 w-40 rounded bg-muted animate-pulse" />
//                 <div className="mt-4 space-y-3">
//                   {[...Array(5)].map((_, idx) => (
//                     <div key={idx} className="h-4 w-full rounded bg-muted animate-pulse" />
//                   ))}
//                 </div>
//               </div>
//             </div>
//             <div className="rounded-lg border border-border bg-card p-5">
//               <div className="h-6 w-48 rounded bg-muted animate-pulse" />
//               <div className="mt-4 space-y-3">
//                 {[...Array(4)].map((_, idx) => (
//                   <div key={idx} className="h-4 w-full rounded bg-muted animate-pulse" />
//                 ))}
//               </div>
//             </div>
//           </div>
//         </>
//       ) : (
//         <>
//           {/* Header */}
//           <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//             <div className="flex items-center gap-4">
//               <div
//                 aria-label={`Avatar for ${name}`}
//                 className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg font-bold grid rounded-full"
//               >
//                 {(name?.[0] || "U").toUpperCase()}
//               </div>
//               <div>
//                 <h1 className="text-xl md:text-2xl font-semibold text-pretty">Welcome, {name}</h1>
//                 <p className="text-sm text-muted-foreground">{email}</p>
//               </div>
//             </div>

//             <div className="relative flex items-center gap-2">
//               <button
//                 type="button"
//                 onClick={() => router.push("/settings")}
//                 className="h-9 rounded-md border border-border bg-card px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition"
//               >
//                 Settings
//               </button>

//               <div className="relative">
//                 <button
//                   type="button"
//                   aria-haspopup="menu"
//                   aria-expanded={menuOpen}
//                   onClick={() => setMenuOpen((v) => !v)}
//                   className="h-9 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
//                 >
//                   Account
//                 </button>

//                 {menuOpen ? (
//                   <div
//                     role="menu"
//                     tabIndex={-1}
//                     className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-lg"
//                   >
//                     <button
//                       role="menuitem"
//                       onClick={() => {
//                         setMenuOpen(false)
//                         setPwOpen(true)
//                       }}
//                       className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
//                     >
//                       Change password
//                     </button>
//                     <button
//                       role="menuitem"
//                       onClick={() => {
//                         setMenuOpen(false)
//                         handleLogout()
//                       }}
//                       className="w-full px-3 py-2 text-left text-sm text-destructive hover:bg-accent"
//                     >
//                       Logout
//                     </button>
//                   </div>
//                 ) : null}
//               </div>
//             </div>
//           </header>

//           {/* Stats */}
//           <section aria-label="Key metrics" className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//             <StatCard title="Projects" value={stats.projects} hint="Active projects" />
//             <StatCard title="Tasks" value={stats.tasks} hint="Open tasks" />
//             <StatCard title="Messages" value={stats.messages} hint="Unread messages" />
//             <StorageCard percent={stats.storageUsedPct} />
//           </section>

//           {/* Main content */}
//           <section className="mt-6 grid gap-6 lg:grid-cols-3">
//             {/* Activity */}
//             <div className="lg:col-span-3 rounded-lg border border-border bg-card">
//               <div className="flex items-center justify-between p-5 bg-blue-500">
//                 <h2 className="text-base font-semibold text-pretty">Recent activity</h2>
//                 <span className="text-xs text-muted-foreground">Latest updates</span>
//               </div>
//               <div className="border-t border-border">
//                 <ul className="divide-y divide-border">
//                   {activity.map((item) => (
//                     <li key={item.id} className="flex items-center justify-between px-5 py-3">
//                       <p className="text-sm md:text-base text-pretty">{item.title}</p>
//                       <span className="text-xs md:text-sm text-muted-foreground bg-yellow-300 border-2 border-white rounded-full px-4 py-2">{item.time}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>

//             {/* Account & Security */}
//             {/* <div className="rounded-lg border border-border bg-card">
//               <div className="p-5">
//                 <h2 className="text-base font-semibold text-pretty">Account & security</h2>
//                 <div className="mt-4 grid grid-cols-1 gap-3 text-sm">
//                   <KeyValueRow label="Name" value={name} />
//                   <KeyValueRow label="Email" value={email} />
//                   <KeyValueRow label="Role" value={role} />
//                   <KeyValueRow label="Last login" value={lastLogin} />
//                 </div>

//                 <div className="my-4 h-px w-full bg-border" />

//                 <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
//                   <p className="text-sm text-muted-foreground">Keep your account secure</p>
//                   <div className="flex gap-2">
//                     <button
//                       type="button"
//                       onClick={() => setPwOpen(true)}
//                       className="h-9 rounded-md border border-border bg-card px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition"
//                     >
//                       Change password
//                     </button>
//                     <button
//                       type="button"
//                       onClick={handleLogout}
//                       className="h-9 rounded-md bg-destructive px-3 text-sm font-medium text-destructive-foreground hover:opacity-90 transition"
//                     >
//                       Logout
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div> */}
//           </section>

//           <ChangePasswordModal open={pwOpen} onOpenChange={setPwOpen} />
//         </>
//       )}
//     </main>
//   )
// }

// /* ===================== */
// /* UI Subcomponents (Tailwind-only) */
// /* ===================== */

// function StatCard({ title, value, hint }: { title: string; value: number; hint: string}) {
//   return (
//     <div className="rounded-lg border border-border bg-card p-4 bg-orange-100">
//       <div className="flex items-center justify-between">
//         <p className="text-sm font-medium text-muted-foreground">{title}</p>
//       </div>
//       <div className="mt-2 text-2xl font-semibold">{value}</div>
//       <p className="text-xs text-muted-foreground">{hint}</p>
//     </div>
//   )
// }

// function StorageCard({ percent }: { percent: number }) {
//   return (
//     <div className="rounded-lg border border-border bg-card p-4">
//       <div className="flex items-center justify-between">
//         <p className="text-sm font-medium text-muted-foreground">Storage</p>
//         <span className="text-xs text-muted-foreground">used</span>
//       </div>
//       <div className="mt-2 text-2xl font-semibold">{percent}%</div>
//       <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted" aria-label="Storage used">
//         <div className="h-full bg-primary" style={{ width: `${Math.max(0, Math.min(100, percent))}%` }} />
//       </div>
//       <p className="mt-2 text-xs text-muted-foreground">Based on your current plan</p>
//     </div>
//   )
// }

// function KeyValueRow({ label, value }: { label: string; value: string | number }) {
//   return (
//     <div className="flex items-center justify-between">
//       <span className="text-muted-foreground">{label}</span>
//       <span className="font-medium">{value}</span>
//     </div>
//   )
// }

// /* ===================== */
// /* Change Password Modal (Tailwind-only) */
// /* ===================== */

// function ChangePasswordModal({
//   open,
//   onOpenChange,
// }: {
//   open: boolean
//   onOpenChange: (v: boolean) => void
// }) {
//   const [loading, setLoading] = useState(false)
//   const [form, setForm] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   })
//   const [msg, setMsg] = useState<string | null>(null)

//   async function onSubmit(e: React.FormEvent) {
//     e.preventDefault()
//     setMsg(null)
//     if (!form.newPassword || form.newPassword !== form.confirmPassword) {
//       setMsg("Passwords do not match. Please confirm your new password.")
//       return
//     }
//     setLoading(true)
//     try {
//       const res = await fetch("/api/auth/change-password", {
//         method: "POST",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           currentPassword: form.currentPassword,
//           newPassword: form.newPassword,
//         }),
//       })
//       const json = await res.json().catch(() => ({}))
//       if (!res.ok) throw new Error(json?.error || "Failed to change password")
//       setMsg("Password updated successfully.")
//       setTimeout(() => onOpenChange(false), 800)
//     } catch (err: any) {
//       setMsg(err.message || "Something went wrong.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (!open) return null

//   return (
//     <div
//       role="dialog"
//       aria-modal="true"
//       aria-label="Change password"
//       className="fixed inset-0 z-40"
//       onClick={() => onOpenChange(false)}
//     >
//       <div className="absolute inset-0 bg-black/50" />
//       <div className="absolute inset-0 z-50 grid place-items-center p-4" onClick={(e) => e.stopPropagation()}>
//         <div className="w-full max-w-md rounded-lg border border-border bg-popover text-popover-foreground shadow-xl">
//           <div className="border-b border-border p-4">
//             <h3 className="text-base font-semibold">Change password</h3>
//             <p className="mt-1 text-sm text-muted-foreground">Use a strong password you don’t reuse elsewhere.</p>
//           </div>

//           <form onSubmit={onSubmit} className="p-4 space-y-4">
//             {msg ? <div className="rounded-md border border-border bg-card/60 p-2 text-xs">{msg}</div> : null}

//             <div className="grid gap-2">
//               <label htmlFor="currentPassword" className="text-sm font-medium">
//                 Current password
//               </label>
//               <input
//                 id="currentPassword"
//                 type="password"
//                 required
//                 value={form.currentPassword}
//                 onChange={(e) => setForm((s) => ({ ...s, currentPassword: e.target.value }))}
//                 className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
//               />
//             </div>

//             <div className="grid gap-2">
//               <label htmlFor="newPassword" className="text-sm font-medium">
//                 New password
//               </label>
//               <input
//                 id="newPassword"
//                 type="password"
//                 required
//                 value={form.newPassword}
//                 onChange={(e) => setForm((s) => ({ ...s, newPassword: e.target.value }))}
//                 className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
//               />
//             </div>

//             <div className="grid gap-2">
//               <label htmlFor="confirmPassword" className="text-sm font-medium">
//                 Confirm password
//               </label>
//               <input
//                 id="confirmPassword"
//                 type="password"
//                 required
//                 value={form.confirmPassword}
//                 onChange={(e) => setForm((s) => ({ ...s, confirmPassword: e.target.value }))}
//                 className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
//               />
//             </div>

//             <div className="flex items-center justify-end gap-2 pt-2">
//               <button
//                 type="button"
//                 onClick={() => onOpenChange(false)}
//                 className="h-9 rounded-md border border-border bg-card px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="h-9 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition disabled:opacity-60"
//               >
//                 {loading ? "Saving…" : "Save changes"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }

// /* ===================== */
// /* Skeletons (Tailwind-only) */
// /* ===================== */

// function HeaderSkeleton() {
//   return (
//     <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//       <div className="flex items-center gap-4">
//         <div className="size-12 rounded-full bg-muted animate-pulse" />
//         <div className="space-y-2">
//           <div className="h-5 w-48 rounded bg-muted animate-pulse" />
//           <div className="h-4 w-64 rounded bg-muted animate-pulse" />
//         </div>
//       </div>
//       <div className="flex gap-2">
//         <div className="h-9 w-28 rounded bg-muted animate-pulse" />
//         <div className="h-9 w-28 rounded bg-muted animate-pulse" />
//       </div>
//     </div>
//   )
// }
