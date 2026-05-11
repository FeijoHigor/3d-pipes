import { useState, useMemo } from "react";
import type { StepProps } from "./types";
import { buildAllPrompts, exportAllPromptsAsText } from "../../lib/promptBuilder";

export default function StepGenerate({ stepState, onComplete, pipeline, allData }: StepProps) {
  const angles = pipeline.angles;
  const imageCount = pipeline.imageCount;

  const prompts = useMemo(
    () => buildAllPrompts(pipeline, allData),
    [pipeline, allData]
  );

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  async function copyPrompt(text: string, index: number) {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  async function copyAll() {
    const full = exportAllPromptsAsText(pipeline, allData);
    await navigator.clipboard.writeText(full);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  }

  const isCompleted = stepState.status === "completed";

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-zinc-400">
          Copie os prompts abaixo e use no modelo de geração de imagem de sua preferência.
          Gere <strong className="text-zinc-200">{imageCount} imagens</strong>, uma para cada ângulo.
        </p>
      </div>

      {/* Copy all button */}
      <div className="flex justify-end mb-3">
        <button
          onClick={copyAll}
          className="text-xs text-zinc-400 hover:text-primary-light transition-colors cursor-pointer flex items-center gap-1.5"
        >
          {copiedAll ? "✓ Copiado!" : "📋 Copiar todos os prompts"}
        </button>
      </div>

      {/* Prompt cards */}
      <div className="space-y-3 mb-6">
        {prompts.map((p, i) => (
          <div
            key={i}
            className="border border-zinc-700 rounded-lg bg-zinc-800/50 overflow-hidden"
          >
            {/* Card header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-700/50 bg-zinc-800/80">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-zinc-500">
                  {i + 1}/{imageCount}
                </span>
                <span className="text-sm text-zinc-300 font-medium">
                  {p.angle}
                </span>
              </div>
              <button
                onClick={() => copyPrompt(p.prompt, i)}
                className="text-xs px-2.5 py-1 rounded bg-zinc-700 text-zinc-300 hover:bg-zinc-600 hover:text-white transition-all cursor-pointer"
              >
                {copiedIndex === i ? "✓ Copiado!" : "Copiar"}
              </button>
            </div>
            {/* Prompt text */}
            <pre className="px-4 py-3 text-xs text-zinc-400 leading-relaxed whitespace-pre-wrap font-mono max-h-48 overflow-y-auto">
              {p.prompt}
            </pre>
          </div>
        ))}
      </div>

      {/* Angle reference */}
      <div className="flex flex-wrap gap-2 mb-4">
        {angles.map((angle, i) => (
          <span
            key={i}
            className="text-[11px] font-mono text-zinc-500 bg-zinc-800 border border-zinc-700 px-2 py-1 rounded"
          >
            📐 {angle}
          </span>
        ))}
      </div>

      <p className="text-xs text-zinc-500 mb-6">
        💡 Use a foto enviada como referência junto com o prompt acima. Gere cada imagem separadamente, uma por ângulo.
      </p>

      {!isCompleted && (
        <div className="flex justify-end">
          <button
            onClick={onComplete}
            className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-all cursor-pointer"
          >
            Já gerei as imagens → Continuar
          </button>
        </div>
      )}
    </div>
  );
}
