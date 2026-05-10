
import { ToolName } from "./types"


export type PlanInfo = {
  name: string
  monthlyPrice: number      // per user per month in USD
  annualPrice?: number      // per user per month if billed annually
  minSeats?: number         // minimum seat requirement
  idealMaxSeats?: number    // above this, next plan makes more sense
  idealMinSeats?: number    // below this, downgrade makes sense
  features: string[]        // key features for use-case matching
  useCases: string[]        // which use cases this plan suits
  predictable: boolean      // flat rate = true, credit-based = false
}

export type ToolPricing = {
  name: ToolName
  plans: PlanInfo[]
  overlaps: ToolName[]      // tools that do similar things
  apiDirect?: boolean       // true if API pricing exists
}

// ─── Cursor ──────────────────────────────────────────────────────────────────
// Source: https://cursor.com/pricing — verified 2026-05-09

const cursorPricing: ToolPricing = {
  name: "Cursor",
  overlaps: ["GitHub Copilot", "Windsurf"],
  plans: [
    {
      name: "Hobby",
      monthlyPrice: 0,
      features: ["limited completions", "limited agent requests"],
      useCases: ["coding"],
      predictable: true,
    },
    {
      name: "Pro",
      monthlyPrice: 20,
      annualPrice: 16,
      features: ["unlimited tab", "$20 model credits", "cloud agents"],
      useCases: ["coding"],
      predictable: false, // credit-based after auto mode
      idealMaxSeats: 10,
    },
    {
      name: "Pro+",
      monthlyPrice: 60,
      features: ["everything in Pro", "3x model credits"],
      useCases: ["coding"],
      predictable: false,
    },
    {
      name: "Ultra",
      monthlyPrice: 200,
      features: ["everything in Pro", "20x model credits"],
      useCases: ["coding"],
      predictable: false,
    },
    {
      name: "Teams",
      monthlyPrice: 40,
      features: ["Pro features", "centralized billing", "RBAC", "SSO"],
      useCases: ["coding"],
      predictable: false,
      idealMinSeats: 5, // below 5, individual Pro plans are cheaper
    },
    {
      name: "Enterprise",
      monthlyPrice: 0, // custom
      features: ["Teams features", "custom contracts", "advanced security"],
      useCases: ["coding"],
      predictable: true,
    },
  ],
}

// ─── GitHub Copilot ──────────────────────────────────────────────────────────
// Source: https://github.com/features/copilot/plans — verified 2026-05-09

const copilotPricing: ToolPricing = {
  name: "GitHub Copilot",
  overlaps: ["Cursor", "Windsurf"],
  plans: [
    {
      name: "Free",
      monthlyPrice: 0,
      features: ["2000 completions/mo", "50 chat requests/mo"],
      useCases: ["coding"],
      predictable: true,
    },
    {
      name: "Pro",
      monthlyPrice: 10,
      features: ["unlimited completions", "AI credits included"],
      useCases: ["coding"],
      predictable: true,
    },
    {
      name: "Pro+",
      monthlyPrice: 39,
      features: ["everything in Pro", "5x more AI credits"],
      useCases: ["coding"],
      predictable: true,
    },
    {
      name: "Business",
      monthlyPrice: 19,
      features: ["org management", "pooled credits", "admin controls"],
      useCases: ["coding"],
      predictable: true,
      idealMinSeats: 5,
    },
    {
      name: "Enterprise",
      monthlyPrice: 39,
      features: ["Business features", "advanced security", "audit logs"],
      useCases: ["coding"],
      predictable: true,
      idealMinSeats: 20,
    },
  ],
}

// ─── Claude (Anthropic) ──────────────────────────────────────────────────────
// Source: https://anthropic.com/pricing — verified 2026-05-09

