"use client"

import { useState, useEffect } from "react"

export interface CurrentUser {
  name?: string
  userName?: string
  email?: string
}

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null)

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data?.data?.user ?? null))
      .catch(() => setUser(null))
  }, [])

  return user
}
