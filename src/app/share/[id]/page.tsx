import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { Zap, CheckCircle, AlertTriangle } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data } = await supabase.from('audits').select('*').eq('id', id).single();
  if (!data) return { title: 'Audit not found - SpendSmart AI' };
  const savings = data.total_monthly_savings ?? 0;
  const title = savings > 0 ? `Save $${savings.toFixed(0)}/mo on AI tools - SpendSmart AI` : 'AI Spend Audit - SpendSmart AI';
  const description = `This team could save $${savings.toFixed(0)}/month by optimizing their AI tool stack.`;
  return {
    title,
    description,
    openGraph: { title, description, siteName: 'SpendSmart AI', type: 'website' },
    twitter: { card: 'summary', title, description },
  };
}

export default async function SharedAuditPage({ params }: Props) {
  const { id } = await params;
  const { data } = await supabase.from('audits').select('*').eq('id', id).single();

  if (!data) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Audit not found</h1>
          <p className="text-gray-400 mb-6">This audit may have expired or the link is incorrect.</p>
          <a href="/" className="px-6 py-3 bg-green-500 text-black font-bold rounded-xl">Run your own audit</a>
        </div>
      </main>
    );
  }

  const recommendations = data.recommendations as any[];
  const monthlySavings = data.total_monthly_savings ?? 0;
  const annualSavings = data.total_annual_savings ?? 0;

  return (
    <main className="min-h-screen bg-gray-950 text-white pb-20">
      <div className="border-b border-gray-800 bg-gray-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="text-green-400" size={24} />
            <span className="text-xl font-bold">SpendSmart AI</span>
          </div>
          <a href="/" className="px-4 py-2 bg-green-500 hover:bg-green-400 text-black font-bold rounded-lg text-sm transition-colors">
            Audit my stack
          </a>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <p className="text-gray-400 mb-2 text-sm uppercase tracking-widest">Shared Audit Report</p>
          {monthlySavings > 0 ? (
            <>
              <h1 className="text-5xl font-bold mb-2">Save <span className="text-green-400">${monthlySavings.toFixed(0)}/mo</span></h1>
              <p className="text-2xl text-gray-300">That is <span className="text-green-300 font-semibold">${annualSavings.toFixed(0)} per year</span></p>
            </>
          ) : (
            <h1 className="text-4xl font-bold text-green-400">This team is spending well</h1>
          )}
        </div>

        {data.ai_summary && (
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 mb-8">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">AI Analysis</p>
            <p className="text-gray-300 leading-relaxed">{data.ai_summary}</p>
          </div>
        )}

        <h2 className="text-xl font-semibold mb-4">Tool-by-tool breakdown</h2>
        <div className="flex flex-col gap-4 mb-10">
          {recommendations.map((rec: any, i: number) => (
            <div key={i} className={`rounded-xl border p-5 ${rec.isOptimal ? 'bg-gray-900 border-gray-700' : 'bg-gray-900 border-yellow-700/50'}`}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  {rec.isOptimal ? <CheckCircle className="text-green-400 shrink-0" size={20} /> : <AlertTriangle className="text-yellow-400 shrink-0" size={20} />}
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
                  {rec.recommendedAction}{rec.recommendedPlan && ' - ' + rec.recommendedPlan}
                </p>
                <p className="text-sm text-gray-400 mt-1">{rec.reason}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-green-950 border border-green-700 rounded-2xl p-6 text-center">
          <h2 className="text-green-400 font-bold text-lg mb-2">Audit your own AI stack</h2>
          <p className="text-gray-300 text-sm mb-4">Free, instant, no login required.</p>
          <a href="/" className="inline-block px-6 py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded-xl transition-colors">
            Run free audit
          </a>
        </div>
      </div>
    </main>
  );
}
