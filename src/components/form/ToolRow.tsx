'use client';

import { ToolEntry, ToolName } from '@/types';
import { TOOL_CONFIG } from '@/lib/toolConfig';
import { Trash2 } from 'lucide-react';

interface ToolRowProps {
  tool: ToolEntry;
  onUpdate: (id: string, updates: Partial<ToolEntry>) => void;
  onRemove: (id: string) => void;
}

export default function ToolRow({ tool, onUpdate, onRemove }: ToolRowProps) {
  const config = TOOL_CONFIG[tool.tool];
  const plans = config?.plans || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 bg-gray-900 border border-gray-700 rounded-xl items-end">
      {/* Tool Selector */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-400 font-medium">AI Tool</label>
        <select
          value={tool.tool}
          onChange={(e) => {
            const newTool = e.target.value as ToolName;
            const firstPlan = TOOL_CONFIG[newTool]?.plans[0];
            onUpdate(tool.id, {
              tool: newTool,
              plan: firstPlan?.value || '',
              monthlySpend: firstPlan?.pricePerSeat || 0,
            });
          }}
          className="bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
        >
          {Object.entries(TOOL_CONFIG).map(([key, cfg]) => (
            <option key={key} value={key}>
              {cfg.name}
            </option>
          ))}
        </select>
      </div>

      {/* Plan Selector */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-400 font-medium">Plan</label>
        <select
          value={tool.plan}
          onChange={(e) => {
            const selectedPlan = plans.find((p) => p.value === e.target.value);
            onUpdate(tool.id, {
              plan: e.target.value,
              monthlySpend: selectedPlan
                ? selectedPlan.pricePerSeat * tool.seats
                : tool.monthlySpend,
            });
          }}
          className="bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
        >
          {plans.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* Seats */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-400 font-medium">Seats</label>
        <input
          type="number"
          min={1}
          value={tool.seats}
          onChange={(e) => {
            const seats = parseInt(e.target.value) || 1;
            const selectedPlan = plans.find((p) => p.value === tool.plan);
            onUpdate(tool.id, {
              seats,
              monthlySpend: selectedPlan
                ? selectedPlan.pricePerSeat * seats
                : tool.monthlySpend,
            });
          }}
          className="bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
        />
      </div>

      {/* Monthly Spend */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-400 font-medium">
          Monthly Spend ($)
        </label>
        <input
          type="number"
          min={0}
          value={tool.monthlySpend}
          onChange={(e) =>
            onUpdate(tool.id, { monthlySpend: parseFloat(e.target.value) || 0 })
          }
          className="bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
        />
      </div>

      {/* Remove Button */}
      <div className="flex items-end">
        <button
          onClick={() => onRemove(tool.id)}
          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
