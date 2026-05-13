# PROMPTS.md

## Overview

SpendLens uses the Anthropic API in exactly one place: generating the
~100-word personalized audit summary paragraph on the results page.

The audit math itself — plan comparisons, seat waste detection, overlap
identification, confidence levels — is entirely deterministic rule-based
logic. Using AI for recommendations would make them unverifiable and
untestable. Using AI for the summary is appropriate because natural
language synthesis is what LLMs do well and the output does not need
to be financially verified.

**Model used:** claude-haiku-4-5
**Location:** `src/lib/anthropic.ts` — `generateSummary()` function
**Fallback:** Template string if API fails or key is missing

---

## The Production Prompt
You are a financial advisor writing a concise audit summary for a
startup founder or engineering manager.
AUDIT CONTEXT:

Team size: {teamSize} people
Primary use case: {useCase}
Usage intensity: {usageIntensity}
Compliance requirements: {yes/no}
Total tools reviewed: {toolCount}
Total potential monthly saving: ${totalMonthlySavings}
Total potential annual saving: ${totalAnnualSavings}

RECOMMENDATIONS FOUND:
{recommendationList}
Write a 80-100 word summary paragraph for this person.
Requirements:

Address them directly as a founder or engineering manager
Be honest — if savings are low, say the stack is efficient
Mention the most impactful finding specifically
Reference their use case and team size naturally
Sound advisory, not salesy
Do not use bullet points
Do not start with "I"
Do not mention SpendLens by name
End with one forward-looking sentence

Output only the paragraph, nothing else.
---

## Why I Wrote It This Way

**"You are a financial advisor"**
The role framing matters significantly. Early tests with "you are a helpful
assistant" produced generic, non-committal summaries. "Financial advisor"
produced summaries that were direct, specific, and confident — which matches
the product's positioning as a financially defensible audit tool.

**Explicit output format constraints**
"Do not use bullet points" and "Output only the paragraph, nothing else"
were added after early versions returned markdown-formatted lists and
preamble text like "Here is your summary:". These constraints eliminate
post-processing requirements and ensure the output renders correctly
directly in the UI.

**"Do not mention SpendLens by name"**
Without this constraint, the model occasionally inserted the product name
in awkward ways ("SpendLens has identified..."). The summary reads more
naturally as a direct advisor-to-client communication without the tool
name appearing.

**"End with one forward-looking sentence"**
This was added to prevent summaries from ending abruptly on the savings
number. The forward-looking sentence ("revisit this quarterly as pricing
changes") makes the output feel complete and gives the user a clear next
step without being pushy.

**Only including recommendations with savings > 0**
The prompt receives only actionable recommendations, not the full
recommendation list including optimal tools. This prevents the model from
padding the summary with "and your Claude Pro plan is already optimal"
filler text.

---

## What I Tried That Did Not Work

**Attempt 1 — Bullet point format**

Early prompt:
Summarize the audit findings as 3 bullet points.
Each bullet should cover one recommendation with the saving amount.
Result: The output was mechanical and read like a list, not an insight.
A finance person reading bullet points expects to verify each one — which
defeats the purpose of a summary. Abandoned in favor of prose paragraph.

**Attempt 2 — 200 word summary**

Early prompt specified "Write a 150-200 word summary."

Result: The model padded with generic AI product advice — "AI tools are
rapidly evolving and pricing changes frequently" type filler that added
no value. Reducing to 80-100 words forces specificity. Every sentence
has to earn its place.

**Attempt 3 — Including all recommendations in prompt**

Early version passed the full recommendations array including optimal
tools (monthlySavings: 0).

Result: The model summarized the list instead of synthesizing insight.
Outputs like "Your Cursor Pro plan is well-matched, your GitHub Copilot
may overlap with Cursor, and your Claude Pro is optimal" — just restating
the cards, not adding value. Fixed by filtering to only include
recommendations where monthlySavings > 0.

**Attempt 4 — GPT-4 instead of Claude Haiku**

Tested the same prompt with OpenAI's GPT-4 API.

Result: Quality was comparable but cost was 4x higher and latency was
2x longer for this specific task. For an 80-100 word summary that does
not require complex reasoning, Haiku is the correct model. Sonnet and
GPT-4 are overkill.

**Attempt 5 — No role framing**

Tested without the "You are a financial advisor" opener.

Result: Outputs were noticeably more hedged and generic. The model
defaulted to cautious assistant language — "you might want to consider"
instead of "the most impactful change is." Role framing is not just
cosmetic — it measurably changes the register and confidence of the output.

---

## Fallback Behavior

If the Anthropic API fails for any reason — network error, rate limit,
missing API key, invalid response — the `generateSummary()` function
catches the error and returns a deterministic template string:

```typescript
// For stacks with savings:
`Your ${toolCount}-tool stack has ${actionableCount} optimization
opportunity totalling $${totalMonthlySavings}/month. The highest-impact
finding is ${topRec.toolName}: ${topRec.recommendedAction} saves
$${topRec.monthlySavings}/month. These recommendations account for your
team size of ${teamSize}, ${useCase} workflows, ${usageIntensity} usage
intensity, and any compliance or limit constraints you specified.`

// For optimal stacks:
`Your ${toolCount}-tool AI stack appears well-matched to your team of
${teamSize} for ${useCase} workflows. No significant plan mismatches,
redundant tools, or seat waste detected under your current ${usageIntensity}
usage profile. We will flag new optimization opportunities as vendor
pricing changes.`
```

The fallback was tested by removing the API key from `.env.local` and
running a full audit. The results page rendered correctly with the template
summary. Users cannot tell the difference in layout — only the prose
quality differs.

---

## AI Usage Disclosure

Per the assignment requirements: Claude (claude.ai) was used throughout
this project for coding assistance, debugging, and architectural planning.
The audit engine rules, pricing data, and all business logic were written
and verified manually. AI-generated code was reviewed, tested against the
10 automated tests, and modified where incorrect before committing.

One specific instance where AI was wrong: Claude suggested force-pushing
to GitHub to resolve a repository structure problem. This would have
deleted all previous commits and reduced the distinct commit day count
below the required minimum of 5, causing automatic submission rejection.
The suggestion was caught and rejected — the structure problem was worked
around instead by configuring CI with the correct working directory path.