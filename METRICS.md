# METRICS.md

## North Star Metric

### Percentage of completed audits that generate a qualified lead

SpendLens is fundamentally a workflow-aware B2B lead-generation tool disguised as a free audit utility. The most important signal is not raw traffic or daily active users because this is not a habit product. Most users will only run an AI spend audit occasionally — usually when:
- costs increase,
- teams expand,
- workflows change,
- or leadership starts questioning AI ROI.

Because of that, the core metric I would optimize for is:

> % of completed audits that convert into qualified leads

A “qualified lead” means the user:
- completes the audit,
- views the result page,
- and either submits their email or triggers the high-savings Credex CTA.

This metric directly measures whether the audit generated enough perceived value and trust for users to continue the conversation.
This metric directly measures whether the audit generated enough perceived 
value and trust for users to continue the conversation.

DAU would be the wrong metric for SpendLens. A founder or engineering 
manager audits their AI stack once a quarter at most — high daily active 
users would signal something is broken, not something is working.

---

## Input Metrics That Drive The North Star

### 1. Audit Completion Rate
The percentage of users who start the audit and successfully reach the results page.

This measures:
- form friction,
- UX clarity,
- and whether the audit feels worth completing.

Low completion rates would indicate the workflow is too long, confusing, or not credible enough.

---

### 2. Recommendation Acceptance Signal
The percentage of users who interact with recommendations:
- expand tool cards,
- copy/share audits,
- or spend meaningful time on the results page.

This measures whether recommendations feel believable instead of generic AI-generated advice.

---

### 3. Email Capture Conversion Rate
The percentage of users who submit an email after seeing their results.

This is the strongest trust indicator because users only share contact information if they believe:
- the recommendations are credible,
- the savings are realistic,
- and the tool understands their workflow.

---

## What I’d Instrument First

The first analytics events I would instrument are:
- audit_started
- audit_completed
- result_viewed
- email_submitted
- recommendation_expanded
- high_savings_triggered
- shareable_link_created

These events would help identify where users lose trust or abandon the workflow.

---

## What Number Triggers A Pivot Decision

Target audit completion rate: above 60%
Target email capture rate: above 25%
Target recommendation acceptance: above 40% interact with at least one card

If fewer than 15% of completed audits convert into qualified leads after meaningful traffic and iteration, I would reconsider the product direction.

That would suggest one of three problems:
- users do not trust the recommendations,
- the perceived savings are not meaningful,
- or AI spend optimization is not painful enough to justify a dedicated workflow-aware audit tool.

At that point, I would likely pivot from “cost optimization” toward:
- AI workflow governance,
- usage visibility,
- or team-level spend management infrastructure.