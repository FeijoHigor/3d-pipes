import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Pipeline, PipelineInput } from "../types";
import { usePipelineContext } from "../context/PipelineContext";

const ANGLE_PRESETS: Record<string, string[]> = {
  "2": ["Frontal (0°)", "Traseira (180°)"],
  "3": ["Frontal (0°)", "Lateral (90°)", "3/4 Frontal (45°)"],
  "4": ["Frontal (0°)", "Lateral Esquerda (90°)", "Traseira (180°)", "Lateral Direita (270°)"],
  "5": ["Frontal (0°)", "3/4 Esquerda (45°)", "Lateral (90°)", "3/4 Traseira (135°)", "Traseira (180°)"],
  "6": ["Frontal (0°)", "3/4 Esquerda (45°)", "Lateral Esquerda (90°)", "Traseira (180°)", "Lateral Direita (270°)", "3/4 Direita (315°)"],
};

const ICON_OPTIONS = ["🎨", "🐾", "😄", "🧸", "🎭", "👤", "🎮", "🏆", "💎", "🌟", "🔮", "🎪"];

const OUTPUT_OPTIONS = [".stl", ".glb", ".obj", ".stl / .glb", ".glb / .obj"];

interface InputField {
  id: string;
  label: string;
  type: "text" | "select" | "photo";
  placeholder: string;
  options: string;
  required: boolean;
}

