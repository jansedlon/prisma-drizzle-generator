import type {
  DrizzleRelation,
  DrizzleTable,
  GeneratorConfig,
} from "../types/index.js";

export class RelationsGenerator {
  constructor(private config: GeneratorConfig) {}

  generateForTable(table: DrizzleTable, allTables: DrizzleTable[], relations: DrizzleRelation[]): string {
    const imports = this.generateImportsForTable(table, allTables, relations);
    const relationDefinition = this.generateRelationDefinitionForTable(table, allTables, relations);

    if (!relationDefinition) {
      return ''; // No relations for this table
    }

    return `${imports}\n\n${relationDefinition}`;
  }

  // Legacy method for backward compatibility (unused now)
  generate(tables: DrizzleTable[], relations: DrizzleRelation[]): string {
    return '';
  }

  private generateImportsForTable(table: DrizzleTable, allTables: DrizzleTable[], relations: DrizzleRelation[]): string {
    const imports = new Set<string>();
    imports.add("relations");
    
    // Add current table import
    const currentTableName = this.toCamelCase(table.name);
    imports.add(currentTableName);
    
    // Find related tables for this specific table
    const relatedTableNames = new Set<string>();
    
    for (const rel of relations) {
      if (rel.foreignKeyTable === table.tableName) {
        // This table references another table
        const referencedTable = allTables.find(t => t.tableName === rel.referencedTable);
        if (referencedTable) {
          relatedTableNames.add(this.toCamelCase(referencedTable.name));
        }
      }
      if (rel.referencedTable === table.tableName && rel.type === "many") {
        // Another table references this table
        const foreignTable = allTables.find(t => t.tableName === rel.foreignKeyTable);
        if (foreignTable) {
          relatedTableNames.add(this.toCamelCase(foreignTable.name));
        }
      }
    }

    // Generate imports
    const drizzleImports = `import { relations } from 'drizzle-orm';`;
    const currentTableImport = `import { ${currentTableName} } from './${this.toKebabCase(table.name)}-schema.js';`;
    
    const relatedImports = Array.from(relatedTableNames)
      .filter(name => name !== currentTableName)
      .map(name => {
        // Find the original table name to get correct file name
        const originalTable = allTables.find(t => this.getValidConstantName(this.toCamelCase(t.name)) === name);
        const fileName = originalTable ? this.toKebabCase(originalTable.name) : this.toKebabCase(name);
        return `import { ${name} } from './${fileName}-schema.js';`;
      })
      .join('\n');

    const allImports = [drizzleImports, currentTableImport, relatedImports].filter(Boolean).join('\n');
    return allImports;
  }

  private generateImports(tables: DrizzleTable[]): string {
    const tableNames = tables.map((t) => this.toCamelCase(t.name));
    const schemaImports = tableNames
      .map(
        (name) =>
          `import { ${name} } from './${this.toKebabCase(name)}-schema.js';`,
      )
      .join("\n");

    return `import { relations } from 'drizzle-orm';\n${schemaImports}`;
  }

  private generateRelationDefinitionForTable(
    table: DrizzleTable,
    allTables: DrizzleTable[],
    relations: DrizzleRelation[],
  ): string | null {
    const currentTableRelations: DrizzleRelation[] = [];

    // Find relations where 'table' is the foreign key owner (for 'one' relations)
    for (const rel of relations) {
      if (rel.foreignKeyTable === table.tableName) {
        currentTableRelations.push(rel);
      }
      // Find relations where 'table' is the referenced table (for 'many' relations)
      if (rel.referencedTable === table.tableName && rel.type === "many") {
        // Ensure we don't add duplicates if it's a self-referencing many-to-many
        if (
          !currentTableRelations.some(
            (r) => r.relationName === rel.relationName && r.type === "many",
          )
        ) {
          currentTableRelations.push(rel);
        }
      }
    }

    if (currentTableRelations.length === 0) return null;

    const relationItems = currentTableRelations
      .map((rel) => {
        const relationType = rel.type;

        let relationFieldName: string;

        if (rel.type === "one") {
          const referencedTableCamelCase = this.getCamelCaseTableName(
            rel.referencedTable,
            allTables,
          );
          relationFieldName = this.toCamelCase(rel.relationName);

          if (relationFieldName === this.toCamelCase(rel.foreignKeyTable)) {
            relationFieldName = `${relationFieldName}Ref`;
          }

          return `  ${relationFieldName}: ${relationType}(${referencedTableCamelCase}, {
    fields: [${this.toCamelCase(table.name)}.${rel.foreignKeyField}],
    references: [${referencedTableCamelCase}.${rel.referencedField}],
    ${rel.onDelete ? `onDelete: '${rel.onDelete}',` : ""}
    ${rel.onUpdate ? `onUpdate: '${rel.onUpdate}',` : ""}
  })`;
        } else {
          // type === 'many'
          const foreignKeyTableCamelCase = this.getCamelCaseTableName(
            rel.foreignKeyTable,
            allTables,
          );
          relationFieldName = this.toCamelCase(rel.relationName);

          if (!relationFieldName.endsWith("s")) {
            relationFieldName += "s";
          }

          return `  ${relationFieldName}: ${relationType}(${foreignKeyTableCamelCase})`;
        }
      })
      .join(",\n");

    const tableName = this.getCamelCaseTableName(table.tableName, allTables);
    return `export const ${tableName}Relations = relations(${tableName}, ({ one, many }) => ({
${relationItems}
}));`;
  }

