import type {
  DatabaseAdapter,
  GeneratedFile,
  GeneratorConfig,
  ParsedSchema,
} from "../types/index.js";
import { EnumsGenerator } from "./enums-generator.js";
import { RelationsGenerator } from "./relations-generator.js";
import { SchemaGenerator } from "./schema-generator.js";

export class CodeGenerator {
  private schemaGenerator: SchemaGenerator;
  private relationsGenerator: RelationsGenerator;
  private enumsGenerator: EnumsGenerator;

  constructor(
    private adapter: DatabaseAdapter,
    private config: GeneratorConfig,
  ) {
    this.schemaGenerator = new SchemaGenerator(adapter, config);
    this.relationsGenerator = new RelationsGenerator(config);
    this.enumsGenerator = new EnumsGenerator(adapter, config);
  }

  async generate(schema: ParsedSchema): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];

    // Generate enums file if there are any enums
    if (schema.enums.length > 0) {
      const enumsContent = this.enumsGenerator.generate(schema.enums);
      files.push({
        path: "enums.ts",
        content: enumsContent,
        type: "enums",
      });
    }

    // Generate schema files for each table
    for (const table of schema.tables) {
      const schemaContent = this.schemaGenerator.generate(table);
      files.push({
        path: `${this.toKebabCase(table.name)}-schema.ts`,
        content: schemaContent,
        type: "schema",
      });
    }

    // Generate relations files for each table that has relations
    if (schema.relations.length > 0) {
      for (const table of schema.tables) {
        const relationsContent = this.relationsGenerator.generateForTable(
          table,
          schema.tables,
          schema.relations,
        );
        
        if (relationsContent.trim()) {
          files.push({
            path: `${this.toKebabCase(table.name)}-relations.ts`,
            content: relationsContent,
            type: "relations",
          });
        }
      }
    }

    // Generate index file that exports everything
    const indexContent = this.generateIndexFile(schema);
    files.push({
      path: "index.ts",
      content: indexContent,
      type: "schema",
    });

    return files;
  }

  private generateIndexFile(schema: ParsedSchema): string {
    const exports: string[] = [];

    // Export enums if any
    if (schema.enums.length > 0) {
      exports.push(`export * from './enums${this.getModuleFileExtension()}';`);
    }

    // Export schemas
    for (const table of schema.tables) {
      exports.push(
        `export * from './${this.toKebabCase(table.name)}-schema${this.getModuleFileExtension()}';`,
      );
    }

    // Export relations files for each table that has relations
    if (schema.relations.length > 0) {
      for (const table of schema.tables) {
        // Check if this table has any relations
        const hasRelations = schema.relations.some(rel => 
          rel.foreignKeyTable === table.tableName || 
          (rel.referencedTable === table.tableName && rel.type === "many")
        );
        
        if (hasRelations) {
          exports.push(
            `export * from './${this.toKebabCase(table.name)}-relations${this.getModuleFileExtension()}';`,
          );
        }
      }
    }

    return exports.join("\n");
  }

  private getModuleFileExtension(): string {
    return ".js";
  }

  private toKebabCase(str: string): string {
    return str
      .replace(/([A-Z])/g, "-$1")
      .replace(/_/g, "-")
      .toLowerCase()
      .replace(/^-/, "")
      .replace(/-+/g, "-"); // Replace multiple dashes with single dash
  }
}
