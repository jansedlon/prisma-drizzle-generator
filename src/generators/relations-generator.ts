import type {
  DrizzleRelation,
  DrizzleTable,
  GeneratorConfig,
} from "../types/index.js";

interface RelationField {
  fieldName: string;
  targetTable: string;
  relationType: 'one' | 'many';
  relationName?: string;
  fields?: string[];
  references?: string[];
  isImplicitManyToMany?: boolean;
}

export class RelationsGenerator {
  constructor(private config: GeneratorConfig) {}

  generateForTable(table: DrizzleTable, allTables: DrizzleTable[], relations: DrizzleRelation[]): string {
    const relationFields = this.parseRelationsForTable(table, allTables, relations);
    
    if (relationFields.length === 0) {
      return ''; // No relations for this table
    }

    const imports = this.generateImportsForTable(table, allTables, relationFields);
    const relationDefinition = this.generateRelationDefinition(table, allTables, relationFields);

    return `${imports}\n\n${relationDefinition}`;
  }

  // Legacy method for backward compatibility (unused now)
  generate(tables: DrizzleTable[], relations: DrizzleRelation[]): string {
    return '';
  }

  private parseRelationsForTable(
    table: DrizzleTable, 
    allTables: DrizzleTable[], 
    relations: DrizzleRelation[]
  ): RelationField[] {
    const relationFields: RelationField[] = [];
    
    // Process each relation where this table is involved
    for (const relation of relations) {
      // ONLY generate relations where this table is the foreign key owner
      // OR where this table is the target of a reverse 1:1 relation
      if (relation.foreignKeyTable === table.tableName) {
        if (relation.type === "one") {
          // This table owns FK - generate one() relation WITH fields/references
          relationFields.push({
            fieldName: relation.relationName,
            targetTable: relation.referencedTable,
            relationType: 'one',
            fields: [relation.foreignKeyField],
            references: [relation.referencedField],
          });
        } else if (relation.type === "many") {
          // Self-relation many side or M:N
          relationFields.push({
            fieldName: relation.relationName,
            targetTable: relation.referencedTable,
            relationType: 'many',
            isImplicitManyToMany: relation.isImplicitManyToMany,
          });
        }
      } else if (relation.referencedTable === table.tableName && relation.isReverse) {
        // This is a reverse 1:1 relation - generate one() without FK
        relationFields.push({
          fieldName: relation.relationName,
          targetTable: relation.foreignKeyTable,
          relationType: 'one',
        });
      }
    }

    return this.deduplicateRelationFields(relationFields);
  }

  private deduplicateRelationFields(relationFields: RelationField[]): RelationField[] {
    const seen = new Map<string, RelationField>();
    
    for (const field of relationFields) {
      const key = `${field.fieldName}_${field.relationType}_${field.targetTable}`;
      
      if (!seen.has(key)) {
        seen.set(key, field);
      }
    }
    
    return Array.from(seen.values());
  }

  private getOneRelationName(
    relation: DrizzleRelation, 
    currentTable: DrizzleTable, 
    allTables: DrizzleTable[]
  ): string {
    // For self-relations, use the relation name
    if (relation.foreignKeyTable === relation.referencedTable && relation.relationName) {
      return this.camelCase(relation.relationName);
    }

    // For regular relations, derive from target table name
    const targetTable = allTables.find(t => t.tableName === relation.referencedTable);
    if (targetTable) {
      const baseName = this.camelCase(targetTable.name);
      
      // Handle cases where field name might conflict with table name
      if (baseName === this.camelCase(currentTable.name)) {
        return `${baseName}Ref`;
      }
      
      return baseName;
    }

    return this.camelCase(relation.referencedTable);
  }

