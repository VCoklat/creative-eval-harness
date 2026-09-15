import { NextResponse } from 'next/server';
import { generateScene } from '@/lib/generator';
import { evaluateScene } from '@/lib/evaluator';
import { HarnessResponse, SceneDraft, EvalScore } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const { idea, maxRetries = 2 } = await req.json();

    if (!idea || typeof idea !== 'string') {
      return NextResponse.json({ error: 'Idea is required' }, { status: 400 });
    }

    const startTime = Date.now();
    let currentFeedback: string | undefined = undefined;
    let finalScene: SceneDraft | null = null;
    let evalScores: EvalScore | null = null;
    let attempts = 0;

    // Loop Control Agent: Retry jika juri belum memberikan approved = true
    for (let i = 1; i <= maxRetries + 1; i++) {
      attempts = i;
      finalScene = await generateScene(idea, currentFeedback);
      evalScores = await evaluateScene(finalScene);

      if (evalScores.approved || i === maxRetries + 1) {
        break;
      }
      currentFeedback = evalScores.feedback;
    }

    const latencySeconds = parseFloat(((Date.now() - startTime) / 1000).toFixed(2));

    const payload: HarnessResponse = {
      final_scene: finalScene!,
      eval_scores: evalScores!,
      attempts,
      latency_seconds: latencySeconds,
      model_routing: {
        generator: 'nvidia/moonshotai/kimi-k3',
        evaluator: 'nvidia/google/gemma-4-31b-it',
      },
    };

    return NextResponse.json(payload);
  } catch (error: any) {
    console.error('Harness execution error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}