# Reflection

## 1. The hardest bug you hit this week

The hardest bug was the JSX parsing error caused by special unicode characters when pasting code into vim. The arrow symbol and other special characters were being corrupted during paste, causing Next.js to fail with "Expression expected" and "Unterminated regex literal" errors that were very hard to trace.

My debugging process: I first assumed the JSX syntax was wrong and tried fixing individual lines. I formed a hypothesis that the issue was with the arrow symbol and replaced it — but the error persisted. I then ran `sed -n '95,105p'` to inspect the exact bytes around the error line, which revealed invisible non-ASCII characters embedded in the file. My second hypothesis was that vim was corrupting the paste. I verified this by checking the raw file with `cat` and seeing garbled characters. The fix was to stop using vim for large pastes entirely and switch to `cat` heredoc which writes bytes directly without terminal interpretation. Once I switched to cat, all subsequent file writes worked perfectly.

## 2. A decision you reversed mid-week

I initially planned to use the Anthropic API for the AI summary feature since the assignment preferred it. I set up the account and got to the billing page before realizing it requires a minimum $20 purchase with no free tier. I reversed this decision and switched to the Gemini API which has a genuinely free tier at aistudio.google.com.

The reversal was driven by a practical constraint — I should not need to spend money to complete an internship assignment. The assignment itself says "preferred — apply for free credits if you don't have access" which implies free access should be possible. Gemini was the right call: free, fast, and the assignment explicitly allows any LLM. I documented this decision in ARCHITECTURE.md and noted it in DEVLOG.md on Day 3.

## 3. What I would build in week 2

In week 2 I would focus on three things. First, a benchmark mode showing "your AI spend per developer is $X — companies your size average $Y" using anonymized aggregate data from all audits run so far. This makes the tool stickier and more shareable. Second, a PDF export of the full audit report so users can share it with their CFO or manager as a formal document. Third, an embeddable widget — a script tag bloggers and newsletter writers could drop into their content, which would dramatically expand distribution. I would also add a referral system where sharing the tool gives both parties a discount on Credex credits, creating a viral loop with real incentive.

## 4. How I used AI tools

I used Claude heavily throughout this week for code generation, debugging, and architecture decisions. Specifically I used it to generate the initial boilerplate for components, API routes, and the audit engine logic. I also used it to debug the vim paste corruption issue and the Next.js 15 params awaiting problem.

Tasks I did not trust AI with: the actual audit logic reasoning. I reviewed every savings recommendation manually to ensure the reasoning was defensible to a finance person — for example checking that the Claude Team minimum seat count was accurate and that the Cursor Business vs Pro recommendation made sense at different team sizes.

One specific time the AI was wrong: Claude suggested using `params.id` directly in the Next.js 15 API route without awaiting params. This caused a TypeScript build error on Vercel. I caught it because the local build failed and the error message clearly said params is a Promise in Next.js 15. I fixed it by changing to `const { id } = await context.params` which is the correct pattern.

## 5. Self-rating

- **Discipline: 7/10** — I started on Day 1 and committed every day, but some days were shorter than I would have liked due to debugging time.
- **Code quality: 6/10** — The code is readable and typed but has some any types in the API routes that I would clean up with more time.
- **Design sense: 7/10** — The dark theme with green accents looks professional and the results page is genuinely shareable, but mobile polish could be better.
- **Problem solving: 8/10** — Debugged the vim corruption issue, the Next.js 15 params issue, and the Vercel build failures systematically with hypotheses and verification steps.
- **Entrepreneurial thinking: 6/10** — I understood the user and the business model but would have liked more time for the GTM and economics files.
