import OpenAI from 'openai';
import { SceneDraft, EvalScore } from './types';

const nvidiaClient = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

export async function evaluateScene(scene: SceneDraft): Promise<EvalScore> {
  const prompt = `
  Bertindak sebagai Sutradara Film Senior. Evaluasi draf adegan berikut berdasarkan standar visual produksi:
  - Heading: ${scene.scene_heading}
  - Action Description: ${scene.action_description}
  - Camera Angle: ${scene.camera_angle}

  Aturan Penilaian:
  1. Berikan skor 1-5 untuk "cinematic_lighting" dan "action_clarity".
  2. "approved" bernilai true HANYA JIKA kedua skor >= 4.
  3. Berikan "feedback" maksimal 2 kalimat ringkas untuk instruksi perbaikan jika tidak approved.

  Kembalikan HANYA JSON valid dengan format:
  {
    "cinematic_lighting": number,
    "action_clarity": number,
    "feedback": string,
    "approved": boolean
  }
  `;

  const response = await nvidiaClient.chat.completions.create({
    model: 'google/gemma-4-31b-it',
    messages: [
      {
        role: 'system',
        content: 'Kamu adalah juri penilai kualitas visual naskah yang ketat dan objektif.',
      },
      { role: 'user', content: prompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.2,
  });

  const content = response.choices[0].message.content || '{}';
  return JSON.parse(content) as EvalScore;
}