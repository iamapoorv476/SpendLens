
import { UserInput, AuditResult, ToolRecommendation, ToolEntry,ExtendedUserInput,UsageIntensity } from "./types"
import { PRICING, getOverlappingTools, getCheaperPlan } from "./pricing-data"

// ─── Constants ────────────────────────────────────────────────────────────────

const HIGH_SAVINGS_THRESHOLD = 500
const LOW_SAVINGS_THRESHOLD = 100

// ─── Confidence + Friction Types ──────────────────────────────────────────────

type ConfidenceLevel = "high" | "medium" | "low"

type SwitchingFriction = "low" | "medium" | "high"

type OverlapProfile = {
  overlapPercent: number
  uniqueValueA: string
  uniqueValueB: string
  friction: SwitchingFriction
}

// ─── Overlap Profiles (research-backed) ───────────────────────────────────────
// Based on real user behavior, not assumed feature equivalence

const OVERLAP_PROFILES: Partial<Record<string, OverlapProfile>> = {
  "Cursor|GitHub Copilot": {
    overlapPercent: 60,
    uniqueValueA: "Agent workflows, multi-file edits, Cursor-native features",
    uniqueValueB: "GitHub PR reviews, non-Cursor IDE contexts, CI pipeline integration",
    friction: "medium",
  },
  "Cursor|Windsurf": {
    overlapPercent: 85,
    uniqueValueA: "Larger model credit pool, broader ecosystem",
    uniqueValueB: "Different pricing model, Flow credits",
    friction: "medium",
  },
  "Claude|ChatGPT": {
    overlapPercent: 40,
    uniqueValueA: "Long-form reasoning, document analysis, writing quality",
    uniqueValueB: "Tool integrations, memory, plugin ecosystem, Codex",
    friction: "high",
  },
  "Anthropic API|OpenAI API": {
    overlapPercent: 70,
    uniqueValueA: "Claude models, prompt caching, batch discounts",
    uniqueValueB: "GPT models, wider third-party integration support",
    friction: "high",
  },
}

