import type { GeneratorConfig } from "../types/index.js";

export function parseGeneratorConfig(
  options: Record<string, string | string[] | undefined>,
): GeneratorConfig {
  return {
    output: String(options.output || "./generated/drizzle"),
    moduleResolution: String(options.moduleResolution || "nodeNext") as
      | "node"
      | "nodeNext"
      | "bundler",
    formatter: String(options.formatter || "biome") as
      | "prettier"
      | "biome"
      | "none",
    formatterConfig: options.formatterConfig
      ? String(options.formatterConfig)
      : undefined,
    splitFiles: String(options.splitFiles || "true") !== "false", // Default to true
  };
}
