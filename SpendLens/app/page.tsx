import Link from "next/link"

export default function HomePage() {
  return (
    <main className="grid-bg min-h-screen">
      {/* Nav */}
      <nav className="border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between">
        <span className="mono text-sm font-medium tracking-widest text-[#00ff88]">
          SPENDLENS
        </span>
        <span className="mono text-xs text-[#444]">
          free · no login required
        </span>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        <div className="inline-flex items-center gap-2 mb-8 px-3 py-1 border border-[#222] bg-[#111]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
          <span className="mono text-xs text-[#666] tracking-wider">
            FREE AI SPEND AUDIT
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
          Are you paying too much
          <br />
          <span className="savings-glow">for AI tools?</span>
        </h1>
        <p className="text-lg text-[#888] max-w-xl mb-10 leading-relaxed">
          Most startups overspend on AI subscriptions without realising it.
          SpendLens audits your stack in 60 seconds and shows you exactly
          where your money is going — and where it should not be.
        </p>
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <Link href="/audit">
            <button className="btn-primary text-sm tracking-widest">
              AUDIT MY STACK →
            </button>
          </Link>
          <span className="text-xs text-[#444] mono self-center">
            No email required to see results
          </span>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-[#1a1a1a] py-6 px-6">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-8 items-center justify-between">
          {[
            { label: "Tools audited", value: "8+" },
            { label: "Avg. monthly savings found", value: "$340" },
            { label: "Audit time", value: "60s" },
            { label: "Cost to you", value: "$0" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <span className="mono text-2xl font-medium text-[#00ff88]">
                {stat.value}
              </span>
              <span className="text-xs text-[#555]">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <p className="mono text-xs text-[#444] tracking-widest mb-10">
          HOW IT WORKS
        </p>
        <div className="grid md:grid-cols-3 gap-px bg-[#1a1a1a]">
          {[
            {
              step: "01",
              title: "Enter your stack",
              desc: "Tell us which AI tools you pay for, which plan, and how many seats. Takes under a minute.",
            },
            {
              step: "02",
              title: "Get your audit",
              desc: "Our engine checks every tool against current pricing, your team size, and your use case.",
            },
            {
              step: "03",
              title: "See your savings",
              desc: "Instant breakdown of where you are overspending and exactly what to do about it.",
            },
          ].map((item) => (
            <div key={item.step} className="bg-[#0a0a0a] p-8">
              <span className="mono text-4xl font-bold text-[#1a1a1a] block mb-4">
                {item.step}
              </span>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-[#555] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <p className="mono text-xs text-[#444] tracking-widest mb-8">
          TOOLS WE AUDIT
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            "Cursor",
            "GitHub Copilot",
            "Claude",
            "ChatGPT",
            "Anthropic API",
            "OpenAI API",
            "Gemini",
            "Windsurf",
          ].map((tool) => (
            <span
              key={tool}
              className="mono text-xs px-3 py-1.5 border border-[#1a1a1a] text-[#555]"
            >
              {tool}
            </span>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-[#1a1a1a] py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Find out in 60 seconds.
        </h2>
        <p className="text-[#555] mb-8 text-sm">
          Free. No account. No credit card.
        </p>
        <Link href="/audit">
          <button className="btn-primary tracking-widest">
            START FREE AUDIT →
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a] px-6 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="mono text-xs text-[#333] tracking-widest">
            SPENDLENS
          </span>
          <span className="text-xs text-[#333]">
            Powered by{" "}
            <a
              href="https://credex.rocks"
              className="text-[#444] hover:text-[#666] transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Credex
            </a>
          </span>
        </div>
      </footer>
    </main>
  )
}