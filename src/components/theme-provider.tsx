"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      {...props}
      // Suppress React 19 script tag warning — next-themes injects a
      // blocking script for SSR theme detection; the warning is dev-only.
      nonce=""
    >
      {children}
    </NextThemesProvider>
  )
}
