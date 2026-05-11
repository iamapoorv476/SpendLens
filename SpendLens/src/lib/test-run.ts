// src/lib/test-run.ts
// Temporary file to manually test the audit engine
// Delete this before submission or add to .gitignore

import { runAudit } from "./audit-engine"
import { ExtendedUserInput } from "./types"

// console.log("Claude Team idealMinSeats:", 
//   PRICING["Claude"].plans.find(p => p.name === "Team")?.idealMinSeats)
// console.log("Claude Team monthlyPrice:", 
//   PRICING["Claude"].plans.find(p => p.name === "Team")?.monthlyPrice)


// ─── Test Case 1 ─────────────────────────────────────────────────────────────
// Classic overlap: developer paying for both Cursor and Copilot

const test1: ExtendedUserInput = {
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

// ─── Test Case 2 ─────────────────────────────────────────────────────────────
// Small team on team/business plans — overkill

const test2: ExtendedUserInput = {
  teamSize: 2,
  useCase: "writing",
  hasHitLimits: {},
  usageIntensity: "moderate",
  hasComplianceRequirements: false,
  tools: [
    { name: "Claude", plan: "Team", seats: 2, monthlySpend: 60 },
    { name: "ChatGPT", plan: "Business", seats: 2, monthlySpend: 50 },
  ],
}

// ─── Test Case 3 ─────────────────────────────────────────────────────────────
// Already optimal — should return zero savings

const test3: ExtendedUserInput = {
  teamSize: 1,
  useCase: "writing",
  hasHitLimits: { "Claude": true},
  usageIntensity: "heavy",
  hasComplianceRequirements: false,
  tools: [
    { name: "Claude", plan: "Pro", seats: 1, monthlySpend: 20 },
  ],
}

// ─── Test Case 4 ─────────────────────────────────────────────────────────────
// Heavy spender — Gemini Ultra for writing use case

const test4: ExtendedUserInput = {
  teamSize: 2,
  useCase: "writing",
  hasHitLimits: { "Gemini": true },
  usageIntensity: "moderate",
  hasComplianceRequirements: false,
  tools: [
    { name: "Gemini", plan: "AI Ultra", seats: 2, monthlySpend: 500 },
    { name: "ChatGPT", plan: "Pro 20x", seats: 2, monthlySpend: 400 },
    { name: "Cursor", plan: "Teams", seats: 2, monthlySpend: 80 },
    { name: "GitHub Copilot", plan: "Business", seats: 2, monthlySpend: 38 },
  ],
}

// ─── Test Case 5 ─────────────────────────────────────────────────────────────
// Your own scenario — edit this with whatever you want to test

const test5: ExtendedUserInput = {
  teamSize: 4,
  useCase: "mixed",
  hasHitLimits: {},
  usageIntensity: "light",
  hasComplianceRequirements: false,
  tools: [
    { name: "Cursor", plan: "Pro+", seats: 4, monthlySpend: 240 },
    { name: "Claude", plan: "Max 5x", seats: 2, monthlySpend: 200 },
    { name: "ChatGPT", plan: "Plus", seats: 4, monthlySpend: 80 },
    { name: "GitHub Copilot", plan: "Business", seats: 4, monthlySpend: 76 },
  ],
}

// ─── Runner ───────────────────────────────────────────────────────────────────

function printResult(label: string, input: ExtendedUserInput) {
  console.log("\n" + "=".repeat(60))
  console.log(`TEST: ${label}`)
  console.log("=".repeat(60))

  

  const result = runAudit(input)

  console.log(`\nTotal Monthly Savings: $${result.totalMonthlySavings}`)
  console.log(`Total Annual Savings:  $${result.totalAnnualSavings}`)
  console.log(`Already Optimal:       ${result.isAlreadyOptimal}`)
  console.log(`High Savings (>$500):  ${result.highSavings}`)
  console.log(`Low Savings (<$100):   ${result.lowSavings}`)

  console.log("\nRecommendations:")
  for (const rec of result.recommendations) {
    console.log(`\n  Tool:    ${rec.toolName} (${rec.currentPlan})`)
    console.log(`  Action:  ${rec.recommendedAction}`)
    console.log(`  Saves:   $${rec.monthlySavings}/mo`)
    console.log(`  Reason:  ${rec.reason}`)
    console.log(`  Optimal: ${rec.isOptimal}`)
  }
}

printResult("Cursor + Copilot overlap", test1)
printResult("Small team on team plans", test2)
printResult("Already optimal", test3)
printResult("Heavy spender wrong use case", test4)
printResult("Custom scenario", test5)