export default function CreatePipeline() {
  const navigate = useNavigate();
  const { addPipeline } = usePipelineContext();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("🎨");
  const [style, setStyle] = useState("");
  const [outputFormat, setOutputFormat] = useState(".stl / .glb");
  const [imageCount, setImageCount] = useState(3);
  const [customAngles, setCustomAngles] = useState<string[]>(ANGLE_PRESETS["3"]);
  const [promptBase, setPromptBase] = useState("");
  const [promptRules, setPromptRules] = useState<string[]>([""]);
  const [inputs, setInputs] = useState<InputField[]>([
    { id: "", label: "", type: "text", placeholder: "", options: "", required: true },
  ]);

  function handleImageCountChange(count: number) {
    setImageCount(count);
    const preset = ANGLE_PRESETS[String(count)];
    if (preset) {
      setCustomAngles([...preset]);
    } else {
      setCustomAngles((prev) => {
        const next = [...prev];
        while (next.length < count) next.push(`Ângulo ${next.length + 1}`);
        return next.slice(0, count);
      });
    }
  }

  function updateAngle(index: number, value: string) {
    setCustomAngles((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  // Prompt rules
  function addRule() {
    setPromptRules((prev) => [...prev, ""]);
  }
  function updateRule(index: number, value: string) {
    setPromptRules((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }
  function removeRule(index: number) {
    setPromptRules((prev) => prev.filter((_, i) => i !== index));
  }

  // Input fields
  function addInput() {
    setInputs((prev) => [
      ...prev,
      { id: "", label: "", type: "text", placeholder: "", options: "", required: true },
    ]);
  }
  function updateInput(index: number, field: keyof InputField, value: string | boolean) {
    setInputs((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }
  function removeInput(index: number) {
    setInputs((prev) => prev.filter((_, i) => i !== index));
  }

  function buildSteps() {
    const steps = [];

    // Check if there are any photo inputs
    const photoInputs = inputs.filter((i) => i.type === "photo" && i.label);
    const otherInputs = inputs.filter((i) => i.type !== "photo" && i.label);

    if (photoInputs.length > 0) {
      steps.push({
        id: "upload-photo",
        type: "upload" as const,
        title: "Upload de Foto",
        description: "Envie a foto de referência para a geração.",
        inputs: photoInputs.map((i) => ({
          id: i.id || i.label.toLowerCase().replace(/\s+/g, "_"),
          label: i.label,
          type: "photo" as const,
          required: i.required,
        })),
      });
    }

    if (otherInputs.length > 0) {
      steps.push({
        id: "user-inputs",
        type: "input" as const,
        title: "Informações",
        description: "Preencha as informações para personalizar o modelo.",
        inputs: otherInputs.map((i): PipelineInput => ({
          id: i.id || i.label.toLowerCase().replace(/\s+/g, "_"),
          label: i.label,
          type: i.type as "text" | "select",
          placeholder: i.placeholder || undefined,
          options: i.type === "select" ? i.options.split(",").map((o) => o.trim()).filter(Boolean) : undefined,
          required: i.required,
        })),
      });
    }

    steps.push(
      {
        id: "generate-images",
        type: "generate" as const,
        title: "Gerar Imagens de Referência",
        description: `O sistema gerará ${imageCount} imagens em ângulos diferentes usando IA generativa.`,
      },
      {
        id: "review-images",
        type: "review" as const,
        title: "Revisar Imagens",
        description: "Confira as imagens geradas. Aprove ou peça uma nova geração.",
      },
      {
        id: "reconstruct-3d",
        type: "reconstruct" as const,
        title: "Reconstrução 3D",
        description: "As imagens aprovadas serão transformadas em um modelo 3D.",
      },
      {
        id: "output",
        type: "output" as const,
        title: "Modelo Pronto!",
        description: "Seu modelo 3D está pronto para download.",
      }
    );

    return steps;
  }

  const isValid = name.trim() && promptBase.trim();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;

    const pipeline: Pipeline = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      icon,
      style: style.trim(),
      outputFormat,
      promptBase: promptBase.trim(),
      promptRules: promptRules.filter((r) => r.trim()),
      imageCount,
      angles: customAngles,
      steps: buildSteps(),
      isCustom: true,
    };

    addPipeline(pipeline);
    navigate("/");
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate("/")}
          className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm cursor-pointer"
        >
          ← Voltar
        </button>
        <span className="text-zinc-700">|</span>
        <h1 className="text-xl font-semibold">Criar Nova Pipeline</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
        {/* Basic info */}
        <section className="border border-zinc-800 rounded-xl p-6 bg-zinc-900/30">
          <h2 className="text-sm font-semibold text-zinc-300 mb-4 uppercase tracking-wide">
            Informações Básicas
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="shrink-0">
                <label className="block text-sm text-zinc-400 mb-1.5">Ícone</label>
                <div className="flex flex-wrap gap-1.5 max-w-[180px]">
                  {ICON_OPTIONS.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setIcon(ic)}
                      className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all cursor-pointer ${
                        icon === ic
                          ? "bg-primary/20 border border-primary/40"
                          : "bg-zinc-800 border border-zinc-700 hover:border-zinc-500"
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1.5">
                    Nome da Pipeline <span className="text-primary-light">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Pet no Suporte"
                    className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1.5">Descrição</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descreva o que essa pipeline faz..."
                    rows={2}
                    className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">Estilo visual</label>
                <input
                  type="text"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  placeholder="Ex: Estatueta chibi colorida"
                  className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">Formato de saída</label>
                <div className="flex flex-wrap gap-2">
                  {OUTPUT_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setOutputFormat(opt)}
                      className={`px-3 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                        outputFormat === opt
                          ? "bg-primary/20 text-primary-light border border-primary/40"
                          : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-500"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Image count & angles */}
        <section className="border border-zinc-800 rounded-xl p-6 bg-zinc-900/30">
          <h2 className="text-sm font-semibold text-zinc-300 mb-4 uppercase tracking-wide">
            Imagens de Referência
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">
                Quantidade de imagens
              </label>
              <div className="flex gap-2">
                {[2, 3, 4, 5, 6].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => handleImageCountChange(n)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      imageCount === n
                        ? "bg-primary/20 text-primary-light border border-primary/40"
                        : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-500"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">
                Ângulos das imagens
              </label>
              <div className="space-y-2">
                {customAngles.map((angle, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500 font-mono w-5">{i + 1}.</span>
                    <input
                      type="text"
                      value={angle}
                      onChange={(e) => updateAngle(i, e.target.value)}
                      className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Prompt */}
        <section className="border border-zinc-800 rounded-xl p-6 bg-zinc-900/30">
          <h2 className="text-sm font-semibold text-zinc-300 mb-4 uppercase tracking-wide">
            Prompt de Geração
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">
                Prompt base <span className="text-primary-light">*</span>
              </label>
              <textarea
                value={promptBase}
                onChange={(e) => setPromptBase(e.target.value)}
                placeholder="Ex: Colorful 3D figurine of a {pet_type}, cute chibi proportions..."
                rows={4}
                className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 resize-none font-mono"
              />
              <p className="text-xs text-zinc-500 mt-1">
                Use {"{ }"} para variáveis que serão preenchidas pelo usuário. Ex: {"{pet_name}"}, {"{style}"}
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm text-zinc-400">Regras adicionais</label>
                <button
                  type="button"
                  onClick={addRule}
                  className="text-xs text-primary-light hover:text-primary transition-colors cursor-pointer"
                >
                  + Adicionar regra
                </button>
              </div>
              <div className="space-y-2">
                {promptRules.map((rule, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={rule}
                      onChange={(e) => updateRule(i, e.target.value)}
                      placeholder="Ex: Fundo branco, sem sombras"
                      className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                    />
                    {promptRules.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRule(i)}
                        className="text-zinc-500 hover:text-red-400 transition-colors text-sm cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* User inputs */}
        <section className="border border-zinc-800 rounded-xl p-6 bg-zinc-900/30">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">
              Inputs do Usuário
            </h2>
            <button
              type="button"
              onClick={addInput}
              className="text-xs text-primary-light hover:text-primary transition-colors cursor-pointer"
            >
              + Adicionar campo
            </button>
          </div>
          <p className="text-xs text-zinc-500 mb-4">
            Defina os campos que o usuário deverá preencher (fotos, textos, seleções).
          </p>
          <div className="space-y-3">
            {inputs.map((input, i) => (
              <div
                key={i}
                className="border border-zinc-700 rounded-lg p-4 bg-zinc-800/30 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500 font-mono">Campo {i + 1}</span>
                  {inputs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInput(i)}
                      className="text-zinc-500 hover:text-red-400 transition-colors text-xs cursor-pointer"
                    >
                      Remover
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Label</label>
                    <input
                      type="text"
                      value={input.label}
                      onChange={(e) => updateInput(i, "label", e.target.value)}
                      placeholder="Ex: Nome do pet"
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Tipo</label>
                    <div className="flex gap-1.5">
                      {(["text", "select", "photo"] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => updateInput(i, "type", t)}
                          className={`flex-1 px-2 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                            input.type === t
                              ? "bg-primary/20 text-primary-light border border-primary/40"
                              : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-500"
                          }`}
                        >
                          {t === "text" ? "Texto" : t === "select" ? "Seleção" : "Foto"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                {input.type === "text" && (
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Placeholder</label>
                    <input
                      type="text"
                      value={input.placeholder}
                      onChange={(e) => updateInput(i, "placeholder", e.target.value)}
                      placeholder="Ex: Digite o nome..."
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-primary/50"
                    />
                  </div>
                )}
                {input.type === "select" && (
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">
                      Opções (separadas por vírgula)
                    </label>
                    <input
                      type="text"
                      value={input.options}
                      onChange={(e) => updateInput(i, "options", e.target.value)}
                      placeholder="Ex: Branco, Preto, Dourado"
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-primary/50"
                    />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateInput(i, "required", !input.required)}
                    className={`w-4 h-4 rounded border transition-all cursor-pointer ${
                      input.required
                        ? "bg-primary border-primary"
                        : "bg-zinc-800 border-zinc-600"
                    }`}
                  />
                  <span className="text-xs text-zinc-400">Obrigatório</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Preview */}
        <section className="border border-zinc-800 rounded-xl p-6 bg-zinc-900/30">
          <h2 className="text-sm font-semibold text-zinc-300 mb-4 uppercase tracking-wide">
            Preview
          </h2>
          <div className="border border-zinc-700 rounded-lg p-5 bg-zinc-800/30">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{icon}</span>
              <div>
                <h3 className="font-semibold">{name || "Nome da Pipeline"}</h3>
                <p className="text-xs text-zinc-400">
                  {description || "Descrição da pipeline"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-zinc-500">
              <span>{imageCount} imagens</span>
              <span>{outputFormat}</span>
              <span>{inputs.filter((i) => i.label).length} inputs</span>
              <span>{promptRules.filter((r) => r.trim()).length} regras</span>
            </div>
          </div>
        </section>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={!isValid}
            className={`px-6 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              isValid
                ? "bg-primary text-white hover:bg-primary-dark"
                : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
            }`}
          >
            Salvar Pipeline
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-6 py-3 text-sm text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
