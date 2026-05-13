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


## Interview 3 — Startup Engineer Using Claude for High-Context Development Workflows

**Name:** Naval Kishor  
**Role:** Software Engineer  
**Company Stage:** Mid-sized startup  
**Company:** Anonymous (requested privacy)  
**Platform:** WhatsApp conversation  
**Duration:** ~10 minutes

### Direct Quotes

> “Claude sonnet 4.6 for normal coding tasks with skills + for docs claude opus 4.6.”

> “Better because it has a good context holding up to 400k tokens.”

> “Like we are able to do 5 day tasks in 1 day.”

> “Yes there is some extra review / debugging overhead.”

> “They can remove the co-pilot. And replace it with claude.”

---

### Most Surprising Thing They Said

The most surprising insight was how strongly workflow value was tied to context-window capacity rather than just raw model intelligence. The engineer specifically highlighted long-context handling as the reason their team preferred Claude workflows.

Another surprising point was the scale of perceived productivity improvement (“5 day tasks in 1 day”) despite still acknowledging meaningful debugging and review overhead.

This contradiction reinforced that teams may still consider AI workflows highly valuable even when outputs are not fully reliable.

---

### What It Changed About My Design

This conversation reinforced that AI-tool evaluation is not purely about subscription pricing. Teams are often optimizing around:
- context retention,
- implementation speed,
- workflow continuity,
- and reduced engineering turnaround time.

Initially, my audit engine focused heavily on overlap detection and pricing optimization.

After this discussion, I became more careful about recommending tool consolidation when a tool provides operational advantages that are difficult to quantify directly through pricing alone.

It also strengthened my decision to include:
- usage intensity,
- heavy-user protections,
- and workflow-aware recommendation logic

inside the audit engine instead of relying on simplistic cost-cutting rules.