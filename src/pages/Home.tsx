import { Link } from "react-router-dom";
import { usePipelineContext } from "../context/PipelineContext";

export default function Home() {
  const { pipelines, removePipeline } = usePipelineContext();

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Crie modelos 3D com IA
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl">
            Selecione uma pipeline abaixo para transformar suas fotos em modelos 3D
            prontos para impressão. Sem complicação.
          </p>
        </div>
        <Link
          to="/create"
          className="shrink-0 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-all"
        >
          + Nova Pipeline
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pipelines.map((pipeline) => (
          <div key={pipeline.id} className="relative group">
            <Link
              to={`/pipeline/${pipeline.id}`}
              className="block border border-zinc-800 rounded-xl p-6 hover:border-primary/50 hover:bg-zinc-900/50 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">{pipeline.icon}</span>
                {pipeline.isCustom && (
                  <span className="text-[10px] font-mono text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
                    custom
                  </span>
                )}
              </div>
              <h2 className="text-lg font-semibold mb-1 group-hover:text-primary-light transition-colors">
                {pipeline.name}
              </h2>
              <p className="text-sm text-zinc-400 mb-4 leading-relaxed">
                {pipeline.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500 font-mono">
                  {pipeline.imageCount} imagens · {pipeline.steps.length} etapas
                </span>
                <span className="text-xs text-zinc-500 font-mono">
                  {pipeline.outputFormat}
                </span>
              </div>
            </Link>
            {pipeline.isCustom && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (confirm(`Remover "${pipeline.name}"?`)) {
                    removePipeline(pipeline.id);
                  }
                }}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-all text-xs cursor-pointer bg-zinc-900/80 px-2 py-1 rounded"
              >
                Remover
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 border border-zinc-800 rounded-xl p-6 bg-zinc-900/30">
        <h3 className="text-sm font-semibold text-zinc-300 mb-3">
          Como funciona?
        </h3>
        <div className="grid sm:grid-cols-4 gap-4">
          {[
            { step: "1", icon: "📸", text: "Envie sua foto" },
            { step: "2", icon: "🤖", text: "IA gera imagens em múltiplos ângulos" },
            { step: "3", icon: "✅", text: "Você aprova as imagens" },
            { step: "4", icon: "🧊", text: "Modelo 3D gerado" },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="text-2xl mb-2">{item.icon}</div>
              <p className="text-xs text-zinc-400">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
