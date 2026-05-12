"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuditResult, ExtendedUserInput, ToolRecommendation } from "@/src/lib/types"

type EmailFormState = {
  email: string
  company: string
  role: string
  submitted: boolean
  submitting: boolean
  error: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function getSavingsTypeLabel(type: string): string {
  switch (type) {
    case "remove": return "overlap detected"
    case "downgrade": return "plan mismatch"
    case "optimize": return "seat waste"
    case "switch": return "better alternative"
    default: return type
  }
}

function getSavingsTypeColor(type: string): string {
  switch (type) {
    case "remove": return "#ff4444"
    case "downgrade": return "#ffaa00"
    case "optimize": return "#00ff88"
    case "switch": return "#4488ff"
    default: return "#6a6a7f"
  }
}

function getConfidenceColor(confidence: string): string {
  switch (confidence) {
    case "high": return "#00ff88"
    case "medium": return "#ffaa00"
    case "low": return "#6a6a7f"
    default: return "#6a6a7f"
  }
}

// ─── Tool Card Component ──────────────────────────────────────────────────────

function ToolCard({ rec }: { rec: ToolRecommendation }) {
  const isOptimal = rec.isOptimal && rec.monthlySavings === 0
  const isBillingWarning = rec.isOptimal && rec.savingsType === "optimize"

  return (
    <div
      className="p-5 space-y-4 transition-all"
      style={{
        background: "#0f0f12",
        border: `1px solid ${isOptimal && !isBillingWarning ? "#1c1c1f" : "#222228"}`,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{
                background: isOptimal && !isBillingWarning
                  ? "#2a2a3f"
                  : getSavingsTypeColor(rec.savingsType),
              }}
            />
            <span className="text-sm font-semibold" style={{ color: "#d0d0d8" }}>
              {rec.toolName}
            </span>
            <span
              className="mono text-xs px-1.5 py-0.5"
              style={{ color: "#4a4a5f", border: "1px solid #1c1c1f" }}
            >
              {rec.currentPlan}
            </span>
          </div>
          <p
            className="mono text-xs"
            style={{
              color: isOptimal && !isBillingWarning
                ? "#4a4a5f"
                : getSavingsTypeColor(rec.savingsType),
            }}
          >
            {rec.recommendedAction}
          </p>
        </div>

        <div className="text-right flex-shrink-0">
          {rec.monthlySavings > 0 ? (
            <>
              <p
                className="mono text-lg font-medium"
                style={{
                  color: "#00ff88",
                  textShadow: "0 0 12px rgba(0,255,136,0.3)",
                }}
              >
                −{formatCurrency(rec.monthlySavings)}/mo
              </p>
              <p className="mono text-xs" style={{ color: "#4a4a5f" }}>
                −{formatCurrency(rec.annualSavings)}/yr
              </p>
            </>
          ) : (
            <p className="mono text-xs" style={{ color: "#2a2a3f" }}>
              {isBillingWarning ? "⚠ variable billing" : "✓ optimal"}
            </p>
          )}
        </div>
      </div>

      <p className="text-xs leading-relaxed" style={{ color: "#6a6a7f" }}>
        {rec.reason}
      </p>

      {/* Metadata */}
      {!isOptimal && (
        <div
          className="flex items-center gap-3 pt-2 flex-wrap"
          style={{ borderTop: "1px solid #1a1a1d" }}
        >
          <span
            className="mono text-xs px-2 py-0.5"
            style={{
              color: getConfidenceColor(rec.confidence),
              border: `1px solid ${getConfidenceColor(rec.confidence)}22`,
              background: `${getConfidenceColor(rec.confidence)}08`,
            }}
          >
            {rec.confidence} confidence
          </span>
          <span className="mono text-xs" style={{ color: "#2a2a3f" }}>
            {getSavingsTypeLabel(rec.savingsType)}
          </span>
        </div>
      )}
    </div>
  )
}


// ─── Email Capture Component ──────────────────────────────────────────────────

function EmailCapture({
  result,
  onSubmitted,
}: {
  result: AuditResult
  onSubmitted: () => void
}) {
  const [form, setForm] = useState<EmailFormState>({
    email: "",
    company: "",
    role: "",
    submitted: false,
    submitting: false,
    error: "",
  })
  const [honeypot, setHoneypot] = useState("")

  async function handleSubmit() {
    if (!form.email) return
    if (honeypot) return // bot detected

    setForm((prev) => ({ ...prev, submitting: true, error: "" }))

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          company: form.company,
          role: form.role,
          totalMonthlySavings: result.totalMonthlySavings,
          highSavings: result.highSavings,
        }),
      })

      if (!res.ok) throw new Error("Failed to submit")

      setForm((prev) => ({ ...prev, submitted: true, submitting: false }))
      onSubmitted()
    } catch {
      setForm((prev) => ({
        ...prev,
        submitting: false,
        error: "Something went wrong. Please try again.",
      }))
    }
  }

  if (form.submitted) {
    return (
      <div
        className="p-6 text-center space-y-2"
        style={{ background: "#0f0f12", border: "1px solid #1c1c1f" }}
      >
        <p style={{ color: "#00ff88" }} className="mono text-sm">
          ✓ Report sent
        </p>
        <p className="text-xs" style={{ color: "#4a4a5f" }}>
          Check your inbox. We will follow up if significant savings apply.
        </p>
      </div>
    )
  }

  return (
    <div
      className="p-6 space-y-4"
      style={{ background: "#0f0f12", border: "1px solid #222228" }}
    >
      <div>
        <p className="text-sm font-semibold mb-1" style={{ color: "#d0d0d8" }}>
          Get this report by email
        </p>
        <p className="text-xs" style={{ color: "#4a4a5f" }}>
          We will send a full breakdown and flag if Credex credits apply
          to your stack.
        </p>
      </div>

      {/* Honeypot — hidden from real users */}
      <input
        type="text"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        style={{ display: "none" }}
        tabIndex={-1}
        aria-hidden="true"
      />

      <div className="space-y-3">
        {/* Email */}
        <input
          type="email"
          placeholder="your@email.com"
          value={form.email}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, email: e.target.value }))
          }
          className="w-full px-3 py-2.5 text-sm mono"
          style={{
            background: "#111114",
            border: "1px solid #1c1c1f",
            color: "#d0d0d8",
            outline: "none",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#00ff88")}
          onBlur={(e) => (e.target.style.borderColor = "#1c1c1f")}
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Company (optional)"
            value={form.company}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, company: e.target.value }))
            }
            className="w-full px-3 py-2.5 text-sm"
            style={{
              background: "#111114",
              border: "1px solid #1c1c1f",
              color: "#d0d0d8",
              outline: "none",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#00ff88")}
            onBlur={(e) => (e.target.style.borderColor = "#1c1c1f")}
          />
          <input
            type="text"
            placeholder="Role (optional)"
            value={form.role}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, role: e.target.value }))
            }
             className="w-full px-3 py-2.5 text-sm"
            style={{
              background: "#111114",
              border: "1px solid #1c1c1f",
              color: "#d0d0d8",
              outline: "none",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#00ff88")}
            onBlur={(e) => (e.target.style.borderColor = "#1c1c1f")}
          />
        </div>
      </div>

      {form.error && (
        <p className="mono text-xs" style={{ color: "#ff4444" }}>
          {form.error}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={!form.email || form.submitting}
        className="w-full py-3 mono text-xs font-medium tracking-widest transition-opacity disabled:opacity-30"
        style={{
          background: "#00ff88",
          color: "#0c0c0e",
          border: "none",
        }}
      >
        {form.submitting ? "SENDING..." : "GET FULL REPORT →"}
      </button>

      <p className="mono text-xs text-center" style={{ color: "#2a2a3f" }}>
        No spam. Unsubscribe any time.
      </p>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<AuditResult | null>(null)
  const [input, setInput] = useState<ExtendedUserInput | null>(null)
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [shareUrl, setShareUrl] = useState("")

  useEffect(() => {
    const savedResult = localStorage.getItem("spendlens_audit_result")
    const savedInput = localStorage.getItem("spendlens_audit_input_final")

    if (!savedResult || !savedInput) {
      router.push("/audit")
      return
    }

    try {
      setResult(JSON.parse(savedResult))
      setInput(JSON.parse(savedInput))
      setShareUrl(window.location.origin + "/audit")
    } catch {
      router.push("/audit")
    }
  }, [router])

  if (!result || !input) {
    return (
      <main
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0c0c0e" }}
      >
        <p className="mono text-xs" style={{ color: "#4a4a5f" }}>
          Loading audit...
        </p>
      </main>
    )
  }

  const actionableRecs = result.recommendations.filter(
    (r) => !r.isOptimal || r.savingsType === "optimize"
  )
  const optimalRecs = result.recommendations.filter(
    (r) => r.isOptimal && r.savingsType !== "optimize"
  )

  return (
    <main className="min-h-screen" style={{ background: "#0c0c0e" }}>

      {/* Nav */}
      <nav
        className="px-8 py-4 flex items-center justify-between"
        style={{ borderBottom: "1px solid #1c1c1f" }}
      >
        <Link href="/">
          <span
            className="mono text-sm font-medium tracking-widest cursor-pointer"
            style={{ color: "#00ff88" }}
          >
            SPENDLENS
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="mono text-xs" style={{ color: "#2a2a3f" }}>
            audit complete
          </span>
          <Link href="/audit">
            <button
              className="mono text-xs px-4 py-2"
              style={{
                border: "1px solid #2a2a2f",
                color: "#4a4a5f",
                background: "transparent",
              }}
            >
              NEW AUDIT
            </button>
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-8 py-12 space-y-8">

        {/* ── Savings Hero ── */}
        <div
          className="p-8 space-y-4"
          style={{
            background: "#0f0f12",
            border: "1px solid #222228",
          }}
        >
            {result.isAlreadyOptimal ? (
            <div className="space-y-2">
              <p
                className="mono text-xs tracking-widest"
                style={{ color: "#4a4a5f" }}
              >
                AUDIT COMPLETE
              </p>
              <h1 className="text-3xl font-bold" style={{ color: "#d0d0d8" }}>
                You are spending well.
              </h1>
              <p className="text-sm" style={{ color: "#4a4a5f" }}>
                No significant optimizations found for your current stack
                and usage profile. We will flag opportunities as pricing
                changes.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p
                className="mono text-xs tracking-widest"
                style={{ color: "#4a4a5f" }}
              >
                AUDIT COMPLETE · {result.recommendations.length} tools reviewed
              </p>
              <div className="flex items-end gap-6 flex-wrap">
                <div>
                  <p className="text-sm mb-1" style={{ color: "#4a4a5f" }}>
                    Potential monthly saving
                  </p>
                  <p
                    className="mono text-5xl font-bold"
                    style={{
                      color: "#00ff88",
                      textShadow: "0 0 30px rgba(0,255,136,0.25)",
                    }}
                  >
                    {formatCurrency(result.totalMonthlySavings)}
                  </p>
                </div>
                <div
                  className="pb-2"
                  style={{ borderLeft: "1px solid #1c1c1f", paddingLeft: "1.5rem" }}
                >
                  <p className="text-sm mb-1" style={{ color: "#4a4a5f" }}>
                    Per year
                  </p>
                  <p
                    className="mono text-2xl font-medium"
                    style={{ color: "#6a6a7f" }}
                  >
                    {formatCurrency(result.totalAnnualSavings)}
                  </p>
                </div>
                </div>

              {/* Context line */}
              <p className="text-xs" style={{ color: "#4a4a5f" }}>
                Based on {input.teamSize} person team ·{" "}
                {input.useCase} use case · {input.usageIntensity} usage
              </p>
            </div>
          )}
        </div>

        {/* ── Credex CTA — high savings only ── */}
        {result.highSavings && (
          <div
            className="p-6 flex items-start justify-between gap-6"
            style={{
              background: "rgba(0,255,136,0.04)",
              border: "1px solid rgba(0,255,136,0.15)",
            }}
          >
            <div className="space-y-1">
              <p className="text-sm font-semibold" style={{ color: "#d0d0d8" }}>
                Capture more of this saving with Credex
              </p>
              <p className="text-xs" style={{ color: "#4a4a5f" }}>
                Credex sources discounted AI infrastructure credits from
                companies that overforecast. Your stack qualifies for
                significant savings beyond plan optimization.
              </p>
            </div>
            <a
              href="https://credex.rocks"
              target="_blank"
              rel="noopener noreferrer"
              className="mono text-xs px-4 py-2 flex-shrink-0 transition-opacity hover:opacity-80"
              style={{
                background: "#00ff88",
                color: "#0c0c0e",
                border: "none",
                textDecoration: "none",
              }}
            >
              BOOK A CALL →
            </a>
          </div>
        )}
        <div className="space-y-3">
          <p
            className="mono text-xs tracking-widest"
            style={{ color: "#2a2a3f" }}
          >
            PER TOOL BREAKDOWN
          </p>

          {/* Actionable recommendations first */}
          {actionableRecs.map((rec) => (
            <ToolCard key={rec.toolName} rec={rec} />
          ))}

          {/* Optimal tools collapsed */}
          {optimalRecs.length > 0 && (
            <div
              className="p-4"
              style={{
                background: "#0c0c0e",
                border: "1px solid #1c1c1f",
              }}
            >
              <p className="mono text-xs" style={{ color: "#2a2a3f" }}>
                ✓ {optimalRecs.map((r) => r.toolName).join(", ")} —
                no changes needed
              </p>
            </div>
          )}
          </div>

        {/* ── AI Summary placeholder ── */}
        <div
          className="p-5 space-y-2"
          style={{
            background: "#0f0f12",
            border: "1px solid #1c1c1f",
          }}
        >
          <p
            className="mono text-xs tracking-widest"
            style={{ color: "#2a2a3f" }}
          >
            AUDIT SUMMARY
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#6a6a7f" }}>
            {result.isAlreadyOptimal
              ? `Your ${input.tools.length}-tool stack appears well-matched to your team of ${input.teamSize} for ${input.useCase} workflows. No significant plan mismatches, redundant tools, or seat waste detected under your current usage profile.`
              : `Your ${input.tools.length}-tool stack has ${actionableRecs.filter(r => r.monthlySavings > 0).length} optimization opportunity${actionableRecs.filter(r => r.monthlySavings > 0).length !== 1 ? "ies" : "y"} totalling ${formatCurrency(result.totalMonthlySavings)}/month. The recommendations above are based on your team size of ${input.teamSize}, ${input.useCase} workflows, and ${input.usageIntensity} usage intensity. Compliance requirements and usage limits have been factored in.`
            }
          </p>
        </div>
        <EmailCapture
          result={result}
          onSubmitted={() => setEmailSubmitted(true)}
        />

        {/* ── Low savings notify me ── */}
        {result.lowSavings && !emailSubmitted && (
          <div
            className="p-5 space-y-2"
            style={{
              background: "#0f0f12",
              border: "1px solid #1c1c1f",
            }}
          >
            <p className="text-sm font-medium" style={{ color: "#d0d0d8" }}>
              Your stack looks efficient
            </p>
            <p className="text-xs" style={{ color: "#4a4a5f" }}>
              We found limited optimization opportunity right now. Enter
              your email above and we will notify you when pricing changes
              or new alternatives apply to your stack.
            </p>
          </div>
        )}<div
          className="p-5 space-y-3"
          style={{
            background: "#0f0f12",
            border: "1px solid #1c1c1f",
          }}
        >
          <p
            className="mono text-xs tracking-widest"
            style={{ color: "#2a2a3f" }}
          >
            SHARE THIS AUDIT
          </p>
          <div className="flex items-center gap-3">
            <input
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-2 mono text-xs"
              style={{
                background: "#111114",
                border: "1px solid #1c1c1f",
                color: "#4a4a5f",
                outline: "none",
              }}
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareUrl)
              }}
              className="mono text-xs px-4 py-2 flex-shrink-0"
              style={{
                border: "1px solid #2a2a3f",
                color: "#4a4a5f",
                background: "transparent",
              }}
            >
              COPY
            </button>
          </div>
          <p className="mono text-xs" style={{ color: "#1c1c1f" }}>
            Identifying details are not included in shared links
          </p>
        </div>
        <div className="text-center pt-4">
          <Link href="/audit">
            <button
              className="mono text-xs px-6 py-3"
              style={{
                border: "1px solid #2a2a3f",
                color: "#4a4a5f",
                background: "transparent",
              }}
            >
              ← RUN ANOTHER AUDIT
            </button>
          </Link>
        </div>

      </div>
    </main>

  )
}
        
