import { describe, it, expect } from "vitest"
import { runAudit } from "./audit-engine"
import { ExtendedUserInput } from "./types"

describe("Audit Engine", () => {
    // ─── Test 1 ─────────────────────────────────────────────────────────────

    it("detects overlap between Cursor and GitHub Copilot", () => {
    const input: ExtendedUserInput = {
      teamSize: 3,
      useCase: "coding",
      hasHitLimits: {},
      usageIntensity: "moderate",
      hasComplianceRequirements: false,
      tools: [
        { name: "Cursor", plan: "Pro", seats: 3, monthlySpend: 60 },
        { name: "GitHub Copilot", plan: "Pro", seats: 3, monthlySpend: 30 },
      ],
    }

    const result = runAudit(input)

    // Must detect Copilot as redundant with Cursor
    const copilotRec = result.recommendations.find(
      (r) => r.toolName === "GitHub Copilot"
    )

    expect(copilotRec).toBeDefined()
    expect(copilotRec?.isOptimal).toBe(false)
    expect(copilotRec?.monthlySavings).toBeGreaterThan(0)
    expect(result.totalMonthlySavings).toBe(30)
    expect(result.totalAnnualSavings).toBe(360)
  })

  // ─── Test 2 ─────────────────────────────────────────────────────────────

  it("flags team plan used by fewer users than ideal minimum", () => {
    const input: ExtendedUserInput = {
      teamSize: 2,
      useCase: "writing",
      hasHitLimits: {},
      usageIntensity: "moderate",
      hasComplianceRequirements: false,
      tools: [
        { name: "Claude", plan: "Team", seats: 2, monthlySpend: 60 },
      ],
    }

    const result = runAudit(input)

    const claudeRec = result.recommendations.find(
      (r) => r.toolName === "Claude"
    )

    expect(claudeRec).toBeDefined()
    expect(claudeRec?.isOptimal).toBe(false)
    expect(claudeRec?.monthlySavings).toBeGreaterThan(0)
    expect(claudeRec?.savingsType).toBe("optimize")
  })

  // ─── Test 3 ─────────────────────────────────────────────────────────────

  it("returns zero savings for already optimal stack", () => {
    const input: ExtendedUserInput = {
      teamSize: 1,
      useCase: "writing",
      hasHitLimits: {},
      usageIntensity: "moderate",
      hasComplianceRequirements: false,
      tools: [
        { name: "Claude", plan: "Pro", seats: 1, monthlySpend: 20 },
      ],
    }

    const result = runAudit(input)

    expect(result.totalMonthlySavings).toBe(0)
    expect(result.totalAnnualSavings).toBe(0)
    expect(result.isAlreadyOptimal).toBe(true)
  })

  // ─── Test 4 ─────────────────────────────────────────────────────────────

  it("calculates annual savings as exactly 12x monthly savings", () => {
    const input: ExtendedUserInput = {
      teamSize: 2,
      useCase: "coding",
      hasHitLimits: {},
      usageIntensity: "moderate",
      hasComplianceRequirements: false,
      tools: [
        { name: "Cursor", plan: "Teams", seats: 2, monthlySpend: 80 },
        { name: "GitHub Copilot", plan: "Business", seats: 2, monthlySpend: 38 },
      ],
    }

    const result = runAudit(input)

    // Annual must always equal monthly * 12
    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12)

    // Each recommendation must also be consistent
    for (const rec of result.recommendations) {
      expect(rec.annualSavings).toBe(rec.monthlySavings * 12)
    }
  })

  // ─── Test 5 ─────────────────────────────────────────────────────────────

  it("sets highSavings flag when total monthly savings exceed $500", () => {
    const input: ExtendedUserInput = {
      teamSize: 5,
      useCase: "mixed",
      hasHitLimits: {},
      usageIntensity: "light",
      hasComplianceRequirements: false,
      tools: [
        { name: "Cursor", plan: "Ultra", seats: 5, monthlySpend: 1000 },
        { name: "GitHub Copilot", plan: "Enterprise", seats: 5, monthlySpend: 195 },
        { name: "ChatGPT", plan: "Pro 20x", seats: 5, monthlySpend: 1000 },
        { name: "Claude", plan: "Max 20x", seats: 5, monthlySpend: 1000 },
      ],
    }

    const result = runAudit(input)

    expect(result.highSavings).toBe(true)
    expect(result.totalMonthlySavings).toBeGreaterThan(500)
  })

  // ─── Test 6 ─────────────────────────────────────────────────────────────

  it("never recommends downgrading a tool the user has hit limits on", () => {
    const input: ExtendedUserInput = {
      teamSize: 1,
      useCase: "writing",
      hasHitLimits: { "Claude": true },
      usageIntensity: "heavy",
      hasComplianceRequirements: false,
      tools: [
        { name: "Claude", plan: "Max 20x", seats: 1, monthlySpend: 200 },
      ],
    }

    const result = runAudit(input)

    const claudeRec = result.recommendations.find(
      (r) => r.toolName === "Claude"
    )

    expect(claudeRec?.savingsType).not.toBe("downgrade")
    expect(claudeRec?.monthlySavings).toBe(0)
  })

  // ─── Test 7 ─────────────────────────────────────────────────────────────

  it("never flags Business or Team plans when compliance is required", () => {
    const input: ExtendedUserInput = {
      teamSize: 2,
      useCase: "writing",
      hasHitLimits: {},
      usageIntensity: "moderate",
      hasComplianceRequirements: true,  // compliance required
      tools: [
        { name: "Claude", plan: "Team", seats: 2, monthlySpend: 60 },
        { name: "ChatGPT", plan: "Business", seats: 2, monthlySpend: 50 },
      ],
    }

    const result = runAudit(input)
    for (const rec of result.recommendations) {
      expect(rec.monthlySavings).toBe(0)
      expect(rec.isOptimal).toBe(true)
    }
  })

  // ─── Test 8 ─────────────────────────────────────────────────────────────

  it("every recommendation includes a non-empty reason", () => {
    const input: ExtendedUserInput = {
      teamSize: 3,
      useCase: "mixed",
      hasHitLimits: {},
      usageIntensity: "light",
      hasComplianceRequirements: false,
      tools: [
        { name: "Cursor", plan: "Pro+", seats: 3, monthlySpend: 180 },
        { name: "GitHub Copilot", plan: "Business", seats: 3, monthlySpend: 57 },
        { name: "Claude", plan: "Max 5x", seats: 3, monthlySpend: 300 },
        { name: "ChatGPT", plan: "Plus", seats: 3, monthlySpend: 60 },
      ],
    }

    const result = runAudit(input)

    for (const rec of result.recommendations) {
      expect(rec.reason).toBeDefined()
      expect(rec.reason.length).toBeGreaterThan(20)
      expect(rec.toolName).toBeDefined()
      expect(rec.recommendedAction).toBeDefined()
    }
  })

  // ─── Test 9 ─────────────────────────────────────────────────────────────

  it("sets lowSavings flag when total monthly savings are under $100", () => {
    const input: ExtendedUserInput = {
      teamSize: 1,
      useCase: "coding",
      hasHitLimits: {},
      usageIntensity: "moderate",
      hasComplianceRequirements: false,
      tools: [
        { name: "Cursor", plan: "Pro", seats: 1, monthlySpend: 20 },
        { name: "GitHub Copilot", plan: "Pro", seats: 1, monthlySpend: 10 },
      ],
    }

    const result = runAudit(input)

    expect(result.lowSavings).toBe(true)
    expect(result.totalMonthlySavings).toBeLessThan(100)
  })

  // ─── Test 10 ──────────────────────────────────────────────────────────

  it("does not suggest downgrades for heavy users", () => {
    const input: ExtendedUserInput = {
      teamSize: 2,
      useCase: "coding",
      hasHitLimits: {},
      usageIntensity: "heavy",  // heavy user
      hasComplianceRequirements: false,
      tools: [
        { name: "Claude", plan: "Max 20x", seats: 2, monthlySpend: 400 },
        { name: "ChatGPT", plan: "Pro 20x", seats: 2, monthlySpend: 400 },
      ],
    }

    const result = runAudit(input)

    const downgradeRecs = result.recommendations.filter(
      (r) => r.savingsType === "downgrade"
    )

    // No downgrade recommendations for heavy users
    expect(downgradeRecs.length).toBe(0)
  })

})

