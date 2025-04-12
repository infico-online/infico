"use client"

import React, { createContext, ReactNode } from "react"
import { useTelegram } from "@/hooks/use-telegram"

interface AdminContextType {
  isAdmin: boolean
  loading: boolean
}

export const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  loading: true
})

export function AdminProvider({ children }: { children: ReactNode }) {
  const { isAdmin, loading } = useTelegram()

  return (
    <AdminContext.Provider value={{ isAdmin, loading }}>
      {children}
    </AdminContext.Provider>
  )
}
