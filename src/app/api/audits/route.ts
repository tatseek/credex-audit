import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { PRICING_SNAPSHOT } from '@/lib/pricingSnapshot';

export async function POST(req: NextRequest) {
  const { id, formData, recommendations, totalMonthlySavings, totalAnnualSavings, aiSummary, userEmail } = await req.json();

  const { error } = await supabase.from('audits').insert({
    id,
    tools: formData.tools,
    team_size: formData.teamSize,
    use_case: formData.useCase,
    recommendations,
    total_monthly_savings: totalMonthlySavings,
    total_annual_savings: totalAnnualSavings,
    ai_summary: aiSummary,
    user_email: userEmail || null,
    pricing_snapshot: PRICING_SNAPSHOT,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