  private getManyRelationName(
    relation: DrizzleRelation, 
    currentTable: DrizzleTable, 
    allTables: DrizzleTable[]
  ): string {
    // For self-relations, use the relation name with plural
    if (relation.foreignKeyTable === relation.referencedTable && relation.relationName) {
      const baseName = this.camelCase(relation.relationName);
      return this.ensurePlural(baseName);
    }

    // For regular relations, derive from foreign table name
    const foreignTable = allTables.find(t => t.tableName === relation.foreignKeyTable);
    if (foreignTable) {
      const baseName = this.camelCase(foreignTable.name);
      return this.ensurePlural(baseName);
    }

    return this.ensurePlural(this.camelCase(relation.foreignKeyTable));
  }

  private generateImportsForTable(
    table: DrizzleTable,
    allTables: DrizzleTable[],
    relationFields: RelationField[]
  ): string {
    const imports = new Set<string>();
    imports.add("relations");
    
    // Add current table import
    const currentTableName = this.getTableConstantName(table);
    imports.add(currentTableName);
    
    // Add related table imports
    const relatedTableNames = new Set<string>();
    for (const rel of relationFields) {
      const targetTable = allTables.find(t => t.tableName === rel.targetTable);
      if (targetTable) {
        const targetTableName = this.getTableConstantName(targetTable);
        if (targetTableName !== currentTableName) {
          relatedTableNames.add(targetTableName);
        }
      }
    }

    // Generate import statements
    const drizzleImports = `import { relations } from 'drizzle-orm';`;
    const currentTableImport = `import { ${currentTableName} } from './${this.toKebabCase(table.name)}-schema.js';`;
    
    const relatedImports = Array.from(relatedTableNames)
      .map(tableName => {
        const originalTable = allTables.find(t => this.getTableConstantName(t) === tableName);
        const fileName = originalTable ? this.toKebabCase(originalTable.name) : this.toKebabCase(tableName);
        return `import { ${tableName} } from './${fileName}-schema.js';`;
      })
      .join('\n');

    const allImports = [drizzleImports, currentTableImport, relatedImports].filter(Boolean).join('\n');
    return allImports;
  }

  private generateRelationDefinition(
    table: DrizzleTable,
    allTables: DrizzleTable[],
    relationFields: RelationField[]
  ): string {
    const tableName = this.getTableConstantName(table);
    
    const relationItems = relationFields.map(rel => {
      const targetTable = allTables.find(t => t.tableName === rel.targetTable);
      const targetTableName = targetTable ? this.getTableConstantName(targetTable) : this.camelCase(rel.targetTable);
      
            if (rel.relationType === 'one' && rel.fields && rel.references) {
        // Generate one() relation with fields and references
        return `  ${rel.fieldName}: one(${targetTableName}, {
    fields: [${tableName}.${rel.fields[0]}],
    references: [${targetTableName}.${rel.references[0]}]
  })`;
      } else if (rel.relationType === 'one') {
        // Generate one() relation without fields (reverse 1:1)
        return `  ${rel.fieldName}: one(${targetTableName})`;
      } else {
        // Generate many() relation
        return `  ${rel.fieldName}: many(${targetTableName})`;
      }
    }).join(',\n');

    return `export const ${tableName}Relations = relations(${tableName}, ({ one, many }) => ({
${relationItems}
}));`;
  }

  private getTableConstantName(table: DrizzleTable): string {
    const camelName = this.camelCase(table.name);
    return this.getValidConstantName(camelName);
  }

  private camelCase(str: string): string {
    return str.charAt(0).toLowerCase() + str.slice(1);
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

  private toKebabCase(str: string): string {
    return str
      .replace(/([A-Z])/g, "-$1")
      .replace(/_/g, "-")
      .toLowerCase()
      .replace(/^-/, "")
      .replace(/-+/g, "-");
  }

  private getValidConstantName(name: string): string {
    const reservedWords = ['default', 'import', 'export', 'class', 'function', 'var', 'let', 'const', 'if', 'else', 'for', 'while', 'return', 'try', 'catch', 'throw', 'new', 'this', 'super'];
    
    if (reservedWords.includes(name.toLowerCase())) {
      return `${name}Table`;
    }
    
    return name;
  }
}
