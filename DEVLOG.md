## Day 1 — 2026-05-06

**Hours worked:** 1.5 ~ 2

**What I did:** Initialized Next.js project with TypeScript, Tailwind CSS, and ESLint. Installed core dependencies (Supabase, Resend, Zustand, Radix UI, Lucide). Pushed initial commit to GitHub.

**What I learned:** Next.js App Router structure differs from Pages Router : layouts and loading states are file-based.

**Blockers / what I'm stuck on:** None yet. Need to set up Supabase project and get Gemini API key tomorrow. I checked for Anthropic API key , but it wasn't free , so I have decided to use Gemini API key as of now .

**Plan for tomorrow:** Build the spend input form with all required AI tools and plan options.


## Day 2 — 2026-05-08

**Hours worked:** 3

**What I did:** Built the core types, Zustand store with localStorage persistence, tool config with pricing data for 8 AI tools, ToolRow component, main form page, audit engine with defensible savings logic, and the audit results page showing per-tool breakdown and total savings.

**What I learned:** JSX doesn't handle special unicode characters well when pasted via terminal , learned to use `cat` heredoc instead of vim for large file creation. Also learned how Zustand persist middleware works for form state across reloads.

**Blockers / what I'm stuck on:** Special character encoding issue with vim causing JSX parse errors . resolved by rewriting files using cat. Minor terminal warnings remain but page renders correctly.

**Plan for tomorrow:** Add AI-generated summary using Gemini API, set up Supabase for lead capture, add email confirmation via Resend, and build the shareable URL feature.


## Day 3 — 2026-05-09

**Hours worked:** 3~3.5 

**What I did:** Set up Supabase database with leads table and RLS policies. Created Gemini API route for AI-generated audit summaries with fallback template. Built lead capture form on results page. Integrated Resend for transactional emails with HTML template. Verified end-to-end flow — leads saving to Supabase and emails delivering successfully.

**What I learned:** Supabase now has publishable/secret keys instead of the old anon/service_role format. Resend's free tier uses onboarding@resend.dev as sender which works fine for development.

**Blockers / what I'm stuck on:** None today — everything worked smoothly.

**Plan for tomorrow:** Build shareable audit URLs with unique IDs, add Open Graph meta tags for link previews, and start on the CI/CD GitHub Actions workflow.
