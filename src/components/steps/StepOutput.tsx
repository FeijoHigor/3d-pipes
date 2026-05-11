import type { StepProps } from "./types";

interface OutputProps extends StepProps {
  onReset: () => void;
  onGoHome: () => void;
}

export default function StepOutput({ pipeline, allData, onReset, onGoHome }: OutputProps) {
  return (
    <div className="text-center py-4">
      <div className="text-5xl mb-4">🎉</div>
      <h3 className="text-xl font-semibold mb-2">Modelo 3D Pronto!</h3>
      <p className="text-sm text-zinc-400 mb-8 max-w-md mx-auto">
        Seu modelo <strong className="text-zinc-200">{pipeline.name}</strong> foi
        gerado com sucesso e está pronto para download.
      </p>

      {/* Summary */}
      <div className="bg-zinc-800/50 rounded-xl p-5 max-w-sm mx-auto mb-8 text-left">
        <p className="text-xs text-zinc-500 font-mono mb-3">RESUMO</p>
        <div className="space-y-2">
          {Object.entries(allData)
            .filter(([key]) => !key.startsWith("preview") && key !== "fileName")
            .map(([key, value]) => (
              <div key={key} className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">{key.replace(/_/g, " ")}</span>
                <span className="text-zinc-300">
                  {typeof value === "string" ? value : "-"}
                </span>
              </div>
            ))}
          <div className="flex items-center justify-between text-sm pt-2 border-t border-zinc-700">
            <span className="text-zinc-500">Formato</span>
            <span className="text-zinc-300 font-mono">{pipeline.outputFormat}</span>
          </div>
        </div>
      </div>

      {/* Mock download buttons */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <button className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-all cursor-pointer">
          ⬇ Download .glb
        </button>
        <button className="px-5 py-2.5 bg-zinc-800 text-zinc-300 rounded-lg text-sm font-medium border border-zinc-700 hover:bg-zinc-700 transition-all cursor-pointer">
          ⬇ Download .stl
        </button>
      </div>

      <p className="text-xs text-zinc-500 mb-8">
        ⚠️ MVP: downloads simulados. Em produção, os arquivos reais estariam disponíveis.
      </p>

      {/* Actions */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={onReset}
          className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
        >
          Criar outro com esta pipeline
        </button>
        <button
          onClick={onGoHome}
          className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
        >
          Voltar ao início
        </button>
      </div>
    </div>
  );
}
