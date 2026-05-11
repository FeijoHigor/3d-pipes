import type { PipelineStep, StepState, Pipeline } from "../../types";

export interface StepProps {
  step: PipelineStep;
  stepState: StepState;
  updateData: (data: Record<string, unknown>) => void;
  onComplete: () => void;
  allData: Record<string, unknown>;
  pipeline: Pipeline;
}
