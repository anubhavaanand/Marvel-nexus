import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Multiverse Archive | Hero Database",
  description: "Explore heroes across the Multiverse — Marvel, DC, Anime and beyond. Powers, timelines, and canon events from every universe.",
  keywords: ["Heroes", "Marvel", "DC", "Anime", "Multiverse", "Database"],
  authors: [{ name: "Multiverse Archive" }],
  openGraph: {
    title: "Multiverse Archive | Hero Database",
    description: "Explore heroes across the Multiverse — Marvel, DC, Anime and beyond.",
    type: "website",
    siteName: "Multiverse Archive",
  },
  twitter: {
    card: "summary_large_image",
    title: "Multiverse Archive",
    description: "The Ultimate Hero Database",
  },
}

export const viewport: Viewport = {
  themeColor: "#000000",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased min-h-screen bg-[var(--bg)] text-[var(--fg)]`}>
        <Navbar />
        <main className="relative z-10 pt-16">
          {children}
        </main>
        <footer className="relative z-10 border-t border-[var(--border)] py-6 px-4 text-center text-xs text-[var(--muted)]">
          <p>
            This product uses the TMDB API but is not endorsed or certified by TMDB.
            {' '}
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[var(--accent)] transition-colors"
            >
              Powered by The Movie Database
            </a>
          </p>
        </footer>
      </body>
    </html>
  )
}
