# Metrics

## North Star Metric

**Qualified leads generated per week** — defined as email captures from users whose audit shows more than $100/month in potential savings.

This is the right North Star because SpendSmart AI is a lead-generation tool for Credex. A user who completes an audit but has no savings potential is not a qualified lead. A user who sees $500/month in savings and submits their email is exactly who Credex wants to talk to. Everything else is upstream of this number.

## 3 Input Metrics

**1. Audit completion rate**
Percentage of visitors who complete the full audit and reach the results page. Target: 40 percent. If this drops it means the form is too long or confusing. This is the biggest lever on lead volume.

**2. Email capture rate**
Percentage of users who complete an audit and then submit their email. Target: 20 percent. If this drops it means the results page is not showing enough value or the email gate feels too early. We only ask for email after showing value — this rate validates that decision.

**3. Share URL click-through rate**
Percentage of generated share URLs that get opened by someone other than the creator. Target: 15 percent of audits generate at least one external view. This measures the viral loop — if people share their audits, we get free distribution.

## What we would instrument first

1. Funnel events: page_view, form_started, tool_added, audit_completed, email_submitted, share_copied
2. Per-audit savings distribution — histogram of savings amounts to understand what the typical user looks like
3. Tool popularity — which AI tools appear most in audits, to prioritize audit engine improvements
4. Referrer source — where users are coming from to know which distribution channels work

We would use Vercel Analytics for page views and a simple Supabase event log for funnel events. No third-party analytics tool needed at this stage.

## Pivot trigger

If after 500 audits the email capture rate is below 5 percent, we pivot the email gate strategy — either removing it entirely and replacing with a Credex CTA, or testing a different value proposition on the results page.

If after 1000 audits the average savings shown is below $50/month, we revisit the audit engine logic — it may be too conservative and not surfacing real savings opportunities.

DAU is not a useful metric for this tool. Most users run one audit and return only when their stack changes. Weekly qualified leads is the only number that matters at this stage.
