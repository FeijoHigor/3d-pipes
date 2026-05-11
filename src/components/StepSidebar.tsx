import type { PipelineStep, StepState } from "../types";

interface Props {
  steps: PipelineStep[];
  stepStates: StepState[];
  currentStep: number;
  onStepClick: (index: number) => void;
}

const typeIcons: Record<string, string> = {
  upload: "📸",
  input: "✏️",
  generate: "🤖",
  review: "👀",
  reconstruct: "🧊",
  output: "✅",
};

export default function StepSidebar({
  steps,
  stepStates,
  currentStep,
  onStepClick,
}: Props) {
  return (
    <div className="hidden md:block w-56 shrink-0">
      <nav className="space-y-1">
        {steps.map((step, i) => {
          const state = stepStates[i];
          const isCurrent = i === currentStep;
          const isClickable = state.status !== "pending";

          return (
            <button
              key={step.id}
              onClick={() => onStepClick(i)}
              disabled={!isClickable}
              className={`
                w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-150 cursor-pointer
                flex items-center gap-2.5
                ${
                  isCurrent
                    ? "bg-primary/15 text-primary-light border border-primary/30"
                    : state.status === "completed"
                    ? "text-zinc-400 hover:bg-zinc-800/50"
                    : "text-zinc-600 cursor-not-allowed"
                }
              `}
            >
              <span className="text-base shrink-0">
                {state.status === "completed" ? "✓" : typeIcons[step.type] || "•"}
              </span>
              <span className="truncate">{step.title}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
