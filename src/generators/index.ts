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
      const pluralName = this.ensurePlural(table.name);
      files.push({
        path: `${this.toKebabCase(pluralName)}-schema.ts`,
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
          const pluralName = this.ensurePlural(table.name);
          files.push({
            path: `${this.toKebabCase(pluralName)}-relations.ts`,
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
      const pluralName = this.ensurePlural(table.name);
      exports.push(
        `export * from './${this.toKebabCase(pluralName)}-schema${this.getModuleFileExtension()}';`,
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
          const pluralName = this.ensurePlural(table.name);
          exports.push(
            `export * from './${this.toKebabCase(pluralName)}-relations${this.getModuleFileExtension()}';`,
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

  private ensurePlural(str: string): string {
    // Don't pluralize if already plural or if it's a special case
    if (str.endsWith('s') && !str.endsWith('us') && !str.endsWith('ss')) {
      return str;
    }
    
    // Special cases
    const irregulars: Record<string, string> = {
      'child': 'children',
      'person': 'people', 
      'man': 'men',
      'woman': 'women',
      'foot': 'feet',
      'tooth': 'teeth',
      'goose': 'geese',
      'mouse': 'mice',
      'category': 'categories',
      'company': 'companies',
      'country': 'countries',
      'city': 'cities',
      'story': 'stories',
      'entry': 'entries',
      'query': 'queries',
      'currency': 'currencies'
    };
    
    const lower = str.toLowerCase();
    if (irregulars[lower]) {
      return irregulars[lower];
    }
    
    // Standard rules
    if (str.endsWith('y') && str.length > 1) {
      const secondToLast = str[str.length - 2];
      if (secondToLast && !['a', 'e', 'i', 'o', 'u'].includes(secondToLast)) {
        return str.slice(0, -1) + 'ies';
      }
    }
    if (str.endsWith('s') || str.endsWith('sh') || str.endsWith('ch') || str.endsWith('x') || str.endsWith('z')) {
      return str + 'es';
    }
    if (str.endsWith('f')) {
      return str.slice(0, -1) + 'ves';
    }
    if (str.endsWith('fe')) {
      return str.slice(0, -2) + 'ves';
    }
    
    return str + 's';
  }
}
