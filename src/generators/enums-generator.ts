import { logger } from "@prisma/sdk";
import type {
  DatabaseAdapter,
  DrizzleEnum,
  GeneratorConfig,
} from "../types/index.js";

export class EnumsGenerator {
  constructor(
    private adapter: DatabaseAdapter,
    private config: GeneratorConfig,
  ) {}

  generate(enums: DrizzleEnum[]): string {
    if (enums.length === 0) return "";

    const imports = this.generateImports();
    const enumDefinitions = enums
      .map((enumItem) => {
        logger.info(`Generating enum definition for ${enumItem.name}`);
        return this.generateEnumDefinition(enumItem);
      })
      .join("\n\n");

    return `${imports}\n\n${enumDefinitions}`;
  }

  private generateImports(): string {
    return "import { pgEnum } from 'drizzle-orm/pg-core';";
  }

  private generateEnumDefinition(enumItem: DrizzleEnum): string {
    const enumName = `${this.toSnakeCase(enumItem.name)}Enum`;
    const values = enumItem.values.map((value) => `'${value}'`).join(", ");

    return `export const ${enumName} = pgEnum('${this.toSnakeCase(enumItem.name)}', [${values}]);`;
  }

  private toSnakeCase(str: string): string {
    return str
      .replace(/([A-Z])/g, "_$1")
      .toLowerCase()
      .replace(/^_/, "");
  }
}
