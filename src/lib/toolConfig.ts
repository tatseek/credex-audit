export interface PlanOption {
  value: string;
  label: string;
  pricePerSeat: number;
}

export interface ToolConfig {
  name: string;
  plans: PlanOption[];
}

export const TOOL_CONFIG: Record<string, ToolConfig> = {
  cursor: {
    name: 'Cursor',
    plans: [
      { value: 'hobby', label: 'Hobby (Free)', pricePerSeat: 0 },
      { value: 'pro', label: 'Pro', pricePerSeat: 20 },
      { value: 'business', label: 'Business', pricePerSeat: 40 },
      { value: 'enterprise', label: 'Enterprise', pricePerSeat: 100 },
    ],
  },
  'github-copilot': {
    name: 'GitHub Copilot',
    plans: [
      { value: 'individual', label: 'Individual', pricePerSeat: 10 },
      { value: 'business', label: 'Business', pricePerSeat: 19 },
      { value: 'enterprise', label: 'Enterprise', pricePerSeat: 39 },
    ],
  },
  claude: {
    name: 'Claude',
    plans: [
      { value: 'free', label: 'Free', pricePerSeat: 0 },
      { value: 'pro', label: 'Pro', pricePerSeat: 20 },
      { value: 'max', label: 'Max', pricePerSeat: 100 },
      { value: 'team', label: 'Team', pricePerSeat: 30 },
      { value: 'enterprise', label: 'Enterprise', pricePerSeat: 60 },
    ],
  },
  chatgpt: {
    name: 'ChatGPT',
    plans: [
      { value: 'free', label: 'Free', pricePerSeat: 0 },
      { value: 'plus', label: 'Plus', pricePerSeat: 20 },
      { value: 'team', label: 'Team', pricePerSeat: 30 },
      { value: 'enterprise', label: 'Enterprise', pricePerSeat: 60 },
      { value: 'api', label: 'API Direct', pricePerSeat: 0 },
    ],
  },
  'anthropic-api': {
    name: 'Anthropic API',
    plans: [{ value: 'api', label: 'API Direct (pay-as-you-go)', pricePerSeat: 0 }],
  },
  'openai-api': {
    name: 'OpenAI API',
    plans: [{ value: 'api', label: 'API Direct (pay-as-you-go)', pricePerSeat: 0 }],
  },
  gemini: {
    name: 'Gemini',
    plans: [
      { value: 'free', label: 'Free', pricePerSeat: 0 },
      { value: 'pro', label: 'Gemini Advanced', pricePerSeat: 19.99 },
      { value: 'api', label: 'API Direct', pricePerSeat: 0 },
    ],
  },
  windsurf: {
    name: 'Windsurf',
    plans: [
      { value: 'free', label: 'Free', pricePerSeat: 0 },
      { value: 'pro', label: 'Pro', pricePerSeat: 15 },
      { value: 'team', label: 'Team', pricePerSeat: 35 },
    ],
  },
};
