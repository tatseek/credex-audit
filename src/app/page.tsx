'use client';

import { useRouter } from 'next/navigation';
import { useAuditStore } from '@/store/auditStore';
import ToolRow from '@/components/form/ToolRow';
import { UseCase } from '@/types';
import { Plus, Zap } from 'lucide-react';

const USE_CASES: { value: UseCase; label: string }[] = [
  { value: 'coding', label: ' Coding' },
  { value: 'writing', label: ' Writing' },
  { value: 'data', label: ' Data Analysis' },
  { value: 'research', label: ' Research' },
  { value: 'mixed', label: ' Mixed' },
];

export default function HomePage() {
  const router = useRouter();
  const { formData, addTool, removeTool, updateTool, setTeamSize, setUseCase } =
    useAuditStore();

  const handleSubmit = () => {
    if (formData.tools.length === 0) {
      alert('Please add at least one AI tool.');
      return;
    }
    router.push('/audit');
  };

  const totalMonthly = formData.tools.reduce(
    (sum, t) => sum + t.monthlySpend,
    0
  );

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="text-green-400" size={24} />
            <span className="text-xl font-bold">SpendSmart AI</span>
          </div>
          <span className="text-sm text-gray-400">Free AI Spend Auditor</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Are you{' '}
            <span className="text-green-400">overpaying</span>{' '}
            for AI tools?
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Enter your current AI subscriptions and get an instant audit showing
            exactly where you can save money — for free, no login required.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8">
          {/* Team Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-300">
                Team Size
              </label>
              <input
                type="number"
                min={1}
                value={formData.teamSize}
                onChange={(e) => setTeamSize(parseInt(e.target.value) || 1)}
                className="bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-green-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-300">
                Primary Use Case
              </label>
              <select
                value={formData.useCase}
                onChange={(e) => setUseCase(e.target.value as UseCase)}
                className="bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-green-500"
              >
                {USE_CASES.map((uc) => (
                  <option key={uc.value} value={uc.value}>
                    {uc.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tools Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Your AI Tools</h2>
              {formData.tools.length > 0 && (
                <span className="text-sm text-gray-400">
                  Total:{' '}
                  <span className="text-white font-medium">
                    ${totalMonthly.toFixed(2)}/mo
                  </span>
                </span>
              )}
            </div>

            {formData.tools.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-700 rounded-xl">
                <p className="text-gray-500 mb-2">No tools added yet</p>
                <p className="text-sm text-gray-600">
                  Click below to add your first AI tool
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {formData.tools.map((tool) => (
                  <ToolRow
                    key={tool.id}
                    tool={tool}
                    onUpdate={updateTool}
                    onRemove={removeTool}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Add Tool Button */}
          <button
            onClick={addTool}
            className="w-full py-3 border-2 border-dashed border-gray-600 hover:border-green-500 text-gray-400 hover:text-green-400 rounded-xl transition-colors flex items-center justify-center gap-2 mb-8"
          >
            <Plus size={18} />
            Add AI Tool
          </button>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={formData.tools.length === 0}
            className="w-full py-4 bg-green-500 hover:bg-green-400 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-black font-bold text-lg rounded-xl transition-colors"
          >
            Run My Free Audit →
          </button>
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          No account needed. Your data stays in your browser until you choose to share it.
        </p>
      </div>
    </main>
  );
}
