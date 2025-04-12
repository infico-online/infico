"use client"

import * as React from "react"

interface ThemeProviderState {
  theme: "dark" | "light" | "system"
  setTheme: (theme: "dark" | "light" | "system") => void
}

const ThemeContext = React.createContext<ThemeProviderState | undefined>(undefined)
ThemeContext.displayName = "ThemeContext"

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "infico-theme",
}: {
  children: React.ReactNode
  defaultTheme?: "dark" | "light" | "system"
  storageKey?: string
}) {
  const [theme, setTheme] = React.useState<"dark" | "light" | "system">(defaultTheme)

  React.useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = React.useMemo(
    () => ({
      theme,
      setTheme: (newTheme: "dark" | "light" | "system") => {
        if (typeof window !== "undefined") {
          localStorage.setItem(storageKey, newTheme)
        }
        setTheme(newTheme)
      },
    }),
    [storageKey, theme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = React.useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
