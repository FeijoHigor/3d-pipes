import type { Pipeline } from "../types";
import seedPipelines from "../data/pipelines.json";

const STORAGE_KEY = "3d-pipes:pipelines";
const VERSION_KEY = "3d-pipes:version";
const CURRENT_VERSION = 2;

/**
 * PipelineStore centralizes all pipeline persistence.
 *
 * On first load (or version bump) it seeds localStorage with the default
 * pipelines from pipelines.json. After that, every pipeline lives in
 * localStorage — both the "seed" ones and the user-created ones.
 *
 * This means:
 *  - There is a single source of truth (localStorage).
 *  - Custom and default pipelines are stored together.
 *  - The JSON file only acts as a seed/reset template.
 */
export class PipelineStore {
  /** Initialize storage if empty or outdated */
  static init(): void {
    const storedVersion = localStorage.getItem(VERSION_KEY);
    const needsSeed =
      !storedVersion || Number(storedVersion) < CURRENT_VERSION;

    if (needsSeed) {
      // Preserve any existing custom pipelines during re-seed
      const existing = PipelineStore.getAll();
      const customOnes = existing.filter((p) => p.isCustom);
      const seeded: Pipeline[] = (seedPipelines as Pipeline[]).map((p) => ({
        ...p,
        isCustom: false,
      }));
      PipelineStore.saveAll([...seeded, ...customOnes]);
      localStorage.setItem(VERSION_KEY, String(CURRENT_VERSION));
    }
  }

  /** Read all pipelines from storage */
  static getAll(): Pipeline[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Pipeline[]) : [];
    } catch {
      return [];
    }
  }

  /** Overwrite the entire pipeline list */
  static saveAll(pipelines: Pipeline[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pipelines));
  }

  /** Find a pipeline by id */
  static getById(id: string): Pipeline | undefined {
    return PipelineStore.getAll().find((p) => p.id === id);
  }

  /** Add a new pipeline (always marked as custom) */
  static add(pipeline: Pipeline): Pipeline[] {
    const all = PipelineStore.getAll();
    const saved: Pipeline = { ...pipeline, isCustom: true };
    const next = [...all, saved];
    PipelineStore.saveAll(next);
    return next;
  }

  /** Update an existing pipeline in-place */
  static update(id: string, data: Partial<Pipeline>): Pipeline[] {
    const all = PipelineStore.getAll();
    const next = all.map((p) => (p.id === id ? { ...p, ...data } : p));
    PipelineStore.saveAll(next);
    return next;
  }

  /** Remove a pipeline by id (only custom ones can be removed) */
  static remove(id: string): Pipeline[] {
    const all = PipelineStore.getAll();
    const target = all.find((p) => p.id === id);
    if (target && !target.isCustom) return all; // prevent deleting seed pipelines
    const next = all.filter((p) => p.id !== id);
    PipelineStore.saveAll(next);
    return next;
  }

  /** Reset to seed defaults (preserves custom pipelines) */
  static resetDefaults(): Pipeline[] {
    const all = PipelineStore.getAll();
    const customOnes = all.filter((p) => p.isCustom);
    const seeded: Pipeline[] = (seedPipelines as Pipeline[]).map((p) => ({
      ...p,
      isCustom: false,
    }));
    const next = [...seeded, ...customOnes];
    PipelineStore.saveAll(next);
    return next;
  }

  /** Export all pipelines as a JSON string (for backup) */
  static exportJSON(): string {
    return JSON.stringify(PipelineStore.getAll(), null, 2);
  }

  /** Import pipelines from a JSON string (merges, skipping duplicates) */
  static importJSON(json: string): Pipeline[] {
    const imported: Pipeline[] = JSON.parse(json);
    const existing = PipelineStore.getAll();
    const existingIds = new Set(existing.map((p) => p.id));
    const newOnes = imported.filter((p) => !existingIds.has(p.id));
    const next = [...existing, ...newOnes.map((p) => ({ ...p, isCustom: true }))];
    PipelineStore.saveAll(next);
    return next;
  }
}
