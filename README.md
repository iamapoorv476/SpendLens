# SpendLens — AI Spend Audit Tool

SpendLens is a free web app that audits AI tool subscriptions for startups and 
engineering teams. You enter your stack — Cursor, Copilot, Claude, ChatGPT, 
Gemini, and others — and get an instant breakdown of where you are overspending, 
what to switch or downgrade, and your total potential monthly and annual savings. 
Built as a lead-generation tool for Credex, which sells discounted AI infrastructure 
credits.

**Live URL:** https://spend-lens-8khs.vercel.app

---

## Screenshots

> Add 3 screenshots here before submitting:
> 1. Landing page hero
> 2. Audit form Step 3 (spend details)
> 3. Results page with savings hero and tool cards
>
> To take screenshots: open the live URL, press F12, toggle device toolbar, 
> select mobile view, screenshot each page.

---

## Quick Start

### Run Locally

```bash
# Clone the repo
git clone https://github.com/iamapoorv476/SpendLens.git
cd SpendLens/SpendLens

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Fill in your keys (see Environment Variables below)

# Run development server
npm run dev
# Open http://localhost:3000
```

### Environment Variables

Create `SpendLens/.env.local` with these values:
ANTHROPIC_API_KEY=your_anthropic_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
RESEND_API_KEY=your_resend_key
NEXT_PUBLIC_APP_URL=http://localhost:3000

### Run Tests

```bash
npm run test
# 10 tests, all covering the audit engine
```

### Deploy

The project deploys to Vercel. Set root directory to `SpendLens` during import.
Add all four environment variables in Vercel project settings before deploying.

---

## Decisions

### 1. Deterministic audit engine over LLM-generated recommendations

I used hardcoded rules for all audit logic — plan comparisons, seat waste detection, 
overlap identification — instead of asking an LLM to generate recommendations. 

The reason: a finance person needs to be able to verify every number independently. 
LLM-generated recommendations are unpredictable and unauditable. Hardcoded rules 
are testable, explainable, and defensible. The LLM is used only for the 100-word 
summary paragraph where natural language synthesis is appropriate and the output 
does not need to be verified.

This also meant I could write 10 automated tests against the engine and guarantee 
consistent behavior across all inputs.

---

### 2. Advisory recommendations over aggressive cost-cutting

Early versions of the engine said things like "Cancel GitHub Copilot — Cursor covers 
this entirely." After three real user interviews, I changed this to "Consider whether 
you still need GitHub Copilot."

The reason: users from the interviews taught me that switching friction, muscle memory, 
and workflow continuity have real operational cost. A recommendation that saves $30/month 
but disrupts a team's development flow for a week is not a good recommendation. The engine 
now uses confidence levels (high/medium/low) and includes caveats on every suggestion.

---

### 3. Three additional inputs beyond basic form fields

I added `usageIntensity`, `hasHitLimits`, and `hasComplianceRequirements` to the form 
beyond the obvious team size and tool selection fields.

The reason: without these, the engine made too many false recommendations. A heavy user 
on Claude Max 20x who hits limits daily should never be told to downgrade. A 2-person 
team on ChatGPT Business with a SOC 2 client contract cannot drop to Plus regardless of 
the cost saving. These three inputs eliminated the most harmful false positives from the 
engine.

---

### 4. localStorage for form persistence over server-side sessions

Form state is saved to localStorage on every keystroke and loaded on mount, so users 
never lose their progress if they close the tab or navigate away.

The reason: the assignment required form state to persist across page reloads. A server 
session would require authentication, which contradicts the "no login required" requirement. 
localStorage is the simplest correct solution. The only tradeoff is that state is 
device-specific, but for a single-session audit tool this is acceptable behavior.

---

### 5. Flat Next.js App Router structure over separate frontend and backend

Everything — pages, API routes, components, audit engine — lives in one Next.js project 
deployed to Vercel.

The reason: a separate backend (Express on Render, FastAPI, etc.) would double the 
deployment surface, add latency between frontend and API, and create two separate 
environments to manage environment variables across. Next.js API routes handle 
Supabase writes and Resend emails cleanly within the same deployment. The only 
tradeoff is that the API routes use in-memory rate limiting which resets on cold starts 
— acceptable for current traffic volume.

---

## Architecture

See `ARCHITECTURE.md` for full system diagram and data flow.

## Tests

See `TESTS.md` for all 10 automated tests and how to run them.

## Pricing Sources

See `PRICING_DATA.md` for all pricing data with official vendor URLs and verification dates.

## AI Prompts

See `PROMPTS.md` for the full Anthropic API prompt used for audit summaries.