const claudePricing: ToolPricing = {
  name: "Claude",
  overlaps: ["ChatGPT"],
  apiDirect: true,
  plans: [
    {
      name: "Free",
      monthlyPrice: 0,
      features: ["daily usage limits", "web and mobile access"],
      useCases: ["writing", "research", "coding", "mixed"],
      predictable: true,
    },
    {
      name: "Pro",
      monthlyPrice: 20,
      annualPrice: 17,
      features: ["higher message caps", "Projects", "Research mode", "Claude Code"],
      useCases: ["writing", "research", "coding", "mixed"],
      predictable: true,
    },
    {
      name: "Max 5x",
      monthlyPrice: 100,
      features: ["5x more usage than Pro"],
      useCases: ["writing", "research", "coding", "mixed"],
      predictable: true,
    },
    {
      name: "Max 20x",
      monthlyPrice: 200,
      features: ["20x more usage than Pro", "highest limits"],
      useCases: ["writing", "research", "coding", "mixed"],
      predictable: true,
    },
    {
      name: "Team",
      monthlyPrice: 30, // approximate, custom per seat
      features: ["admin controls", "collaboration", "min 5 members"],
      useCases: ["writing", "research", "coding", "mixed"],
      predictable: true,
      idealMinSeats: 5,
      minSeats: 5,
    },
    {
      name: "Enterprise",
      monthlyPrice: 0, // custom
      features: ["governance", "compliance", "data residency"],
      useCases: ["writing", "research", "coding", "data", "mixed"],
      predictable: true,
      idealMinSeats: 20,
    },
    {
      name: "API direct",
      monthlyPrice: 0, // usage based
      features: ["pay per token", "all models", "no usage cap"],
      useCases: ["coding", "data", "mixed"],
      predictable: false,
    },
  ],
}

// ─── ChatGPT (OpenAI) ────────────────────────────────────────────────────────
// Source: https://openai.com/business/chatgpt-pricing/ — verified 2026-05-09

const chatgptPricing: ToolPricing = {
  name: "ChatGPT",
  overlaps: ["Claude"],
  apiDirect: true,
  plans: [
    {
      name: "Free",
      monthlyPrice: 0,
      features: ["GPT-5.3", "usage limits"],
      useCases: ["writing", "research", "coding", "mixed"],
      predictable: true,
    },
    {
      name: "Go",
      monthlyPrice: 8,
      features: ["basic access", "includes ads"],
      useCases: ["writing", "research", "mixed"],
      predictable: true,
    },
    {
      name: "Plus",
      monthlyPrice: 20,
      features: ["GPT-5.5", "Deep Research 10/mo", "Sora", "Codex"],
      useCases: ["writing", "research", "coding", "mixed"],
      predictable: true,
    },
    {
      name: "Pro 5x",
      monthlyPrice: 100,
      features: ["5x Plus usage", "all models including GPT-5.5 Pro"],
      useCases: ["writing", "research", "coding", "data", "mixed"],
      predictable: true,
    },
    {
      name: "Pro 20x",
      monthlyPrice: 200,
      features: ["20x Plus usage", "1M token context", "o1 Pro mode"],
      useCases: ["writing", "research", "coding", "data", "mixed"],
      predictable: true,
    },
    {
      name: "Business",
      monthlyPrice: 25, // monthly billing
      annualPrice: 20,
      features: ["SAML SSO", "SOC 2", "admin controls", "no training on data"],
      useCases: ["writing", "research", "coding", "mixed"],
      predictable: true,
      idealMinSeats: 2,
      minSeats: 2,
    },
    {
      name: "Enterprise",
      monthlyPrice: 0, // custom
      features: ["multi-region data residency", "audit logs", "dedicated support"],
      useCases: ["writing", "research", "coding", "data", "mixed"],
      predictable: true,
      idealMinSeats: 150,
    },
    {
      name: "API direct",
      monthlyPrice: 0,
      features: ["pay per token", "GPT-5.4 and GPT-5.5 access"],
      useCases: ["coding", "data", "mixed"],
      predictable: false,
    },
  ],
}

// ─── Anthropic API ───────────────────────────────────────────────────────────
// Source: https://anthropic.com/pricing — verified 2026-05-09

const anthropicApiPricing: ToolPricing = {
  name: "Anthropic API",
  overlaps: ["OpenAI API"],
  apiDirect: true,
  plans: [
    {
      name: "API direct",
      monthlyPrice: 0, // usage based
      features: [
        "Haiku 4.5: $1/$5 per 1M tokens",
        "Sonnet 4.6: $3/$15 per 1M tokens",
        "Opus 4.6: $5/$25 per 1M tokens",
        "50% batch discount",
        "90% prompt caching discount",
      ],
      useCases: ["coding", "data", "mixed"],
      predictable: false,
    },
  ],
}

// ─── OpenAI API ──────────────────────────────────────────────────────────────
// Source: https://openai.com/api/pricing/ — verified 2026-05-09

const openaiApiPricing: ToolPricing = {
  name: "OpenAI API",
  overlaps: ["Anthropic API"],
  apiDirect: true,
  plans: [
    {
      name: "API direct",
      monthlyPrice: 0, // usage based
      features: [
        "GPT-5.4: $2.50/$15 per 1M tokens",
        "GPT-5.5: $5/$30 per 1M tokens",
        "50% batch discount",
        "cached input discount",
      ],
      useCases: ["coding", "data", "mixed"],
      predictable: false,
    },
  ],
}

