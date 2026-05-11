import { Link } from "react-router-dom";
import pipelines from "../data/pipelines";

export default function Home() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Crie modelos 3D com IA
        </h1>
        <p className="text-zinc-400 text-lg max-w-2xl">
          Selecione uma pipeline abaixo para transformar suas fotos em modelos 3D
          prontos para impressão. Sem complicação.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pipelines.map((pipeline) => (
          <Link
            key={pipeline.id}
            to={`/pipeline/${pipeline.id}`}
            className="group border border-zinc-800 rounded-xl p-6 hover:border-primary/50 hover:bg-zinc-900/50 transition-all duration-200"
          >
            <div className="text-4xl mb-4">{pipeline.icon}</div>
            <h2 className="text-lg font-semibold mb-1 group-hover:text-primary-light transition-colors">
              {pipeline.name}
            </h2>
            <p className="text-sm text-zinc-400 mb-4 leading-relaxed">
              {pipeline.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500 font-mono">
                {pipeline.steps.length} etapas
              </span>
              <span className="text-xs text-zinc-500 font-mono">
                {pipeline.outputFormat}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 border border-zinc-800 rounded-xl p-6 bg-zinc-900/30">
        <h3 className="text-sm font-semibold text-zinc-300 mb-3">
          Como funciona?
        </h3>
        <div className="grid sm:grid-cols-4 gap-4">
          {[
            { step: "1", icon: "📸", text: "Envie sua foto" },
            { step: "2", icon: "🤖", text: "IA gera imagens em 3 ângulos" },
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
