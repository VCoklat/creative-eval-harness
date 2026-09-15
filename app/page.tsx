'use client';

import { useState } from 'react';
import { HarnessResponse } from '@/lib/types';

export default function Home() {
  const [idea, setIdea] = useState(
    'A cyberpunk detective confronting a rogue android in the rain under neon streetlights.'
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HarnessResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, maxRetries: 2 }),
      });

      if (!res.ok) throw new Error('Failed to execute harness loop');
      const data: HarnessResponse = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header className="border-b border-slate-800 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Creative Eval Harness 🎬
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                LLM Control Loop & Evals Dashboard · Driven by NVIDIA API
              </p>
            </div>
            <div className="hidden sm:flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Generator: Kimi K3 | Judge: Gemma 4 31B</span>
            </div>
          </div>
        </header>

        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">
              Scene Concept / Idea
            </label>
            <textarea
              rows={3}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Describe your film/TV scene..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-sm rounded-lg transition duration-200"
            >
              {loading ? 'Running Harness Loop...' : 'Generate & Evaluate Scene'}
            </button>
          </form>
        </section>

        {error && (
          <div className="p-4 bg-red-950/50 border border-red-800 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <span className="text-xs text-slate-400 block">Total Latency</span>
                <span className="text-xl font-bold text-indigo-400">{result.latency_seconds}s</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <span className="text-xs text-slate-400 block">Attempts (Loop)</span>
                <span className="text-xl font-bold text-slate-200">{result.attempts}</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <span className="text-xs text-slate-400 block">Judge Verdict</span>
                <span className={`text-xl font-bold ${result.eval_scores.approved ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {result.eval_scores.approved ? 'Approved ✅' : 'Rejected ❌'}
                </span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <span className="text-xs text-slate-400 block">Routing Provider</span>
                <span className="text-sm font-mono text-slate-300 mt-1 block truncate">NVIDIA NIM</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h2 className="font-semibold text-slate-200">Generated Script</h2>
                  <span className="text-xs font-mono bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded">
                    Kimi K3
                  </span>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Heading</span>
                    <p className="font-mono text-amber-300 mt-0.5">{result.final_scene.scene_heading}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Action</span>
                    <p className="text-slate-300 mt-0.5 leading-relaxed">{result.final_scene.action_description}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Camera Angle</span>
                    <p className="text-slate-400 italic mt-0.5">{result.final_scene.camera_angle}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h2 className="font-semibold text-slate-200">LLM Judge Scorecard</h2>
                  <span className="text-xs font-mono bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded">
                    Gemma 4 31B
                  </span>
                </div>

                <div className="space-y-4 text-sm">
                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Cinematic Lighting</span>
                      <span>{result.eval_scores.cinematic_lighting} / 5</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${(result.eval_scores.cinematic_lighting / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Action Clarity</span>
                      <span>{result.eval_scores.action_clarity} / 5</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${(result.eval_scores.action_clarity / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Judge Feedback
                    </span>
                    <p className="text-slate-300 text-xs italic">
                      "{result.eval_scores.feedback}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}