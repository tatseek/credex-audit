import { supabase } from '@/lib/supabase';
import { runAudit } from '@/lib/auditEngine';
import { PRICING_SNAPSHOT } from '@/lib/pricingSnapshot';
import { Zap, CheckCircle, AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ReauditPage({ params }: Props) {
  const { id } = await params;

  const { data } = await supabase
    .from('audits')
    .select('*')
    .eq('id', id)
    .single();

  if (!data) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Audit not found</h1>
          <a href="/" className="px-6 py-3 bg-green-500 text-black font-bold rounded-xl">
            Run a new audit
          </a>
        </div>
      </main>
    );
  }

  const oldRecommendations = data.recommendations as any[];
  const oldMonthlySavings = data.total_monthly_savings ?? 0;

  const formData = {
    tools: data.tools as any[],
    teamSize: data.team_size,
    useCase: data.use_case,
  };

  const newResult = runAudit(formData as any);
  const newRecommendations = newResult.recommendations;
  const newMonthlySavings = newResult.totalMonthlySavings;
  const savingsDelta = newMonthlySavings - oldMonthlySavings;

  return (
    <main className="min-h-screen bg-gray-950 text-white pb-20">
      <div className="border-b border-gray-800 bg-gray-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="text-green-400" size={24} />
            <span className="text-xl font-bold">SpendSmart AI</span>
          </div>
          <span className="text-sm text-gray-400">Re-audit — pricing updated</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <p className="text-gray-400 mb-2 text-sm uppercase tracking-widest">
            Pricing has changed since your last audit
          </p>
          <h1 className="text-4xl font-bold mb-2">
            {savingsDelta > 0 ? (
              <span>You can now save <span className="text-green-400">${savingsDelta.toFixed(0)} more/mo</span></span>
            ) : savingsDelta < 0 ? (
              <span>Savings reduced by <span className="text-red-400">${Math.abs(savingsDelta).toFixed(0)}/mo</span></span>
            ) : (
              <span className="text-gray-300">Your recommendations are unchanged</span>
            )}
          </h1>
          <p className="text-gray-400">
            Previous savings: <span className="text-white">${oldMonthlySavings.toFixed(0)}/mo</span>
            {' '} — New savings: <span className="text-green-400">${newMonthlySavings.toFixed(0)}/mo</span>
          </p>
        </div>

        <div className="text-xs text-gray-500 uppercase tracking-widest mb-3">
          Pricing snapshot used: {PRICING_SNAPSHOT.version}
        </div>

        <h2 className="text-xl font-semibold mb-4">Recommendation changes</h2>
        <div className="flex flex-col gap-4 mb-10">
          {newRecommendations.map((newRec: any, i: number) => {
            const oldRec = oldRecommendations[i];
            const changed = oldRec?.recommendedAction !== newRec.recommendedAction ||
              oldRec?.monthlySavings !== newRec.monthlySavings;

            return (
              <div key={i} className={`rounded-xl border p-5 ${changed ? 'border-yellow-700/50 bg-gray-900' : 'border-gray-700 bg-gray-900'}`}>
                <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    {newRec.isOptimal
                      ? <CheckCircle className="text-green-400 shrink-0" size={18} />
                      : <AlertTriangle className="text-yellow-400 shrink-0" size={18} />
                    }
                    <span className="font-semibold">{newRec.toolName}</span>
                    {changed && (
                      <span className="text-xs bg-yellow-900/50 text-yellow-400 px-2 py-0.5 rounded-full">
                        Changed
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {changed && oldRec && (
                      <>
                        <span className="text-red-400 line-through">${oldRec.monthlySavings.toFixed(0)}/mo</span>
                        <span className="text-gray-500">-&gt;</span>
                      </>
                    )}
                    <span className="text-green-400 font-bold">${newRec.monthlySavings.toFixed(0)}/mo</span>
                  </div>
                </div>

                {changed && oldRec && (
                  <div className="mb-3 pl-6">
                    <div className="flex items-start gap-2 text-sm text-red-400 line-through mb-1">
                      <TrendingDown size={14} className="mt-0.5 shrink-0" />
                      <span>{oldRec.recommendedAction}{oldRec.recommendedPlan && ' - ' + oldRec.recommendedPlan}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-green-400">
                      <TrendingUp size={14} className="mt-0.5 shrink-0" />
                      <span>{newRec.recommendedAction}{newRec.recommendedPlan && ' - ' + newRec.recommendedPlan}</span>
                    </div>
                  </div>
                )}

                {!changed && (
                  <div className="pl-6 flex items-center gap-2 text-sm text-gray-500">
                    <Minus size={14} />
                    <span>No change — {newRec.recommendedAction}</span>
                  </div>
                )}

                <p className="text-sm text-gray-400 mt-2 pl-6">{newRec.reason}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-green-950 border border-green-700 rounded-2xl p-6 text-center">
          <h2 className="text-green-400 font-bold text-lg mb-2">Want to run a fresh audit?</h2>
          <p className="text-gray-300 text-sm mb-4">Update your stack and get the latest recommendations.</p>
          <a href="/"
            className="inline-block px-6 py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded-xl transition-colors">
            Run new audit
          </a>
        </div>
      </div>
    </main>
  );
}
