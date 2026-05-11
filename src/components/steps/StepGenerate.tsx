import { useState, useEffect } from "react";
import type { StepProps } from "./types";

const MOCK_ANGLES = ["Frontal (0°)", "Lateral (90°)", "3/4 Frontal (45°)"];

export default function StepGenerate({ stepState, onComplete }: StepProps) {
  const [progress, setProgress] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(stepState.status === "completed");

  function startGeneration() {
    setGenerating(true);
    setProgress(0);
  }

  useEffect(() => {
    if (!generating) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setGenerating(false);
          setGenerated(true);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [generating]);

  const isCompleted = stepState.status === "completed";

  return (
    <div>
      {!generated && !generating && (
        <div className="text-center py-8">
          <div className="text-5xl mb-4">🤖</div>
          <p className="text-sm text-zinc-400 mb-6">
            Pronto para gerar as 3 imagens de referência em ângulos diferentes.
          </p>
          <button
            onClick={startGeneration}
            className="px-6 py-3 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-all cursor-pointer"
          >
            Gerar Imagens
          </button>
        </div>
      )}

      {generating && (
        <div className="py-8">
          <div className="max-w-sm mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-zinc-300">Gerando imagens...</span>
              <span className="text-sm text-zinc-500 font-mono">{progress}%</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-zinc-500 mt-3 text-center">
              {progress < 33
                ? `Gerando ${MOCK_ANGLES[0]}...`
                : progress < 66
                ? `Gerando ${MOCK_ANGLES[1]}...`
                : `Gerando ${MOCK_ANGLES[2]}...`}
            </p>
          </div>
        </div>
      )}

      {generated && (
        <div>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {MOCK_ANGLES.map((angle, i) => (
              <div
                key={i}
                className="bg-zinc-800 rounded-lg p-4 text-center border border-zinc-700"
              >
                <div className="aspect-square bg-zinc-700/50 rounded-md mb-2 flex items-center justify-center">
                  <span className="text-3xl opacity-30">🖼️</span>
                </div>
                <p className="text-xs text-zinc-400">{angle}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-zinc-500 text-center mb-4">
            ⚠️ MVP: imagens simuladas. Em produção, serão geradas via IA generativa.
          </p>

          {!isCompleted && (
            <div className="flex justify-end">
              <button
                onClick={onComplete}
                className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-all cursor-pointer"
              >
                Continuar →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
