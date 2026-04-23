"use client"

import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export function useLogout() {
  const router = useRouter()

  return async function handleLogout() {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
      if (res.ok) {
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
