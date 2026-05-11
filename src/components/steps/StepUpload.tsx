import { useState, useRef } from "react";
import type { StepProps } from "./types";

export default function StepUpload({ step, stepState, updateData, onComplete }: StepProps) {
  const [preview, setPreview] = useState<string | null>(
    (stepState.data?.preview as string) || null
  );
  const [fileName, setFileName] = useState<string>(
    (stepState.data?.fileName as string) || ""
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreview(dataUrl);
      setFileName(file.name);
      updateData({
        [step.inputs?.[0]?.id || "photo"]: file.name,
        preview: dataUrl,
        fileName: file.name,
      });
    };
    reader.readAsDataURL(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFile(file);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  const isCompleted = stepState.status === "completed";

  return (
    <div>
      {/* Drop zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
          ${preview
            ? "border-primary/40 bg-primary/5"
            : "border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/30"
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />

        {preview ? (
          <div className="space-y-3">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 mx-auto rounded-lg object-cover"
            />
            <p className="text-sm text-zinc-400">{fileName}</p>
            <p className="text-xs text-zinc-500">Clique para trocar a foto</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-4xl">📸</div>
            <p className="text-sm text-zinc-300">
              Arraste uma foto aqui ou clique para selecionar
            </p>
            <p className="text-xs text-zinc-500">PNG, JPG até 10MB</p>
          </div>
        )}
      </div>

      {/* Action */}
      {!isCompleted && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={onComplete}
            disabled={!preview}
            className={`
              px-5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer
              ${preview
                ? "bg-primary text-white hover:bg-primary-dark"
                : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              }
            `}
          >
            Continuar →
          </button>
        </div>
      )}
    </div>
  );
}
