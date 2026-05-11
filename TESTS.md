# Tests

All tests are in `src/__tests__/auditEngine.test.ts` and cover the core audit engine logic.

## How to run

```bash
npm test
```

## Test coverage

| Test | File | What it covers |
|------|------|---------------|
| audit runs and returns result for valid input | auditEngine.test.ts | Basic smoke test — engine returns a result for valid input |
| cursor business plan with 2 seats recommends downgrade to pro | auditEngine.test.ts | Plan optimization logic for small teams |
| total monthly savings equals sum of individual savings | auditEngine.test.ts | Savings aggregation math is correct |
| annual savings is exactly 12x monthly savings | auditEngine.test.ts | Annual savings calculation |
| cursor hobby plan is marked as optimal | auditEngine.test.ts | Optimal plans are not flagged as savings opportunities |
| having both cursor and windsurf flags windsurf as duplicate | auditEngine.test.ts | Duplicate tool detection logic |
| empty tools list returns zero savings | auditEngine.test.ts | Edge case — empty input handled gracefully |
