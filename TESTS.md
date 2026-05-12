# TESTS.md

All tests cover the audit engine (`src/lib/audit-engine.ts`).
Run with: `npm run test`
Framework: Vitest v4

---

## Test File

`src/lib/audit-engine.test.ts`

---

## Tests

### Test 1 — Detects overlap between Cursor and GitHub Copilot
Verifies the engine identifies Cursor and GitHub Copilot as overlapping
tools and recommends consolidation. Checks that monthly savings equal
$30 and annual savings equal $360 for a 3-person team.

### Test 2 — Flags team plan used by fewer users than ideal minimum
Verifies the engine flags Claude Team plan (designed for 5+ users) when
used by only 2 people. Checks that a downgrade recommendation is
generated with positive monthly savings.

### Test 3 — Returns zero savings for already optimal stack
Verifies the engine does not manufacture savings when the user's stack
is already well-matched. Claude Pro for 1 person doing writing returns
zero savings and isAlreadyOptimal = true.

### Test 4 — Calculates annual savings as exactly 12x monthly savings
Verifies mathematical consistency across all recommendations. Both
total annual savings and per-tool annual savings must equal exactly
12 times their monthly equivalents.

### Test 5 — Sets highSavings flag when total monthly savings exceed $500
Verifies the highSavings flag is set correctly for large teams on
premium plans. This flag controls whether the Credex CTA is shown
on the results page.

### Test 6 — Never recommends downgrading a tool the user has hit limits on
Verifies the engine respects the hasHitLimits input. If a user has
explicitly hit limits on Claude Max 20x, no downgrade recommendation
is generated regardless of price.

### Test 7 — Never flags Business or Team plans when compliance is required
Verifies the engine protects Business and Team plan users who have
compliance requirements. SOC 2, SSO, and data residency features
justify the plan cost regardless of team size.

### Test 8 — Every recommendation includes a non-empty reason
Verifies that every recommendation the engine generates includes a
non-empty reason string of at least 20 characters. Reasons are what
make the audit defensible to a finance-literate person.

### Test 9 — Sets lowSavings flag when total monthly savings are under $100
Verifies the lowSavings flag is set correctly for near-optimal stacks.
This flag controls whether the "you're spending well" message is shown
on the results page instead of the savings hero.

### Test 10 — Does not suggest downgrades for heavy users
Verifies the engine never recommends downgrades when usageIntensity
is "heavy". Heavy users are assumed to be using their plan capacity
and downgrade recommendations would be operationally harmful.

---

## How to Run

```bash
# Run all tests once
npm run test

# Run in watch mode during development
npm run test:watch
```

## How CI Runs Them

Every push to main triggers `.github/workflows/ci.yml` which runs:
1. `npm run lint` — ESLint check
2. `npm run test` — all 10 Vitest tests

Both must pass for the commit to show a green check.