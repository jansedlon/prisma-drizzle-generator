import type { GeneratorConfig } from "../types/index.js";

export class CodeFormatter {
  constructor(private config: GeneratorConfig) {}

  async format(content: string, filePath: string): Promise<string> {
    if (this.config.formatter === "none") {
      return content;
    }

    try {
      if (this.config.formatter === "biome") {
        return await this.formatWithBiome(content, filePath);
      } else if (this.config.formatter === "prettier") {
        return await this.formatWithPrettier(content, filePath);
      }
    } catch (error) {
      console.warn(`Warning: Failed to format ${filePath}:`, error);
    }

    return content;
  }

  private async formatWithBiome(
    content: string,
    _filePath: string,
  ): Promise<string> {
    try {
      // Try to use Biome programmatically if available
      const { spawn } = await import("node:child_process");
      const { promisify } = await import("node:util");
      const execFile = promisify(spawn);

      const configPath = this.config.formatterConfig || "biome.json";

      const result = await execFile(
        "biome",
        [
          "format",
          "--stdin-file-path",
          "temp.ts",
          ...(this.config.formatterConfig ? ["--config-path", configPath] : []),
        ],
        {
          input: content,
          encoding: "utf8",
        },
      );

      return result.stdout || content;
    } catch {
      return content;
    }
  }

  private async formatWithPrettier(
    content: string,
    filePath: string,
  ): Promise<string> {
    try {
      const prettier = await import("prettier");

      const configPath = this.config.formatterConfig;
      const options = configPath
        ? await prettier.resolveConfig(configPath)
        : await prettier.resolveConfig(filePath);

      return await prettier.format(content, {
        ...options,
        filepath: filePath,
        parser: "typescript",
      });
    } catch {
      return content;
    }
  }
}