  private generateRelationDefinitions(
    tables: DrizzleTable[],
    relations: DrizzleRelation[],
  ): string {
    const definitions: string[] = [];

    for (const table of tables) {
      const currentTableRelations: DrizzleRelation[] = [];

      // Find relations where 'table' is the foreign key owner (for 'one' relations)
      for (const rel of relations) {
        if (rel.foreignKeyTable === table.tableName) {
          currentTableRelations.push(rel);
        }
        // Find relations where 'table' is the referenced table (for 'many' relations)
        if (rel.referencedTable === table.tableName && rel.type === "many") {
          // Ensure we don't add duplicates if it's a self-referencing many-to-many
          if (
            !currentTableRelations.some(
              (r) => r.relationName === rel.relationName && r.type === "many",
            )
          ) {
            currentTableRelations.push(rel);
          }
        }
      }

      if (currentTableRelations.length === 0) continue;

      const relationItems = currentTableRelations
        .map((rel) => {
          const relationType = rel.type;

          let relationFieldName: string;

          if (rel.type === "one") {
            const referencedTableCamelCase = this.getCamelCaseTableName(
              rel.referencedTable,
              tables,
            );
            relationFieldName = this.toCamelCase(rel.relationName);

            if (relationFieldName === this.toCamelCase(rel.foreignKeyTable)) {
              relationFieldName = `${relationFieldName}Ref`;
            }

            return `  ${relationFieldName}: ${relationType}(${referencedTableCamelCase}, {
    fields: [${this.toCamelCase(table.name)}.${rel.foreignKeyField}],
    references: [${referencedTableCamelCase}.${rel.referencedField}],
    ${rel.onDelete ? `onDelete: '${rel.onDelete}',` : ""}
    ${rel.onUpdate ? `onUpdate: '${rel.onUpdate}',` : ""}
  })`;
          } else {
            // type === 'many'
            const foreignKeyTableCamelCase = this.getCamelCaseTableName(
              rel.foreignKeyTable,
              tables,
            );
            relationFieldName = this.toCamelCase(rel.relationName);

            if (!relationFieldName.endsWith("s")) {
              relationFieldName += "s";
            }

            return `  ${relationFieldName}: ${relationType}(${foreignKeyTableCamelCase})`;
          }
        })
        .join(",\n");

      const tableName = this.getCamelCaseTableName(table.tableName, tables);
      definitions.push(`export const ${tableName}Relations = relations(${tableName}, ({ one, many }) => ({
${relationItems}
}));`);
    }

    return definitions.join("\n\n");
  }

  private toCamelCase(str: string): string {
    return str.charAt(0).toLowerCase() + str.slice(1);
  }

  private toKebabCase(str: string): string {
    return str
      .replace(/([A-Z])/g, "-$1")
      .replace(/_/g, "-")
      .toLowerCase()
      .replace(/^-/, "")
      .replace(/-+/g, "-"); // Replace multiple dashes with single dash
  }

  private fromSnakeCase(str: string): string {
    return str
      .split("_")
      .map((word, index) =>
        index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1),
      )
      .join("");
  }

  private toPlural(str: string): string {
    if (str.endsWith("s")) {
      return str;
    }
    return `${str}s`;
  }

  private getValidConstantName(name: string): string {
    const reservedWords = ['default', 'import', 'export', 'class', 'function', 'var', 'let', 'const', 'if', 'else', 'for', 'while', 'return', 'try', 'catch', 'throw', 'new', 'this', 'super'];
    
    if (reservedWords.includes(name.toLowerCase())) {
      return `${name}Table`;
    }
    
    return name;
  }

  private getCamelCaseTableName(
    dbTableName: string,
    tables: DrizzleTable[],
  ): string {
    const table = tables.find((t) => t.tableName === dbTableName);
    const camelName = this.toCamelCase(table?.name || this.toSingular(dbTableName));
    return this.getValidConstantName(camelName);
  }

  private toSingular(str: string): string {
    if (str.endsWith("s")) {
      return str.slice(0, -1);
    }
    return str;
  }
}
