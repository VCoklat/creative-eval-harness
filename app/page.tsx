'use client';

import { useState, useEffect } from 'react';
import { HarnessResponse } from '@/lib/types';

const LOADING_STEPS = [
  'Initializing LLM Agent Pipeline...',
  'Generating initial script draft via Gemma 4 26B...',
  'Routing draft to LLM Judge (Gemma 4 31B)...',
  'Evaluating visual contrast, lighting, & action clarity...',
  'Applying feedback loop & finalizing structured output...',
];

export default function Home() {
  const [idea, setIdea] = useState(
    'A cyberpunk detective confronting a rogue android in the rain under neon streetlights.'
  );
  const [loading, setLoading] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [result, setResult] = useState<HarnessResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Cycle through execution steps during loading state
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setLoadingStepIndex(0);
      interval = setInterval(() => {
        setLoadingStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
      }, 2200);
    }
    return () => clearInterval(interval);
  }, [loading]);

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

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to execute harness loop');
      }

      const data: HarnessResponse = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans selection:bg-indigo-500 selection:text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="border-b border-slate-800 pb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                Creative Eval Harness 🎬
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Autonomous LLM Control Loop & Evals Dashboard · Powered by Google AI Studio
              </p>
            </div>
            <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl text-xs font-mono text-slate-300 shadow-inner self-start md:self-auto">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Generator: Gemma 4 26B | Judge: Gemma 4 31B</span>
            </div>
          </div>
        </header>

        {/* Input Form Section */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-slate-200">
                Scene Concept / Input Prompt
              </label>
              <span className="text-xs text-slate-500 font-mono">Feedback Loop Enabled (Max Retries: 2)</span>
            </div>

            <textarea
              rows={3}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Describe your film/TV scene..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all duration-200"
            />

            <button
              type="submit"
              disabled={loading}
              className="relative overflow-hidden w-full sm:w-auto px-7 py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-60 text-white font-semibold text-sm rounded-xl transition duration-200 shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Running Harness Loop...</span>
                </>
              ) : (
                'Generate & Evaluate Scene'
              )}
            </button>
          </form>

          {/* Animated Loading Pipeline Status Banner */}
          {loading && (
            <div className="mt-6 border-t border-slate-800/80 pt-4">
              <div className="flex items-center gap-3 bg-slate-950/80 border border-indigo-500/30 rounded-xl p-4">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-mono font-semibold text-indigo-400 uppercase tracking-wider">
                      Execution Stepper
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      Step {loadingStepIndex + 1} of {LOADING_STEPS.length}
                    </span>
                  </div>
                  <p className="text-sm font-mono text-slate-200 animate-pulse truncate">
                    {LOADING_STEPS[loadingStepIndex]}
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {error && (
          <div className="p-4 bg-red-950/40 border border-red-800/80 rounded-xl text-red-300 text-sm flex items-start gap-3">
            <span className="text-lg">⚠️</span>
            <div>
              <strong className="font-semibold block">Execution Error</strong>
              <p className="text-red-400 text-xs mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Results Dashboard */}
        {result && (
          <div className="space-y-6 transition-all duration-500">
            
            {/* Telemetry Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md">
                <span className="text-xs font-medium text-slate-400 block">Total Latency</span>
                <span className="text-2xl font-black text-indigo-400 mt-1 block">{result.latency_seconds}s</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md">
                <span className="text-xs font-medium text-slate-400 block">Loop Attempts</span>
                <span className="text-2xl font-black text-slate-100 mt-1 block">{result.attempts}</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md">
                <span className="text-xs font-medium text-slate-400 block">Judge Verdict</span>
                <span className={`text-xl font-bold mt-1 inline-flex items-center gap-1.5 ${result.eval_scores.approved ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {result.eval_scores.approved ? 'Approved ✅' : 'Rejected ❌'}
                </span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md">
                <span className="text-xs font-medium text-slate-400 block">Routing Provider</span>
                <span className="text-sm font-semibold font-mono text-slate-200 mt-2 block truncate">Google AI Studio</span>
              </div>
            </div>

            {/* Output Columns */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Scene Output Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h2 className="font-semibold text-slate-100 flex items-center gap-2">
                    📄 Generated Script Output
                  </h2>
                  <span className="text-xs font-mono bg-indigo-950 text-indigo-300 border border-indigo-800 px-2.5 py-1 rounded-md">
                    Gemma 4 26B
                  </span>
                </div>
                
                <div className="space-y-4 text-sm">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Heading</span>
                    <p className="font-mono text-amber-300 font-medium mt-1 bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                      {result.final_scene.scene_heading}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Action Description</span>
                    <p className="text-slate-300 mt-1 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-850">
                      {result.final_scene.action_description}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Camera Angle</span>
                    <p className="text-slate-400 italic mt-1 bg-slate-950/40 p-2.5 rounded-lg border border-slate-850">
                      {result.final_scene.camera_angle}
                    </p>
                  </div>
                </div>
              </div>

              {/* LLM Judge Scorecard */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h2 className="font-semibold text-slate-100 flex items-center gap-2">
                    ⚖️ LLM Judge Scorecard
                  </h2>
                  <span className="text-xs font-mono bg-purple-950 text-purple-300 border border-purple-800 px-2.5 py-1 rounded-md">
                    Gemma 4 31B
                  </span>
                </div>

                <div className="space-y-4 text-sm">
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 font-medium mb-1.5">
                      <span>Cinematic Lighting</span>
                      <span className="font-mono text-indigo-400">{result.eval_scores.cinematic_lighting} / 5</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
                      <div
                        className="bg-indigo-500 h-full rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${(result.eval_scores.cinematic_lighting / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-300 font-medium mb-1.5">
                      <span>Action Clarity</span>
                      <span className="font-mono text-indigo-400">{result.eval_scores.action_clarity} / 5</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
                      <div
                        className="bg-indigo-500 h-full rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${(result.eval_scores.action_clarity / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1 mt-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Judge Feedback & Instructions
                    </span>
                    <p className="text-slate-300 text-xs italic leading-relaxed">
                      "{result.eval_scores.feedback}"
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Technical Architecture Overview */}
        <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 text-slate-400 text-xs space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            💡 LLM Systems Engineering Overview
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-850 space-y-1">
              <strong className="text-slate-200 block">1. Autonomous Feedback Loop</strong>
              <p className="text-slate-400 leading-normal">
                If scores fall below threshold (&lt; 4/5), the judge generates feedback which is injected back into the generator prompt for automatic re-evaluations.
              </p>
            </div>
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-850 space-y-1">
              <strong className="text-slate-200 block">2. Dual-Model Specialization</strong>
              <p className="text-slate-400 leading-normal">
                Separates creative generation (<code className="text-indigo-300 font-mono">gemma-4-26b-a4b-it</code>) from objective grading (<code className="text-purple-300 font-mono">gemma-4-31b-it</code>) to prevent generator bias.
              </p>
            </div>
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-850 space-y-1">
              <strong className="text-slate-200 block">3. Zero-Break JSON Parser</strong>
              <p className="text-slate-400 leading-normal">
                Employs custom brace-depth tracking (<code className="text-slate-300 font-mono">lib/utils.ts</code>) to extract structured JSON payloads despite conversational LLM output noise.
              </p>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}