'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuditStore } from '@/store/auditStore';
import { runAudit } from '@/lib/auditEngine';
import { AuditResult } from '@/types';
import { Zap, TrendingDown, CheckCircle, ArrowLeft, AlertTriangle } from 'lucide-react';

export default function AuditPage() {
  const router = useRouter();
  const { formData } = useAuditStore();
  const [result, setResult] = useState<AuditResult | null>(null);

  useEffect(() => {
    if (formData.tools.length === 0) {
      router.push('/');
      return;
    }
    const auditResult = runAudit(formData);
    setResult(auditResult);
  }, []);

  if (!result) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-white text-xl animate-pulse">Running your audit...</div>
    </div>
  );

  const hasSignificantSavings = result.totalMonthlySavings > 500;
  const isAlreadyOptimal = result.totalMonthlySavings < 100 &&
    result.recommendations.every((r) => r.isOptimal);

  return (
    <main className="min-h-screen bg-gray-950 text-white pb-20">
      <div className="border-b border-gray-800 bg-gray-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="text-green-400" size={24} />
            <span className="text-xl font-bold">SpendSmart AI</span>
          </div>
          <button onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
            <ArrowLeft size={16} /> Edit inputs
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <p className="text-gray-400 mb-2 text-sm uppercase tracking-widest">Your Audit Results</p>
          {isAlreadyOptimal ? (
            <>
              <h1 className="text-4xl font-bold text-green-400 mb-2">You are spending well</h1>
              <p className="text-gray-400">Your current AI stack looks optimized.</p>
            </>
          ) : (
            <>
              <h1 className="text-5xl font-bold mb-2">
                Save <span className="text-green-400">${result.totalMonthlySavings.toFixed(0)}/mo</span>
              </h1>
              <p className="text-2xl text-gray-300">
                That is <span className="text-green-300 font-semibold">${result.totalAnnualSavings.toFixed(0)} per year</span>
              </p>
            </>
          )}
        </div>

        {hasSignificantSavings && (
          <div className="bg-green-950 border border-green-700 rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-green-400 font-bold text-lg mb-1">You qualify for a Credex consultation</h2>
              <p className="text-gray-300 text-sm">Credex sells discounted AI credits. At your savings level, we can cut your bill further.</p>
            </div>
            <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer"
              className="whitespace-nowrap px-6 py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded-xl transition-colors">
              Book Free Call
            </a>
          </div>
        )}

        <h2 className="text-xl font-semibold mb-4">Tool-by-tool breakdown</h2>
        <div className="flex flex-col gap-4 mb-10">
          {result.recommendations.map((rec) => (
            <div key={rec.toolId}
              className={`rounded-xl border p-5 ${rec.isOptimal ? 'bg-gray-900 border-gray-700' : 'bg-gray-900 border-yellow-700/50'}`}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  {rec.isOptimal ? (
                    <CheckCircle className="text-green-400 shrink-0" size={20} />
                  ) : (
                    <AlertTriangle className="text-yellow-400 shrink-0" size={20} />
                  )}
                  <div>
                    <h3 className="font-semibold text-white">{rec.toolName}</h3>
                    <p className="text-sm text-gray-400">Current: {rec.currentPlan} - ${rec.currentSpend}/mo</p>
                  </div>
                </div>
                {!rec.isOptimal && (
                  <div className="text-right">
                    <p className="text-green-400 font-bold">Save ${rec.monthlySavings.toFixed(0)}/mo</p>
                    <p className="text-xs text-gray-500">${rec.annualSavings.toFixed(0)}/yr</p>
                  </div>
                )}
              </div>
              <div className="mt-3 pl-8">
                <p className="text-sm font-medium text-yellow-300">
                  {rec.recommendedAction}
                  {rec.recommendedPlan && ' - ' + rec.recommendedPlan}
                </p>
                <p className="text-sm text-gray-400 mt-1">{rec.reason}</p>
              </div>
            </div>
          ))}
        </div>

        {isAlreadyOptimal && (
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 mb-8 text-center">
            <TrendingDown className="mx-auto text-green-400 mb-3" size={32} />
            <h3 className="font-semibold mb-1">Stay in the loop</h3>
            <p className="text-gray-400 text-sm">Your stack looks good right now.</p>
          </div>
        )}

        <div className="text-center">
          <button onClick={() => router.push('/')}
            className="px-6 py-3 border border-gray-600 hover:border-gray-400 text-gray-400 hover:text-white rounded-xl transition-colors">
            Run another audit
          </button>
        </div>
      </div>
    </main>
  );
}
