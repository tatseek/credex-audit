# feat: add re-audit on pricing change with email notifications and diff view

## What this PR does

Adds a "re-audit on pricing change" system that makes SpendSmart AI audits live instead of one-time. When AI tool pricing changes, users who submitted their email are automatically notified with a consolidated email showing what changed and a one-click link to see how their recommendations have been updated.

## Why

A one-time audit goes stale. Pricing for AI tools changes frequently. A recommendation that was correct a few months ago can become outdated quickly if tool pricing or plan structures change. A user who ran an audit 3 months ago and trusted it is now making decisions on wrong data. Stale audits are worse than no audit because they create false confidence. This feature makes the tool genuinely useful over time, not just at the moment of first use.

The main goal was reducing audit staleness. Users who submitted an email should not need to manually re-check pricing changes themselves.

## How it works

```text
Pricing change detected
|
v
POST /api/detect-changes
|
v
Fetch all audits with user_email from Supabase
|
v
Compare stored pricing_snapshot against current PRICING_SNAPSHOT
|
v
Group affected audits by email (one email per user)
|
v
Send consolidated Resend email with what changed + re-run link
|
v
User clicks link -> /reaudit/[id]
|
v
Fetch stored audit, re-run engine with current pricing
|
v
Show old vs new recommendations side by side with diff highlighted
```

### New files added

- `src/lib/pricingSnapshot.ts` — versioned pricing snapshot stored with every audit
- `src/app/api/detect-changes/route.ts` — pricing change detection and email trigger
- `src/app/reaudit/[id]/page.tsx` — diff view showing old vs new recommendations

### Modified files

- `src/app/api/audits/route.ts` — now stores `user_email` and `pricing_snapshot`
- Supabase `audits` table — added `user_email` and `pricing_snapshot` columns

To update pricing data:
- edit `PRICING_SNAPSHOT` in `src/lib/pricingSnapshot.ts`
- redeploy
- POST to `/api/detect-changes` to notify affected users

## What I cut

- Scheduled cron trigger — Vercel Cron requires Pro plan. Used a manual `POST /api/detect-changes` endpoint instead which is explicitly acceptable per the spec.
- One-click unsubscribe in emails — would require a new DB column and endpoint. Cut due to time. Would be the first thing I add with another 24 hours.
- Admin dashboard showing total audits, emails sent, click-through — cut because the 4 required features were higher priority. The data is all in Supabase and readable directly.
- Fresh AI summary on re-run — the diff view does not call Gemini again. Cut because adding async calls to a server component cleanly would have taken an hour I did not have.

## How to test it manually

Preview deployment URL is attached to this PR via Vercel.

1. Go to the live URL and run an audit with at least one tool
2. Submit your email on the results page
3. Temporarily edit `src/lib/pricingSnapshot.ts` — change Cursor Pro price from 20 to 25
4. Redeploy or run locally with `npm run dev`
5. POST to `/api/detect-changes` using curl:

```bash
curl -X POST http://localhost:3000/api/detect-changes
```

6. Check your inbox — you should receive a pricing change email
7. Click the re-run link in the email
8. You should see the diff view showing the old vs new recommendation for Cursor

## What is tested

Automated tests from Round 1 covering the audit engine still pass — the core logic was not changed, only extended.

I did not add new automated tests for the detect-changes flow in this PR due to time pressure. If I were to add them next, I would test:
- audits with no email are skipped
- two audits for the same email produce one email instead of two
- unchanged pricing produces no emails

## Open questions and risks

- If a user submits multiple audits with the same email, they get one consolidated email but it only links to the first affected audit ID. A user with multiple audits needs a better experience here.
- The pricing snapshot comparison is exact — a price change from `$20.00` to `$20.00` stored as a float could produce false positives due to floating point precision. In production this should use a tolerance check.
