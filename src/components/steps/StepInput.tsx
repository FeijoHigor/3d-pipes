import { useState } from "react";
import type { StepProps } from "./types";

export default function StepInput({ step, stepState, updateData, onComplete }: StepProps) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    step.inputs?.forEach((input) => {
      initial[input.id] = (stepState.data?.[input.id] as string) || "";
    });
    return initial;
  });

  function handleChange(id: string, value: string) {
    setValues((prev) => ({ ...prev, [id]: value }));
    updateData({ [id]: value });
  }

  const allRequiredFilled = step.inputs
    ?.filter((i) => i.required)
    .every((i) => values[i.id]?.trim());

  const isCompleted = stepState.status === "completed";

  return (
    <div>
      <div className="space-y-4">
        {step.inputs?.map((input) => (
          <div key={input.id}>
            <label className="block text-sm text-zinc-300 mb-1.5">
              {input.label}
              {input.required && <span className="text-primary-light ml-1">*</span>}
            </label>

            {input.type === "text" && (
              <input
                type="text"
                value={values[input.id] || ""}
                onChange={(e) => handleChange(input.id, e.target.value)}
                placeholder={input.placeholder}
                disabled={isCompleted}
                className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
              />
            )}

            {input.type === "select" && (
              <div className="flex flex-wrap gap-2">
                {input.options?.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleChange(input.id, option)}
                    disabled={isCompleted}
                    className={`
                      px-3 py-2 rounded-lg text-sm transition-all cursor-pointer
                      ${values[input.id] === option
                        ? "bg-primary/20 text-primary-light border border-primary/40"
                        : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-500"
                      }
                    `}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {!isCompleted && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={onComplete}
            disabled={!allRequiredFilled}
            className={`
              px-5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer
              ${allRequiredFilled
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
