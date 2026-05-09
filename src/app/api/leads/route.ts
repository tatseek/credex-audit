import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { email, companyName, role, teamSize, auditData, totalMonthlySavings, totalAnnualSavings } = await req.json();

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const { error } = await supabase.from('leads').insert({
    email,
    company_name: companyName,
    role,
    team_size: teamSize,
    audit_data: auditData,
    total_monthly_savings: totalMonthlySavings,
    total_annual_savings: totalAnnualSavings,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  try {
    await resend.emails.send({
      from: 'SpendSmart AI <onboarding@resend.dev>',
      to: email,
      subject: 'Your AI Spend Audit Report',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #0a0a0a; color: #fff;">
          <h1 style="color: #4ade80; font-size: 24px; margin-bottom: 8px;">Your AI Spend Audit</h1>
          <p style="color: #9ca3af; margin-bottom: 24px;">Here is a summary of your audit results from SpendSmart AI.</p>

          <div style="background: #1f2937; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <p style="color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px;">Potential Savings</p>
            <p style="color: #4ade80; font-size: 36px; font-weight: bold; margin: 0;">$${totalMonthlySavings?.toFixed(0)}/mo</p>
            <p style="color: #d1fae5; font-size: 18px; margin-top: 4px;">$${totalAnnualSavings?.toFixed(0)} per year</p>
          </div>

          <div style="background: #1f2937; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <p style="color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px;">Tools Audited</p>
            ${auditData?.tools?.map((t: any) => `
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #374151;">
                <span style="color: #fff;">${t.tool}</span>
                <span style="color: #9ca3af;">$${t.monthlySpend}/mo</span>
              </div>
            `).join('')}
          </div>

          ${totalMonthlySavings > 500 ? `
          <div style="background: #052e16; border: 1px solid #166534; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <p style="color: #4ade80; font-weight: bold; font-size: 16px; margin-bottom: 8px;">You qualify for a Credex consultation</p>
            <p style="color: #9ca3af; margin-bottom: 16px;">Credex sells discounted AI credits. At your savings level, we can cut your bill even further.</p>
            <a href="https://credex.rocks" style="background: #4ade80; color: #000; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Book Free Call</a>
          </div>
          ` : ''}

          <p style="color: #6b7280; font-size: 12px; margin-top: 32px;">Sent by SpendSmart AI. You received this because you requested an audit report.</p>
        </div>
      `,
    });
  } catch (emailError) {
    console.error('Email sending failed:', emailError);
  }

  return NextResponse.json({ success: true });
}
