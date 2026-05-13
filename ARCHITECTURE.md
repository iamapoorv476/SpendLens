# ARCHITECTURE.md

## System Diagram

```mermaid

graph TD
A[User visits SpendLens] --> B[Landing Page\nNext.js SSR]
B --> C[Audit Form\n3-step wizard]
C --> D[localStorage\nform persistence]
D --> C
C --> E[POST /api/audit\nNext.js API Route]
E --> F[audit-engine.ts\nDeterministic rules]
F --> G[generateSummary\nAnthropic API]
G --> H{API success?}
H -->|Yes| I[AI paragraph ~100 words]
H -->|No| J[Template fallback]
I --> K[AuditResult object]
J --> K
K --> L[Supabase\naudits table]
L --> M[Unique ID generated\nnanoid]
M --> N[Results Page\n/results]
N --> O[Email Capture Form]
O --> P[POST /api/leads\nNext.js API Route]
P --> Q[Supabase\nleads table]
P --> R[Resend\nTransactional Email]
N --> S[Shareable URL\n/audit/id]
S --> T[Public Audit Page\nOG tags stripped of PII]
``

---

## Data Flow

### How a user's input becomes an audit result
USER FILLS FORM (client side)
└── Step 1: teamSize, useCase, usageIntensity, hasComplianceRequirements
└── Step 2: tool selection (checkbox grid)
└── Step 3: plan, seats, monthlySpend, hasHitLimits per tool
└── localStorage saves state on every change
└── State restored on page reload automatically
USER CLICKS RUN AUDIT
└── AuditForm.tsx calls POST /api/audit
└── Sends ExtendedUserInput as JSON body
API ROUTE RECEIVES INPUT (/api/audit)
└── Validates: tools array must not be empty
└── Calls runAudit(input) from audit-engine.ts
└── runAudit() applies 5 rule types in sequence:
├── checkSeatWaste() per tool
├── checkMinimumSeatWaste() per tool
├── checkForDowngrade() per tool
├── checkUseCaseMismatch() per tool
└── evaluateOverlaps() across all tools
└── Each rule respects:
├── hasHitLimits → never downgrade if true
├── hasComplianceRequirements → protect Business/Team/Enterprise
└── usageIntensity → heavy users never get downgrade suggestions
AI SUMMARY GENERATED
└── generateSummary(result, input) called
└── Anthropic API called with structured prompt
└── If API fails → templateSummary() used as fallback
└── Summary attached to AuditResult object
RESULT SAVED TO SUPABASE
└── nanoid(10) generates unique audit ID
└── input_json and result_json stored in audits table
└── ID returned to client
CLIENT RECEIVES RESULT
└── Stored in localStorage for results page
└── Router redirects to /results?id=...
RESULTS PAGE RENDERS
└── Reads from localStorage
└── Displays savings hero, per-tool cards, AI summary
└── Email capture form shown after value displayed
└── Credex CTA shown if totalMonthlySavings > $500
LEAD CAPTURED (/api/leads)
└── Honeypot check → silently reject bots
└── Rate limit check → 1 request per IP per 60 seconds
└── Saved to Supabase leads table
└── Resend sends confirmation email
└── Subject line varies: high savings → mentions Credex outreach

---

## Why I Chose This Stack

### Next.js 14 with App Router
Next.js was the obvious choice for three reasons. First, API routes are built in — no separate backend server to deploy or manage. Second, server components render on the server by default, which gave me a Lighthouse performance score of 99 without any optimization effort. Third, Vercel deployment is zero-config for Next.js projects, which saved hours.

The App Router specifically gives me server-side rendering for the public audit page (`/audit/[id]`) which means Open Graph meta tags are generated server-side and work correctly for Twitter/LinkedIn link previews.

### TypeScript
Strongly preferred per the assignment constraints. In practice it was essential — the audit engine has 8 tool types, 5+ plan types per tool, and 3 extended input fields. Without TypeScript the number of possible runtime errors from mismatched types would have made the engine untestable. The 10 automated tests only work reliably because the types enforce correct inputs.

### Tailwind CSS + shadcn/ui
Tailwind is explicitly allowed per constraints. shadcn/ui was chosen because its components are built on Radix UI primitives which are accessible by default — this directly contributed to the Lighthouse Accessibility score of 95 without extra work. No pre-built dashboard template was used; every component was built from scratch using headless primitives.

### Supabase
Free tier covers the submission period. PostgreSQL underneath means proper relational data — audits link to leads via `audit_id`. Row Level Security enabled. The alternative was Firebase but Supabase's SQL interface made it easier to verify data during testing. Setup took 20 minutes including table creation.

### Resend
Simplest transactional email DX available. Free tier allows 100 emails/day. The API is a single function call. Postmark and SES were considered but both require domain verification upfront which adds friction. Resend allows sending from `onboarding@resend.dev` immediately on the free tier.

### Anthropic API (Claude Haiku)
Used only for the audit summary paragraph. Haiku was chosen over Sonnet because the task (80-100 word summary) does not require advanced reasoning — it requires good writing. Haiku is 3x cheaper and 2x faster than Sonnet for this use case. The fallback template ensures the product works even if the API is unavailable.

### Vitest
Faster than Jest, works natively with TypeScript, zero configuration needed. The 10 audit engine tests run in under 500ms. This is important because CI runs on every push and slow tests create friction.

---

## What I Would Change at 10,000 Audits Per Day

### Current limitations that break at scale

**In-memory rate limiting**
The current rate limiter uses a JavaScript Map in the API route process. This resets on every cold start and does not work across multiple Vercel instances. At 10k audits/day, this provides zero protection.

Fix: Replace with Upstash Redis rate limiting. One environment variable, one npm package, five lines of code change. Cost: ~$10/month at this volume.

**Anthropic API latency**
Every audit currently makes a synchronous Anthropic API call before returning results. At 10k audits/day this is fine. At 10k concurrent audits it becomes a bottleneck and a cost problem.

Fix: Queue AI summary generation separately. Return the audit result immediately from the API route, then generate the summary asynchronously and update the Supabase row. Results page polls for the summary. This decouples audit speed from AI latency.

**Supabase free tier**
Free tier allows 500MB database and 2GB bandwidth. At 10k audits/day with average 5KB per audit, that is 50MB/day — exhausting the free tier in 10 days.

Fix: Upgrade to Supabase Pro ($25/month) or implement audit expiry — delete audits older than 90 days via a scheduled cron job.

**No caching on pricing data**
Currently, pricing data is a static TypeScript file imported at build time. This is correct for now. At scale, pricing needs to be updated without redeployment.

Fix: Move pricing data to a Supabase table with a CDN-cached API endpoint. Update pricing weekly via an admin interface. The audit engine reads from the cache, not the static file.

**Single deployment region**
Currently deployed on Vercel's default US region. For users in India, Southeast Asia, or Europe, latency is noticeable.

Fix: Enable Vercel Edge Network or deploy API routes to multiple regions. Supabase also supports multiple regions on paid plans.

### What would not change

The audit engine itself is stateless pure functions. It scales horizontally without any changes — 10k concurrent calls to `runAudit()` work identically to 1. This was an intentional architectural decision: keeping the engine as pure TypeScript functions with no I/O dependencies means it never becomes the bottleneck.