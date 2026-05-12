import { AuditResult, ExtendedUserInput } from "./types";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

// ─── Template Fallback ────────────────────────────────────────────────────────
// Used when API fails or key is missing

function templateSummary(
  result: AuditResult,
  input: ExtendedUserInput
): string {
  if (result.isAlreadyOptimal) {
    return `Your ${input.tools.length}-tool AI stack appears well-matched to your team of ${input.teamSize} for ${input.useCase} workflows. No significant plan mismatches, redundant tools, or seat waste detected under your current ${input.usageIntensity} usage profile. We will flag new optimization opportunities as vendor pricing changes.`
  }

  const actionableCount = result.recommendations.filter(
    (r) => r.monthlySavings > 0
  ).length

  const topRec = result.recommendations
    .filter((r) => r.monthlySavings > 0)
    .sort((a, b) => b.monthlySavings - a.monthlySavings)[0]

  return `Your ${input.tools.length}-tool stack has ${actionableCount} optimization opportunity${actionableCount !== 1 ? "ies" : "y"} totalling $${result.totalMonthlySavings}/month. ${topRec ? `The highest-impact finding is ${topRec.toolName}: ${topRec.recommendedAction} saves $${topRec.monthlySavings}/month. ` : ""}These recommendations account for your team size of ${input.teamSize}, ${input.useCase} workflows, ${input.usageIntensity} usage intensity, and any compliance or limit constraints you specified.`
}

// ─── Main Function ────────────────────────────────────────────────────────────

export async function generateSummary(
  result: AuditResult,
  input: ExtendedUserInput
): Promise<string> {
  // If no API key, use template
  if (!ANTHROPIC_API_KEY) {
    console.warn("No Anthropic API key — using template summary")
    return templateSummary(result, input)
  }

  const recommendationText = result.recommendations
    .filter((r) => r.monthlySavings > 0)
    .map(
      (r) =>
        `- ${r.toolName} (${r.currentPlan}): ${r.recommendedAction} — saves $${r.monthlySavings}/mo. Reason: ${r.reason}`
    )
    .join("\n")
  
  const prompt = `You are a financial advisor writing a concise audit summary for a startup founder or engineering manager.

AUDIT CONTEXT:
- Team size: ${input.teamSize} people
- Primary use case: ${input.useCase}
- Usage intensity: ${input.usageIntensity}
- Compliance requirements: ${input.hasComplianceRequirements ? "yes" : "no"}
- Total tools reviewed: ${input.tools.length}
- Total potential monthly saving: $${result.totalMonthlySavings}
- Total potential annual saving: $${result.totalAnnualSavings}

RECOMMENDATIONS FOUND:
${recommendationText || "No savings opportunities found — stack is already optimised."}

Write a 80-100 word summary paragraph for this person. 
Requirements:
- Address them directly as a founder or engineering manager
- Be honest — if savings are low, say the stack is efficient
- Mention the most impactful finding specifically
- Reference their use case and team size naturally
- Sound advisory, not salesy
- Do not use bullet points
- Do not start with "I"
- Do not mention SpendLens by name
- End with one forward-looking sentence
Output only the paragraph, nothing else.`

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 200,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`)
    }

    const data = await response.json()
    const text = data.content?.[0]?.text

    if (!text) throw new Error("Empty response from Anthropic")

    return text.trim()
  } catch (err) {
    console.error("Anthropic API failed, using template:", err)
    return templateSummary(result, input)
  }
}