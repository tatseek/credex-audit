# Prompts

## AI Summary Prompt

Used in /api/summary/route.ts to generate a personalized 100-word audit summary.

### Final prompt

You are a friendly financial advisor for startups. Write a 100-word personalized audit summary for a team of {teamSize} people whose primary AI use case is {useCase}. They are currently spending ${totalSpend}/month on AI tools including: {toolList}. Our audit found they could save ${totalMonthlySavings}/month (${totalAnnualSavings}/year) by optimizing their stack. Write a concise, specific, encouraging summary. No bullet points. Plain paragraph only.

### Why this prompt works

- Gives the model a clear role as friendly financial advisor to set tone
- Provides specific numbers so the output is personalized not generic
- Lists the actual tools so the summary references real context
- Explicitly says no bullet points and plain paragraph to control format
- Keeps it short at 100 words so it fits cleanly on the results page

### What did not work

First attempt: Asked for a detailed analysis — output was too long and formal, did not fit the UI.

Second attempt: No role definition — output was dry and generic, felt AI-generated.

Third attempt: Included savings percentage — model hallucinated percentages not in the data.

### Fallback template

When the Gemini API fails or returns no content, we fall back to a hardcoded template:

Your team of {teamSize} is spending on {toolCount} AI tools for {useCase} work. Our audit identified ${totalMonthlySavings}/month in potential savings by optimizing plans and eliminating overlap. Small changes to your subscriptions could save you ${totalAnnualSavings} annually — money better spent on building your product.

This ensures the results page always shows a summary even if the API is down.
