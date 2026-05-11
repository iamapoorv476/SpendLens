import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "SpendLens — AI Tool Spend Audit",
  description:
    "Find out if you're overpaying for AI tools. Free audit for startups and engineering teams.",
  openGraph: {
    title: "SpendLens — AI Tool Spend Audit",
    description:
      "Find out if you're overpaying for AI tools. Free audit for startups and engineering teams.",
    type: "website",
    url: "https://spendlens.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpendLens — AI Tool Spend Audit",
    description:
      "Find out if you're overpaying for AI tools. Free audit for startups and engineering teams.",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}