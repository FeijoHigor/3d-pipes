export interface PipelineInput {
  id: string;
  label: string;
  type: "photo" | "text" | "select";
  placeholder?: string;
  options?: string[];
  required: boolean;
}

export interface PipelineStep {
  id: string;
  type: "upload" | "input" | "generate" | "review" | "reconstruct" | "output";
  title: string;
  description: string;
  inputs?: PipelineInput[];
}

export interface Pipeline {
  id: string;
  name: string;
  description: string;
  icon: string;
  style: string;
  outputFormat: string;
  promptBase: string;
  promptRules: string[];
  imageCount: number;
  angles: string[];
  steps: PipelineStep[];
  isCustom?: boolean;
}

export interface StepState {
  status: "pending" | "active" | "completed" | "error";
  data?: Record<string, unknown>;
  previewUrls?: string[];
}

export interface PipelineExecution {
  pipelineId: string;
  currentStepIndex: number;
  stepStates: StepState[];
  startedAt: string;
}
