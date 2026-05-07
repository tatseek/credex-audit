# SpendSmart AI — Free AI Spend Auditor

SpendSmart AI helps startup founders and engineering managers find out if they are overpaying for AI tools like Cursor, Claude, ChatGPT, and GitHub Copilot. Enter your current subscriptions and get an instant audit showing exactly where you can save money — no login required.

**Live URL:** _coming soon_

---

## Screenshots

_To be added_

---

## Quick Start

```bash
git clone https://github.com/tatseek/credex-audit.git
cd credex-audit
npm install
npm run dev
```

Open http://localhost:3000

---

## Decisions

**1. Next.js over React + Vite**
Next.js handles frontend and backend API routes in one project, reducing complexity for a short build window.

**2. Zustand over useState for form state**
The form has multiple tools with nested state. Zustand with persist middleware gives localStorage persistence across reloads for free.

**3. Hardcoded audit rules over AI for savings logic**
Rules are transparent, auditable, and defensible to a finance person. The assignment explicitly recommends this approach.

**4. Tailwind CSS for styling**
Full design control without overhead of a component library. The results page needs to look good enough to screenshot and share.

**5. TypeScript over JavaScript**
Catches type errors early, especially important for the audit engine where wrong types could produce incorrect savings calculations.
