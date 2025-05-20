import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import Link from "next/link"
import { Home, Clock, ImageIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { MemoryProvider } from "@/lib/memory-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Noah's Memory App",
  description: "A collection of memories from Noah's first year",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "bg-[#fcfcfa]")}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <MemoryProvider>
            <main className="min-h-screen pb-16">{children}</main>
            <nav className="fixed bottom-0 left-0 right-0 border-t bg-white">
              <div className="container flex justify-around py-3 max-w-md mx-auto">
                <Link href="/" className="flex flex-col items-center text-xs text-muted-foreground hover:text-teal-600">
                  <Home className="h-6 w-6 mb-1" />
                  Home
                </Link>
                <Link
                  href="/timeline"
                  className="flex flex-col items-center text-xs text-muted-foreground hover:text-teal-600"
                >
                  <Clock className="h-6 w-6 mb-1" />
                  Timeline
                </Link>
                <Link
                  href="/gallery"
                  className="flex flex-col items-center text-xs text-muted-foreground hover:text-teal-600"
                >
                  <ImageIcon className="h-6 w-6 mb-1" />
                  Gallery
                </Link>
              </div>
            </nav>
          </MemoryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
