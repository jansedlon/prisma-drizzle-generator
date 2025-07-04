import { logger } from "@prisma/sdk";
import type {
  DatabaseAdapter,
  DrizzleTable,
  GeneratorConfig,
} from "../types/index.js";

export class SchemaGenerator {
  constructor(
    private adapter: DatabaseAdapter,
    private _config: GeneratorConfig,
  ) {}

  generate(table: DrizzleTable): string {
    logger.info(`Generating schema for ${table.name}`);
    const imports = this.generateImports(table);
    const tableDefinition = this.generateTableDefinition(table);

    return `${imports}\n\n${tableDefinition}`;
  }

  private generateImports(table: DrizzleTable): string {
    const imports = new Set<string>();

    // Add base imports from adapter
    for (const imp of table.columns.map((col) => col.type.drizzleType)) {
      imports.add(imp);
    }

    for (const imp of this.adapter.alwaysPresentImports) {
      imports.add(imp);
    }

    // Check if we need sql imports based on default values
    const needsSql = table.columns.some(col => col.defaultValue?.includes('sql`'));
    
    if (needsSql) imports.add('sql');

    // Add relation imports if needed
    if (table.columns.some((col) => col.type.importPath === "./enums.js")) {
      imports.add("pgEnum");
    }

    const importList = Array.from(imports).join(", ");
    let importStatement = `import { ${importList} } from '${this.adapter.name === "postgresql" ? "drizzle-orm/pg-core" : "drizzle-orm"}';`;

    // Add enum imports if needed
    if (table.enums.length > 0) {
      importStatement += `\nimport { ${table.enums.map((e) => `${this.toSnakeCase(e.name)}Enum`).join(", ")} } from './enums.js';`;
    }

    return importStatement;
  }

  private generateTableDefinition(table: DrizzleTable): string {
    const tableName = table.name;
    const dbTableName = table.tableName;

    const tableStart = this.adapter.generateTableFunction(dbTableName);
    const columns = table.columns
      .map((col) => `  ${this.adapter.generateColumnDefinition(col)}`)
      .join(",\n");

    const constName = this.getValidConstantName(this.toCamelCase(tableName));
    return `export const ${constName} = ${tableStart}\n${columns}\n});`;
  }

  private toCamelCase(str: string): string {
    return str.charAt(0).toLowerCase() + str.slice(1);
  }

  private toPlural(str: string): string {
    // Don't pluralize if already plural
    if (str.endsWith("s") && !str.endsWith("us") && !str.endsWith("ss")) {
      return str;
    }
    
    // Special cases
    const irregulars: Record<string, string> = {
      'country': 'countries',
      'city': 'cities',
      'category': 'categories',
      'company': 'companies',
      'story': 'stories',
      'entry': 'entries',
      'query': 'queries',
      'currency': 'currencies',
      'child': 'children',
      'person': 'people',
      'man': 'men',
      'woman': 'women',
      'foot': 'feet',
      'tooth': 'teeth',
      'goose': 'geese',
      'mouse': 'mice'
    };
    
    const lower = str.toLowerCase();
    if (irregulars[lower]) {
      // Preserve original case
      const irregular = irregulars[lower];
      if (str === str.toUpperCase()) return irregular.toUpperCase();
      if (str[0] === str[0].toUpperCase()) {
        return irregular.charAt(0).toUpperCase() + irregular.slice(1);
      }
      return irregular;
    }
    
    // Standard rules
    if (str.endsWith('y') && !['a', 'e', 'i', 'o', 'u'].includes(str[str.length - 2])) {
      return str.slice(0, -1) + 'ies';
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

  private getValidConstantName(name: string): string {
    const reservedWords = ['default', 'import', 'export', 'class', 'function', 'var', 'let', 'const', 'if', 'else', 'for', 'while', 'return', 'try', 'catch', 'throw', 'new', 'this', 'super'];
    
    if (reservedWords.includes(name.toLowerCase())) {
      return `${name}Table`;
    }
    
    return name;
  }

  private toSnakeCase(str: string): string {
    return str
      .replace(/([A-Z])/g, "_$1")
      .toLowerCase()
      .replace(/^_/, "");
  }
}
