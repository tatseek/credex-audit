import { runAudit } from '@/lib/auditEngine';
import { AuditFormData } from '@/types';

// Test 1: Basic audit runs without errors
test('audit runs and returns result for valid input', () => {
  const formData: AuditFormData = {
    tools: [{ id: '1', tool: 'cursor', plan: 'pro', monthlySpend: 20, seats: 1 }],
    teamSize: 1,
    useCase: 'coding',
  };
  const result = runAudit(formData);
  expect(result).toBeDefined();
  expect(result.recommendations).toHaveLength(1);
});

// Test 2: Cursor Business with 2 seats should recommend Pro
test('cursor business plan with 2 seats recommends downgrade to pro', () => {
  const formData: AuditFormData = {
    tools: [{ id: '1', tool: 'cursor', plan: 'business', monthlySpend: 80, seats: 2 }],
    teamSize: 2,
    useCase: 'coding',
  };
  const result = runAudit(formData);
  expect(result.recommendations[0].isOptimal).toBe(false);
  expect(result.recommendations[0].monthlySavings).toBeGreaterThan(0);
});

// Test 3: Savings calculation is correct
test('total monthly savings equals sum of individual savings', () => {
  const formData: AuditFormData = {
    tools: [
      { id: '1', tool: 'cursor', plan: 'business', monthlySpend: 80, seats: 2 },
      { id: '2', tool: 'github-copilot', plan: 'enterprise', monthlySpend: 390, seats: 10 },
    ],
    teamSize: 10,
    useCase: 'coding',
  };
  const result = runAudit(formData);
  const expectedTotal = result.recommendations.reduce((sum, r) => sum + r.monthlySavings, 0);
  expect(result.totalMonthlySavings).toBe(expectedTotal);
});

// Test 4: Annual savings is 12x monthly
test('annual savings is exactly 12x monthly savings', () => {
  const formData: AuditFormData = {
    tools: [{ id: '1', tool: 'cursor', plan: 'business', monthlySpend: 80, seats: 2 }],
    teamSize: 2,
    useCase: 'coding',
  };
  const result = runAudit(formData);
  expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
});

// Test 5: Optimal plan returns isOptimal true
test('cursor hobby plan is marked as optimal', () => {
  const formData: AuditFormData = {
    tools: [{ id: '1', tool: 'cursor', plan: 'hobby', monthlySpend: 0, seats: 1 }],
    teamSize: 1,
    useCase: 'coding',
  };
  const result = runAudit(formData);
  expect(result.recommendations[0].isOptimal).toBe(true);
  expect(result.recommendations[0].monthlySavings).toBe(0);
});

// Test 6: Duplicate tools flagged
test('having both cursor and windsurf flags windsurf as duplicate', () => {
  const formData: AuditFormData = {
    tools: [
      { id: '1', tool: 'cursor', plan: 'pro', monthlySpend: 20, seats: 1 },
      { id: '2', tool: 'windsurf', plan: 'pro', monthlySpend: 15, seats: 1 },
    ],
    teamSize: 1,
    useCase: 'coding',
  };
  const result = runAudit(formData);
  const windsurfRec = result.recommendations.find((r) => r.toolName === 'Windsurf');
  expect(windsurfRec?.isOptimal).toBe(false);
});

// Test 7: Empty tools returns zero savings
test('empty tools list returns zero savings', () => {
  const formData: AuditFormData = {
    tools: [],
    teamSize: 1,
    useCase: 'mixed',
  };
  const result = runAudit(formData);
  expect(result.totalMonthlySavings).toBe(0);
  expect(result.recommendations).toHaveLength(0);
});
