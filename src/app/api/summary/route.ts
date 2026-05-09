import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { formData, totalMonthlySavings, totalAnnualSavings } = await req.json();

  const prompt = `You are a friendly financial advisor for startups. Write a 100-word personalized audit summary for a team of ${formData.teamSize} people whose primary AI use case is ${formData.useCase}.

They are currently spending $${formData.tools.reduce((s: number, t: any) => s + t.monthlySpend, 0)}/month on AI tools including: ${formData.tools.map((t: any) => t.tool).join(', ')}.

Our audit found they could save $${totalMonthlySavings.toFixed(0)}/month ($${totalAnnualSavings.toFixed(0)}/year) by optimizing their stack.

Write a concise, specific, encouraging summary. No bullet points. Plain paragraph only.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    const summary = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!summary) throw new Error('No summary returned');

    return NextResponse.json({ summary });
  } catch (error) {
    const fallback = `Your team of ${formData.teamSize} is spending on ${formData.tools.length} AI tools for ${formData.useCase} work. Our audit identified $${totalMonthlySavings.toFixed(0)}/month in potential savings by optimizing plans and eliminating overlap. Small changes to your subscriptions could save you $${totalAnnualSavings.toFixed(0)} annually — money better spent on building your product.`;
    return NextResponse.json({ summary: fallback });
  }
}