// ─── Gemini (Google) ─────────────────────────────────────────────────────────
// Source: https://one.google.com/about/ai-premium — verified 2026-05-09
// API: https://ai.google.dev/gemini-api/docs/pricing — verified 2026-05-09

const geminiPricing: ToolPricing = {
  name: "Gemini",
  overlaps: ["ChatGPT", "Claude"],
  apiDirect: true,
  plans: [
    {
      name: "Free",
      monthlyPrice: 0,
      features: ["Gemini 2.5 Flash", "100 AI credits/mo"],
      useCases: ["writing", "research", "mixed"],
      predictable: true,
    },
    {
      name: "AI Plus",
      monthlyPrice: 7.99,
      features: ["more AI credits", "expanded features"],
      useCases: ["writing", "research", "mixed"],
      predictable: true,
    },
    {
      name: "AI Pro",
      monthlyPrice: 19.99,
      features: ["Gemini 3", "1000 AI credits", "Workspace integration"],
      useCases: ["writing", "research", "data", "mixed"],
      predictable: true,
    },
    {
      name: "AI Ultra",
      monthlyPrice: 249.99,
      features: ["Gemini 3 Pro", "25000 AI credits", "Veo 3.1 video"],
      useCases: ["writing", "research", "data", "mixed"],
      predictable: true,
    },
    {
      name: "API",
      monthlyPrice: 0,
      features: [
        "Flash-Lite: $0.10/$0.40 per 1M tokens",
        "Flash: $0.50/$3.00 per 1M tokens",
        "2.5 Pro: $1.25/$10.00 per 1M tokens",
        "3.1 Pro: $2.00/$12.00 per 1M tokens",
        "50% batch discount",
      ],
      useCases: ["coding", "data", "mixed"],
      predictable: false,
    },
  ],
}

// ─── Windsurf ────────────────────────────────────────────────────────────────
// Source: https://windsurf.com/pricing — verified 2026-05-09

const windsurfPricing: ToolPricing = {
  name: "Windsurf",
  overlaps: ["Cursor", "GitHub Copilot"],
  plans: [
    {
      name: "Free",
      monthlyPrice: 0,
      features: ["limited completions", "limited Flow credits"],
      useCases: ["coding"],
      predictable: true,
    },
    {
      name: "Pro",
      monthlyPrice: 15,
      features: ["more Flow credits", "priority access"],
      useCases: ["coding"],
      predictable: true,
    },
    {
      name: "Teams",
      monthlyPrice: 35,
      features: ["centralized billing", "team features"],
      useCases: ["coding"],
      predictable: true,
      idealMinSeats: 5,
    },
    {
      name: "Enterprise",
      monthlyPrice: 0,
      features: ["SSO", "admin controls", "custom pricing"],
      useCases: ["coding"],
      predictable: true,
      idealMinSeats: 20,
    },
  ],
}

// ─── Master Pricing Map ───────────────────────────────────────────────────────

export const PRICING: Record<ToolName, ToolPricing> = {
  Cursor: cursorPricing,
  "GitHub Copilot": copilotPricing,
  Claude: claudePricing,
  ChatGPT: chatgptPricing,
  "Anthropic API": anthropicApiPricing,
  "OpenAI API": openaiApiPricing,
  Gemini: geminiPricing,
  Windsurf: windsurfPricing,
}

// ─── Helper Functions ─────────────────────────────────────────────────────────

export function getPlan(toolName: ToolName, planName: string): PlanInfo | undefined {
  return PRICING[toolName]?.plans.find(
    (p) => p.name.toLowerCase() === planName.toLowerCase()
  )
}

export function getCheaperPlan(
  toolName: ToolName,
  currentPlanName: string
): PlanInfo | undefined {
  const tool = PRICING[toolName]
  if (!tool) return undefined

  const currentPlan = getPlan(toolName, currentPlanName)
  if (!currentPlan) return undefined

  return tool.plans
    .filter(
      (p) =>
        p.monthlyPrice > 0 &&
        p.monthlyPrice < currentPlan.monthlyPrice &&
        p.name !== currentPlan.name
    )
    .sort((a, b) => b.monthlyPrice - a.monthlyPrice)[0]
}

export function getOverlappingTools(toolName: ToolName): ToolName[] {
  return PRICING[toolName]?.overlaps ?? []
}