function getOverlapProfile(
  toolA: string,
  toolB: string
): OverlapProfile | undefined {
  return (
    OVERLAP_PROFILES[`${toolA}|${toolB}`] ||
    OVERLAP_PROFILES[`${toolB}|${toolA}`]
  )
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function runAudit(input: ExtendedUserInput): AuditResult {
  const recommendations: ToolRecommendation[] = []

  // Per-tool evaluation
  for (const tool of input.tools) {
    const recs = evaluateTool(tool, input)
    recommendations.push(...recs)
  }

  // Cross-tool overlap evaluation
  const overlapRecs = evaluateOverlaps(input)
  for (const rec of overlapRecs) {
    const alreadyFlagged = recommendations.some(
      (r) => r.toolName === rec.toolName && r.savingsType === rec.savingsType
    )
    if (!alreadyFlagged) recommendations.push(rec)
  }

  // Credit-based billing warnings
  const billingRecs = evaluateBillingPredictability(input.tools)
  for (const rec of billingRecs) {
    const alreadyFlagged = recommendations.some(
      (r) => r.toolName === rec.toolName && r.savingsType === "optimize"
    )
    if (!alreadyFlagged) recommendations.push(rec)
  }

  // Fill in optimal tools that got no recommendations
  const finalRecs = input.tools.map((tool) => {
    const existing = recommendations.find((r) => r.toolName === tool.name)
    if (existing) return existing

    return {
      toolName: tool.name,
      currentPlan: tool.plan,
      currentSpend: tool.monthlySpend,
      recommendedAction: "No changes needed",
      savingsType: "optimize" as const,
      monthlySavings: 0,
      annualSavings: 0,
      confidence: "high" as ConfidenceLevel,
      reason:
        "Based on your team size, usage intensity, and stated use case, this tool appears well-matched to your needs.",
      isOptimal: true,
    } satisfies ToolRecommendation
  })

  const totalMonthlySavings = finalRecs.reduce(
    (sum, r) => sum + r.monthlySavings,
    0
  )
  const totalAnnualSavings = totalMonthlySavings * 12

  return {
    recommendations: finalRecs,
    totalMonthlySavings,
    totalAnnualSavings,
    isAlreadyOptimal: finalRecs.every((r) => r.isOptimal),
    highSavings: totalMonthlySavings > HIGH_SAVINGS_THRESHOLD,
    lowSavings: totalMonthlySavings < LOW_SAVINGS_THRESHOLD,
    summary: "",
  }
}

// ─── Per-Tool Evaluation ──────────────────────────────────────────────────────

function evaluateTool(
  tool: ToolEntry,
  input: ExtendedUserInput
): ToolRecommendation[] {
  const recommendations: ToolRecommendation[] = []

  const hasHitLimits = input.hasHitLimits[tool.name] === true
  if (hasHitLimits) return []

  const isBusinessOrEnterprise =
    tool.plan.toLowerCase().includes("business") ||
    tool.plan.toLowerCase().includes("enterprise") ||
    tool.plan.toLowerCase().includes("team")

  if (input.hasComplianceRequirements && isBusinessOrEnterprise) return []

  const seatRec = checkSeatWaste(tool)
  if (seatRec) recommendations.push(seatRec)

  const minSeatRec = checkMinimumSeatWaste(tool)
  if (minSeatRec) recommendations.push(minSeatRec)

  const downgradeRec = checkForDowngrade(tool, input.usageIntensity)
  if (downgradeRec) recommendations.push(downgradeRec)

  const useCaseRec = checkUseCaseMismatch(tool, input.useCase)
  if (useCaseRec) recommendations.push(useCaseRec)

  return recommendations
}

// ─── Rule 1: Seat Waste ───────────────────────────────────────────────────────
// High confidence — pure arithmetic, no workflow assumptions

function checkSeatWaste(tool: ToolEntry): ToolRecommendation | null {
  const toolPricing = PRICING[tool.name]
  if (!toolPricing) return null

  const currentPlanInfo = toolPricing.plans.find(
    (p) => p.name.toLowerCase() === tool.plan.toLowerCase()
  )
  if (!currentPlanInfo) return null
  if (!currentPlanInfo.idealMinSeats) return null
  if (tool.seats >= currentPlanInfo.idealMinSeats) return null

  const individualPlan = toolPricing.plans.find(
    (p) =>
      p.monthlyPrice > 0 &&
      p.monthlyPrice < currentPlanInfo.monthlyPrice &&
      !p.name.toLowerCase().includes("team") &&
      !p.name.toLowerCase().includes("business")
  )
  if (!individualPlan) return null

  const currentTotal = currentPlanInfo.monthlyPrice * tool.seats
  const alternativeTotal = individualPlan.monthlyPrice * tool.seats
  const monthlySavings = currentTotal - alternativeTotal
  if (monthlySavings <= 0) return null

  return {
    toolName: tool.name,
    currentPlan: tool.plan,
    currentSpend: tool.monthlySpend,
    recommendedAction: `Consider switching to individual ${individualPlan.name} plans`,
    savingsType: "optimize",
    monthlySavings,
    annualSavings: monthlySavings * 12,
    confidence: "high",
    reason: `${tool.name} ${tool.plan} is structured for teams of ${currentPlanInfo.idealMinSeats}+ users. With ${tool.seats} seat(s), individual ${individualPlan.name} plans at $${individualPlan.monthlyPrice}/seat provide the same core capability for $${monthlySavings}/month less — unless you specifically need the admin controls or policy management features of the ${tool.plan} plan.`,
    isOptimal: false,
  }
}

// ─── Rule 2: Minimum Seat Waste ───────────────────────────────────────────────
// High confidence — paying for seats nobody uses

function checkMinimumSeatWaste(tool: ToolEntry): ToolRecommendation | null {
  const toolPricing = PRICING[tool.name]
  if (!toolPricing) return null

  const currentPlanInfo = toolPricing.plans.find(
    (p) => p.name.toLowerCase() === tool.plan.toLowerCase()
  )
  if (!currentPlanInfo) return null
  if (!currentPlanInfo.minSeats) return null
  if (tool.seats <= currentPlanInfo.minSeats) return null

  const wastedSeats = tool.seats - currentPlanInfo.minSeats
  const monthlySavings = wastedSeats * currentPlanInfo.monthlyPrice
  if (monthlySavings <= 0) return null

  return {
    toolName: tool.name,
    currentPlan: tool.plan,
    currentSpend: tool.monthlySpend,
    recommendedAction: `Review active seat count — ${wastedSeats} seat(s) may be unused`,
    savingsType: "optimize",
    monthlySavings,
    annualSavings: monthlySavings * 12,
    confidence: "high",
    reason: `You are paying for ${tool.seats} seats but your entry suggests ${currentPlanInfo.minSeats} are required by the plan minimum. If ${wastedSeats} seat(s) are genuinely unused, removing them saves $${monthlySavings}/month with no workflow impact.`,
    isOptimal: false,
  }
}

// ─── Rule 3: Downgrade Check ──────────────────────────────────────────────────
// Medium confidence — depends on usage intensity

function checkForDowngrade(
  tool: ToolEntry,
  usageIntensity: UsageIntensity
): ToolRecommendation | null {
  // Never suggest downgrades to heavy users
  // They are likely using the plan capacity they are paying for
  if (usageIntensity === "heavy") return null

  const cheaperPlan = getCheaperPlan(tool.name, tool.plan)
  if (!cheaperPlan) return null

  const monthlySavings =
    tool.monthlySpend - cheaperPlan.monthlyPrice * tool.seats
  if (monthlySavings <= 0) return null

  // Only suggest if savings are meaningful (>$10/month)
  if (monthlySavings < 10) return null

  const confidenceLevel: ConfidenceLevel =
    usageIntensity === "light" ? "medium" : "low"

  return {
    toolName: tool.name,
    currentPlan: tool.plan,
    currentSpend: tool.monthlySpend,
    recommendedAction: `Worth evaluating ${tool.name} ${cheaperPlan.name}`,
    savingsType: "downgrade",
    monthlySavings,
    annualSavings: monthlySavings * 12,
    confidence: confidenceLevel,
    reason: `${tool.name} ${cheaperPlan.name} at $${cheaperPlan.monthlyPrice}/seat may cover your current workflow — particularly if you have not consistently hit the limits of your current plan. We recommend trialing the lower tier before committing to a switch. If you hit limits, upgrading back takes minutes.`,
    isOptimal: false,
  }
}

// ─── Rule 4: Use Case Mismatch ────────────────────────────────────────────────
// Flags overkill plans for stated workflow — low to medium confidence

function checkUseCaseMismatch(
  tool: ToolEntry,
  useCase: string
): ToolRecommendation | null {
  // Gemini Ultra for non-data/video workflows
  if (tool.name === "Gemini" && tool.plan === "AI Ultra") {
    if (useCase !== "data" && useCase !== "mixed") {
      const monthlySavings = tool.monthlySpend - 19.99 * tool.seats
      if (monthlySavings <= 0) return null
      return {
        toolName: tool.name,
        currentPlan: tool.plan,
        currentSpend: tool.monthlySpend,
        recommendedAction: "Consider whether Gemini AI Pro covers your needs",
        savingsType: "downgrade",
        monthlySavings,
        annualSavings: monthlySavings * 12,
        confidence: "medium",
        reason: `Gemini AI Ultra at $249.99/month is primarily justified by Veo 3.1 video generation and 25,000 AI credits for intensive multimodal workflows. For ${useCase}-focused work, Gemini AI Pro at $19.99/month provides equivalent text and reasoning capability at a fraction of the cost — unless video generation is a regular part of your workflow.`,
        isOptimal: false,
      }
    }
  }

  // ChatGPT Pro 20x for light/moderate users
  if (tool.name === "ChatGPT" && tool.plan === "Pro 20x") {
    const monthlySavings = tool.monthlySpend - 100 * tool.seats
    if (monthlySavings <= 0) return null
    return {
      toolName: tool.name,
      currentPlan: tool.plan,
      currentSpend: tool.monthlySpend,
      recommendedAction: "Consider whether ChatGPT Pro 5x meets your usage",
      savingsType: "downgrade",
      monthlySavings,
      annualSavings: monthlySavings * 12,
      confidence: "low",
      reason: `ChatGPT Pro 20x is designed for users running parallel intensive workflows who consistently exceed Pro 5x limits. If you have not hit Pro 5x limits, the $100/seat/month difference may not be earning its cost. Pro 5x provides identical model access — only the usage ceiling differs.`,
      isOptimal: false,
    }
  }

  // Claude Max 20x for light users
  if (tool.name === "Claude" && tool.plan === "Max 20x") {
    const monthlySavings = tool.monthlySpend - 100 * tool.seats
    if (monthlySavings <= 0) return null
    return {
      toolName: tool.name,
      currentPlan: tool.plan,
      currentSpend: tool.monthlySpend,
      recommendedAction: "Consider whether Claude Max 5x covers your usage",
      savingsType: "downgrade",
      monthlySavings,
      annualSavings: monthlySavings * 12,
      confidence: "low",
      reason: `Claude Max 20x provides 20x the usage of Claude Pro, designed for users who hit limits daily across extended sessions. If your team has not consistently exhausted Max 5x limits, Max 20x may be over-provisioned. The models and features are identical — only the usage volume ceiling differs.`,
      isOptimal: false,
    }
  }

  return null
}

// ─── Cross-Tool Overlap Evaluation ───────────────────────────────────────────
// Advisory only — never hard recommendations for tool removal

function evaluateOverlaps(input: ExtendedUserInput): ToolRecommendation[] {
  const recommendations: ToolRecommendation[] = []
  const tools = input.tools
  const toolNames = tools.map((t) => t.name)

  // Check every pair of tools for overlap
  for (let i = 0; i < tools.length; i++) {
    for (let j = i + 1; j < tools.length; j++) {
      const toolA = tools[i]
      const toolB = tools[j]
      const profile = getOverlapProfile(toolA.name, toolB.name)

      if (!profile) continue

      // Only flag if overlap is significant
      if (profile.overlapPercent < 50) continue

      // Skip if user hit limits on either tool
      const aHitLimits = input.hasHitLimits[toolA.name]
      const bHitLimits = input.hasHitLimits[toolB.name]
      if (aHitLimits || bHitLimits) continue

      // Determine which tool to flag based on cost
      const removeCandidate =
        toolA.monthlySpend <= toolB.monthlySpend ? toolA : toolB
      const keepCandidate =
        toolA.monthlySpend <= toolB.monthlySpend ? toolB : toolA

      const monthlySavings = removeCandidate.monthlySpend

      // High overlap = medium confidence suggestion
      // Lower overlap = low confidence, informational only
      const confidence: ConfidenceLevel =
        profile.overlapPercent >= 80 ? "medium" : "low"

      const actionVerb =
        profile.friction === "high"
          ? "Worth reviewing whether you still need"
          : profile.friction === "medium"
          ? "Consider whether you still need"
          : "Consider consolidating by removing"

      recommendations.push({
        toolName: removeCandidate.name,
        currentPlan: removeCandidate.plan,
        currentSpend: removeCandidate.monthlySpend,
        recommendedAction: `${actionVerb} ${removeCandidate.name}`,
        savingsType: "remove",
        monthlySavings,
        annualSavings: monthlySavings * 12,
        confidence,
        reason: `${toolA.name} and ${toolB.name} overlap in approximately ${profile.overlapPercent}% of use cases. ${keepCandidate.name} uniquely provides: ${
          keepCandidate.name === toolA.name
            ? profile.uniqueValueA
            : profile.uniqueValueB
        }. If ${removeCandidate.name} is not being used for its unique capabilities (${
          removeCandidate.name === toolA.name
            ? profile.uniqueValueA
            : profile.uniqueValueB
        }), consolidating on ${keepCandidate.name} could save $${monthlySavings}/month.`,
        isOptimal: false,
      })
    }
  }

  return recommendations.filter((r) => toolNames.includes(r.toolName))
}

// ─── Billing Predictability Warnings ─────────────────────────────────────────
// Flags credit-based tools — not a savings recommendation, an operational insight

function evaluateBillingPredictability(
  tools: ToolEntry[]
): ToolRecommendation[] {
  const recommendations: ToolRecommendation[] = []

  for (const tool of tools) {
    const toolPricing = PRICING[tool.name]
    if (!toolPricing) continue

    const planInfo = toolPricing.plans.find(
      (p) => p.name.toLowerCase() === tool.plan.toLowerCase()
    )
    if (!planInfo) continue
    if (planInfo.predictable) continue

    // This tool uses credit-based billing
    // Flag it as an operational insight, not a savings recommendation
    recommendations.push({
      toolName: tool.name,
      currentPlan: tool.plan,
      currentSpend: tool.monthlySpend,
      recommendedAction: "Monitor monthly credit usage",
      savingsType: "optimize",
      monthlySavings: 0,
      annualSavings: 0,
      confidence: "high",
      reason: `${tool.name} ${tool.plan} uses credit-based billing — your actual monthly cost varies based on which AI models you select. Auto mode usage is typically unlimited, but manually selecting premium models (Claude Sonnet, GPT-4, Gemini Pro) draws from your credit pool. Heavy users have reported exhausting $60-$200 plans within days. Track your credit consumption weekly to avoid bill surprises.`,
      isOptimal: true, // not a problem to fix, just awareness
    })
  }

  return recommendations
}