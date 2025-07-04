import type { CustomDirective } from "../types/index.js";

export function parseCustomDirectives(
  documentation?: string,
): CustomDirective[] {
  if (!documentation) return [];

  const directives: CustomDirective[] = [];
  // Handle escaped newlines in documentation
  const normalizedDoc = documentation.replace(/\\n/g, "\n");
  const lines = normalizedDoc.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("/// @drizzle.")) continue;

    const match = trimmed.match(/^\/\/\/ @drizzle\.(\w+)(?:\((.*?)\))?$/);
    if (!match) continue;

    const [, directiveName, argsString] = match;
    const args: Record<string, unknown> = {};

    if (argsString) {
      // Parse simple key=value arguments
      const argMatches = argsString.matchAll(/(\w+):\s*([^,]+)/g);
      for (const argMatch of argMatches) {
        const [, key, value] = argMatch;
        if (key && value) {
          args[key] = parseDirectiveValue(value.trim());
        }
      }
    }

    directives.push({
      name: `drizzle.${directiveName}`,
      arguments: args,
    });
  }

  return directives;
}

function parseDirectiveValue(value: string): unknown {
  // Remove quotes if present
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  // Parse numbers
  if (/^\d+$/.test(value)) {
    return Number.parseInt(value, 10);
  }

  if (/^\d+\.\d+$/.test(value)) {
    return Number.parseFloat(value);
  }

  // Parse booleans
  if (value === "true") return true;
  if (value === "false") return false;

  // Return as string
  return value;
}
