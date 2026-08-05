# Round 2 Devlog

## 2026-05-20 9:00 — Start
Read the Round 2 assignment carefully. Feature is clear: make audits live by detecting pricing changes and notifying users. Going to plan first, build second.

## 2026-05-20 9:40 — Decided on approach
Already have Supabase and Resend from Round 1 so no new services needed. Will use a manual /api/detect-changes endpoint instead of cron — acceptable per the spec and simpler to ship in 36 hours. Vercel Cron requires Pro plan anyway.

## 2026-05-20 10:00 — Created branch and updated Supabase schema
Created round-2-reaudit branch. Added user_email and pricing_snapshot columns to audits table via SQL editor. Straightforward.

## 2026-05-20 11:30 — Built pricing snapshot system
Created pricingSnapshot.ts with current prices for all 8 tools. This gets stored with every audit so we can compare later. Key insight: storing the snapshot at audit time is the only reliable way to detect changes later.

## 2026-05-20 12:00 — Built detect-changes endpoint
POST /api/detect-changes fetches all audits with emails, compares stored pricing snapshot against current prices, groups changes by user email, sends one consolidated email per user. Took longer than expected to get the grouping logic right.

## 2026-05-20 13:00 — Built notification email
Resend integration for pricing change emails. Email shows what changed, old vs new price per seat, and a one-click re-run link. Reused the HTML email pattern from Round 1.

## 2026-05-20 13:35~40 — Built diff view page
/reaudit/[id] fetches the stored audit, re-runs it with current pricing, and shows old vs new recommendations side by side. Changed recommendations highlighted in yellow with strikethrough on old action and new action below it.

## 2026-05-20 14:00 — Build passing, tested end to end
Ran npm run build — clean pass. Tested manually: submitted audit with email, ran detect-changes, received email, clicked re-run link, saw diff view. Full flow works.

## 2026-05-20 17:30 — Debugged deployment mismatch

Audit rows in Supabase were still showing NULL for user_email and pricing_snapshot even though local testing worked. Traced the issue to Vercel production still deploying from main instead of the round-2-reaudit branch. Created a preview deployment from the feature branch and verified the fix end-to-end after redeploying.

## 2026-05-20 18:00 — Writing MD files and opening PR
ROUND2_DEVLOG, ROUND2_PR, ROUND2_REFLECTION. Will open PR and submit form before deadline.
