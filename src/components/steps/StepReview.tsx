import { useState } from "react";
import type { StepProps } from "./types";

export default function StepReview({ stepState, onComplete, pipeline }: StepProps) {
  const angles = pipeline.angles;
  const imageCount = pipeline.imageCount;
  const [approved, setApproved] = useState<boolean[]>(
    () => Array(imageCount).fill(true)
  );
  const isCompleted = stepState.status === "completed";

  function toggleApproval(index: number) {
    if (isCompleted) return;
    setApproved((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  }

  const allApproved = approved.every(Boolean);

  return (
    <div>
      <div className={`grid gap-3 mb-4 ${imageCount <= 2 ? 'grid-cols-2' : imageCount === 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {angles.map((angle, i) => (
          <div
            key={i}
            onClick={() => toggleApproval(i)}
            className={`
              rounded-lg p-4 text-center border-2 transition-all cursor-pointer
              ${approved[i]
                ? "border-green-500/40 bg-green-500/5"
                : "border-red-500/40 bg-red-500/5"
              }
            `}
          >
            <div className="aspect-square bg-zinc-700/50 rounded-md mb-2 flex items-center justify-center relative">
              <span className="text-3xl opacity-30">🖼️</span>
              <span className="absolute top-1 right-1 text-lg">
                {approved[i] ? "✅" : "❌"}
              </span>
            </div>
            <p className="text-xs text-zinc-400">{angle}</p>
            <p className="text-xs mt-1">
              {approved[i] ? (
                <span className="text-green-400">Aprovada</span>
              ) : (
                <span className="text-red-400">Reprovada</span>
              )}
            </p>
          </div>
        ))}
      </div>

      <p className="text-xs text-zinc-500 text-center mb-6">
        Clique em uma imagem para aprovar ou reprovar. Imagens reprovadas seriam regeneradas em produção.
      </p>

      {!isCompleted && (
        <div className="flex justify-end gap-3">
          {!allApproved && (
            <button
              className="px-5 py-2.5 bg-zinc-800 text-zinc-300 rounded-lg text-sm font-medium border border-zinc-700 hover:bg-zinc-700 transition-all cursor-pointer"
            >
              Regerar reprovadas
            </button>
          )}
          <button
            onClick={onComplete}
            className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-all cursor-pointer"
          >
            {allApproved ? "Aprovar e continuar →" : "Continuar assim mesmo →"}
          </button>
        </div>
      )}
    </div>
  );
}
