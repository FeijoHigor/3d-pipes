import { useState, useEffect } from "react";
import type { Pipeline } from "../types";
import defaultPipelines from "../data/pipelines";

const STORAGE_KEY = "3d-pipes-custom-pipelines";

function loadCustomPipelines(): Pipeline[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore parse errors
  }
  return [];
}

function saveCustomPipelines(pipelines: Pipeline[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pipelines));
}

export function usePipelines() {
  const [customPipelines, setCustomPipelines] = useState<Pipeline[]>(loadCustomPipelines);

  useEffect(() => {
    saveCustomPipelines(customPipelines);
  }, [customPipelines]);

  const allPipelines = [...defaultPipelines, ...customPipelines];

  function addPipeline(pipeline: Pipeline) {
    setCustomPipelines((prev) => [...prev, { ...pipeline, isCustom: true }]);
  }

  function removePipeline(id: string) {
    setCustomPipelines((prev) => prev.filter((p) => p.id !== id));
  }

  function findPipeline(id: string): Pipeline | undefined {
    return allPipelines.find((p) => p.id === id);
  }

  return {
    pipelines: allPipelines,
    customPipelines,
    defaultPipelines,
    addPipeline,
    removePipeline,
    findPipeline,
  };
}
