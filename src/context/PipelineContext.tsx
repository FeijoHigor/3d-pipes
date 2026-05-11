import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Pipeline } from "../types";
import { PipelineStore } from "../store/PipelineStore";

interface PipelineContextValue {
  pipelines: Pipeline[];
  findPipeline: (id: string) => Pipeline | undefined;
  addPipeline: (pipeline: Pipeline) => void;
  updatePipeline: (id: string, data: Partial<Pipeline>) => void;
  removePipeline: (id: string) => void;
  resetDefaults: () => void;
  exportPipelines: () => string;
  importPipelines: (json: string) => void;
}

const PipelineContext = createContext<PipelineContextValue | null>(null);

export function PipelineProvider({ children }: { children: ReactNode }) {
  const [pipelines, setPipelines] = useState<Pipeline[]>(() => {
    PipelineStore.init();
    return PipelineStore.getAll();
  });

  // Keep state in sync if another tab changes localStorage
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === "3d-pipes:pipelines") {
        setPipelines(PipelineStore.getAll());
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function addPipeline(pipeline: Pipeline) {
    setPipelines(PipelineStore.add(pipeline));
  }

  function updatePipeline(id: string, data: Partial<Pipeline>) {
    setPipelines(PipelineStore.update(id, data));
  }

  function removePipeline(id: string) {
    setPipelines(PipelineStore.remove(id));
  }

  function resetDefaults() {
    setPipelines(PipelineStore.resetDefaults());
  }

  function findPipeline(id: string) {
    return pipelines.find((p) => p.id === id);
  }

  function exportPipelines() {
    return PipelineStore.exportJSON();
  }

  function importPipelines(json: string) {
    setPipelines(PipelineStore.importJSON(json));
  }

  return (
    <PipelineContext.Provider
      value={{
        pipelines,
        findPipeline,
        addPipeline,
        updatePipeline,
        removePipeline,
        resetDefaults,
        exportPipelines,
        importPipelines,
      }}
    >
      {children}
    </PipelineContext.Provider>
  );
}

export function usePipelineContext(): PipelineContextValue {
  const ctx = useContext(PipelineContext);
  if (!ctx) throw new Error("usePipelineContext must be used within PipelineProvider");
  return ctx;
}
