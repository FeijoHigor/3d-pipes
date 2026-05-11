import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import pipelines from "../data/pipelines";
import type { StepState } from "../types";
import StepUpload from "../components/steps/StepUpload";
import StepInput from "../components/steps/StepInput";
import StepGenerate from "../components/steps/StepGenerate";
import StepReview from "../components/steps/StepReview";
import StepReconstruct from "../components/steps/StepReconstruct";
import StepOutput from "../components/steps/StepOutput";
import StepSidebar from "../components/StepSidebar";
import PromptPreview from "../components/PromptPreview";

export default function PipelineExecution() {
  const { pipelineId } = useParams<{ pipelineId: string }>();
  const navigate = useNavigate();
  const pipeline = pipelines.find((p) => p.id === pipelineId);

  const [currentStep, setCurrentStep] = useState(0);
  const [stepStates, setStepStates] = useState<StepState[]>(() =>
    pipeline
      ? pipeline.steps.map((_, i) => ({
          status: i === 0 ? "active" : "pending",
          data: {},
        }))
      : []
  );
  const [showPrompt, setShowPrompt] = useState(false);

  const allData = useMemo(() => {
    const merged: Record<string, unknown> = {};
    stepStates.forEach((s) => {
      if (s.data) Object.assign(merged, s.data);
    });
    return merged;
  }, [stepStates]);

  if (!pipeline) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-400 mb-4">Pipeline não encontrada.</p>
        <Link to="/" className="text-primary-light hover:underline">
          Voltar ao início
        </Link>
      </div>
    );
  }

  const step = pipeline.steps[currentStep];

  function updateStepData(data: Record<string, unknown>) {
    setStepStates((prev) => {
      const next = [...prev];
      next[currentStep] = {
        ...next[currentStep],
        data: { ...next[currentStep].data, ...data },
      };
      return next;
    });
  }

  function completeStep() {
    setStepStates((prev) => {
      const next = [...prev];
      next[currentStep] = { ...next[currentStep], status: "completed" };
      if (currentStep + 1 < next.length) {
        next[currentStep + 1] = { ...next[currentStep + 1], status: "active" };
      }
      return next;
    });
    if (pipeline && currentStep + 1 < pipeline.steps.length) {
      setCurrentStep(currentStep + 1);
    }
  }

  function goToStep(index: number) {
    if (stepStates[index].status !== "pending") {
      setCurrentStep(index);
    }
  }

  function resetPipeline() {
    setCurrentStep(0);
    setStepStates(
      pipeline!.steps.map((_, i) => ({
        status: i === 0 ? "active" : "pending",
        data: {},
      }))
    );
  }

  const stepProps = {
    step,
    stepState: stepStates[currentStep],
    updateData: updateStepData,
    onComplete: completeStep,
    allData,
    pipeline,
  };

  function renderStep() {
    switch (step.type) {
      case "upload":
        return <StepUpload {...stepProps} />;
      case "input":
        return <StepInput {...stepProps} />;
      case "generate":
        return <StepGenerate {...stepProps} />;
      case "review":
        return <StepReview {...stepProps} />;
      case "reconstruct":
        return <StepReconstruct {...stepProps} />;
      case "output":
        return <StepOutput {...stepProps} onReset={resetPipeline} onGoHome={() => navigate("/")} />;
      default:
        return null;
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          to="/"
          className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
        >
          ← Voltar
        </Link>
        <span className="text-zinc-700">|</span>
        <span className="text-2xl">{pipeline.icon}</span>
        <h1 className="text-xl font-semibold">{pipeline.name}</h1>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <StepSidebar
          steps={pipeline.steps}
          stepStates={stepStates}
          currentStep={currentStep}
          onStepClick={goToStep}
        />

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="border border-zinc-800 rounded-xl p-6 bg-zinc-900/30">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-zinc-500 font-mono uppercase tracking-wide">
                Etapa {currentStep + 1} de {pipeline.steps.length}
              </span>
              <button
                onClick={() => setShowPrompt(!showPrompt)}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
              >
                {showPrompt ? "Ocultar prompt" : "Ver prompt base"}
              </button>
            </div>
            <h2 className="text-lg font-semibold mb-1">{step.title}</h2>
            <p className="text-sm text-zinc-400 mb-6">{step.description}</p>

            {showPrompt && (
              <PromptPreview pipeline={pipeline} allData={allData} />
            )}

            {renderStep()}
          </div>
        </div>
      </div>
    </div>
  );
}
