// app/audit/page.tsx
// Audit form page — wraps AuditForm component
// Handles nav and page layout only

import Link from "next/link"
import { AuditForm } from "@/src/components/form/AuditForm"

export default function AuditPage() {
  return (
    <main className="min-h-screen grid-bg">
      {/* Nav */}
      <nav className="border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between">
        <Link href="/">
          <span className="mono text-sm font-medium tracking-widest text-[#00ff88] cursor-pointer">
            SPENDLENS
          </span>
        </Link>
        <span className="mono text-xs text-[#444]">
          free audit · no login required
        </span>
      </nav>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <AuditForm />
      </div>
    </main>
  )
}