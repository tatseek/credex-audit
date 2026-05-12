# User Interviews

Three interviews conducted during the week with people from my network who use AI tools. Each conversation was around 10 to 15 minutes, done over WhatsApp call or in person.

---

## Interview 1

**Name:** Aditi Singh 
**Role:** Third year B.Tech student, does freelance web development on the side
**Company stage:** Solo freelancer, 2 active clients

**Summary:**
Aditi pays for Claude Pro and recently started using Cursor after seeing it recommended on YouTube. She tracks her expenses carefully since she funds everything from freelance income. We talked in hostel after class for about 12 minutes.

**Direct quotes:**
- "I just pay whatever the app asks. I never sat down and thought about whether I actually need the Pro plan."
- "Wait, Cursor and GitHub Copilot do the same thing? I have been using both for two months."
- "If this thing told me I could save 500 rupees a month I would actually use it every time I add a new tool."

**Most surprising thing:**
She did not realize she was paying for overlapping tools. When I showed her the duplicate tool detection in the audit, she immediately said she would cancel GitHub Copilot since she preferred Cursor anyway. She had been paying for both for two months without noticing.

**What it changed about the design:**
This confirmed the duplicate tool detection feature was the most valuable part of the audit for solo developers. I made sure the warning for duplicate tools was visually distinct with a yellow border so it stands out immediately.

---

## Interview 2

**Name:** Devika Soni
**Role:** Third year B.Tech student, working as a full stack intern at a startup
**Company stage:** The startup has around 12 people, early stage

**Summary:**
Devika uses Claude Pro for her internship work and recently convinced her team lead to get GitHub Copilot Business for the dev team. She manages her own personal subscriptions separately. We spoke over WhatsApp call for about 12 minutes after she finished her internship shift.

**Direct quotes:**
- "At my internship we just got Copilot added for everyone but half the team still uses ChatGPT anyway. Nobody switched."
- "I did not know Claude had a Team plan. I thought it was just Pro or Enterprise, nothing in between."
- "If I showed this to my team lead he would actually listen. A tool that shows exact rupee savings is hard to ignore."

**Most surprising thing:**
She mentioned that her internship team is paying for GitHub Copilot Business for 8 developers but at least 4 of them still use ChatGPT because they are used to it. They are essentially paying for a tool half the team ignores — a real overspend pattern that pure plan analysis cannot catch.

**What it changed about the design:**
This made me add a note on team plan recommendations suggesting users verify actual usage before renewing, since seat count alone does not tell the full story. Devika's situation showed that the real waste is often in unused seats, not just wrong plans.

---

## Interview 3

**Name:** Anusha Yadav
**Role:** Third year B.Tech student, working as a backend intern at Hookfish (startup)
**Company stage:** Hookfish is an early stage startup, around 10 people

**Summary:**
Anusha uses Claude Pro personally and her team at Hookfish recently started using Cursor Pro for all developers. She is hands on with the codebase daily and has strong opinions about which tools actually help versus which ones are just hype. We spoke in person over lunch for about 13 minutes.

**Direct quotes:**
- "Hookfish just put everyone on Cursor Pro but two of the backend devs barely use it. They just use the terminal."
- "I would not give my email to a random tool before seeing results. Show me something useful first."
- "Honestly I just want to know — am I paying for Claude Pro for no reason or is it actually worth it for coding?"

**Most surprising thing:**
She asked whether the tool could tell her if a plan is worth it for her specific use case, not just whether she is on the wrong plan. She wanted a quality judgment, not just a price comparison. This was a more nuanced ask than I expected.

**What it changed about the design:**
This reinforced the importance of the use case selector on the form. The audit engine now factors in whether a tool matches the user's primary use case — for example flagging Cursor Pro as potentially unnecessary for someone whose primary use is writing or research rather than coding.
