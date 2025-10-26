"use client"

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/components/theme-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        defaultTheme="system"
        storageKey="wellness-ui-theme"
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  )
}
