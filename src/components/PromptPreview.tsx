import type { Pipeline } from "../types";

interface Props {
  pipeline: Pipeline;
  allData: Record<string, unknown>;
}

export default function PromptPreview({ pipeline, allData }: Props) {
  let prompt = pipeline.promptBase;

  // Replace placeholders with actual data
  Object.entries(allData).forEach(([key, value]) => {
    if (typeof value === "string") {
      prompt = prompt.replace(new RegExp(`\\{${key}\\}`, "g"), value);
    }
  });

  return (
    <div className="mb-6 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
      <p className="text-xs text-zinc-500 font-mono mb-2">PROMPT BASE</p>
      <p className="text-sm text-zinc-300 leading-relaxed italic">"{prompt}"</p>
      <div className="mt-3 pt-3 border-t border-zinc-700">
        <p className="text-xs text-zinc-500 font-mono mb-1.5">REGRAS 3D</p>
        <ul className="space-y-1">
          {pipeline.promptRules.map((rule, i) => (
            <li key={i} className="text-xs text-zinc-400 flex items-start gap-1.5">
              <span className="text-primary-light mt-0.5">•</span>
              {rule}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
