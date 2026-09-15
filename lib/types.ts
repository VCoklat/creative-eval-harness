export interface SceneDraft {
  scene_heading: string;
  action_description: string;
  camera_angle: string;
}

export interface EvalScore {
  cinematic_lighting: number;
  action_clarity: number;
  feedback: string;
  approved: boolean;
}

export interface HarnessResponse {
  final_scene: SceneDraft;
  eval_scores: EvalScore;
  attempts: number;
  latency_seconds: number;
  model_routing: {
    generator: string;
    evaluator: string;
  };
}