export const PRICING_SNAPSHOT = {
  version: '2026-05-20',
  prices: {
    cursor: {
      hobby: 0,
      pro: 20,
      business: 40,
      enterprise: 100,
    },
    'github-copilot': {
      individual: 10,
      business: 19,
      enterprise: 39,
    },
    claude: {
      free: 0,
      pro: 20,
      max: 100,
      team: 30,
      enterprise: 60,
    },
    chatgpt: {
      free: 0,
      plus: 20,
      team: 30,
      enterprise: 60,
      api: 0,
    },
    'anthropic-api': {
      api: 0,
    },
    'openai-api': {
      api: 0,
    },
    gemini: {
      free: 0,
      pro: 19.99,
      api: 0,
    },
    windsurf: {
      free: 0,
      pro: 15,
      team: 35,
    },
  },
};

export type PricingSnapshot = typeof PRICING_SNAPSHOT;
