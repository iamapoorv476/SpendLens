## Interview 1 — _crs (Reddit username), Product Manager / Developer

**Name:** _crs (Reddit username, preferred anonymity)
**Role:** Product Management professionally, development personally
**Company Stage:** Medium-sized company
**Platform:** Reddit DM async conversation
**Duration:** ~15 minutes async discussion


### Direct Quotes

> “The question is not simply ‘cheap vs expensive.’ It’s useful output per dollar.”

> “A cheap tool is expensive if it wastes time, gets stuck, or forces me to babysit it.”

> “Metered/API-style pricing is not bad. It’s often the right model for teams and automation, but for solo agentic coding it can push me into spend management mode instead of building mode.”

> “The real unit is: did it help me ship a change, fix a bug, review a PR, or save an hour of focused work?”

> “The things that make switching hard are editor integration, muscle memory, repo understanding, and existing context.”

### Most Surprising Thing They Said

The most surprising insight was that the user did not evaluate AI tools primarily by subscription price or token cost. Instead, they evaluated them based on “useful output per dollar” and whether the tool helped maintain engineering flow without creating cognitive overhead around usage tracking or spend management.

Another surprising point was that the user viewed workflow interruption and mental overhead as part of the effective cost of an AI tool, not just the billing amount itself.

### What It Changed About My Design

This conversation significantly changed how I thought about the audit engine.

Initially, I was approaching recommendations mainly from a cost-reduction perspective. After this discussion, I shifted the audit logic toward evaluating workflow value relative to cost instead of simply recommending the cheapest alternative.

Changes influenced by this interview:
- Recommendations now prioritize productivity-per-dollar instead of raw pricing alone.
- I began treating pricing predictability as an important part of perceived value.
- I started considering user segmentation (casual users vs professional developers vs heavy agentic coding users).
- The audit engine now avoids aggressively recommending tool switching when workflow disruption could outweigh short-term savings.


## Interview 2 — Experienced Developer Using AI as Execution Acceleration

**Name:** habitoti(Reddit username, preferred anoymity)
**Role:** Senior Developer 
**Company Stage:** Medium-sized company  
**Platform:** Reddit async conversation  
**Duration:** ~15 minutes async discussion

### Direct Quotes

> “Once I know what I want to build, I am way too impatient to actually get there by writing line by line.”

> “I still define every bit and feature and don’t go like ‘build me an ERP’, but rather have the final solution in my head and go fully bottom up on a very modular level.”

> “I do my own testing and code reading and challenge edge cases early to the AI to improve.”

> “For a simple web project like the one above, Flash-3 is still good. But I really opt for Sonnet 4.6 for more complex programming.”

---

### Most Surprising Thing They Said

The most surprising insight was that the user did not view AI as a replacement for engineering thinking. Instead, they described AI as a way to remove the emotional friction and implementation fatigue of manually writing every line of code while still maintaining full architectural and testing control themselves.

Another surprising detail was how intentionally they segmented model usage:
- cheaper/faster models for lightweight projects,
- stronger reasoning models for complex implementation work.

This reinforced that experienced developers increasingly treat AI models as specialized workflow tools rather than one universal assistant.

---

### What It Changed About My Design

This conversation significantly changed how I thought about optimization logic inside SpendLens.

Originally, the audit engine focused mostly on:
- overlapping subscriptions,
- seat inefficiencies,
- plan downgrades,
- pricing comparisons.

After this discussion, I realized that advanced users often intentionally maintain multiple models because different models fit different workflow phases:
- implementation,
- planning,
- debugging,
- frontend polishing,
- heavy reasoning.

Because of this, I changed the audit logic to avoid aggressively recommending consolidation simply because two tools appear functionally similar on paper.

It also reinforced the importance of:
- workflow-aware recommendations,
- usage intensity detection,
- avoiding simplistic “cheapest plan wins” logic,
- and respecting operational preferences instead of only minimizing spend.


## Interview 3 — Hybrid AI Workflow User Optimizing Around Cost and Model Specialization

**Name:** Theio666  
**Role:** Independent developer / heavy AI tooling user  
**Company Stage:** Solo / individual workflow  
**Platform:** Reddit async conversation  
**Duration:** ~10–15 minute async discussion

### Direct Quotes

> “I mostly use cursor with driving it by Minimax M2.1 (their coding plan), leaving hardest tasks to codex.”

> “30 opus prompts per week is just not enough for me.”

> “Using just cursor is rough nowadays if you're coding anything, I burn through cursor plan in a few days if I'm starting using only it without relying on 3rd party providers/other coding agents.”

> “I dropped cursor a few months ago.”

> “Been using mostly codex (swapped from plus to pro recently) + opencode.”

> “So I use just 2 tools basically nowadays.”

---

### Most Surprising Thing They Said

The most surprising insight was that the user did not optimize around one “best” AI coding tool. Instead, they intentionally routed different types of work across different providers:
- Minimax for coding workflows,
- Codex for harder reasoning tasks,
- Kimi K2.6 for frontend adjustments.

Another surprising detail was that even premium AI subscriptions were not solving the core operational problem because usage limits were still being exhausted within days during heavier development periods.

The user also described gradually simplifying their stack over time after experimenting with many tools, which contradicted my earlier assumption that advanced users naturally continue expanding subscriptions indefinitely.

---

### What It Changed About My Design

This conversation changed how I thought about AI tool overlap detection inside SpendLens.

Initially, my audit logic treated overlapping subscriptions aggressively and leaned toward consolidation recommendations whenever two tools appeared to solve similar problems.

After this conversation, I realized that advanced users often intentionally maintain multiple tools because:
- different models perform better on different workflow phases,
- pricing structures vary dramatically,
- reasoning quality and implementation quality are not always equal,
- and operational sustainability matters more than theoretical capability.

Because of this, I refined the audit logic to:
- avoid naive “replace Tool A with Tool B” recommendations,
- consider workflow specialization,
- respect heavy-user constraints,
- and account for users who intentionally distribute workloads to avoid exhausting plans too quickly.

This directly influenced additions like:
- usageIntensity,
- hasHitLimits,
- and more context-aware recommendation rules inside the audit engine.