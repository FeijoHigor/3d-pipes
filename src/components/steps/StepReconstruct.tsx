import { useState, useEffect } from "react";
import type { StepProps } from "./types";

export default function StepReconstruct({ stepState, onComplete }: StepProps) {
  const [phase, setPhase] = useState<"idle" | "processing" | "done">(
    stepState.status === "completed" ? "done" : "idle"
  );
  const [progress, setProgress] = useState(0);

  function startReconstruction() {
    setPhase("processing");
    setProgress(0);
  }

  useEffect(() => {
    if (phase !== "processing") return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setPhase("done");
          return 100;
        }
        return prev + 1;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [phase]);

  const isCompleted = stepState.status === "completed";

  return (
    <div>
      {phase === "idle" && (
        <div className="text-center py-8">
          <div className="text-5xl mb-4">🧊</div>
          <p className="text-sm text-zinc-400 mb-2">
            As 3 imagens de referência aprovadas serão enviadas para reconstrução 3D.
          </p>
          <p className="text-xs text-zinc-500 mb-6">
            Em produção, seria usado Tripo3D, Meshy ou similar.
          </p>
          <button
            onClick={startReconstruction}
            className="px-6 py-3 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-all cursor-pointer"
          >
            Iniciar Reconstrução 3D
          </button>
        </div>
      )}

      {phase === "processing" && (
        <div className="py-8">
          <div className="max-w-sm mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-zinc-300">Reconstruindo modelo 3D...</span>
              <span className="text-sm text-zinc-500 font-mono">{progress}%</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-4 space-y-1.5 text-xs text-zinc-500">
              <p className={progress >= 10 ? "text-zinc-400" : ""}>
                {progress >= 10 ? "✓" : "○"} Enviando imagens...
              </p>
              <p className={progress >= 30 ? "text-zinc-400" : ""}>
                {progress >= 30 ? "✓" : "○"} Detectando geometria...
              </p>
              <p className={progress >= 60 ? "text-zinc-400" : ""}>
                {progress >= 60 ? "✓" : "○"} Gerando mesh...
              </p>
              <p className={progress >= 80 ? "text-zinc-400" : ""}>
                {progress >= 80 ? "✓" : "○"} Aplicando texturas...
              </p>
              <p className={progress >= 95 ? "text-zinc-400" : ""}>
                {progress >= 95 ? "✓" : "○"} Finalizando modelo...
              </p>
            </div>
          </div>
        </div>
      )}

      {phase === "done" && (
        <div className="text-center py-6">
          <div className="w-48 h-48 mx-auto bg-zinc-800 rounded-xl border border-zinc-700 flex items-center justify-center mb-4">
            <div className="text-center">
              <span className="text-5xl block mb-2">🧊</span>
              <span className="text-xs text-zinc-500">Preview 3D</span>
            </div>
          </div>
          <p className="text-sm text-green-400 mb-1">Modelo gerado com sucesso!</p>
          <p className="text-xs text-zinc-500 mb-6">
            MVP: modelo simulado. Em produção, seria exibido um viewer 3D interativo.
          </p>

          {!isCompleted && (
            <button
              onClick={onComplete}
              className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-all cursor-pointer"
            >
              Continuar →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
