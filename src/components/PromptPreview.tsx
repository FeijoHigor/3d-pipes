import { useState } from "react";
import type { Pipeline } from "../types";
import { buildAllPrompts, exportAllPromptsAsText } from "../lib/promptBuilder";

interface Props {
  pipeline: Pipeline;
  allData: Record<string, unknown>;
}

export default function PromptPreview({ pipeline, allData }: Props) {
  const prompts = buildAllPrompts(pipeline, allData);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const text = exportAllPromptsAsText(pipeline, allData);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Show a summary with the first prompt as example
  const example = prompts[0];

  return (
    <div className="mb-6 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-zinc-500 font-mono">PROMPT FINAL (exemplo: {example.angle})</p>
        <button
          onClick={handleCopy}
          className="text-xs text-zinc-400 hover:text-primary-light transition-colors cursor-pointer"
        >
          {copied ? "✓ Copiado!" : "📋 Copiar todos"}
        </button>
      </div>
      <pre className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap font-mono max-h-40 overflow-y-auto">
        {example.prompt}
      </pre>
      {pipeline.angles.length > 1 && (
        <p className="text-[11px] text-zinc-500 mt-2">
          + {pipeline.angles.length - 1} prompt(s) para os outros ângulos
        </p>
      )}
    </div>
  );
}
