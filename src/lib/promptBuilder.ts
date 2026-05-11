import type { Pipeline } from "../types";

const GLOBAL_3D_RULES = [
  "Neutral white or light gray background, no projected shadows",
  "Diffuse uniform lighting, no strong specular reflections",
  "Object centered in frame, no cropping at edges",
  "No 2D elements, collages, or graphic overlays",
  "Consistent style, color palette, and detail level across all views",
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
    "Style rules:",
    pipelineRules,
    "",
    "3D reconstruction rules:",
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
