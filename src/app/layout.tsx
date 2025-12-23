import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import TimelineScroll from "@/components/TimelineScroll"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Multiverse Archive | The Ultimate Hero Database",
  description: "Explore heroes across the Multiverse - Marvel, DC, Anime and beyond. Powers, timelines, and canon events from every universe.",
  keywords: ["Heroes", "Marvel", "DC", "Anime", "Multiverse", "Database", "Spider-Verse", "X-Men", "Batman", "Superman"],
  authors: [{ name: "Multiverse Archive Team" }],
  openGraph: {
    title: "Multiverse Archive | The Ultimate Hero Database",
    description: "Explore heroes across the Multiverse - Marvel, DC, Anime and beyond.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Multiverse Archive",
    description: "The Ultimate Hero Database",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen cyber-grid`}
      >
        {/* Ambient background effects */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {/* Top-right glow */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
          {/* Bottom-left glow */}
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
          {/* Center subtle glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-3xl" />
        </div>

        {/* Main content */}
        <div className="relative z-10">
          <TimelineScroll />
          {children}
        </div>

        {/* Global Navigation */}
        <Navbar />
      </body>
    </html>
  )
}
