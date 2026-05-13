## Day 1 — 2026-05-07

**Hours worked:** 0

**What I did:**
- Did not make progress on the project today.

**What I learned:**
- Realized I needed to plan the project structure carefully before jumping into implementation.

**Blockers / what I'm stuck on:**
- None.

**Plan for tomorrow:**
- Read the assignment carefully and understand the evaluation criteria before making technical decisions.

---

## Day 2 — 2026-05-08

**Hours worked:** 1.5

**What I did:**
- Read the assignment document carefully multiple times.
- Analyzed the evaluation rubric and required deliverables.
- Started identifying the core problem the project is trying to solve beyond just building a UI.
- Planned the overall direction of the project and noted important constraints around audit logic, documentation, and user interviews.

**What I learned:**
- The assignment is evaluating product thinking and reasoning depth as much as technical implementation.
- The audit engine needs to focus on pricing efficiency and workflow fit rather than simply recommending the cheapest tools.

**Blockers / what I'm stuck on:**
- Still refining how detailed and realistic the audit recommendation logic should be.

**Plan for tomorrow:**
- Research AI tool pricing in depth.
- Create the initial PRICING_DATA.md file.
- Study real user discussions around AI tooling costs and workflow behavior.

---

## Day 3 — 2026-05-09

**Hours worked:** 4

**What I did:**
- Completed the first version of PRICING_DATA.md using official vendor pricing sources.
- Researched discussions across Reddit and developer communities to better understand real-world AI tooling usage and pricing frustrations.
- Collected observations around pricing psychology, switching resistance, workflow quality, and productivity tradeoffs.
- Reached out to potential users online for short interviews related to AI tool usage and spending behavior.

**What I learned:**
- Users do not optimize purely for the lowest price; many prioritize workflow quality and productivity gains.
- Pricing unpredictability creates more frustration than high pricing alone for many users.
- Different users evaluate AI tools very differently depending on experience level, workload complexity, and dependence on AI-assisted workflows.

**Blockers / what I'm stuck on:**
- Waiting for responses from users to complete the interview portion of the assignment.
- Still refining how the audit engine should balance cost optimization against workflow disruption.

**Plan for tomorrow:**
- Reach out to additional users for interviews.
- Finalize the initial project architecture and folder structure.
- Start building the application foundation and core audit flow.

---

## Day 4 — 2026-05-10

**Hours worked:** 5

**What I did:**
- Finalized my first detailed user interview and documented the key insights from the conversation.
- Finalized the overall project folder structure and architecture direction for the application.
- Reached out to additional people for user interviews to gather more perspectives on AI tooling workflows and pricing behavior.
- Implemented the initial `types.ts` file containing the core TypeScript models for the audit engine and recommendation system.
- Added the first version of `pricing-data.ts` as the centralized pricing metadata source for supported AI tools and plans.

**What I learned:**
- Learned several nuanced insights from the first user interview, especially around “useful output per dollar” and workflow continuity.
- Began understanding the economics and behavioral psychology behind AI tooling usage, including pricing predictability, workflow lock-in, and productivity tradeoffs.
- Realized that building a strong audit engine requires much deeper operational reasoning than simply comparing subscription prices.
- Started refining my understanding of how recommendation logic should balance cost optimization with real workflow value.

**Blockers / what I'm stuck on:**
- Still refining my understanding of vendor pricing models and feature differences to improve the accuracy and maintainability of `pricing-data.ts`.
- Some pricing/features change frequently, making it difficult to decide how much detail should be included without introducing inaccurate assumptions.

**Plan for tomorrow:**
- Continue reaching out to more users for interviews.
- Start implementing and refining the core logic inside the audit engine.
- Begin testing recommendation scenarios and validating whether the logic feels operationally realistic and financially defensible.

---

## Day 5 — 2026-05-11

**Hours worked:** 7

**What I did:**
- Refined the audit engine logic by running multiple test scenarios and improving recommendation behavior based on edge cases and operational realism.
- Added and finalized automated audit-engine tests using Vitest.
- Implemented CI workflow setup to automatically run linting and tests on pushes to the repository.
- Debugged failing CI and lint-related issues during workflow setup.
- Continued improving recommendation quality by refining downgrade logic, overlap detection, and workflow-aware safeguards.
- Started building the frontend UI, including the multi-step audit form structure and initial form components.

**What I learned:**
- Learned how subtle recommendation assumptions can significantly affect trustworthiness and operational realism inside an audit engine.
- Improved my understanding of deterministic recommendation systems and how contextual inputs like compliance requirements, usage intensity, and limit exhaustion affect financial recommendations.
- Learned more about CI workflows, automated testing discipline, and debugging test/lint failures in a real development workflow.
- Repeatedly challenged AI-generated suggestions to validate whether the logic and architecture decisions were operationally defensible rather than blindly accepting generated output.

**Blockers / what I'm stuck on:**
- Encountered lint and CI-related issues while configuring the GitHub Actions workflow.
- Refining audit recommendations still requires careful prompt engineering and iterative reasoning to avoid unrealistic cost-cutting suggestions.

**Plan for tomorrow:**
- Continue building and polishing the frontend UI.
- Integrate the database layer and persistence logic.
- Begin deployment setup and production integration work.

---

## Day 6 — 2026-05-12

**Hours worked:** 9

**What I did:**
- Refined the landing page UI to better align with the product positioning and target audience.
- Built the frontend audit flow including the audit form and results page.
- Integrated Anthropic LLM support for generating AI-powered audit summaries.
- Implemented email delivery functionality using Resend for sending audit reports.
- Tested the UI extensively and refined pricing logic after identifying inaccurate audit outputs.
- Improved result-page readability and adjusted recommendation visibility to make findings clearer and more defensible.

**What I learned:**
- Learned how to integrate and work with Resend for transactional email workflows.
- Gained practical experience integrating LLM APIs into a production-style workflow.
- Improved my understanding of UI/UX requirements for developer-focused SaaS products.
- Learned the importance of validating AI-generated recommendations against deterministic business logic.

**Blockers / what I'm stuck on:**
- Faced multiple issues related to full-report email delivery workflows.
- Encountered integration and debugging issues while working with Anthropic API responses and summary generation.

**Plan for tomorrow:**
- Deploy the application.
- Complete remaining project documentation.
- Finalise audit-sharing flow and polish frontend inconsistencies.
- Continue gathering user interview insights for improving recommendation quality.

---

## Day 7 — 2026-05-13

**Hours worked:** 7

### What I did
- Deployed the application on Vercel.
- Ran Lighthouse analysis on the deployed build and achieved:
  - Performance ≥ 95
  - Accessibility and best-practice improvements through UI refinements.
- Conducted two additional real-world user interviews focused on AI tooling workflows and pricing behavior.
- Completed the remaining documentation files including GTM, Metrics, Economics, and interview analysis.
- Refined deployment configuration, environment variables, and production behavior after testing the live application.

### What I learned
- Improved my understanding of deployment workflows and production debugging while fixing deployment-related issues.
- Gained more confidence handling real-world integration problems instead of only local development issues.
- Researched AI tooling economics and developer workflow behavior more deeply to improve the quality and realism of the documentation.
- Learned how strongly operational workflows influence AI-tool purchasing decisions beyond simple pricing comparisons.

### Blockers / what I'm stuck on
- Getting responses for user interviews became increasingly difficult because most conversations required multiple follow-ups.
- Faced several syntax, typing, and deployment-related issues while moving from local development to production deployment.
- Had to repeatedly debug environment-variable and API integration issues during deployment.

### Plan for tomorrow
- Assignment completed.