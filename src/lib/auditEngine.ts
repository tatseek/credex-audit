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

    if (tool.tool === 'cursor') {
      if (tool.plan === 'enterprise' && tool.seats < 20) {
        const savings = currentSpend - 40 * tool.seats;
        if (savings > 0) {
          recommendation = {
            ...recommendation,
            recommendedAction: 'Downgrade to Business',
            recommendedPlan: 'Business ($40/seat)',
            monthlySavings: savings,
            annualSavings: savings * 12,
            reason: `Enterprise is designed for 20+ seats with SSO needs. At ${tool.seats} seats, Business gives the same features at $40/seat.`,
            isOptimal: false,
          };
        }
      } else if (tool.plan === 'business' && tool.seats <= 2 && formData.useCase === 'coding') {
        const savings = currentSpend - 20 * tool.seats;
        if (savings > 0) {
          recommendation = {
            ...recommendation,
            recommendedAction: 'Downgrade to Pro',
            recommendedPlan: 'Pro ($20/seat)',
            monthlySavings: savings,
            annualSavings: savings * 12,
            reason: `Business adds admin controls unnecessary for ${tool.seats} people. Pro gives the same AI features at half the price.`,
            isOptimal: false,
          };
        }
      } else if (tool.plan === 'pro' && formData.useCase !== 'coding') {
        const savings = (20 - 10) * tool.seats;
        recommendation = {
          ...recommendation,
          recommendedAction: 'Consider switching to GitHub Copilot',
          recommendedPlan: 'GitHub Copilot Individual ($10/seat)',
          monthlySavings: savings,
          annualSavings: savings * 12,
          reason: `Cursor Pro is optimized for AI-first coding. For ${formData.useCase} use cases, GitHub Copilot at $10/seat covers your needs at half the price.`,
          isOptimal: false,
        };
      }
    }

    if (tool.tool === 'github-copilot') {
      if (tool.plan === 'enterprise' && tool.seats < 50) {
        const savings = currentSpend - 19 * tool.seats;
        if (savings > 0) {
          recommendation = {
            ...recommendation,
            recommendedAction: 'Downgrade to Business',
            recommendedPlan: 'Business ($19/seat)',
            monthlySavings: savings,
            annualSavings: savings * 12,
            reason: `Copilot Enterprise adds Bing search integration rarely justified under 50 seats. Business covers all core coding assistance.`,
            isOptimal: false,
          };
        }
      } else if (tool.plan === 'business' && tool.seats === 1) {
        const savings = 19 - 10;
        recommendation = {
          ...recommendation,
          recommendedAction: 'Downgrade to Individual',
          recommendedPlan: 'Individual ($10/seat)',
          monthlySavings: savings,
          annualSavings: savings * 12,
          reason: `Business plan adds admin controls not useful for a single developer. Individual plan has identical AI features at $10/mo.`,
          isOptimal: false,
        };
      }
    }

    if (tool.tool === 'claude') {
      if (tool.plan === 'team' && tool.seats <= 2) {
        const savings = currentSpend - 20 * tool.seats;
        if (savings > 0) {
          recommendation = {
            ...recommendation,
            recommendedAction: 'Switch to individual Pro plans',
            recommendedPlan: 'Claude Pro ($20/seat)',
            monthlySavings: savings,
            annualSavings: savings * 12,
            reason: `Claude Team has minimum billing of 5 seats. Individual Pro plans save money for ${tool.seats} people.`,
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
          reason: `Claude Max is for extremely heavy users who hit Pro limits daily. For ${formData.useCase} use cases, Pro limits are sufficient.`,
          isOptimal: false,
        };
      }
    }

    if (tool.tool === 'chatgpt') {
      if (tool.plan === 'team' && tool.seats <= 2) {
        const savings = (30 - 20) * tool.seats;
        recommendation = {
          ...recommendation,
          recommendedAction: 'Switch to Plus plans',
          recommendedPlan: 'ChatGPT Plus ($20/seat)',
          monthlySavings: savings,
          annualSavings: savings * 12,
          reason: `ChatGPT Team adds shared workspaces overkill for ${tool.seats} users. Plus gives the same GPT-4o access at $20/seat.`,
          isOptimal: false,
        };
      } else if (tool.plan === 'plus' && formData.tools.some((t) => t.tool === 'claude')) {
        recommendation = {
          ...recommendation,
          recommendedAction: 'Consolidate to one AI assistant',
          monthlySavings: 20 * tool.seats,
          annualSavings: 20 * tool.seats * 12,
          reason: `You are paying for both ChatGPT Plus and Claude which have significant overlap for ${formData.useCase} tasks. Pick one and save $20/seat/month.`,
          isOptimal: false,
        };
      }
    }

    if (tool.tool === 'windsurf' && formData.tools.some((t) => t.tool === 'cursor')) {
      recommendation = {
        ...recommendation,
        recommendedAction: 'Remove duplicate coding assistant',
        monthlySavings: currentSpend,
        annualSavings: currentSpend * 12,
        reason: `You are paying for both Cursor and Windsurf which serve identical purposes. Pick one and cancel the other.`,
        isOptimal: false,
      };
    }

    recommendations.push(recommendation);
  }

  const totalMonthlySavings = recommendations.reduce((sum, r) => sum + r.monthlySavings, 0);

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
