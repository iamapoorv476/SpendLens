import Link from "next/link"

export default function HomePage() {
  return (
    <main className="min-h-screen" style={{ background: "#0c0c0e" }}>

      {/* Nav */}
      <nav
        style={{ borderBottom: "1px solid #2a2a3f" }}
        className="px-8 py-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <span className="mono text-sm font-medium tracking-widest text-[#00ff88]">
            SPENDLENS
          </span>
          <span
            className="mono text-xs px-2 py-0.5"
            style={{
              background: "rgba(0,255,136,0.06)",
              border: "1px solid rgba(0,255,136,0.15)",
              color: "#00ff88",
            }}
          >
            v1.0
          </span>
        </div>
        <div className="flex items-center gap-6">
          <span className="mono text-xs" style={{ color: "#a0a0b8" }}>
            pricing verified May 2026
          </span>
          <Link href="/audit">
            <button
              aria-label="Start free audit"
              className="mono text-xs px-4 transition-all"
              style={{
                border: "1px solid #6a6a8f",
                color: "#a0a0b8",
                background: "transparent",
                minHeight: "44px",
                minWidth: "44px",
              }}
            >
              START AUDIT →
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-8 md:px-12 pt-20 pb-16">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }}>

          {/* Left */}
          <div>
            <div
              className="inline-flex items-center gap-2 mb-8 px-3 py-1.5"
              style={{ border: "1px solid #2a2a3f", background: "#111114" }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#00ff88" }} />
              <span className="mono text-xs tracking-widest" style={{ color: "#a0a0b8" }}>
                DETERMINISTIC AUDIT ENGINE
              </span>
            </div>

            <h1
              className="text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight mb-5"
              style={{ color: "#f0f0f2" }}
            >
              Your AI tool spend,
              <br />
              <span style={{ color: "#00ff88", textShadow: "0 0 30px rgba(0,255,136,0.2)" }}>
                audited honestly.
              </span>
            </h1>

            <p className="text-base leading-relaxed mb-8 max-w-md" style={{ color: "#a0a0b8" }}>
              SpendLens evaluates your AI subscriptions against current
              vendor pricing, your team size, usage intensity, and workflow
              type — then generates recommendations a finance team would
              actually agree with.
            </p>

            <div className="space-y-2 mb-10">
              {[
                "Compliance requirements never overridden",
                "Heavy users never recommended to downgrade",
                "Every number traces to an official pricing page",
              ].map((signal) => (
                <div key={signal} className="flex items-center gap-3">
                  <span style={{ color: "#00ff88" }} className="text-xs">✓</span>
                  <span className="text-sm" style={{ color: "#a0a0b8" }}>{signal}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-5">
              <div style={{ minHeight: "44px", display: "inline-flex", alignItems: "center" }}>
              <Link href="/audit">
                <button
                  aria-label="Audit my AI tool stack"
                  className="mono text-xs px-6 font-medium tracking-widest transition-all"
                  style={{
                    background: "#00ff88",
                    color: "#0c0c0e",
                    border: "none",
                    minHeight: "44px",
                    minWidth: "44px",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  AUDIT MY STACK →
                </button>
              </Link>
              </div>
              <span className="mono text-xs" style={{ color: "#b0b0c8" }}>
                no login · no email upfront
              </span>
            </div>
          </div>

          {/* Right — audit preview */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between mb-4">
              <span className="mono text-xs tracking-widest" style={{ color: "#a0a0b8" }}>
                EXAMPLE AUDIT OUTPUT
              </span>
              <span className="mono text-xs" style={{ color: "#a0a0b8" }}>
                3-person team · coding
              </span>
            </div>

            {/* Card 1 */}
            <div className="p-4 space-y-3" style={{ background: "#0f0f12", border: "1px solid #2a2a3f" }}>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#ff4444" }} />
                    <span className="text-sm font-medium" style={{ color: "#d0d0d4" }}>
                      GitHub Copilot
                    </span>
                    <span
                      className="mono text-xs px-1.5 py-0.5"
                      style={{
                        background: "rgba(255,170,0,0.08)",
                        border: "1px solid rgba(255,170,0,0.15)",
                        color: "#ffaa00",
                      }}
                    >
                      medium confidence
                    </span>
                  </div>
                  <p className="mono text-xs" style={{ color: "#ffaa00" }}>
                    Consider consolidating on Cursor
                  </p>
                </div>
                <span className="mono text-sm font-medium flex-shrink-0" style={{ color: "#00ff88" }}>
                  −$30/mo
                </span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "#a0a0b8" }}>
                Cursor and GitHub Copilot overlap in ~60% of use cases.
                Copilot retains value for PR reviews and CI pipeline
                contexts — if those workflows exist, this saving does not apply.
              </p>
              <div className="flex items-center gap-2 pt-1" style={{ borderTop: "1px solid #1a1a1d" }}>
                <span className="mono text-xs" style={{ color: "#9a9ab0" }}>overlap detection</span>
                <span style={{ color: "#2a2a3f" }}>·</span>
                <span className="mono text-xs" style={{ color: "#9a9ab0" }}>switching friction: medium</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-4 space-y-3" style={{ background: "#0f0f12", border: "1px solid #2a2a3f" }}>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#ffaa00" }} />
                    <span className="text-sm font-medium" style={{ color: "#d0d0d4" }}>
                      Cursor Teams
                    </span>
                    <span
                      className="mono text-xs px-1.5 py-0.5"
                      style={{
                        background: "rgba(0,255,136,0.06)",
                        border: "1px solid rgba(0,255,136,0.12)",
                        color: "#00ff88",
                      }}
                    >
                      high confidence
                    </span>
                  </div>
                  <p className="mono text-xs" style={{ color: "#00ff88" }}>
                    Switch to individual Pro plans
                  </p>
                </div>
                <span className="mono text-sm font-medium flex-shrink-0" style={{ color: "#00ff88" }}>
                  −$40/mo
                </span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "#a0a0b8" }}>
                Teams plan is structured for 5+ users. At 3 seats,
                individual Pro at $20/seat saves $40/mo with identical
                capability — unless SSO or centralised billing are
                contractually required.
              </p>
              <div className="flex items-center gap-2 pt-1" style={{ borderTop: "1px solid #1a1a1d" }}>
                <span className="mono text-xs" style={{ color: "#9a9ab0" }}>seat waste</span>
                <span style={{ color: "#2a2a3f" }}>·</span>
                <span className="mono text-xs" style={{ color: "#9a9ab0" }}>math-based · no assumptions</span>
              </div>
            </div>

            {/* Total */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ background: "#0f0f12", border: "1px solid #2a2a3f" }}
            >
              <span className="mono text-xs" style={{ color: "#a0a0b8" }}>
                potential monthly saving
              </span>
              <div className="flex items-baseline gap-2">
                <span
                  className="mono text-lg font-medium"
                  style={{ color: "#00ff88", textShadow: "0 0 12px rgba(0,255,136,0.3)" }}
                >
                  $70/mo
                </span>
                <span className="mono text-xs" style={{ color: "#9a9ab0" }}>$840/yr</span>
              </div>
            </div>

            <p className="mono text-xs text-right pt-1" style={{ color: "#7a7a9f" }}>
              actual output format · your numbers will differ
            </p>
          </div>

        </div>
      </section>

      {/* Engineering facts strip */}
      <section
        style={{ borderTop: "1px solid #2a2a3f", borderBottom: "1px solid #2a2a3f" }}
        className="py-5 px-8"
      >
        <div className="max-w-6xl mx-auto flex flex-wrap gap-8 items-center justify-between">
          {[
            { label: "tools with verified pricing", value: "8" },
            { label: "audit engine test coverage", value: "10 tests" },
            { label: "recommendation rule types", value: "5" },
            { label: "pricing last verified", value: "May 2026" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-baseline gap-3">
              <span className="mono text-sm font-medium" style={{ color: "#00ff88" }}>
                {stat.value}
              </span>
              <span className="mono text-xs" style={{ color: "#a0a0b8" }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-8 py-20">
        {/* h2 fixes heading order — h3 inside needs h2 parent */}
        <h2 className="mono text-xs tracking-widest mb-12" style={{ color: "#a0a0b8" }}>
          HOW THE AUDIT WORKS
        </h2>
        <div className="grid md:grid-cols-3 gap-px" style={{ background: "#2a2a3f" }}>
          {[
            {
              step: "01",
              title: "You describe your stack",
              desc: "Team size, use case, usage intensity, compliance requirements, and whether you have hit plan limits. Three steps, under 90 seconds.",
            },
            {
              step: "02",
              title: "The engine evaluates",
              desc: "Deterministic rules check plan fit, seat efficiency, tool overlap, and use case alignment against verified pricing data.",
            },
            {
              step: "03",
              title: "You get defensible recommendations",
              desc: "Every suggestion includes a one-sentence reason and a confidence level. No manufactured savings. No aggressive upselling.",
            },
          ].map((item) => (
            <div key={item.step} className="p-8" style={{ background: "#0c0c0e" }}>
              {/* Fixed: was #2a2a3f now #4a4a6f for contrast */}
              <span className="mono text-3xl font-bold block mb-6" style={{ color: "#6a6a8f" }}>
                {item.step}
              </span>
              <h3 className="text-sm font-semibold mb-3" style={{ color: "#d0d0d4" }}>
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#a0a0b8" }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section className="max-w-6xl mx-auto px-8 pb-20">
        <h2 className="mono text-xs tracking-widest mb-6" style={{ color: "#a0a0b8" }}>
          TOOLS AUDITED
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            "Cursor", "GitHub Copilot", "Claude", "ChatGPT",
            "Anthropic API", "OpenAI API", "Gemini", "Windsurf",
          ].map((tool) => (
            <span
              key={tool}
              className="mono text-xs px-3 py-1.5"
              style={{ border: "1px solid #2a2a3f", color: "#a0a0b8", background: "#0f0f12" }}
            >
              {tool}
            </span>
          ))}
        </div>
        {/* Fixed: was #4a4a6f now #9a9ab0 */}
        <p className="mono text-xs mt-4" style={{ color: "#b0b0c8" }}>
          pricing verified against official vendor pages · May 2026
        </p>
      </section>

      {/* Bottom CTA */}
      <section style={{ borderTop: "1px solid #2a2a3f" }} className="px-8 py-16">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: "#f0f0f2" }}>
              Run your audit.
            </h2>
            <p className="text-sm" style={{ color: "#a0a0b8" }}>
              Free. No account. Email captured after you see results.
            </p>
          </div>
          <Link href="/audit">
            <button
              aria-label="Start free audit"
              className="mono text-xs px-6 font-medium tracking-widest"
              style={{
                background: "#00ff88",
                color: "#0c0c0e",
                border: "none",
                minHeight: "44px",
                minWidth: "44px",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              START FREE AUDIT →
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #2a2a3f" }} className="px-8 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="mono text-xs" style={{ color: "#9a9ab0" }}>
            SPENDLENS · built for Credex
          </span>
          {/* Fixed: was #6a6a8f now #9a9ab0, added minHeight for touch target */}
          <a
            href="https://credex.rocks"
            aria-label="Visit Credex website"
            className="mono text-xs transition-colors"
            style={{
              color: "#b0b0c8",
              minHeight: "44px",
              display: "inline-flex",
              alignItems: "center",
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            credex.rocks →
          </a>
        </div>
      </footer>

    </main>
  )
}