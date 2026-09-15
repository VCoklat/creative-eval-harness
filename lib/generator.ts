import OpenAI from 'openai';
import { SceneDraft } from './types';

const nvidiaClient = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

export async function generateScene(idea: string, feedback?: string): Promise<SceneDraft> {
  const prompt = feedback
    ? `Ide Adegan: ${idea}\n\n[PENTING] Masukan dan perbaikan dari Sutradara (harus diterapkan): ${feedback}`
    : `Ide Adegan: ${idea}`;

  const response = await nvidiaClient.chat.completions.create({
    model: 'moonshotai/kimi-k3',
    messages: [
      {
        role: 'system',
        content:
          'Kamu adalah penulisan naskah film profesional. Tugasmu adalah mengubah ide menjadi deskripsi adegan visual. Kembalikan HANYA JSON valid dengan kunci: "scene_heading", "action_description", "camera_angle".',
      },
      { role: 'user', content: prompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  const content = response.choices[0].message.content || '{}';
  return JSON.parse(content) as SceneDraft;
}