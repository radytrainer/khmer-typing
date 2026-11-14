import type { Metadata } from "next"
import { Baloo_2, Geist_Mono, Noto_Sans_Khmer } from "next/font/google"
import { AppProviders } from "@/components/providers/app-providers"
import "./globals.css"

const balooSans = Baloo_2({
  variable: "--font-display",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
})

const notoSansKhmer = Noto_Sans_Khmer({
  variable: "--font-khmer",
  subsets: ["khmer"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: {
    default: "Khmer Typing — Learn to type Khmer, one game at a time",
    template: "%s | Khmer Typing",
  },
  description:
    "A playful Khmer typing platform for Cambodian students: falling-letter games, XP, achievements, and teacher/classroom tools.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${balooSans.variable} ${geistMono.variable} ${notoSansKhmer.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
