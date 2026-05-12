import { Metadata } from "next"

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params  // ← await here
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://spendlens.vercel.app"

  try {
    const res = await fetch(`${baseUrl}/api/audit/${id}`, {  // ← use id not params.id
      cache: "no-store",
    })

    if (!res.ok) throw new Error("Not found")

    const audit = await res.json()
    const savings = audit.totalMonthlySavings

    const title = savings > 0
      ? `AI spend audit — $${savings}/mo in savings found`
      : "AI spend audit — stack is optimised"

    const description = savings > 0
      ? `This team could save $${savings}/month ($${audit.totalAnnualSavings}/year) on AI tools. Run your free audit on SpendLens.`
      : "This team's AI tool stack is well-optimised. Run your free audit on SpendLens."

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        url: `${baseUrl}/audit/${id}`,  // ← use id
      },
      twitter: {
        card: "summary",
        title,
        description,
      },
    }
  } catch {
    return {
      title: "AI Spend Audit — SpendLens",
      description: "Free AI tool spend audit for startups and engineering teams.",
    }
  }
}

export default async function PublicAuditPage({ params }: Props) {
  const { id } = await params  // ← await here
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://spendlens.vercel.app"

  let audit = null

  try {
    const res = await fetch(`${baseUrl}/api/audit/${id}`, {  // ← use id
      cache: "no-store",
    })
    if (res.ok) audit = await res.json()
  } catch {
    // ignore
  }

  if (!audit) {
    return (
      <main
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0c0c0e" }}
      >
        <p className="mono text-xs" style={{ color: "#4a4a5f" }}>
          Audit not found.
        </p>
      </main>
    )
  }

  return (
    <main className="min-h-screen" style={{ background: "#0c0c0e" }}>
      <nav
        className="px-8 py-4 flex items-center justify-between"
        style={{ borderBottom: "1px solid #1c1c1f" }}
      >
        <span
          className="mono text-sm font-medium tracking-widest"
          style={{ color: "#00ff88" }}
        >
          SPENDLENS
        </span>
        <a
          href="/audit"
          className="mono text-xs px-4 py-2"
          style={{
            border: "1px solid #2a2a2f",
            color: "#4a4a5f",
            textDecoration: "none",
          }}
        >
          RUN YOUR AUDIT →
        </a>
      </nav>

      <div className="max-w-3xl mx-auto px-8 py-12 space-y-6">
        {/* Savings hero */}
        <div
          className="p-8 space-y-4"
          style={{ background: "#0f0f12", border: "1px solid #222228" }}
        >
          <p className="mono text-xs tracking-widest" style={{ color: "#7a7a9f" }}>
            SHARED AUDIT · {audit.teamSize} person team · {audit.useCase}
          </p>
          {audit.totalMonthlySavings > 0 ? (
            <div className="space-y-2">
              <p className="text-sm" style={{ color: "#7a7a9f" }}>
                Potential monthly saving identified
              </p>
              <p
                className="mono text-5xl font-bold"
                style={{
                  color: "#00ff88",
                  textShadow: "0 0 30px rgba(0,255,136,0.25)",
                }}
              >
                ${audit.totalMonthlySavings}/mo
              </p>
              <p className="mono text-sm" style={{ color: "#7a7a9f" }}>
                ${audit.totalAnnualSavings}/year
              </p>
            </div>
          ) : (
            <p className="text-2xl font-bold" style={{ color: "#d0d0d8" }}>
              Stack is well-optimised.
            </p>
          )}
        </div>

        {/* Recommendations */}
        <div className="space-y-3">
          <p className="mono text-xs tracking-widest" style={{ color: "#4a4a6f" }}>
            FINDINGS
          </p>
          {audit.recommendations
            .filter((r: { monthlySavings: number }) => r.monthlySavings > 0)
            .map((rec: {
              toolName: string
              currentPlan: string
              recommendedAction: string
              monthlySavings: number
              reason: string
            }) => (
              <div
                key={rec.toolName}
                className="p-4 space-y-2"
                style={{ background: "#0f0f12", border: "1px solid #1c1c1f" }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: "#d0d0d8" }}>
                    {rec.toolName}
                  </span>
                  <span className="mono text-sm" style={{ color: "#00ff88" }}>
                    −${rec.monthlySavings}/mo
                  </span>
                </div>
                <p className="mono text-xs" style={{ color: "#ffaa00" }}>
                  {rec.recommendedAction}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "#7a7a9f" }}>
                  {rec.reason}
                </p>
              </div>
            ))}
        </div>

        {/* CTA */}
        <div
          className="p-6 text-center space-y-4"
          style={{ background: "#0f0f12", border: "1px solid #1c1c1f" }}
        >
          <p className="text-sm font-medium" style={{ color: "#d0d0d8" }}>
            Find out what your stack costs
          </p>
          <p className="text-xs" style={{ color: "#7a7a9f" }}>
            Free audit. No login. Results in 60 seconds.
          </p>
          <a
            href="/audit"
            className="inline-block mono text-xs px-6 py-3"
            style={{ background: "#00ff88", color: "#0c0c0e" }}
          >
            AUDIT MY STACK →
          </a>
        </div>
      </div>
    </main>
  )
}
