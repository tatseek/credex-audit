import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { PRICING_SNAPSHOT } from '@/lib/pricingSnapshot';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  const { data: audits, error } = await supabase
    .from('audits')
    .select('*')
    .not('user_email', 'is', null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!audits || audits.length === 0) {
    return NextResponse.json({ message: 'No audits with emails found' });
  }

  const affectedByEmail: Record<string, any[]> = {};

  for (const audit of audits) {
    const snapshot = audit.pricing_snapshot as any;
    if (!snapshot?.prices) continue;

    const tools = audit.tools as any[];
    const changes: any[] = [];

    for (const tool of tools) {
      const oldPrice = snapshot.prices?.[tool.tool]?.[tool.plan];
      const newPrice = (PRICING_SNAPSHOT.prices as any)?.[tool.tool]?.[tool.plan];

      if (oldPrice === undefined || newPrice === undefined) continue;
      if (oldPrice !== newPrice) {
        changes.push({
          tool: tool.tool,
          plan: tool.plan,
          oldPrice,
          newPrice,
          seats: tool.seats,
        });
      }
    }

    if (changes.length > 0 && audit.user_email) {
      if (!affectedByEmail[audit.user_email]) {
        affectedByEmail[audit.user_email] = [];
      }
      affectedByEmail[audit.user_email].push({ audit, changes });
    }
  }

  const emailsSent: string[] = [];

  for (const [email, affectedAudits] of Object.entries(affectedByEmail)) {
    const allChanges = affectedAudits.flatMap((a) => a.changes);
    const auditId = affectedAudits[0].audit.id;

    const changesHtml = allChanges.map((c) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #374151; color: #fff;">${c.tool} - ${c.plan}</td>
        <td style="padding: 8px; border-bottom: 1px solid #374151; color: #ef4444;">$${c.oldPrice}/seat</td>
        <td style="padding: 8px; border-bottom: 1px solid #374151; color: #4ade80;">$${c.newPrice}/seat</td>
        <td style="padding: 8px; border-bottom: 1px solid #374151; color: #fff;">${c.seats} seat(s)</td>
      </tr>
    `).join('');

    const rerunUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reaudit/${auditId}`;

    try {
      await resend.emails.send({
        from: 'SpendSmart AI <onboarding@resend.dev>',
        to: email,
        subject: 'Your AI spend audit is out of date — pricing changed',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #0a0a0a; color: #fff;">
            <h1 style="color: #4ade80; font-size: 22px; margin-bottom: 8px;">Pricing changed on your stack</h1>
            <p style="color: #9ca3af; margin-bottom: 24px;">
              We detected pricing changes for tools in your previous audit.
              Your recommendations may no longer be accurate.
            </p>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <thead>
                <tr>
                  <th style="padding: 8px; text-align: left; color: #9ca3af; font-size: 12px;">Tool</th>
                  <th style="padding: 8px; text-align: left; color: #9ca3af; font-size: 12px;">Old Price</th>
                  <th style="padding: 8px; text-align: left; color: #9ca3af; font-size: 12px;">New Price</th>
                  <th style="padding: 8px; text-align: left; color: #9ca3af; font-size: 12px;">Your Seats</th>
                </tr>
              </thead>
              <tbody>${changesHtml}</tbody>
            </table>

            <a href="${rerunUrl}"
              style="display: inline-block; background: #4ade80; color: #000; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; margin-bottom: 24px;">
              Re-run my audit with new pricing
            </a>

            <p style="color: #6b7280; font-size: 12px; margin-top: 32px;">
              Sent by SpendSmart AI. You received this because you submitted your email for an audit report.
            </p>
          </div>
        `,
      });
      emailsSent.push(email);
    } catch (err) {
      console.error('Email failed for', email, err);
    }
  }

  return NextResponse.json({
    auditsChecked: audits.length,
    usersAffected: Object.keys(affectedByEmail).length,
    emailsSent,
  });
}
