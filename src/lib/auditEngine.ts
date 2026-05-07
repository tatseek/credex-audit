import { AuditFormData, AuditRecommendation, AuditResult } from '@/types';
import { TOOL_CONFIG } from './toolConfig';

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function runAudit(formData: AuditFormData): AuditResult {
  const recommendations: AuditRecommendation[] = [];

  for (const tool of formData.tools) {
    const config = TOOL_CONFIG[tool.tool];
    if (!config) continue;

    const currentPlan = config.plans.find((p) => p.value === tool.plan);
    const currentPricePerSeat = currentPlan?.pricePerSeat ?? 0;
    const currentSpend = tool.monthlySpend;

    let recommendation: AuditRecommendation = {
      toolId: tool.id,
      toolName: config.name,
      currentPlan: currentPlan?.label ?? tool.plan,
      currentSpend,
      recommendedAction: 'Keep current plan',
      monthlySavings: 0,
      annualSavings: 0,
      reason: 'Your current plan is well-matched to your usage.',
      isOptimal: true,
    };

    // --- Cursor rules ---
    if (tool.tool === 'cursor') {
      if (tool.plan === 'enterprise' && tool.seats < 20) {
        const businessCost = 40 * tool.seats;
        const savings = currentSpend - businessCost;
        if (savings > 0) {
          recommendation = {
            ...recommendation,
            recommendedAction: 'Downgrade to Business',
            recommendedPlan: 'Business ($40/seat)',
            monthlySavings: savings,
            annualSavings: savings * 12,
            reason: `Enterprise is designed for 20+ seats with SSO/audit needs. At ${tool.seats} seats, Business gives you the same core features at $40/seat vs your current rate.`,
            isOptimal: false,
          };
        }
      } else if (tool.plan === 'business' && tool.seats <= 2 && formData.useCase === 'coding') {
        const proCost = 20 * tool.seats;
        const savings = currentSpend - proCost;
        if (savings > 0) {
          recommendation = {
            ...recommendation,
            recommendedAction: 'Downgrade to Pro',
            recommendedPlan: 'Pro ($20/seat)',
            monthlySavings: savings,
            annualSavings: savings * 12,
            reason: `Business adds admin controls and centralized billing — unnecessary for a ${tool.seats}-person team. Pro gives the same AI features at half the price.`,
            isOptimal: false,
          };
        }
      } else if (tool.plan === 'pro' && formData.useCase !== 'coding') {
        recommendation = {
          ...recommendation,
          recommendedAction: 'Consider switching to GitHub Copilot',
          recommendedPlan: 'GitHub Copilot Individual ($10/seat)',
          monthlySavings: (20 - 10) * tool.seats,
          annualSavings: (20 - 10) * tool.seats * 12,
          reason: `Cursor Pro is optimized for AI-first coding workflows. Since your primary use is ${formData.useCase}, GitHub Copilot at $10/seat covers your needs at half the price.`,
          isOptimal: false,
        };
      }
    }

    // --- GitHub Copilot rules ---
    if (tool.tool === 'github-copilot') {
      if (tool.plan === 'enterprise' && tool.seats < 50) {
        const businessCost = 19 * tool.seats;
        const savings = currentSpend - businessCost;
        if (savings > 0) {
          recommendation = {
            ...recommendation,
            recommendedAction: 'Downgrade to Business',
            recommendedPlan: 'Business ($19/seat)',
            monthlySavings: savings,
            annualSavings: savings * 12,
            reason: `Copilot Enterprise adds Bing search integration and fine-tuned models — rarely justified under 50 seats. Business plan covers all core coding assistance.`,
            isOptimal: false,
          };
        }
      } else if (tool.plan === 'business' && tool.seats === 1) {
        const savings = (19 - 10) * 1;
        recommendation = {
          ...recommendation,
          recommendedAction: 'Downgrade to Individual',
          recommendedPlan: 'Individual ($10/seat)',
          monthlySavings: savings,
          annualSavings: savings * 12,
          reason: `Business plan adds admin controls and policy management — not useful for a single developer. Individual plan at $10/mo has identical AI features.`,
          isOptimal: false,
        };
      }
    }

    // --- Claude rules ---
    if (tool.tool === 'claude') {
      if (tool.plan === 'team' && tool.seats <= 2) {
        const proCost = 20 * tool.seats;
        const savings = currentSpend - proCost;
        if (savings > 0) {
          recommendation = {
            ...recommendation,
            recommendedAction: 'Switch to individual Pro plans',
            recommendedPlan: 'Claude Pro ($20/seat)',
            monthlySavings: savings,
            annualSavings: savings * 12,
            reason: `Claude Team has a minimum billing of 5 seats and adds collaboration features not useful for ${tool.seats} people. Individual Pro plans save you money.`,
            isOptimal: false,
          };
        }
      } else if (tool.plan === 'max' && formData.useCase !== 'research' && formData.useCase !== 'data') {
        const savings = (100 - 20) * tool.seats;
        recommendation = {
          ...recommendation,
          recommendedAction: 'Downgrade to Pro',
          recommendedPlan: 'Claude Pro ($20/seat)',
          monthlySavings: savings,
          annualSavings: savings * 12,
          reason: `Claude Max is for extremely heavy users who hit Pro limits daily. For ${formData.useCase} use cases, Pro's limits are sufficient for most teams.`,
          isOptimal: false,
        };
      }
    }

    // --- ChatGPT rules ---
    if (tool.tool === 'chatgpt') {
      if (tool.plan === 'team' && tool.seats <= 2) {
        const savings = (30 - 20) * tool.seats;
        recommendation = {
          ...recommendation,
          recommendedAction: 'Switch to Plus plans',
          recommendedPlan: 'ChatGPT Plus ($20/seat)',
          monthlySavings: savings,
          annualSavings: savings * 12,
          reason: `ChatGPT Team adds shared workspaces and admin controls — overkill for ${tool.seats} users. Plus gives the same GPT-4o access at $20/seat.`,
          isOptimal: false,
        };
      } else if (
        tool.plan === 'plus' &&
        (tool.tool === 'claude' || formData.tools.some((t) => t.tool === 'claude'))
      ) {
        recommendation = {
          ...recommendation,
          recommendedAction: 'Consolidate to one AI assistant',
          monthlySavings: 20 * tool.seats,
          annualSavings: 20 * tool.seats * 12,
          reason: `You're paying for both ChatGPT Plus and Claude. These tools have significant capability overlap for ${formData.useCase} tasks. Pick one and save $20/seat/month.`,
          isOptimal: false,
        };
      }
    }

    // --- Overlap: both Cursor and Windsurf ---
    if (
      tool.tool === 'windsurf' &&
      formData.tools.some((t) => t.tool === 'cursor')
    ) {
      recommendation = {
        ...recommendation,
        recommendedAction: 'Remove duplicate coding assistant',
        monthlySavings: currentSpend,
        annualSavings: currentSpend * 12,
        reason: `You're paying for both Cursor and Windsurf — they serve identical purposes. Pick the one your team prefers and cancel the other.`,
        isOptimal: false,
      };
    }

    recommendations.push(recommendation);
  }

  const totalMonthlySavings = recommendations.reduce(
    (sum, r) => sum + r.monthlySavings,
    0
  );

  return {
    id: generateId(),
    formData,
    recommendations,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    aiSummary: '',
    createdAt: new Date().toISOString(),
  };
}
