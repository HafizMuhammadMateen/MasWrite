"use client"

import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import toast from "react-hot-toast"

export function useLogout() {
  const router = useRouter()

  return async function handleLogout() {
    try {
      // Clear server-side cookies (manual JWT + NextAuth)
      const res = await fetch("/api/auth/logout", { method: "POST", credentials: "include" })

      if (res.ok) {
        // Clear NextAuth client-side session state (in-memory + its own cookies)
        await signOut({ redirect: false })
        toast.success("Logged out successfully")
        router.push("/login")
      } else {
        toast.error("Logout failed, please try again")
      }
    } catch {
      toast.error("Something went wrong while logging out")
    }
  }
}
