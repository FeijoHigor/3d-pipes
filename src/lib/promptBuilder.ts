import type { Pipeline } from "../types";

const GLOBAL_3D_RULES = [
  // === Camera / background ===
  "Pure white background (#FFFFFF), no shadows, no reflections, no floor plane",
  "Diffuse uniform lighting from all sides, no directional shadows or specular highlights",
  "Object perfectly centered in frame with small margin, no cropping at edges",
  "No 2D elements, text overlays, watermarks, or UI artifacts",
  // === Color constraints (printer has 4 filament slots) ===
  "STRICT: Maximum 4 dominant colors in the entire object. Small accent details (eyes, tiny logos) may use a 5th color if the area is very small and paintable by hand",
  "Flat solid colors only, NO gradients, NO color transitions, NO shading baked into the surface",
  "Each color region must have clean sharp boundaries, clearly separable from adjacent colors",
  "High contrast between adjacent color regions so a slicer can distinguish them",
  // === Style (printability) ===
  "Cartoon / stylized / toy aesthetic — NOT photorealistic. Think vinyl toy, Funko Pop, or clay figurine",
  "Smooth simplified surfaces — no realistic skin pores, fur strands, fabric weave, or wood grain",
  "All features must be chunky and thick (minimum ~2mm visual thickness), nothing thin or fragile",
  "No tiny holes, slits, or negative details smaller than 2mm",
  "No floating or disconnected parts — everything must be physically attached to the main body",
  // === Pose / geometry ===
  "Compact pose with limbs close to the body, no extended arms or fingers spread out",
  "Flat stable base so the model can stand upright on a table",
  "Clean simple silhouette — avoid overly intricate outlines",
  // === Consistency ===
  "Identical character, proportions, colors, and style across ALL angle views — must look like the same object rotated",
];

/**
 * Builds the final prompt for a specific angle, ready to send to an AI model.
 *
 * Structure:
 *   1. Prompt base (with user variables replaced)
 *   2. Angle instruction
 *   3. Pipeline-specific rules
 *   4. Global 3D reconstruction rules
 */
export function buildPromptForAngle(
  pipeline: Pipeline,
  userData: Record<string, unknown>,
  angle: string
): string {
  // 1. Replace {variables} in prompt base
  let base = pipeline.promptBase;
  Object.entries(userData).forEach(([key, value]) => {
    if (typeof value === "string" && value.trim()) {
      base = base.replace(new RegExp(`\\{${key}\\}`, "g"), value);
    }
  });

  // 2. Angle instruction
  const angleInstruction = `Camera angle: ${angle}`;

  // 3. Pipeline-specific rules
  const pipelineRules = pipeline.promptRules
    .filter((r) => r.trim())
    .map((r) => `- ${r}`)
    .join("\n");

  // 4. Global 3D rules
  const globalRules = GLOBAL_3D_RULES.map((r) => `- ${r}`).join("\n");

  return [
    base,
    "",
    angleInstruction,
    "",
    "Pipeline style rules:",
    pipelineRules,
    "",
    "3D printing & reconstruction rules (MUST follow all):",
    globalRules,
  ].join("\n");
}

/**
 * Builds all prompts for every angle in the pipeline.
 */
export function buildAllPrompts(
  pipeline: Pipeline,
  userData: Record<string, unknown>
): { angle: string; prompt: string }[] {
  return pipeline.angles.map((angle) => ({
    angle,
    prompt: buildPromptForAngle(pipeline, userData, angle),
  }));
}

/**
 * Exports all prompts as a single text block (for copy/paste).
 */
export function exportAllPromptsAsText(
  pipeline: Pipeline,
  userData: Record<string, unknown>
): string {
  const prompts = buildAllPrompts(pipeline, userData);
  const header = `Pipeline: ${pipeline.name}\nImages: ${pipeline.imageCount}\nOutput: ${pipeline.outputFormat}\n`;
  const separator = "\n" + "─".repeat(60) + "\n";

  const body = prompts
    .map(
      (p, i) =>
        `[Image ${i + 1}/${prompts.length}] ${p.angle}\n\n${p.prompt}`
    )
    .join(separator);

  return `${header}${separator}${body}\n`;
}
